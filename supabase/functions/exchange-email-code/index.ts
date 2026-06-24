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

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    code_verifier: codeVerifier,
    client_id: Deno.env.get("GOOGLE_OAUTH_CLIENT_ID") || "",
    client_secret: Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET") || "",
    redirect_uri: redirectUri,
  })

  const response = await fetch(googleTokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  })

  if (!response.ok) {
    const errorData = await response.json()
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

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
