import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/db'
import {
  runInboxScan,
  saveGuestScanResults,
  clearEmailSessionTokens,
  type InboxProvider,
} from '@/lib/inboxScan'
import { initializeInboxScan } from '@/lib/scan'

const SESSION_ONLY_TOKEN = 'session_only'

export default function EmailCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState('Completing email authentication...')

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

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        const exchangeUrl = `${supabaseUrl}/functions/v1/exchange-email-code`

        const response = await fetch(exchangeUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            code,
            codeVerifier,
            provider,
            redirectUri: `${window.location.origin}/scanner/auth/email-callback`,
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

        sessionStorage.setItem('email_access_token', accessToken)
        sessionStorage.setItem('email_provider', provider)
        if (expiresIn) {
          sessionStorage.setItem('email_token_expires', String(Date.now() + expiresIn * 1000))
        }

        sessionStorage.removeItem('oauth_code_verifier')
        sessionStorage.removeItem('oauth_provider')
        sessionStorage.removeItem('oauth_state')

        setStatus('Scanning your inbox (metadata only)...')

        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          const scopes =
            provider === 'gmail'
              ? 'https://www.googleapis.com/auth/gmail.metadata'
              : 'https://graph.microsoft.com/Mail.ReadBasic'

          const { data: connection, error: upsertError } = await supabase
            .from('mailbox_connections')
            .upsert(
              {
                user_id: user.id,
                provider,
                oauth_token_encrypted: SESSION_ONLY_TOKEN,
                scopes,
                connected_at: new Date().toISOString(),
                revoked_at: null,
              },
              { onConflict: 'user_id,provider' }
            )
            .select('id')
            .single()

          if (upsertError || !connection) {
            throw new Error('Failed to save mailbox connection')
          }

          const { scanId, error: scanError } = await initializeInboxScan(
            connection.id,
            user.id,
            accessToken,
            provider
          )

          clearEmailSessionTokens()

          if (scanError || !scanId) {
            throw new Error(scanError || 'Scan failed')
          }

          navigate(`/scanner/results/${scanId}`, { replace: true })
          return
        }

        const scanOutcome = await runInboxScan(accessToken, provider, {
          onProgress: (_percent, step) => setStatus(step),
        })

        saveGuestScanResults({
          provider: scanOutcome.provider,
          scannedCount: scanOutcome.scannedCount,
          matched: scanOutcome.matched,
          createdAt: Date.now(),
        })

        clearEmailSessionTokens()
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
