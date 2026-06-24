import { useEffect, useState } from 'react'
import { supabase } from '@/lib/db'

export default function CallbackPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !data.session) {
        setError('Failed to establish session. Please try signing in again.')
        setLoading(false)
        return
      }

      // Redirect to dashboard after successful auth
      window.location.href = '/dashboard'
    }

    handleCallback()
  }, [])

  if (error) {
    return (
      <div className="mx-auto max-w-md space-y-6">
        <div className="rounded-lg border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-900/20 p-6">
          <h2 className="mb-2 text-lg font-mono font-semibold text-red-900 dark:text-red-400">Authentication failed</h2>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">{error}</p>
          <a href="/auth/signin" className="inline-block text-sm text-green dark:text-green-dark hover:underline">
            Try signing in again
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin h-8 w-8 border-4 border-green dark:border-green-dark border-t-transparent rounded-full mx-auto"></div>
        <p className="text-[#1a2332]/70 dark:text-[#a89d96]">Completing authentication...</p>
      </div>
    </div>
  )
}

