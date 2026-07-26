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

    const { public_token, institution_id, institution_name } = await req.json();
    if (!public_token) {
      return new Response(JSON.stringify({ error: 'public_token required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const plaidClientId = Deno.env.get('PLAID_CLIENT_ID');
    const plaidSecret = Deno.env.get('PLAID_SECRET');
    const plaidEnv = Deno.env.get('PLAID_ENV') ?? 'sandbox';
    const plaidBaseUrl = plaidEnv === 'production'
      ? 'https://production.plaid.com'
      : plaidEnv === 'development'
        ? 'https://development.plaid.com'
        : 'https://sandbox.plaid.com';

    // Exchange public token for access token
    const exchangeRes = await fetch(`${plaidBaseUrl}/item/public_token/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: plaidClientId, secret: plaidSecret, public_token }),
    });

    if (!exchangeRes.ok) {
      const err = await exchangeRes.text();
      console.error('Plaid exchange error:', err);
      return new Response(JSON.stringify({ error: `Plaid: ${err}` }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { access_token, item_id } = await exchangeRes.json();

    // Store access token securely — never logged or exposed
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: item, error: itemError } = await supabaseAdmin
      .from('plaid_items')
      .upsert({
        user_id: user.id,
        access_token,
        item_id,
        institution_id: institution_id ?? null,
        institution_name: institution_name ?? 'Unknown Bank',
        last_synced_at: null,
      }, { onConflict: 'item_id' })
      .select('id')
      .single();

    if (itemError) {
      console.error('DB insert plaid_items error:', itemError.message);
      return new Response(JSON.stringify({ error: 'Failed to store account link' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Trigger initial sync immediately
    const syncRes = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/plaid-sync`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': req.headers.get('Authorization') ?? '',
        },
        body: JSON.stringify({ plaid_item_id: item.id }),
      }
    );

    console.log('Initial sync triggered, status:', syncRes.status);

    return new Response(JSON.stringify({ success: true, institution_name }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('plaid-exchange-token error:', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
