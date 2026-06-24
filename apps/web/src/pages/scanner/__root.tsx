import { useEffect, useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { supabase } from '../../lib/db'

export default function Layout() {
  const [theme, setTheme] = useTheme()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    let mounted = true

    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (mounted) {
        setIsAuthenticated(!!user)
      }
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-[#f9f7f2] dark:bg-[#1a1815] text-[#1a2332] dark:text-[#f5f1ea] transition-colors">
      <header className="border-b border-[#1a2332]/10 dark:border-[#3a3530] py-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Top row: Logo + Sign in + Theme */}
          <div className="flex justify-between items-center mb-4">
            <Link to="/" className="text-2xl font-mono font-semibold hover:text-[#c17a5c] transition">
              Europa
            </Link>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <a
                    href="/dashboard"
                    className="text-sm text-[#1a2332]/70 dark:text-[#a89d96] hover:text-[#c17a5c] dark:hover:text-[#a86650] transition"
                  >
                    Dashboard
                  </a>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-[#1a2332]/70 dark:text-[#a89d96] hover:text-[#c17a5c] dark:hover:text-[#a86650] transition"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <a
                  href="/auth/signin"
                  className="text-sm text-[#1a2332]/70 dark:text-[#a89d96] hover:text-[#c17a5c] dark:hover:text-[#a86650] transition"
                >
                  Sign in
                </a>
              )}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg bg-[#f9f7f2]/10 dark:bg-[#f5f1ea]/10 hover:bg-[#1a2332]/20 dark:hover:bg-[#f5f1ea]/20 transition"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun size={20} className="text-[#c17a5c]" />
                ) : (
                  <Moon size={20} className="text-[#1a2332]" />
                )}
              </button>
            </div>
          </div>

          {/* Navigation menu */}
          <nav className="flex gap-8 text-sm text-[#1a2332]/70 dark:text-[#a89d96]">
            <Link to="/" className="hover:text-[#c17a5c] dark:hover:text-[#a86650] transition">
              How it works
            </Link>
            <a href="https://www.digitaleu.me/catalog" className="hover:text-[#c17a5c] dark:hover:text-[#a86650] transition">
              Alternatives
            </a>
            <a href="https://www.digitaleu.me/guides" className="hover:text-[#c17a5c] dark:hover:text-[#a86650] transition">
              Guides
            </a>
            <a href="https://www.digitaleu.me/news" className="hover:text-[#c17a5c] dark:hover:text-[#a86650] transition">
              News
            </a>
            <a href="https://www.digitaleu.me/about" className="hover:text-[#c17a5c] dark:hover:text-[#a86650] transition">
              About
            </a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <Outlet />
      </main>
      <footer className="border-t border-[#1a2332]/10 dark:border-[#3a3530] py-6 mt-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-sm text-[#1a2332]/60 dark:text-[#a89d96]">
          <p>&copy; 2026 digitaleu.me. Privacy first, always.</p>
          <p className="mt-1 text-xs leading-relaxed">
            Some recommendation links support the project.
          </p>
        </div>
      </footer>
    </div>
  )
}

