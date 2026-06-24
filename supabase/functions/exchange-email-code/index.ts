/**
 * Supabase Edge Function: exchange-email-code
 *
 * Securely exchanges OAuth authorization code + PKCE code_verifier for access token.
 * This prevents code interception via PKCE validation (RFC 7636).
 *
 * SECURITY MODEL:
 * - Receives authorization code (not token) from client
 * - Client sends code_verifier (secret, never transmitted before)
 * - Google/Microsoft validates that code_verifier matches code_challenge (received during auth)
 * - Edge Function receives access token (never exposed to browser)
 * - Returns token to client (ephemeral, stored in sessionStorage only)
 *
 * Request body:
 * {
 *   "code": "4/0AY0e-gxxxxxx",           // OAuth authorization code
 *   "codeVerifier": "...random...",      // PKCE code_verifier (43–128 chars)
 *   "provider": "gmail" | "outlook",
 *   "redirectUri": "https://scanner.digitaleu.me/auth/email-callback"
 * }
 *
 * Response:
 * {
 *   "accessToken": "ya29.a0AfH6...",     // Short-lived access token
 *   "expiresIn": 3600                    // Token expiry (seconds)
 * }
 *
 * Error response (400/500):
 * {
 *   "error": "error_description"
 * }
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

/**
 * Exchange Gmail authorization code + PKCE verifier for access token.
 * Calls Google's token endpoint securely (server-side).
 */
async function exchangeGmailCode(
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<{ access_token: string; expires_in: number }> {
  const googleTokenUrl = "https://oauth2.googleapis.com/token"
  
  const clientId = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID") || ""
  const clientSecret = Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET") || ""
  
  console.log("DEBUG: Gmail exchange starting")
  console.log("DEBUG: clientId length:", clientId.length, "first 20:", clientId.substring(0, 20))
  console.log("DEBUG: clientSecret length:", clientSecret.length)
  
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

  console.log("DEBUG: Sending token request to Google with redirectUri:", redirectUri)
  
  const response = await fetch(googleTokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  })

  console.log("DEBUG: Google response status:", response.status)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error("DEBUG: Google token exchange failed - status:", response.status)
    console.error("DEBUG: Response body:", errorText)
    
    let errorData = {}
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

/**
 * Exchange Outlook authorization code + PKCE verifier for access token.
 * Calls Microsoft's token endpoint securely (server-side).
 */
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
    scope: "https://graph.microsoft.com/.default",
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
  // Handle CORS preflight
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
    // Parse request body
    const { code, codeVerifier, provider, redirectUri } = await req.json()
    
    // DEBUG: Log all environment variables to diagnose secret access
    const googleId = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID") || ""
    const googleSecret = Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET") || ""
    const msId = Deno.env.get("MICROSOFT_OAUTH_CLIENT_ID") || ""
    const msSecret = Deno.env.get("MICROSOFT_OAUTH_CLIENT_SECRET") || ""
    
    console.log("DEBUG: ========== ENVIRONMENT CHECK ==========")
    console.log("DEBUG: Google ID (first 30):", googleId.substring(0, 30))
    console.log("DEBUG: Google Secret (first 30):", googleSecret.substring(0, 30))
    console.log("DEBUG: MS ID (first 30):", msId.substring(0, 30))
    console.log("DEBUG: MS Secret (first 30):", msSecret.substring(0, 30))
    console.log("DEBUG: ========== END ENVIRONMENT CHECK ==========")

    // Validate required parameters
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

    // Exchange code for token
    let tokenData
    if (provider === "gmail") {
      tokenData = await exchangeGmailCode(code, codeVerifier, redirectUri)
    } else {
      tokenData = await exchangeOutlookCode(code, codeVerifier, redirectUri)
    }

    // Return token to client (ephemeral, not stored server-side)
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
    
    const googleId = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID") || ""
    const googleSecret = Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET") || ""
    const msId = Deno.env.get("MICROSOFT_OAUTH_CLIENT_ID") || ""
    const msSecret = Deno.env.get("MICROSOFT_OAUTH_CLIENT_SECRET") || ""
    
    const diagnostics = {
      error: message,
      google_client_id_first_30: googleId.substring(0, 30),
      google_secret_first_30: googleSecret.substring(0, 30),
      microsoft_client_id_first_30: msId.substring(0, 30),
      microsoft_secret_first_30: msSecret.substring(0, 30)
    }
    
    console.error("DEBUG: Error diagnostics:", diagnostics)

    return new Response(JSON.stringify(diagnostics), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
