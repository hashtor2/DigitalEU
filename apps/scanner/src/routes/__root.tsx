import { useEffect, useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { supabase } from '@/lib/db'

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
    <div className="min-h-screen bg-canvas dark:bg-dark-canvas text-text-primary dark:text-dark-text-primary transition-colors">
      <header className="sticky top-0 z-50 border-b border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Top row: Logo + Nav + Sign in + Theme */}
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="font-mono text-lg font-semibold text-text-primary dark:text-dark-text-primary hover:text-accent transition-colors">
              digitaleu.me
            </Link>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="/" className="text-sm text-text-secondary dark:text-dark-text-secondary hover:text-accent transition">
                HOME
              </a>
              <a href="/emailscanner" className="text-sm text-text-secondary dark:text-dark-text-secondary hover:text-accent transition font-medium text-accent">
                EMAIL SCANNER
              </a>
              <a href="/directory" className="text-sm text-text-secondary dark:text-dark-text-secondary hover:text-accent transition">
                EU ALTERNATIVES
              </a>
              <a href="/news" className="text-sm text-text-secondary dark:text-dark-text-secondary hover:text-accent transition">
                NEWS
              </a>
              <a href="/b2b" className="text-sm text-text-secondary dark:text-dark-text-secondary hover:text-accent transition">
                BUSINESS
              </a>
              <a href="/about" className="text-sm text-text-secondary dark:text-dark-text-secondary hover:text-accent transition">
                ABOUT
              </a>
            </nav>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <a
                    href="/dashboard"
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
                  href="/auth/signin"
                  className="text-sm text-text-secondary dark:text-dark-text-secondary hover:text-accent transition"
                >
                  Sign in
                </a>
              )}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-sm bg-border/10 dark:bg-dark-border/10 hover:bg-border/20 dark:hover:bg-dark-border/20 transition"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun size={20} className="text-accent" />
                ) : (
                  <Moon size={20} className="text-accent" />
                )}
              </button>
            </div>
          </div>

          {/* Navigation menu */}
          <nav className="flex gap-8 text-sm text-text-secondary dark:text-dark-text-secondary border-t border-border dark:border-dark-border py-3">
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
      <footer className="border-t border-border dark:border-dark-border py-6 mt-12 bg-canvas dark:bg-dark-canvas">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-small text-text-secondary dark:text-dark-text-secondary">
          <p>&copy; 2026 digitaleu.me. Privacy first, always.</p>
          <p className="mt-1 text-xs leading-relaxed">
            Some recommendation links support the project.
          </p>
        </div>
      </footer>
    </div>
  )
}

