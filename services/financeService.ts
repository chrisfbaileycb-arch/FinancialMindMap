import { getSupabaseClient } from '@/template';
import { FunctionsHttpError } from '@supabase/supabase-js';

const supabase = getSupabaseClient();

async function callFn(name: string, body?: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) {
    let msg = error.message;
    if (error instanceof FunctionsHttpError) {
      try {
        const text = await error.context?.text();
        const code = error.context?.status ?? 500;
        msg = `[${code}] ${text || msg}`;
      } catch { /* ignore */ }
    }
    throw new Error(msg);
  }
  return data;
}

// ── Plaid ──────────────────────────────────────────────
export async function createLinkToken(): Promise<string> {
  const data = await callFn('plaid-link-token');
  return data.link_token;
}

export async function exchangePublicToken(
  publicToken: string,
  institutionId: string | null,
  institutionName: string
): Promise<void> {
  await callFn('plaid-exchange-token', {
    public_token: publicToken,
    institution_id: institutionId,
    institution_name: institutionName,
  });
}

export async function syncAll(): Promise<void> {
  await callFn('plaid-sync', {});
}

// ── Accounts ───────────────────────────────────────────
export async function fetchAccounts() {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .order('type', { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

// ── Transactions ───────────────────────────────────────
export async function fetchTransactions(limit = 50) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}

// ── Alerts ─────────────────────────────────────────────
export async function fetchAlerts() {
  const { data, error } = await supabase
    .from('spending_alerts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(30);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function markAlertRead(id: string) {
  await supabase.from('spending_alerts').update({ read: true }).eq('id', id);
}

// ── Spending profiles ──────────────────────────────────
export async function fetchSpendingProfiles() {
  const { data, error } = await supabase.from('spending_profiles').select('*');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function upsertSpendingProfile(
  category: string,
  monthlyBudget: number,
  alertThresholdPct: number = 80
) {
  const { error } = await supabase.from('spending_profiles').upsert(
    { category, monthly_budget: monthlyBudget, alert_threshold_pct: alertThresholdPct },
    { onConflict: 'user_id,category' }
  );
  if (error) throw new Error(error.message);
}

// ── AI Insight ─────────────────────────────────────────
export async function askFinancialInsight(query: string): Promise<string> {
  const data = await callFn('financial-insight', { query });
  return data.answer ?? 'No answer returned.';
}

// ── Plaid Link items ───────────────────────────────────
export async function fetchLinkedInstitutions() {
  const { data, error } = await supabase
    .from('plaid_items')
    .select('id, institution_name, last_synced_at, created_at')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}
