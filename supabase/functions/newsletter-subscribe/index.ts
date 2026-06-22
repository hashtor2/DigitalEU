import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, name } = await req.json();

    // Validate email
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate name (optional but recommended)
    const sanitizedName =
      name && typeof name === "string" ? name.trim() : null;
    const sanitizedEmail = email.toLowerCase().trim();

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert into newsletter_subscribers table (upsert pattern)
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: sanitizedEmail,
        name: sanitizedName,
        status: "active",
      })
      .select();

    if (error) {
      // Check if duplicate email (unique constraint violation)
      if (error.code === "23505") {
        return new Response(
          JSON.stringify({ error: "Email already subscribed", code: "DUPLICATE" }),
          {
            status: 409,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      throw error;
    }

    // Sync with Plausible Email List API (optional, best-effort)
    const plausibleApiKey = Deno.env.get("PLAUSIBLE_API_KEY");
    const plausibleEmailListId = Deno.env.get("PLAUSIBLE_EMAIL_LIST_ID");

    if (plausibleApiKey && plausibleEmailListId) {
      try {
        await fetch(
          `https://plausible.io/api/v1/email-lists/${plausibleEmailListId}/subscribers`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${plausibleApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: sanitizedEmail,
              name: sanitizedName || undefined,
            }),
          }
        );
      } catch (plausibleError) {
        // Log but don't fail the request if Plausible sync fails
        console.error("Plausible sync error:", plausibleError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Successfully subscribed to newsletter",
        email: sanitizedEmail,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to subscribe to newsletter",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
