# OAUTH_FLOW_MIGRATION.md

## Authorization Code + PKCE Migration (Implicit Grant → Secure Flow)

**Status:** CRITICAL — Must be completed before public launch.  
**Deadline:** 2 weeks  
**Owner:** Lead Engineer  

---

## 1. Executive Summary

The current implementation uses the **Implicit Grant flow**, which is:
- **Deprecated** by OAuth 2.0 Security Best Current Practice (BCP 8).
- **Insecure** — access tokens appear in the browser URL hash and can be intercepted via:
  - Browser history
  - Extensions
  - Referer headers
  - XSS attacks

**Solution:** Migrate to **Authorization Code Flow + PKCE (RFC 7636)**, which:
- Keeps tokens server-side (Edge Function only)
- Requires a `code_challenge` to prevent token interception
- Is the **OAuth 2.0 standard for SPAs** (and all public clients)

**Impact:**
- Zero user-facing changes (except improved security).
- ~3 days implementation + testing.
- Fully blocks compliance issues before CASA Tier 2 audit.

---

## 2. Current State (Implicit Grant — DEPRECATED)

### Flow Diagram
```
[Browser]
    ↓ (1) Redirect to Google/Microsoft
[Google/Microsoft OAuth]
    ↓ (2) Consent screen
[Browser URL]
    ↓ (3) Token in hash: #access_token=xyz...
[Client JS]
    ↓ (4) Parse hash, extract token
    ↓ (5) Send token to Edge Function
[Edge Function]
    ↓ (6) Use token, scan inbox
[Browser]
    ↓ (7) Display results
```

### Problems
- **Token in hash**: Visible in browser history, referer headers, extensions.
- **No code challenge**: Attacker can inject an authorization code directly.
- **Deprecated**: Google/Microsoft warn customers not to use this flow.
- **CASA Tier 2 audit failure**: Auditors will reject this immediately.

---

## 3. Target State (Authorization Code + PKCE)

### Flow Diagram
```
[Client JS]
    ↓ (1) Generate code_verifier (43–128 chars, random)
    ↓ (2) Hash to code_challenge (SHA256)
[Browser]
    ↓ (3) Redirect to Google/Microsoft with code_challenge
[Google/Microsoft OAuth]
    ↓ (4) Consent screen
[Browser]
    ↓ (5) Receives authorization code (NOT token) in URL: ?code=xyz...
[Client JS]
    ↓ (6) Extract code + code_verifier
    ↓ (7) Send code + code_verifier to Edge Function
[Edge Function]
    ↓ (8) Exchange code + code_verifier for access token (server-side)
    ↓ (9) Use token, scan inbox
    ↓ (10) Delete token immediately (never stored)
[Browser]
    ↓ (11) Send back only domain list
[Client JS]
    ↓ (12) Display results
```

### Benefits
- **Token never in browser or history**: Stays server-side only.
- **PKCE protection**: code_verifier ensures attacker can't intercept code.
- **Compliant**: OAuth 2.0 standard for public clients and SPAs.
- **CASA Tier 2 approved**: Auditors will accept this as secure.

---

## 4. Implementation Steps

### 4.1 Scanner Frontend Changes

#### File: `apps/scanner/src/routes/auth/signin.tsx`

**Add Gmail OAuth button with PKCE flow:**

```typescript
import { generateCodeVerifier, generateCodeChallenge } from '@/lib/oauth-utils'

const handleGmailOAuth = async () => {
  // 1. Generate PKCE parameters
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  
  // 2. Store verifier in sessionStorage (ephemeral)
  sessionStorage.setItem('oauth_code_verifier', codeVerifier)
  sessionStorage.setItem('oauth_provider', 'gmail')
  
  // 3. Construct authorization URL
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.append('client_id', import.meta.env.VITE_GOOGLE_CLIENT_ID)
  authUrl.searchParams.append('redirect_uri', `${window.location.origin}/auth/email-callback`)
  authUrl.searchParams.append('response_type', 'code')
  authUrl.searchParams.append('scope', 'https://www.googleapis.com/auth/gmail.metadata')
  authUrl.searchParams.append('code_challenge', codeChallenge)
  authUrl.searchParams.append('code_challenge_method', 'S256')
  authUrl.searchParams.append('access_type', 'offline')
  authUrl.searchParams.append('state', generateRandomState())
  
  // 4. Redirect to Google OAuth
  window.location.href = authUrl.toString()
}

const handleOutlookOAuth = async () => {
  // Same as Gmail but with Microsoft endpoints
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  
  sessionStorage.setItem('oauth_code_verifier', codeVerifier)
  sessionStorage.setItem('oauth_provider', 'outlook')
  
  const authUrl = new URL('https://login.microsoftonline.com/common/oauth2/v2.0/authorize')
  authUrl.searchParams.append('client_id', import.meta.env.VITE_MICROSOFT_CLIENT_ID)
  authUrl.searchParams.append('redirect_uri', `${window.location.origin}/auth/email-callback`)
  authUrl.searchParams.append('response_type', 'code')
  authUrl.searchParams.append('scope', 'https://graph.microsoft.com/.default')
  authUrl.searchParams.append('code_challenge', codeChallenge)
  authUrl.searchParams.append('code_challenge_method', 'S256')
  authUrl.searchParams.append('prompt', 'consent')
  
  window.location.href = authUrl.toString()
}
```

#### File: `apps/scanner/src/lib/oauth-utils.ts` (NEW)

```typescript
/**
 * PKCE utilities for OAuth 2.0 Authorization Code flow.
 * RFC 7636: https://tools.ietf.org/html/rfc7636
 */

/**
 * Generate a cryptographically secure random code_verifier (43–128 chars).
 * Uses base64url encoding of random bytes.
 */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64UrlEncode(array)
}

/**
 * Generate code_challenge from code_verifier via SHA256.
 * Required for S256 (SHA256) method.
 */
export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return base64UrlEncode(new Uint8Array(hashBuffer))
}

/**
 * Helper: Base64URL encoding (no padding, URL-safe).
 */
function base64UrlEncode(buffer: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < buffer.byteLength; i++) {
    binary += String.fromCharCode(buffer[i])
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Generate random state parameter for CSRF protection.
 */
export function generateRandomState(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64UrlEncode(array)
}
```

#### File: `apps/scanner/src/routes/auth/email-callback.tsx` (NEW)

```typescript
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EmailCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 1. Extract authorization code and state from URL
        const url = new URL(window.location.href)
        const code = url.searchParams.get('code')
        const state = url.searchParams.get('state')
        const errorParam = url.searchParams.get('error')

        // Check for OAuth errors
        if (errorParam) {
          throw new Error(`OAuth error: ${errorParam}`)
        }

        if (!code) {
          throw new Error('No authorization code received')
        }

        // 2. Retrieve code_verifier and provider from sessionStorage
        const codeVerifier = sessionStorage.getItem('oauth_code_verifier')
        const provider = sessionStorage.getItem('oauth_provider')

        if (!codeVerifier || !provider) {
          throw new Error('PKCE parameters missing. Please try again.')
        }

        // 3. Call Edge Function to exchange code for access token
        const response = await fetch('/api/email-auth/exchange-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            codeVerifier,
            provider,
            redirectUri: `${window.location.origin}/auth/email-callback`,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Token exchange failed')
        }

        const { accessToken } = await response.json()

        // 4. Store access token in sessionStorage (ephemeral)
        sessionStorage.setItem('email_access_token', accessToken)
        sessionStorage.setItem('email_provider', provider)

        // 5. Clean up PKCE parameters
        sessionStorage.removeItem('oauth_code_verifier')
        sessionStorage.removeItem('oauth_provider')

        // 6. Redirect to scanner dashboard
        navigate('/dashboard')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    handleCallback()
  }, [navigate])

  if (error) {
    return (
      <div className="mx-auto max-w-md space-y-6">
        <div className="rounded-lg border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-900/20 p-6">
          <h2 className="mb-2 text-lg font-mono font-semibold text-red-900 dark:text-red-400">
            Authentication failed
          </h2>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">{error}</p>
          <a
            href="/auth/signin"
            className="inline-block text-sm text-[#c17a5c] dark:text-[#a86650] hover:underline"
          >
            Try again
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin h-8 w-8 border-4 border-[#c17a5c] dark:border-[#a86650] border-t-transparent rounded-full mx-auto"></div>
        <p className="text-[#1a2332]/70 dark:text-[#a89d96]">Completing email authentication...</p>
      </div>
    </div>
  )
}
```

### 4.2 Edge Function Changes

#### File: `supabase/functions/exchange-email-code/index.ts` (NEW)

```typescript
/**
 * Supabase Edge Function: exchange-email-code
 *
 * Securely exchanges OAuth authorization code + PKCE verifier for access token.
 * Prevents CSRF/code interception via PKCE (RFC 7636).
 *
 * Request body:
 * {
 *   "code": "...",           // OAuth authorization code from Google/Microsoft
 *   "codeVerifier": "...",   // PKCE code_verifier (43–128 chars)
 *   "provider": "gmail" | "outlook",
 *   "redirectUri": "https://scanner.digitaleu.me/auth/email-callback"
 * }
 *
 * Response:
 * {
 *   "accessToken": "...",    // Short-lived access token (returned to client)
 *   "expiresIn": 3600        // Token expiry (seconds)
 * }
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
    throw new Error(`Google token exchange failed: ${errorData.error_description}`)
  }

  return await response.json()
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
    scope: "https://graph.microsoft.com/.default",
  })

  const response = await fetch(microsoftTokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Microsoft token exchange failed: ${errorData.error_description}`)
  }

  return await response.json()
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Only POST allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  try {
    const { code, codeVerifier, provider, redirectUri } = await req.json()

    if (!code || !codeVerifier || !provider || !redirectUri) {
      return new Response(
        JSON.stringify({
          error: "Missing required parameters: code, codeVerifier, provider, redirectUri",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    let tokenData
    if (provider === "gmail") {
      tokenData = await exchangeGmailCode(code, codeVerifier, redirectUri)
    } else if (provider === "outlook") {
      tokenData = await exchangeOutlookCode(code, codeVerifier, redirectUri)
    } else {
      return new Response(
        JSON.stringify({ error: 'Provider must be "gmail" or "outlook"' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Return only the access token to the client
    // (not the refresh token — refresh tokens are handled server-side only)
    return new Response(
      JSON.stringify({
        accessToken: tokenData.access_token,
        expiresIn: tokenData.expires_in,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
```

### 4.3 Existing `scan-email` Edge Function: Remove Logging

#### File: `supabase/functions/scan-email/index.ts`

**Remove all console.log/console.warn/console.error statements:**

```typescript
// BEFORE:
console.log(`[scan-email] Fetching headers for ${messageIds.length} messages`);

// AFTER:
// (removed)

// BEFORE:
console.warn(`[scan-email] Failed to fetch message ${messageId}: ${msgResponse.status}`);

// AFTER:
// (removed)

// BEFORE:
console.log(`[scan-email] Fetched ${messages.length} Outlook messages`);

// AFTER:
// (removed)

// BEFORE:
console.error("[scan-email] Gmail scanning error:", error);
console.error("[scan-email] Outlook scanning error:", error);
console.error("[scan-email] Error:", error);

// AFTER:
// (removed — only throw or return error response)
```

---

## 5. Environment Variables (CRITICAL)

### Required in Vercel & Supabase:

```
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=        # ← Edge Function only!
MICROSOFT_OAUTH_CLIENT_ID=
MICROSOFT_OAUTH_CLIENT_SECRET=     # ← Edge Function only!
```

**MUST NOT be in `.env` or `.env.local` — set in Vercel/Supabase dashboards.**

---

## 6. Testing Checklist

Before deploying:

- [ ] **Local dev:** OAuth redirect works (code received in URL, not token).
- [ ] **PKCE validation:** code_challenge calculated correctly (SHA256).
- [ ] **Token exchange:** Edge Function receives code + verifier, exchanges for token.
- [ ] **Ephemeral:** Token never appears in browser history, URL, or console.
- [ ] **Scanner:** Can scan Gmail/Outlook with exchanged access token.
- [ ] **Cleanup:** Token deleted immediately after scanning.
- [ ] **Error handling:** Graceful messages if code_verifier mismatch.
- [ ] **Prod deployment:** GOOGLE/MICROSOFT secrets in Vercel/Supabase only.
- [ ] **Security audit:** No console.* statements in Edge Functions.

---

## 7. Rollout Plan

### Phase 1: Development (Days 1–2)
- [ ] Implement PKCE utilities.
- [ ] Update signin → OAuth flow.
- [ ] Create email-callback route.
- [ ] Create exchange-email-code Edge Function.
- [ ] Test locally with `npm run dev:scanner`.

### Phase 2: Staging (Day 3)
- [ ] Deploy Edge Functions to staging.
- [ ] Test OAuth redirect → token exchange → scanner.
- [ ] Validate no tokens in browser history.
- [ ] Security review.

### Phase 3: Production (Day 4)
- [ ] Deploy Edge Functions to production.
- [ ] Deploy scanner app to `scanner.digitaleu.me`.
- [ ] Test end-to-end.
- [ ] Monitor error rates (first 24h).

### Phase 4: Cleanup (Post-launch)
- [ ] Remove all Implicit Grant OAuth references from README.
- [ ] Update docs with new flow.
- [ ] Create runbook for rotating OAuth secrets.

---

## 8. References

- [RFC 7636: Proof Key for Public OAuth 2.0 Clients (PKCE)](https://tools.ietf.org/html/rfc7636)
- [Google: Using OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft: OAuth 2.0 authorization code flow](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow)
- [OAuth 2.0 Security Best Practices (BCP 8)](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)

---

**Next:** See `CASA_TIER_2_ROADMAP.md` for security audit requirements after this flow is live.
