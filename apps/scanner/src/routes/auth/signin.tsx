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
        <h1 className="text-3xl font-mono font-bold text-[#1a2332] dark:text-[#f5f1ea]">
          Sign in or connect email
        </h1>
        <p className="text-[#1a2332]/70 dark:text-[#a89d96]">
          Create an account or scan your email with OAuth.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-900/20 p-4 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Email/Password Section */}
      <div className="space-y-4 pb-6 border-b border-[#1a2332]/10 dark:border-[#3a3530]">
        <h2 className="text-sm font-mono font-semibold text-[#1a2332]/60 dark:text-[#a89d96] uppercase tracking-wider">
          Traditional login
        </h2>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-mono font-semibold mb-1 text-[#1a2332] dark:text-[#f5f1ea]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-[#1a2332]/20 dark:border-[#3a3530] px-3 py-2 bg-white dark:bg-[#2a251f] text-[#1a2332] dark:text-[#f5f1ea] focus:outline-none focus:ring-2 focus:ring-[#c17a5c]"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-mono font-semibold mb-1 text-[#1a2332] dark:text-[#f5f1ea]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-[#1a2332]/20 dark:border-[#3a3530] px-3 py-2 bg-white dark:bg-[#2a251f] text-[#1a2332] dark:text-[#f5f1ea] focus:outline-none focus:ring-2 focus:ring-[#c17a5c]"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-[#c17a5c] dark:bg-[#a86650] px-4 py-2 font-mono font-semibold text-[#f9f7f2] hover:bg-[#c17a5c]/90 dark:hover:bg-[#a86650]/90 disabled:opacity-50 transition"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>

      {/* Email Scanner Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-semibold text-[#1a2332]/60 dark:text-[#a89d96] uppercase tracking-wider">
          Quick scan (no account)
        </h2>

        <button
          onClick={handleGmailEmailConnect}
          disabled={loading}
          className="w-full rounded border border-[#1a2332]/20 dark:border-[#3a3530] px-4 py-3 font-mono font-semibold text-[#1a2332] dark:text-[#f5f1ea] hover:bg-[#1a2332]/5 dark:hover:bg-[#f5f1ea]/10 disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          {loading ? 'Connecting...' : '🔗 Connect Gmail'}
        </button>

        <button
          onClick={handleOutlookEmailConnect}
          disabled={loading}
          className="w-full rounded border border-[#1a2332]/20 dark:border-[#3a3530] px-4 py-3 font-mono font-semibold text-[#1a2332] dark:text-[#f5f1ea] hover:bg-[#1a2332]/5 dark:hover:bg-[#f5f1ea]/10 disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          {loading ? 'Connecting...' : '🔗 Connect Outlook'}
        </button>

        <p className="text-xs text-[#1a2332]/60 dark:text-[#a89d96] text-center">
          Read-only access. Your inbox stays private.
        </p>
      </div>

      {/* Sign up link */}
      <div className="text-center text-sm text-[#1a2332]/70 dark:text-[#a89d96] pt-4 border-t border-[#1a2332]/10 dark:border-[#3a3530]">
        Don't have an account?{' '}
        <a href="/auth/signup" className="font-semibold text-[#c17a5c] dark:text-[#a86650] hover:underline">
          Sign up
        </a>
      </div>

      {/* Beta notice */}
      <div className="rounded-lg border border-[#2d3e2d]/10 dark:border-[#3a3530] bg-[#2d3e2d]/5 dark:bg-[#2d3e2d]/20 p-4 text-xs text-[#1a2332]/70 dark:text-[#a89d96] space-y-2">
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

