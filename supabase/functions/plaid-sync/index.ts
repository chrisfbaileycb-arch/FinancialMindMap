/**
 * plaid-sync: Fetches updated transactions + balances from Plaid.
 * Runs on-demand (post-link) and via scheduled polling every 4 hours.
 * Logs are anonymized — no full account numbers or credentials ever logged.
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const plaidEnv = () => {
  const env = Deno.env.get('PLAID_ENV') ?? 'sandbox';
  if (env === 'production') return 'https://production.plaid.com';
  if (env === 'development') return 'https://development.plaid.com';
  return 'https://sandbox.plaid.com';
};

async function syncItem(
  supabaseAdmin: ReturnType<typeof createClient>,
  plaidItemId: string,
  userId: string
) {
  const plaidClientId = Deno.env.get('PLAID_CLIENT_ID');
  const plaidSecret = Deno.env.get('PLAID_SECRET');
  const baseUrl = plaidEnv();

  // Fetch stored access token
  const { data: item, error: itemErr } = await supabaseAdmin
    .from('plaid_items')
    .select('access_token, item_id, institution_name')
    .eq('id', plaidItemId)
    .single();

  if (itemErr || !item) {
    console.error(`[sync] item not found: ${plaidItemId}`);
    return { added: 0, modified: 0, removed: 0, error: 'Item not found' };
  }

  // Get existing cursor
  const { data: cursorRow } = await supabaseAdmin
    .from('sync_cursors')
    .select('cursor')
    .eq('plaid_item_id', plaidItemId)
    .single();

  let cursor = cursorRow?.cursor ?? null;
  let hasMore = true;
  let totalAdded = 0, totalModified = 0, totalRemoved = 0;

  // Sync accounts / balances
  const balRes = await fetch(`${baseUrl}/accounts/balance/get`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: plaidClientId, secret: plaidSecret,
      access_token: item.access_token,
    }),
  });

  if (balRes.ok) {
    const balData = await balRes.json();
    for (const acc of (balData.accounts ?? [])) {
      await supabaseAdmin.from('accounts').upsert({
        user_id: userId,
        plaid_item_id: plaidItemId,
        plaid_account_id: acc.account_id,
        name: acc.name,
        official_name: acc.official_name ?? null,
        type: acc.type,
        subtype: acc.subtype ?? null,
        current_balance: acc.balances?.current ?? null,
        available_balance: acc.balances?.available ?? null,
        currency_code: acc.balances?.iso_currency_code ?? 'USD',
        institution_name: item.institution_name,
        last_updated_at: new Date().toISOString(),
      }, { onConflict: 'plaid_account_id' });
    }
    console.log(`[sync] accounts updated: ${(balData.accounts ?? []).length}`);
  }

  // Incremental transaction sync
  while (hasMore) {
    const syncBody: Record<string, unknown> = {
      client_id: plaidClientId,
      secret: plaidSecret,
      access_token: item.access_token,
      count: 250,
    };
    if (cursor) syncBody['cursor'] = cursor;

    const txRes = await fetch(`${baseUrl}/transactions/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(syncBody),
    });

    if (!txRes.ok) {
      const err = await txRes.text();
      console.error(`[sync] transactions/sync error: ${err.substring(0, 200)}`);
      break;
    }

    const txData = await txRes.json();
    hasMore = txData.has_more ?? false;
    cursor = txData.next_cursor;

    // Look up account IDs by plaid_account_id
    const plaidAccIds = [...new Set([
      ...(txData.added ?? []).map((t: any) => t.account_id),
      ...(txData.modified ?? []).map((t: any) => t.account_id),
    ])];
    const { data: accRows } = await supabaseAdmin
      .from('accounts')
      .select('id, plaid_account_id')
      .in('plaid_account_id', plaidAccIds);
    const accMap: Record<string, string> = {};
    for (const a of (accRows ?? [])) accMap[a.plaid_account_id] = a.id;

    // Added + modified
    const upsertRows = [...(txData.added ?? []), ...(txData.modified ?? [])].map((t: any) => ({
      user_id: userId,
      account_id: accMap[t.account_id] ?? null,
      plaid_transaction_id: t.transaction_id,
      merchant_name: t.merchant_name ?? t.name,
      amount: t.amount,
      category: (t.personal_finance_category?.primary ?? t.category?.[0] ?? 'Other'),
      category_detail: (t.personal_finance_category?.detailed ?? t.category?.[1] ?? null),
      date: t.date,
      pending: t.pending ?? false,
    }));

    if (upsertRows.length > 0) {
      await supabaseAdmin.from('transactions').upsert(upsertRows, { onConflict: 'plaid_transaction_id' });
    }

    // Removed
    const removedIds = (txData.removed ?? []).map((r: any) => r.transaction_id);
    if (removedIds.length > 0) {
      // Mark removed by setting flagged = true rather than deleting user data
      await supabaseAdmin.from('transactions')
        .update({ flagged: true })
        .in('plaid_transaction_id', removedIds);
    }

    totalAdded += (txData.added ?? []).length;
    totalModified += (txData.modified ?? []).length;
    totalRemoved += removedIds.length;
  }

  // Persist updated cursor
  await supabaseAdmin.from('sync_cursors').upsert({
    plaid_item_id: plaidItemId,
    cursor,
    last_sync_at: new Date().toISOString(),
  }, { onConflict: 'plaid_item_id' });

  // Update last_synced_at on item
  await supabaseAdmin.from('plaid_items').update({ last_synced_at: new Date().toISOString() }).eq('id', plaidItemId);

  // Run alert analysis after sync
  await runAlertAnalysis(supabaseAdmin, userId);

  console.log(`[sync] done — added:${totalAdded} modified:${totalModified} removed:${totalRemoved}`);
  return { added: totalAdded, modified: totalModified, removed: totalRemoved };
}

async function runAlertAnalysis(
  supabaseAdmin: ReturnType<typeof createClient>,
  userId: string
) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

  // Fetch this month's transactions
  const { data: txs } = await supabaseAdmin
    .from('transactions')
    .select('merchant_name, category, amount, date')
    .eq('user_id', userId)
    .gte('date', monthStart)
    .eq('pending', false);

  if (!txs || txs.length === 0) return;

  // Fetch user spending profiles (budgets)
  const { data: profiles } = await supabaseAdmin
    .from('spending_profiles')
    .select('category, monthly_budget, alert_threshold_pct')
    .eq('user_id', userId);

  const profileMap: Record<string, { budget: number; threshold: number }> = {};
  for (const p of (profiles ?? [])) {
    profileMap[p.category] = { budget: p.monthly_budget, threshold: p.alert_threshold_pct };
  }

  // Spend by category
  const spendByCategory: Record<string, number> = {};
  const spendByMerchant: Record<string, number> = {};

  for (const tx of txs) {
    const cat = tx.category ?? 'Other';
    spendByCategory[cat] = (spendByCategory[cat] ?? 0) + tx.amount;
    const m = tx.merchant_name ?? 'Unknown';
    spendByMerchant[m] = (spendByMerchant[m] ?? 0) + tx.amount;
  }

  const alertsToInsert: any[] = [];

  // Threshold alerts
  for (const [cat, spent] of Object.entries(spendByCategory)) {
    const profile = profileMap[cat];
    if (!profile) continue;
    const pct = (spent / profile.budget) * 100;
    if (pct >= profile.threshold && pct < 100) {
      alertsToInsert.push({
        user_id: userId, type: 'threshold',
        title: `${cat} at ${pct.toFixed(0)}% of budget`,
        description: `You have spent $${spent.toFixed(2)} of your $${profile.budget} ${cat} budget.`,
        severity: pct >= 90 ? 'high' : 'medium',
        merchant_name: null, amount: spent,
      });
    } else if (pct >= 100) {
      alertsToInsert.push({
        user_id: userId, type: 'threshold',
        title: `${cat} budget exceeded`,
        description: `You have gone $${(spent - profile.budget).toFixed(2)} over your ${cat} budget.`,
        severity: 'high',
        merchant_name: null, amount: spent,
      });
    }
  }

  // High-frequency merchant insight (5+ transactions)
  for (const [merchant, total] of Object.entries(spendByMerchant)) {
    const count = txs.filter(t => t.merchant_name === merchant).length;
    if (count >= 5 && total > 50) {
      alertsToInsert.push({
        user_id: userId, type: 'insight',
        title: `Frequent visits to ${merchant}`,
        description: `You have spent $${total.toFixed(2)} across ${count} visits to ${merchant} this month.`,
        severity: total > 200 ? 'medium' : 'low',
        merchant_name: merchant, amount: total,
      });
    }
  }

  if (alertsToInsert.length > 0) {
    await supabaseAdmin.from('spending_alerts').insert(alertsToInsert);
    console.log(`[alerts] inserted ${alertsToInsert.length} alerts for user ${userId.substring(0, 8)}...`);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Validate user
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader ?? '' } } }
    );
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let body: any = {};
    try { body = await req.json(); } catch { /* no body */ }

    const { plaid_item_id } = body;

    let results: any[] = [];

    if (plaid_item_id) {
      // Sync specific item
      const result = await syncItem(supabaseAdmin, plaid_item_id, user.id);
      results = [result];
    } else {
      // Sync all items for user (4-hour scheduled call)
      const { data: items } = await supabaseAdmin
        .from('plaid_items')
        .select('id')
        .eq('user_id', user.id);

      for (const item of (items ?? [])) {
        const r = await syncItem(supabaseAdmin, item.id, user.id);
        results.push(r);
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('plaid-sync error:', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
