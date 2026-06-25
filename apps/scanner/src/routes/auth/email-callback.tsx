import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mapDomainsToAlternativeIds, extractDetectedServices } from '@/lib/serviceMapping'

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
        const errorDescription = url.searchParams.get('error_description')

        // Check for OAuth errors from provider
        if (errorParam) {
          throw new Error(
            `OAuth error: ${errorParam}${errorDescription ? ` — ${errorDescription}` : ''}`
          )
        }

        if (!code) {
          throw new Error('No authorization code received from OAuth provider')
        }

        // 2. Retrieve PKCE parameters from sessionStorage
        const codeVerifier = sessionStorage.getItem('oauth_code_verifier')
        const provider = sessionStorage.getItem('oauth_provider')
        const storedState = sessionStorage.getItem('oauth_state')

        if (!codeVerifier || !provider) {
          throw new Error('PKCE parameters missing. Please try signing in again.')
        }

        // 3. Validate state parameter (CSRF protection)
        if (!storedState || storedState !== state) {
          throw new Error('State parameter mismatch. Possible CSRF attack detected.')
        }

        // 4. Call Edge Function to exchange code for access token
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        const exchangeUrl = `${supabaseUrl}/functions/v1/exchange-email-code`
        
        const response = await fetch(exchangeUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            code,
            codeVerifier,
            provider,
            redirectUri: `${window.location.origin}/auth/email-callback`,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("OAuth token exchange error:", {
            status: response.status,
            response: errorData
          })
          throw new Error(
            errorData.error || `Token exchange failed with status ${response.status}`
          )
        }

        const { accessToken, expiresIn } = await response.json()

        if (!accessToken) {
          throw new Error('No access token received from server')
        }

        // 5. Store access token in sessionStorage (ephemeral — cleared on tab close)
        sessionStorage.setItem('email_access_token', accessToken)
        sessionStorage.setItem('email_provider', provider)
        if (expiresIn) {
          sessionStorage.setItem('email_token_expires', String(Date.now() + expiresIn * 1000))
        }

        // 6. Call scan-email Edge Function to get detected services
        const scanUrl = `${supabaseUrl}/functions/v1/scan-email`
        
        const scanResponse = await fetch(scanUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            accessToken,
            provider,
            maxResults: 500,
          }),
        })

        if (!scanResponse.ok) {
          const scanErr = await scanResponse.text().catch(() => '')
          throw new Error(
            `Inbox scan failed (status ${scanResponse.status}). ${scanErr || ''}`.trim()
          )
        }

        const scanData = await scanResponse.json()
        const senders: string[] = scanData.senders || []
        // Full footprint: every distinct service domain found in the inbox.
        const detectedDomains = extractDetectedServices(senders)
        sessionStorage.setItem('detected_domains', JSON.stringify(detectedDomains))
        // scan-email returns sender domains; map them to the European
        // alternative IDs that the home-page grid pre-selects.
        const detectedServices = mapDomainsToAlternativeIds(senders)
        sessionStorage.setItem('detected_services', JSON.stringify(detectedServices))

        // 7. Clean up PKCE parameters from sessionStorage
        sessionStorage.removeItem('oauth_code_verifier')
        sessionStorage.removeItem('oauth_provider')
        sessionStorage.removeItem('oauth_state')

        // 8. Navigate to home page with inbox session active
        navigate('/', { replace: true })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error during authentication'
        setError(errorMessage)
        setLoading(false)
      }
    }

    handleCallback()
  }, [navigate])

  if (error) {
    return (
      <div className="mx-auto max-w-md space-y-6 py-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-mono font-bold text-black dark:text-white">
            Authentication failed
          </h1>
        </div>

        <div className="rounded-lg border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-900/20 p-6 space-y-4">
          <h2 className="text-lg font-mono font-semibold text-red-900 dark:text-red-400">
            Error
          </h2>
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          <a
            href="/auth/signin"
            className="inline-block px-4 py-2 rounded bg-red-900 dark:bg-red-800 text-white font-mono font-semibold hover:bg-red-900/90 dark:hover:bg-red-800/90 transition"
          >
            Try signing in again
          </a>
        </div>

        <div className="rounded-lg border border-green/10 dark:border-slate-700 bg-green/5 dark:bg-slate-700/20 p-4 text-xs text-black/70 dark:text-slate-400">
          <p className="font-mono font-semibold mb-2">Troubleshooting</p>
          <ul className="space-y-2 text-xs">
            <li>• Ensure you're signing in with the correct email provider (Gmail or Outlook)</li>
            <li>• Check that pop-ups are enabled in your browser</li>
            <li>• Try clearing your browser cache and signing in again</li>
            <li>• If the problem persists, contact support@digitaleu.me</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="animate-spin h-8 w-8 border-4 border-green dark:border-green-dark border-t-transparent rounded-full mx-auto"></div>
        <p className="text-black/70 dark:text-slate-400 font-mono">
          {loading ? 'Completing email authentication...' : 'Redirecting...'}
        </p>
      </div>
    </div>
  )
}
