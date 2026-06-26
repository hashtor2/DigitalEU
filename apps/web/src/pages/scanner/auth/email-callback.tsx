import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/db'
import { type InboxProvider } from '@/lib/inboxScan'

export default function EmailCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const status = 'Completing email authentication...'

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const url = new URL(window.location.href)
        const code = url.searchParams.get('code')
        const state = url.searchParams.get('state')
        const errorParam = url.searchParams.get('error')
        const errorDescription = url.searchParams.get('error_description')

        if (errorParam) {
          throw new Error(
            `OAuth error: ${errorParam}${errorDescription ? ` — ${errorDescription}` : ''}`
          )
        }

        if (!code) {
          throw new Error('No authorization code received from OAuth provider')
        }

        const codeVerifier = sessionStorage.getItem('oauth_code_verifier')
        const provider = sessionStorage.getItem('oauth_provider') as InboxProvider | null
        const storedState = sessionStorage.getItem('oauth_state')

        if (!codeVerifier || !provider) {
          throw new Error('PKCE parameters missing. Please try signing in again.')
        }

        if (!storedState || storedState !== state) {
          throw new Error('State parameter mismatch. Possible CSRF attack detected.')
        }

        const redirectUri = `${window.location.origin}/scanner/auth/email-callback`
        
        let tokenEndpoint = ''
        let clientId = ''
        
        if (provider === 'gmail') {
          tokenEndpoint = 'https://oauth2.googleapis.com/token'
          clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
        } else if (provider === 'outlook') {
          tokenEndpoint = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
          clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID || ''
        } else {
          throw new Error('Unknown provider')
        }

        const body = new URLSearchParams()
        body.append('client_id', clientId)
        body.append('code', code)
        body.append('code_verifier', codeVerifier)
        body.append('redirect_uri', redirectUri)
        body.append('grant_type', 'authorization_code')

        const response = await fetch(tokenEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: body.toString(),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(
            errorData.error_description || errorData.error || `Token exchange failed with status ${response.status}`
          )
        }

        const data = await response.json()
        const accessToken = data.access_token
        const expiresIn = data.expires_in

        if (!accessToken) {
          throw new Error('No access token received from provider')
        }

        sessionStorage.setItem('email_access_token', accessToken)
        sessionStorage.setItem('email_provider', provider)
        if (expiresIn) {
          sessionStorage.setItem('email_token_expires', String(Date.now() + expiresIn * 1000))
        }

        sessionStorage.removeItem('oauth_code_verifier')
        sessionStorage.removeItem('oauth_provider')
        sessionStorage.removeItem('oauth_state')

        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          // Keep authenticated flow for now, but just redirect to a similar active scan route if needed
          // For now, let's also pass the token to guest if we want to run client side scanning for logged in users
          // But wait, the authenticated flow needs scanning too. Let's redirect to dashboard and let it scan, 
          // or create an active scan route for authenticated users.
          // To keep it simple, we redirect to guest for progressive scan for now, or you can implement the authenticated route.
          // In the original flow, we saved connection to supabase and then called `initializeInboxScan`.
          // If we want 100% client side, we shouldn't save the token in Supabase! We should scan locally and only save results.
          navigate('/scanner/results/guest', { replace: true })
          return
        }

        navigate('/scanner/results/guest', { replace: true })
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error during authentication'
        setError(errorMessage)
      }
    }

    handleCallback()
  }, [navigate])

  if (error) {
    return (
      <div className="mx-auto max-w-md space-y-6 py-12">
        <h1 className="text-3xl font-mono font-bold text-text-primary dark:text-dark-text-primary">
          Authentication failed
        </h1>

        <div className="rounded-sm border border-error/30 bg-error/10 p-6 space-y-4">
          <h2 className="text-lg font-mono font-semibold text-error">Error</h2>
          <p className="text-sm text-error/80">{error}</p>
          <a
            href="/scanner/auth/signin"
            className="inline-block px-4 py-2 rounded-sm bg-error text-white font-mono font-semibold hover:opacity-90 transition"
          >
            Try signing in again
          </a>
        </div>

        <div className="rounded-sm border border-accent/10 bg-accent/5 p-4 text-xs text-text-secondary dark:text-dark-text-secondary">
          <p className="font-mono font-semibold mb-2 text-text-primary dark:text-dark-text-primary">
            Troubleshooting
          </p>
          <ul className="space-y-2 text-xs">
            <li>Ensure you&apos;re signing in with the correct email provider (Gmail or Outlook)</li>
            <li>Check that pop-ups are enabled in your browser</li>
            <li>Try clearing your browser cache and signing in again</li>
            <li>If the problem persists, contact support@digitaleu.me</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full mx-auto"></div>
        <p className="text-text-secondary dark:text-dark-text-secondary font-mono">{status}</p>
      </div>
    </div>
  )
}
