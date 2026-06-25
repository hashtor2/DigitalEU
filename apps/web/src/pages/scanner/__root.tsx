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
    window.location.href = '/scanner'
  }

  return (
    <div className="min-h-screen bg-canvas dark:bg-dark-canvas text-text-primary dark:text-dark-text-primary transition-colors">
      <header className="border-b border-border dark:border-dark-border py-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Top row: Logo + Sign in + Theme */}
          <div className="flex justify-between items-center mb-4">
            <Link to="/" className="text-2xl font-mono font-semibold hover:text-accent transition">
              Europa
            </Link>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <a
                    href="/scanner/dashboard"
                    className="text-sm text-text-secondary dark:text-dark-text-secondary hover:text-accent transition"
                  >
                    Dashboard
                  </a>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-text-secondary dark:text-dark-text-secondary hover:text-accent transition"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <a
                  href="/scanner/auth/signin"
                  className="text-sm text-text-secondary dark:text-dark-text-secondary hover:text-accent transition"
                >
                  Sign in
                </a>
              )}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg bg-border/20 hover:bg-border/40 dark:bg-dark-border/20 dark:hover:bg-dark-border/40 transition"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun size={20} className="text-accent" />
                ) : (
                  <Moon size={20} className="text-text-primary" />
                )}
              </button>
            </div>
          </div>

          {/* Navigation menu */}
          <nav className="flex gap-8 text-sm text-text-secondary dark:text-dark-text-secondary">
            <Link to="/" className="hover:text-accent transition">
              How it works
            </Link>
            <a href="https://www.digitaleu.me/directory" className="hover:text-accent transition">
              Alternatives
            </a>
            <a href="https://www.digitaleu.me/guides" className="hover:text-accent transition">
              Guides
            </a>
            <a href="https://www.digitaleu.me/news" className="hover:text-accent transition">
              News
            </a>
            <a href="https://www.digitaleu.me/about" className="hover:text-accent transition">
              About
            </a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <Outlet />
      </main>
      <footer className="border-t border-border dark:border-dark-border py-6 mt-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-sm text-text-secondary dark:text-dark-text-secondary">
          <p>&copy; 2026 digitaleu.me. Privacy first, always.</p>
          <p className="mt-1 text-xs leading-relaxed">
            Some recommendation links support the project.
          </p>
        </div>
      </footer>
    </div>
  )
}

