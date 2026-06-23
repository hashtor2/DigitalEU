import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const stripe = await import("https://esm.sh/stripe@13.3.0").then(m => m.default);

const createPaymentIntent = async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { email, amount, currency } = await req.json();

    // Validate input
    if (!email || !amount || !currency) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, amount, currency" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get Stripe secret key from environment
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY not configured");
      return new Response(JSON.stringify({ error: "Payment service not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const stripeClient = stripe(stripeKey);

    // Create payment intent
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount,
      currency,
      metadata: {
        email,
        source: "scanner",
      },
      statement_descriptor: "DigitalEU Scanner",
    });

    return new Response(
      JSON.stringify({
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Payment intent error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to create payment intent" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

serve(createPaymentIntent);