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

    // -------------------------------------------------------------------------
    // checkout.session.completed — eneste hendelse som gir tilgang.
    // Brukes også for €0-sesjoner (100%-rabattkupong → gratis-tilgang).
    // -------------------------------------------------------------------------
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.user_id || session.client_reference_id;
      const gmailAddress = session.metadata?.gmail_address || null;
      const email =
        session.customer_email || session.customer_details?.email || null;
      const amountTotal = session.amount_total ?? 0;
      // €0-kupongsesjoner har ingen payment_intent; bruk session-id som referanse.
      const paymentRef = (session.payment_intent as string) || session.id;
      const now = new Date().toISOString();

      if (!userId) {
        console.error("checkout.session.completed without user_id metadata");
        // Ack med 200 for å unngå at Stripe prøver på nytt i det uendelige.
        return new Response(JSON.stringify({ received: true, skipped: "no_user_id" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // 1) Gi entitlement (idempotent på user_id).
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

      // 2) Sett scanner-metadata. gmail_verified utelates med vilje slik at
      //    standardverdien (FALSE) gjelder ved innsetting og en allerede
      //    godkjent verdi bevares ved konflikt — manuell godkjenning kreves.
      const { error: metaError } = await supabase
        .from("user_scanner_metadata")
        .upsert(
          {
            user_id: userId,
            scanner_access_type: "paid_stripe",
            gmail_address: gmailAddress,
            access_granted_at: now,
            updated_at: now,
          },
          { onConflict: "user_id" },
        );
      if (metaError) {
        console.error("Failed to upsert scanner metadata:", metaError);
      }

      // 3) Revisjonslogg for betalingen.
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

      // 4) Varsle admin om at en Gmail må godkjennes manuelt (Google test-user).
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      const adminEmail = Deno.env.get("ADMIN_NOTIFICATION_EMAIL");
      if (resendApiKey && adminEmail) {
        try {
          const amountLabel = (amountTotal / 100).toFixed(2);
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "onboarding@resend.dev",
              to: adminEmail,
              subject: "New scanner unlock — Gmail approval needed",
              text:
                `A user unlocked the scanner and needs manual Gmail approval.\n\n` +
                `User ID: ${userId}\n` +
                `Account email: ${email || "unknown"}\n` +
                `Gmail to approve: ${gmailAddress || "(not provided yet)"}\n` +
                `Amount: €${amountLabel}\n` +
                `Stripe session: ${session.id}\n\n` +
                `Action: add the Gmail as a Google Cloud test user, then set ` +
                `user_scanner_metadata.gmail_verified = true for this user_id.`,
            }),
          });
        } catch (err) {
          console.error("Failed to send admin notification:", err);
        }
      } else {
        console.warn(
          "RESEND_API_KEY or ADMIN_NOTIFICATION_EMAIL not set — admin not notified.",
        );
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