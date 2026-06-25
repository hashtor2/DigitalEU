import { useEffect, useState } from 'react'
import { supabase } from '@/lib/db'

export default function CallbackPage() {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !data.session) {
        setError('Failed to establish session. Please try signing in again.')
        return
      }

      window.location.href = '/dashboard'
    }

    handleCallback()
  }, [])

  if (error) {
    return (
      <div className="mx-auto max-w-md space-y-6">
        <div className="rounded-sm border border-error/30 bg-error/10 p-6">
          <h2 className="mb-2 text-lg font-mono font-semibold text-error">Authentication failed</h2>
          <p className="text-sm text-error/80 mb-4">{error}</p>
          <a href="/auth/signin" className="inline-block text-sm text-accent hover:underline">
            Try signing in again
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full mx-auto"></div>
        <p className="text-text-secondary dark:text-dark-text-secondary">Completing authentication...</p>
      </div>
    </div>
  )
}
