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
        const exchangeUrl = new URL(`${window.location.origin}/api/auth/exchange-code`)
        
        const response = await fetch(exchangeUrl.toString(), {
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
          const errorData = await response.json().catch(() => ({}))
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

        // 6. Clean up PKCE parameters from sessionStorage
        sessionStorage.removeItem('oauth_code_verifier')
        sessionStorage.removeItem('oauth_provider')
        sessionStorage.removeItem('oauth_state')

        // 7. Redirect to scanner dashboard
        navigate('/dashboard')
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
          <h1 className="text-3xl font-mono font-bold text-[#1a2332] dark:text-[#f5f1ea]">
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

        <div className="rounded-lg border border-[#2d3e2d]/10 dark:border-[#3a3530] bg-[#2d3e2d]/5 dark:bg-[#2d3e2d]/20 p-4 text-xs text-[#1a2332]/70 dark:text-[#a89d96]">
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
        <div className="animate-spin h-8 w-8 border-4 border-[#c17a5c] dark:border-[#a86650] border-t-transparent rounded-full mx-auto"></div>
        <p className="text-[#1a2332]/70 dark:text-[#a89d96] font-mono">
          {loading ? 'Completing email authentication...' : 'Redirecting...'}
        </p>
      </div>
    </div>
  )
}
