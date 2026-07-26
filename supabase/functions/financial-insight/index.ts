/**
 * financial-insight: Natural language financial Q&A powered by OnSpace AI.
 * Retrieves categorized transaction data, performs analysis, returns plain-English answer.
 * No raw credentials or full account numbers are ever included in AI context.
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { query } = await req.json();
    if (!query) {
      return new Response(JSON.stringify({ error: 'query required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch last 90 days of transactions — anonymized context for AI
    const since = new Date();
    since.setDate(since.getDate() - 90);
    const sinceStr = since.toISOString().split('T')[0];

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: txs } = await supabaseAdmin
      .from('transactions')
      .select('merchant_name, category, amount, date, pending')
      .eq('user_id', user.id)
      .gte('date', sinceStr)
      .eq('pending', false)
      .order('date', { ascending: false })
      .limit(300);

    const { data: accounts } = await supabaseAdmin
      .from('accounts')
      .select('name, type, current_balance, institution_name')
      .eq('user_id', user.id);

    const { data: alerts } = await supabaseAdmin
      .from('spending_alerts')
      .select('type, title, description, severity, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Build anonymized context
    const spendByCategory: Record<string, number> = {};
    const spendByMerchant: Record<string, number> = {};
    for (const tx of (txs ?? [])) {
      const cat = tx.category ?? 'Other';
      spendByCategory[cat] = (spendByCategory[cat] ?? 0) + tx.amount;
      const m = tx.merchant_name ?? 'Unknown';
      spendByMerchant[m] = (spendByMerchant[m] ?? 0) + tx.amount;
    }

    const totalSpend = Object.values(spendByCategory).reduce((a, b) => a + b, 0);
    const accountSummary = (accounts ?? []).map(a =>
      `${a.name} (${a.type}, ${a.institution_name}): $${(a.current_balance ?? 0).toFixed(2)}`
    ).join('\n');

    const categoryBreakdown = Object.entries(spendByCategory)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, amt]) => `${cat}: $${amt.toFixed(2)}`)
      .join('\n');

    const topMerchants = Object.entries(spendByMerchant)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([m, amt]) => `${m}: $${amt.toFixed(2)}`)
      .join('\n');

    const recentAlertsSummary = (alerts ?? [])
      .map(a => `[${a.severity.toUpperCase()}] ${a.title}: ${a.description}`)
      .join('\n');

    const systemPrompt = `You are a personal financial advisor AI embedded in the Financial Mind Map app.
You have access to the user's anonymized transaction data from the last 90 days.
Always respond in clear, concise natural language. Be supportive, specific, and actionable.
Never mention raw account numbers, credentials, or internal system details.
Keep answers under 150 words unless a detailed breakdown is explicitly requested.

--- USER FINANCIAL CONTEXT ---
Total spend (90 days): $${totalSpend.toFixed(2)}

ACCOUNTS:
${accountSummary || 'No accounts linked yet.'}

SPENDING BY CATEGORY:
${categoryBreakdown || 'No transactions yet.'}

TOP MERCHANTS:
${topMerchants || 'No transactions yet.'}

RECENT ALERTS:
${recentAlertsSummary || 'No alerts.'}
--- END CONTEXT ---`;

    const apiKey = Deno.env.get('ONSPACE_AI_API_KEY');
    const baseUrl = Deno.env.get('ONSPACE_AI_BASE_URL');

    const aiRes = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query },
        ],
      }),
    });

    if (!aiRes.ok) {
      const err = await aiRes.text();
      console.error('OnSpace AI error:', err.substring(0, 200));
      return new Response(JSON.stringify({ error: `AI: ${err}` }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await aiRes.json();
    const answer = aiData.choices?.[0]?.message?.content ?? 'Unable to generate insight.';

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('financial-insight error:', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
