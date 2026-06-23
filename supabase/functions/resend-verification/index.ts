import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resendVerification = async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Missing email" }),
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

    // Find existing unverified token for this email
    const { data: existingRecord } = await supabase
      .from("email_verifications")
      .select("*")
      .eq("email", email)
      .is("verified_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // If token is still valid (>30 min old), reuse it; otherwise generate new
    let token = existingRecord?.token;
    const recordAge = existingRecord
      ? (Date.now() - new Date(existingRecord.created_at).getTime()) / 1000 / 60
      : null;

    if (!token || (recordAge && recordAge > 30)) {
      token = crypto.getRandomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      // Delete old unverified records and create new one
      if (existingRecord) {
        await supabase
          .from("email_verifications")
          .delete()
          .eq("id", existingRecord.id);
      }

      const { error: insertError } = await supabase
        .from("email_verifications")
        .insert({
          email,
          token,
          expires_at: expiresAt,
          verified_at: null,
        });

      if (insertError) {
        console.error("Failed to create verification record:", insertError);
        return new Response(
          JSON.stringify({ error: "Failed to process request" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Send verification email
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
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Verification email sent" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Resend verification error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to resend verification" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

serve(resendVerification);