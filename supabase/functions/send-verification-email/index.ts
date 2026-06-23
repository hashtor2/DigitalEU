import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const sendVerificationEmail = async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, token" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const verificationUrl = `https://scanner.digitaleu.me/verify?token=${token}`;

    const emailBody = `
Hi,

Verify your email to unlock the DigitalEU scanner and see your digital footprint.

Verify Email: ${verificationUrl}

Link expires in 24 hours.

—DigitalEU Team
    `.trim();

    // Send email via Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev", // TODO: update to custom domain
        to: email,
        subject: "Verify your scanner access",
        text: emailBody,
        html: `
<html>
<body style="font-family: 'IBM Plex Mono', monospace; background-color: #1a1815; color: #f9f7f2; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #2a2420; padding: 30px; border-radius: 8px;">
    <h1 style="font-size: 24px; margin-bottom: 20px; color: #c17a5c;">Verify Your Email</h1>
    <p style="margin-bottom: 20px; line-height: 1.6;">
      Hi,<br><br>
      Verify your email to unlock the DigitalEU scanner and see your digital footprint.
    </p>
    <a href="${verificationUrl}" style="display: inline-block; background-color: #c17a5c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-bottom: 20px; font-weight: bold;">
      Verify Email
    </a>
    <p style="margin-bottom: 20px; line-height: 1.6;">
      Or copy this link into your browser:<br>
      <code style="background-color: #1a1815; padding: 8px 12px; border-radius: 4px; display: block; overflow-wrap: break-word; margin-top: 10px;">${verificationUrl}</code>
    </p>
    <p style="color: #999; font-size: 12px; margin-top: 30px;">
      Link expires in 24 hours.
    </p>
    <p style="color: #999; font-size: 12px;">
      —DigitalEU Team
    </p>
  </div>
</body>
</html>
        `.trim(),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Resend API error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        message_id: result.id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Send verification email error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to send verification email" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

serve(sendVerificationEmail);