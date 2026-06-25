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
        <div className="rounded-sm border border-success/30 bg-success/10 p-6 text-center">
          <h2 className="mb-2 text-lg font-mono font-semibold text-success">Check your email</h2>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
            We've sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
          </p>
        </div>
        <div className="text-center">
          <a href="/" className="text-sm text-accent hover:underline">
            Back to home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-mono font-bold text-text-primary dark:text-dark-text-primary">Create an account</h1>
        <p className="text-text-secondary dark:text-dark-text-secondary">Join the scanner beta and take control of your digital life.</p>
      </div>

      {error && (
        <div className="rounded-sm border border-error/30 bg-error/10 p-4 text-error text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label className="block text-sm font-mono font-semibold mb-1 text-text-primary dark:text-dark-text-primary">Email</label>
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
          <label className="block text-sm font-mono font-semibold mb-1 text-text-primary dark:text-dark-text-primary">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-sm border border-border dark:border-dark-border px-3 py-2 bg-canvas dark:bg-dark-canvas text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            disabled={loading}
            minLength={8}
            required
          />
          <p className="mt-1 text-xs text-text-secondary dark:text-dark-text-secondary">At least 8 characters</p>
        </div>

        <div>
          <label className="block text-sm font-mono font-semibold mb-1 text-text-primary dark:text-dark-text-primary">Confirm password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      <div className="text-center text-sm text-text-secondary dark:text-dark-text-secondary">
        Already have an account?{' '}
        <a href="/scanner/auth/signin" className="font-semibold text-accent hover:underline">
          Sign in
        </a>
      </div>
    </div>
  )
}
