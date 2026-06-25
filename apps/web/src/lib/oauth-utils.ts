/**
 * PKCE utilities for OAuth 2.0 Authorization Code flow.
 * RFC 7636: https://tools.ietf.org/html/rfc7636
 * 
 * Implements cryptographically secure code_verifier generation and
 * code_challenge derivation via SHA256.
 */

/**
 * Generate a cryptographically secure random code_verifier (43–128 chars).
 * Uses base64url encoding of random bytes per RFC 7636 §4.1.
 * 
 * @returns Random code_verifier string (unreserved characters, URL-safe)
 */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64UrlEncode(array)
}

/**
 * Generate code_challenge from code_verifier via SHA256.
 * Required for S256 (SHA256) method per RFC 7636 §4.2.
 * 
 * @param codeVerifier - Original code_verifier (43–128 chars)
 * @returns code_challenge (base64url-encoded SHA256 hash)
 */
export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return base64UrlEncode(new Uint8Array(hashBuffer))
}

/**
 * Helper: Base64URL encoding (no padding, URL-safe).
 * Per RFC 7636, uses - and _ instead of + and /.
 * 
 * @param buffer - Uint8Array to encode
 * @returns base64url string (no padding)
 */
function base64UrlEncode(buffer: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < buffer.byteLength; i++) {
    binary += String.fromCharCode(buffer[i]!)
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Generate random state parameter for CSRF protection.
 * Per OAuth 2.0 spec, state should be cryptographically random.
 * 
 * @returns Random state string (base64url-encoded)
 */
export function generateRandomState(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64UrlEncode(array)
}

/**
 * Construct Gmail OAuth authorization URL with PKCE.
 * 
 * @param codeChallenge - PKCE code_challenge (from generateCodeChallenge)
 * @param state - Random state for CSRF protection (from generateRandomState)
 * @returns Full authorization URL
 */
export function constructGmailAuthUrl(codeChallenge: string, state: string): string {
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  
  authUrl.searchParams.append('client_id', import.meta.env.VITE_GOOGLE_CLIENT_ID || '')
  authUrl.searchParams.append('redirect_uri', `${window.location.origin}/scanner/auth/email-callback`)
  authUrl.searchParams.append('response_type', 'code')
  authUrl.searchParams.append('scope', 'https://www.googleapis.com/auth/gmail.metadata')
  authUrl.searchParams.append('code_challenge', codeChallenge)
  authUrl.searchParams.append('code_challenge_method', 'S256')
  authUrl.searchParams.append('access_type', 'offline')
  authUrl.searchParams.append('state', state)
  
  return authUrl.toString()
}

/**
 * Construct Outlook/Microsoft OAuth authorization URL with PKCE.
 * 
 * @param codeChallenge - PKCE code_challenge (from generateCodeChallenge)
 * @param state - Random state for CSRF protection (from generateRandomState)
 * @returns Full authorization URL
 */
export function constructOutlookAuthUrl(codeChallenge: string, state: string): string {
  const authUrl = new URL('https://login.microsoftonline.com/common/oauth2/v2.0/authorize')
  
  authUrl.searchParams.append('client_id', import.meta.env.VITE_MICROSOFT_CLIENT_ID || '')
  authUrl.searchParams.append('redirect_uri', `${window.location.origin}/scanner/auth/email-callback`)
  authUrl.searchParams.append('response_type', 'code')
  authUrl.searchParams.append('scope', 'https://graph.microsoft.com/Mail.ReadBasic offline_access')
  authUrl.searchParams.append('code_challenge', codeChallenge)
  authUrl.searchParams.append('code_challenge_method', 'S256')
  authUrl.searchParams.append('prompt', 'consent')
  authUrl.searchParams.append('state', state)
  
  return authUrl.toString()
}
