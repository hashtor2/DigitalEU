import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@13.3.0";

const stripeWebhookHandler = async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response(JSON.stringify({ error: "Missing signature" }), { status: 400 });
    }

    const body = await req.text();
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!stripeKey || !webhookSecret) {
      console.error("Stripe keys not configured");
      return new Response(
        JSON.stringify({ error: "Webhook not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(stripeKey);

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response(
        JSON.stringify({ error: "Webhook signature verification failed" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error("Supabase keys not configured");
      return new Response(
        JSON.stringify({ error: "Database not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // -------------------------------------------------------------------------
    // checkout.session.completed — grants access to the Migration Toolkit.
    // Toolkit-First model: scanner is free, toolkit is €5 one-time.
    // No affiliate verification, no gmail_verified, no manual approval needed.
    // -------------------------------------------------------------------------
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.user_id || session.client_reference_id;
      const email =
        session.customer_email || session.customer_details?.email || null;
      const amountTotal = session.amount_total ?? 0;
      const paymentRef = (session.payment_intent as string) || session.id;
      const now = new Date().toISOString();

      if (!userId) {
        console.error("checkout.session.completed without user_id metadata");
        return new Response(JSON.stringify({ received: true, skipped: "no_user_id" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // 1) Grant toolkit entitlement (idempotent on user_id).
      const { error: entError } = await supabase
        .from("entitlements")
        .upsert(
          {
            user_id: userId,
            access_type: "paid",
            stripe_session_id: session.id,
          },
          { onConflict: "user_id" },
        );
      if (entError) {
        console.error("Failed to grant entitlement:", entError);
        return new Response(
          JSON.stringify({ error: "Failed to grant entitlement" }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }

      // 2) Payment audit log.
      const { error: payError } = await supabase
        .from("scanner_payments")
        .upsert(
          {
            user_id: userId,
            email: email || "unknown",
            stripe_payment_intent_id: paymentRef,
            stripe_session_id: session.id,
            amount_cents: amountTotal,
            currency: session.currency || "eur",
            status: "succeeded",
            completed_at: now,
          },
          { onConflict: "stripe_payment_intent_id" },
        );
      if (payError) {
        console.error("Failed to record payment audit:", payError);
      }

    } else if (event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object;
      const userId = session.metadata?.user_id || session.client_reference_id;
      const email =
        session.customer_email || session.customer_details?.email || "unknown";
      const paymentRef = (session.payment_intent as string) || session.id;
      await supabase.from("scanner_payments").upsert(
        {
          user_id: userId || null,
          email,
          stripe_payment_intent_id: paymentRef,
          stripe_session_id: session.id,
          amount_cents: session.amount_total ?? 0,
          currency: session.currency || "eur",
          status: "failed",
        },
        { onConflict: "stripe_payment_intent_id" },
      );
    } else if (event.type === "charge.refunded") {
      const charge = event.data.object;
      await supabase
        .from("scanner_payments")
        .update({ status: "refunded", refund_id: charge.id })
        .eq("stripe_payment_intent_id", charge.payment_intent);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return new Response(
      JSON.stringify({ error: "Webhook processing failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

serve(stripeWebhookHandler);
