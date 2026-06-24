import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/db'
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateRandomState,
  constructGmailAuthUrl,
  constructOutlookAuthUrl,
} from '@/lib/oauth-utils'

export default function SignInPage() {
  const navigate = useNavigate()
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

      // 1. Generate PKCE parameters
      const codeVerifier = generateCodeVerifier()
      const codeChallenge = await generateCodeChallenge(codeVerifier)
      const state = generateRandomState()

      // 2. Store PKCE parameters in sessionStorage (ephemeral)
      sessionStorage.setItem('oauth_code_verifier', codeVerifier)
      sessionStorage.setItem('oauth_provider', 'gmail')
      sessionStorage.setItem('oauth_state', state)

      // 3. Construct authorization URL
      const authUrl = constructGmailAuthUrl(codeChallenge, state)

      // 4. Redirect to Google OAuth
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

      // 1. Generate PKCE parameters
      const codeVerifier = generateCodeVerifier()
      const codeChallenge = await generateCodeChallenge(codeVerifier)
      const state = generateRandomState()

      // 2. Store PKCE parameters in sessionStorage (ephemeral)
      sessionStorage.setItem('oauth_code_verifier', codeVerifier)
      sessionStorage.setItem('oauth_provider', 'outlook')
      sessionStorage.setItem('oauth_state', state)

      // 3. Construct authorization URL
      const authUrl = constructOutlookAuthUrl(codeChallenge, state)

      // 4. Redirect to Microsoft OAuth
      window.location.href = authUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate Outlook connection')
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-mono font-bold text-black dark:text-slate-50">
          Sign in or connect email
        </h1>
        <p className="text-gray dark:text-slate-400">
          Create an account or scan your email with OAuth.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-900/20 p-4 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Email/Password Section */}
      <div className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-sm font-mono font-semibold text-gray dark:text-slate-400 uppercase tracking-wider">
          Traditional login
        </h2>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-mono font-semibold mb-1 text-black dark:text-slate-50">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-slate-200 dark:border-slate-700 px-3 py-2 bg-white dark:bg-navy-dark text-black dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-green"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-mono font-semibold mb-1 text-black dark:text-slate-50">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-slate-200 dark:border-slate-700 px-3 py-2 bg-white dark:bg-navy-dark text-black dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-green"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-green dark:bg-green px-4 py-2 font-mono font-semibold text-white hover:bg-green-dark dark:hover:bg-green-dark disabled:opacity-50 transition"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>

      {/* Email Scanner Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-semibold text-gray dark:text-slate-400 uppercase tracking-wider">
          Quick scan (no account)
        </h2>

        <button
          onClick={handleGmailEmailConnect}
          disabled={loading}
          className="w-full rounded border border-slate-200 dark:border-slate-700 px-4 py-3 font-mono font-semibold text-black dark:text-slate-50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          {loading ? 'Connecting...' : '🔗 Connect Gmail'}
        </button>

        <button
          onClick={handleOutlookEmailConnect}
          disabled={loading}
          className="w-full rounded border border-slate-200 dark:border-slate-700 px-4 py-3 font-mono font-semibold text-black dark:text-slate-50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          {loading ? 'Connecting...' : '🔗 Connect Outlook'}
        </button>

        <p className="text-xs text-gray dark:text-slate-400 text-center">
          Read-only access. Your inbox stays private.
        </p>
      </div>

      {/* Sign up link */}
      <div className="text-center text-sm text-gray dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-700">
        Don't have an account?{' '}
        <a href="/auth/signup" className="font-semibold text-green dark:text-green hover:underline">
          Sign up
        </a>
      </div>

      {/* Beta notice */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-200/10 dark:bg-slate-700/20 p-4 text-xs text-gray dark:text-slate-400 space-y-2">
        <p className="font-mono font-semibold">🔐 Security</p>
        <ul className="space-y-1 text-xs">
          <li>✓ Metadata-only scanning (no email bodies)</li>
          <li>✓ Secure OAuth 2.0 with PKCE</li>
          <li>✓ Zero-knowledge encryption</li>
        </ul>
      </div>
    </div>
  )
}

