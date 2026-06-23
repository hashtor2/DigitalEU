import { useState } from 'react'
import { supabase } from '@/lib/db'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      setError(signUpError.message)
    } else {
      setSuccess(true)
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="mx-auto max-w-md space-y-6">
        <div className="rounded-lg border border-green-300 dark:border-green-900 bg-green-50 dark:bg-green-900/20 p-6 text-center">
          <h2 className="mb-2 text-lg font-mono font-semibold text-green-900 dark:text-green-400">Check your email</h2>
          <p className="text-sm text-green-700 dark:text-green-300">
            We've sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
          </p>
        </div>
        <div className="text-center">
          <a href="/" className="text-sm text-[#c17a5c] dark:text-[#a86650] hover:underline">
            Back to home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-mono font-bold text-[#1a2332] dark:text-[#f5f1ea]">Create an account</h1>
        <p className="text-[#1a2332]/70 dark:text-[#a89d96]">Join the scanner beta and take control of your digital life.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-900/20 p-4 text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label className="block text-sm font-mono font-semibold mb-1 text-[#1a2332] dark:text-[#f5f1ea]">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-[#1a2332]/20 dark:border-[#3a3530] px-3 py-2 bg-white dark:bg-[#2a251f] text-[#1a2332] dark:text-[#f5f1ea] focus:outline-none focus:ring-2 focus:ring-terracotta"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-mono font-semibold mb-1 text-[#1a2332] dark:text-[#f5f1ea]">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-[#1a2332]/20 dark:border-[#3a3530] px-3 py-2 bg-white dark:bg-[#2a251f] text-[#1a2332] dark:text-[#f5f1ea] focus:outline-none focus:ring-2 focus:ring-terracotta"
            disabled={loading}
            minLength={8}
            required
          />
          <p className="mt-1 text-xs text-[#1a2332]/60 dark:text-[#a89d96]">At least 8 characters</p>
        </div>

        <div>
          <label className="block text-sm font-mono font-semibold mb-1 text-[#1a2332] dark:text-[#f5f1ea]">Confirm password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded border border-[#1a2332]/20 dark:border-[#3a3530] px-3 py-2 bg-white dark:bg-[#2a251f] text-[#1a2332] dark:text-[#f5f1ea] focus:outline-none focus:ring-2 focus:ring-terracotta"
            disabled={loading}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-[#c17a5c] dark:bg-[#a86650] px-4 py-2 font-mono font-semibold text-[#f9f7f2] hover:bg-[#c17a5c]/90 dark:hover:bg-[#a86650]/90 disabled:opacity-50 transition"
        >
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      <div className="text-center text-sm text-[#1a2332]/70 dark:text-[#a89d96]">
        Already have an account?{' '}
        <a href="/auth/signin" className="font-semibold text-[#c17a5c] dark:text-[#a86650] hover:underline">
          Sign in
        </a>
      </div>
    </div>
  )
}

