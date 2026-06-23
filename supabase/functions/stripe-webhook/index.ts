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

    // Verify webhook signature
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

    // Initialize Supabase client
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

    // Handle payment events
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const email = paymentIntent.metadata?.email;

      if (!email) {
        console.error("No email in payment intent metadata");
        return new Response(
          JSON.stringify({ error: "Invalid payment intent" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Generate verification token
      const token = crypto.getRandomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      // Create email verification record
      const { error: verifyError } = await supabase
        .from("email_verifications")
        .insert({
          email,
          token,
          expires_at: expiresAt,
          verified_at: null,
        });

      if (verifyError) {
        console.error("Failed to create verification record:", verifyError);
        return new Response(
          JSON.stringify({ error: "Failed to process payment" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      // Create payment record
      await supabase
        .from("scanner_payments")
        .insert({
          email,
          stripe_payment_intent_id: paymentIntent.id,
          amount_cents: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: "succeeded",
        });

      // Call send-verification-email function
      try {
        await fetch(`${supabaseUrl}/functions/v1/send-verification-email`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${supabaseServiceRoleKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            token,
          }),
        });
      } catch (err) {
        console.error("Failed to send verification email:", err);
        // Don't fail the webhook if email send fails - payment was successful
      }
    } else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;
      const email = paymentIntent.metadata?.email;

      if (email) {
        await supabase
          .from("scanner_payments")
          .insert({
            email,
            stripe_payment_intent_id: paymentIntent.id,
            amount_cents: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: "failed",
          });
      }
    } else if (event.type === "charge.refunded") {
      const charge = event.data.object;

      await supabase
        .from("scanner_payments")
        .update({
          status: "refunded",
          refund_id: charge.id,
        })
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