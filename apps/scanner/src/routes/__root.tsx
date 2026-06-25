import { useEffect, useRef, useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Sun, Moon, BarChart3, Settings, LogOut, ChevronDown } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { supabase } from '@/lib/db'

export default function Layout() {
  const [theme, setTheme] = useTheme()
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => {
    let mounted = true

    const checkSession = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      if (mounted) {
        setUser(currentUser ? { email: currentUser.email } : null)
      }
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { email: session.user.email } : null)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Lukk brukermenyen ved klikk utenfor.
  useEffect(() => {
    if (!userMenuOpen) return
    const onClick = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [userMenuOpen])

  const handleSignOut = async () => {
    setUserMenuOpen(false)
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const isAuthenticated = !!user

  const secondaryLinkClass = (path: string) =>
    `transition ${
      location.pathname === path
        ? 'text-accent font-semibold'
        : 'text-text-secondary dark:text-dark-text-secondary hover:text-accent'
    }`

  return (
    <div className="min-h-screen bg-canvas dark:bg-dark-canvas text-text-primary dark:text-dark-text-primary transition-colors">
      <header className="sticky top-0 z-50 border-b border-border dark:border-dark-border bg-canvas/95 dark:bg-dark-canvas/95 backdrop-blur supports-[backdrop-filter]:bg-canvas/80 dark:supports-[backdrop-filter]:bg-dark-canvas/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Top row: Logo + Nav + Sign in + Theme */}
          <div className="flex justify-between items-center py-4">
            <Link
              to="/"
              className="font-mono text-lg font-semibold text-text-primary dark:text-dark-text-primary hover:text-accent transition-colors"
            >
              digitaleu.me
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="/" className="text-sm text-text-secondary dark:text-dark-text-secondary hover:text-accent transition">
                HOME
              </a>
              <a href="/emailscanner" className="text-sm font-medium text-accent hover:text-accent-hover transition">
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

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((open) => !open)}
                    className="flex items-center gap-2 rounded-sm border border-border dark:border-dark-border px-3 py-2 text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary hover:bg-border/30 dark:hover:bg-dark-border/30 transition-colors"
                    aria-haspopup="menu"
                    aria-expanded={userMenuOpen}
                    title={user?.email}
                  >
                    <span className="h-2 w-2 rounded-full bg-success flex-shrink-0" aria-hidden />
                    <span className="hidden font-mono text-xs sm:inline max-w-[140px] truncate">{user?.email}</span>
                    <ChevronDown size={16} />
                  </button>

                  {userMenuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 top-full mt-1 min-w-[200px] rounded-sm border border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas shadow-lg z-50"
                    >
                      <a
                        href="/dashboard"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 border-b border-border/60 dark:border-dark-border/60 px-4 py-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:bg-border/30 dark:hover:bg-dark-border/30 hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
                      >
                        <BarChart3 size={16} /> Dashboard
                      </a>
                      <a
                        href="/dashboard#security"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 border-b border-border/60 dark:border-dark-border/60 px-4 py-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:bg-border/30 dark:hover:bg-dark-border/30 hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
                      >
                        <Settings size={16} /> Settings
                      </a>
                      <button
                        onClick={handleSignOut}
                        role="menuitem"
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-text-secondary dark:text-dark-text-secondary hover:bg-border/30 dark:hover:bg-dark-border/30 hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
                      >
                        <LogOut size={16} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
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
                className="p-2 rounded-sm border border-border dark:border-dark-border hover:bg-border/30 dark:hover:bg-dark-border/30 transition"
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
          <nav className="flex gap-8 text-sm border-t border-border dark:border-dark-border py-3">
            <Link to="/" className={secondaryLinkClass('/')}>
              How it works
            </Link>
            <a href="https://www.digitaleu.me/directory" className="text-text-secondary dark:text-dark-text-secondary hover:text-accent transition">
              Alternatives
            </a>
            <a href="https://www.digitaleu.me/guides" className="text-text-secondary dark:text-dark-text-secondary hover:text-accent transition">
              Guides
            </a>
            <a href="https://www.digitaleu.me/news" className="text-text-secondary dark:text-dark-text-secondary hover:text-accent transition">
              News
            </a>
            <a href="https://www.digitaleu.me/about" className="text-text-secondary dark:text-dark-text-secondary hover:text-accent transition">
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

