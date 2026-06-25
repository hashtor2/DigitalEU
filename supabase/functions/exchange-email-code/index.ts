/**
 * Supabase Edge Function: exchange-email-code
 *
 * Securely exchanges OAuth authorization code + PKCE code_verifier for access token.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

async function exchangeGmailCode(
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<{ access_token: string; expires_in: number }> {
  const googleTokenUrl = "https://oauth2.googleapis.com/token"

  const clientId = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID") || ""
  const clientSecret = Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET") || ""

  if (!clientId) {
    throw new Error("GOOGLE_OAUTH_CLIENT_ID not set in Supabase secrets")
  }
  if (!clientSecret) {
    throw new Error("GOOGLE_OAUTH_CLIENT_SECRET not set in Supabase secrets")
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    code_verifier: codeVerifier,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
  })

  const response = await fetch(googleTokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  })

  if (!response.ok) {
    const errorText = await response.text()
    let errorData: { error?: string; error_description?: string } = {}
    try {
      errorData = JSON.parse(errorText)
    } catch {
      errorData = { error: "invalid_response", error_description: errorText }
    }

    throw new Error(
      `Gmail token exchange failed: ${errorData.error} — ${errorData.error_description || ""}`
    )
  }

  const data = await response.json()
  return {
    access_token: data.access_token,
    expires_in: data.expires_in || 3600,
  }
}

async function exchangeOutlookCode(
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<{ access_token: string; expires_in: number }> {
  const microsoftTokenUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/token"

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    code_verifier: codeVerifier,
    client_id: Deno.env.get("MICROSOFT_OAUTH_CLIENT_ID") || "",
    client_secret: Deno.env.get("MICROSOFT_OAUTH_CLIENT_SECRET") || "",
    redirect_uri: redirectUri,
    scope: "https://graph.microsoft.com/Mail.ReadBasic offline_access",
  })

  const response = await fetch(microsoftTokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(
      `Microsoft token exchange failed: ${errorData.error} — ${errorData.error_description || ""}`
    )
  }

  const data = await response.json()
  return {
    access_token: data.access_token,
    expires_in: data.expires_in || 3600,
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Only POST method allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  try {
    const { code, codeVerifier, provider, redirectUri } = await req.json()

    if (!code) {
      return new Response(
        JSON.stringify({ error: "Missing required parameter: code" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    if (!codeVerifier) {
      return new Response(
        JSON.stringify({ error: "Missing required parameter: codeVerifier" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    if (!provider || !["gmail", "outlook"].includes(provider)) {
      return new Response(
        JSON.stringify({ error: 'provider must be "gmail" or "outlook"' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    if (!redirectUri) {
      return new Response(
        JSON.stringify({ error: "Missing required parameter: redirectUri" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const tokenData =
      provider === "gmail"
        ? await exchangeGmailCode(code, codeVerifier, redirectUri)
        : await exchangeOutlookCode(code, codeVerifier, redirectUri)

    return new Response(
      JSON.stringify({
        accessToken: tokenData.access_token,
        expiresIn: tokenData.expires_in,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error during token exchange"

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
