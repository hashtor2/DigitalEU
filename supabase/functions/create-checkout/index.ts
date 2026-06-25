import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Scanner unlock pris: €5 engangskjøp (ADR #12).
const SCANNER_UNLOCK_CENTS = "500";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Only POST method is allowed." }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    return new Response(
      JSON.stringify({
        error:
          "Missing STRIPE_SECRET_KEY in Supabase Edge Secrets. Configure this secret before using checkout.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // Identifiser den innloggede brukeren fra JWT-en slik at webhooken kan
  // knytte entitlement til riktig user_id etter betaling.
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const authHeader = req.headers.get("Authorization");

  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response(
      JSON.stringify({ error: "Server is not configured for authentication." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "You must be signed in to start checkout." }),
      {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return new Response(
      JSON.stringify({ error: "Invalid or expired session. Please sign in again." }),
      {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  let body: { successUrl?: string; cancelUrl?: string; gmailAddress?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Request body must be valid JSON." }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const { successUrl, cancelUrl, gmailAddress } = body;
  if (!successUrl || !cancelUrl) {
    return new Response(
      JSON.stringify({ error: "successUrl and cancelUrl are required." }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const params = new URLSearchParams();
  params.append("payment_method_types[]", "card");
  params.append("mode", "payment");
  params.append("success_url", successUrl);
  params.append("cancel_url", cancelUrl);
  // Tillat rabattkoder (Stripe promotion codes) — gir gratis-tilgang via 100%-kupong.
  params.append("allow_promotion_codes", "true");
  // Knytt sesjonen til brukeren for webhook-grant.
  params.append("client_reference_id", user.id);
  params.append("metadata[user_id]", user.id);
  if (user.email) {
    params.append("customer_email", user.email);
  }
  if (gmailAddress) {
    params.append("metadata[gmail_address]", gmailAddress);
  }
  params.append("line_items[0][price_data][currency]", "eur");
  params.append("line_items[0][price_data][product_data][name]", "DigitalEU Scanner unlock");
  params.append("line_items[0][price_data][unit_amount]", SCANNER_UNLOCK_CENTS);
  params.append("line_items[0][quantity]", "1");

  const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = await stripeResponse.json();
  if (!stripeResponse.ok) {
    return new Response(
      JSON.stringify({
        error: data.error?.message || "Stripe checkout creation failed.",
        details: data,
      }),
      {
        status: stripeResponse.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  return new Response(JSON.stringify({ url: data.url }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
