import { useState } from 'react'
import { supabase } from '@/lib/db'

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

  const handleGoogleSignIn = async () => {
    setLoading(true)
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (oauthError) {
      setError(oauthError.message)
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-mono font-bold">Sign in</h1>
        <p className="text-[#1a2332]/70">Connect your email and start scanning.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label className="block text-sm font-mono font-semibold mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-[#1a2332]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c17a5c]"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-mono font-semibold mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-[#1a2332]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c17a5c]"
            disabled={loading}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-[#c17a5c] px-4 py-2 font-mono font-semibold text-[#f9f7f2] hover:bg-[#c17a5c]/90 disabled:opacity-50 transition"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#1a2332]/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-[#f9f7f2] px-2 text-[#1a2332]/60">Or continue with</span>
        </div>
      </div>

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full rounded border border-[#1a2332]/20 px-4 py-2 font-mono font-semibold hover:bg-[#1a2332]/5 disabled:opacity-50 transition"
      >
        {loading ? 'Loading...' : 'Google'}
      </button>

      <div className="text-center text-sm text-[#1a2332]/70">
        Don't have an account?{' '}
        <a href="/auth/signup" className="font-semibold text-[#c17a5c] hover:underline">
          Sign up
        </a>
      </div>

      <div className="rounded-lg border border-[#2d3e2d]/10 bg-[#2d3e2d]/5 p-4 text-xs text-[#1a2332]/70">
        <p className="font-mono font-semibold mb-2">Beta access</p>
        <p>This scanner is in closed beta. If you don't have access, you'll be added to the waitlist after signup.</p>
      </div>
    </div>
  )
}
