import { useState } from 'react'
import { supabase } from '@/lib/db'
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateRandomState,
  constructGmailAuthUrl,
  constructOutlookAuthUrl,
} from '@/lib/oauth-utils'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
    } else {
      window.location.href = '/dashboard'
    }

    setLoading(false)
  }

  const handleGmailEmailConnect = async () => {
    try {
      setLoading(true)
      setError(null)

      const codeVerifier = generateCodeVerifier()
      const codeChallenge = await generateCodeChallenge(codeVerifier)
      const state = generateRandomState()

      sessionStorage.setItem('oauth_code_verifier', codeVerifier)
      sessionStorage.setItem('oauth_provider', 'gmail')
      sessionStorage.setItem('oauth_state', state)

      const authUrl = constructGmailAuthUrl(codeChallenge, state)
      window.location.href = authUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate Gmail connection')
      setLoading(false)
    }
  }

  const handleOutlookEmailConnect = async () => {
    try {
      setLoading(true)
      setError(null)

      const codeVerifier = generateCodeVerifier()
      const codeChallenge = await generateCodeChallenge(codeVerifier)
      const state = generateRandomState()

      sessionStorage.setItem('oauth_code_verifier', codeVerifier)
      sessionStorage.setItem('oauth_provider', 'outlook')
      sessionStorage.setItem('oauth_state', state)

      const authUrl = constructOutlookAuthUrl(codeChallenge, state)
      window.location.href = authUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate Outlook connection')
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-mono font-bold text-text-primary dark:text-dark-text-primary">
          Sign in or connect email
        </h1>
        <p className="text-text-secondary dark:text-dark-text-secondary">
          Create an account or scan your email with OAuth.
        </p>
      </div>

      {error && (
        <div className="rounded-sm border border-error/30 bg-error/10 p-4 text-error text-sm">
          {error}
        </div>
      )}

      {/* Email/Password Section */}
      <div className="space-y-4 pb-6 border-b border-border dark:border-dark-border">
        <h2 className="text-sm font-mono font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
          Traditional login
        </h2>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-mono font-semibold mb-1 text-text-primary dark:text-dark-text-primary">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-sm border border-border dark:border-dark-border px-3 py-2 bg-canvas dark:bg-dark-canvas text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-mono font-semibold mb-1 text-text-primary dark:text-dark-text-primary">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-sm border border-border dark:border-dark-border px-3 py-2 bg-canvas dark:bg-dark-canvas text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-accent px-4 py-2 font-mono font-semibold text-white hover:bg-accent-hover disabled:opacity-50 transition"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>

      {/* Email Scanner Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
          Quick scan (no account)
        </h2>

        <button
          onClick={handleGmailEmailConnect}
          disabled={loading}
          className="w-full rounded-sm border border-border dark:border-dark-border px-4 py-3 font-mono font-semibold text-text-primary dark:text-dark-text-primary hover:bg-border dark:hover:bg-dark-border disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          {loading ? 'Connecting...' : '🔗 Connect Gmail'}
        </button>

        <button
          onClick={handleOutlookEmailConnect}
          disabled={loading}
          className="w-full rounded-sm border border-border dark:border-dark-border px-4 py-3 font-mono font-semibold text-text-primary dark:text-dark-text-primary hover:bg-border dark:hover:bg-dark-border disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          {loading ? 'Connecting...' : '🔗 Connect Outlook'}
        </button>

        <p className="text-xs text-text-secondary dark:text-dark-text-secondary text-center">
          Read-only access. Your inbox stays private.
        </p>
      </div>

      {/* Sign up link */}
      <div className="text-center text-sm text-text-secondary dark:text-dark-text-secondary pt-4 border-t border-border dark:border-dark-border">
        Don't have an account?{' '}
        <a href="/auth/signup" className="font-semibold text-accent hover:underline">
          Sign up
        </a>
      </div>

      {/* Security notice */}
      <div className="rounded-sm border border-accent/10 bg-accent/5 p-4 text-xs text-text-secondary dark:text-dark-text-secondary space-y-2">
        <p className="font-mono font-semibold text-text-primary dark:text-dark-text-primary">🔐 Security</p>
        <ul className="space-y-1 text-xs">
          <li>✓ Metadata-only scanning (no email bodies)</li>
          <li>✓ Secure OAuth 2.0 with PKCE</li>
          <li>✓ Zero-knowledge encryption</li>
        </ul>
      </div>
    </div>
  )
}
