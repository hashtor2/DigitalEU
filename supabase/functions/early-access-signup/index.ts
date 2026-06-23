import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Gmail-only for beta (samme regel som klient + DB-constraint).
const GMAIL_RE = /^[^@\s]+@(gmail|googlemail)\.com$/i;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, consent } = await req.json();

    const sanitizedEmail =
      typeof email === "string" ? email.toLowerCase().trim() : "";

    if (!GMAIL_RE.test(sanitizedEmail)) {
      return new Response(
        JSON.stringify({
          error:
            "Early access is Gmail-only for now — other providers are next on the list.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (consent !== true) {
      return new Response(
        JSON.stringify({ error: "Consent is required to join the early-access list." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase
      .from("early_access")
      .insert({ email: sanitizedEmail, consent: true, status: "pending" })
      .select();

    if (error) {
      // Duplikat — allerede på listen. Behandle som suksess på klienten (409).
      if (error.code === "23505") {
        return new Response(
          JSON.stringify({ error: "Already on the list", code: "DUPLICATE" }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, message: "Added to early-access list", email: sanitizedEmail }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Early access signup error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to join early access", details: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
