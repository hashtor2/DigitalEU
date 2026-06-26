import { useEffect, useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { supabase } from '../../lib/db'

const NAV_LINKS = [
  { to: '/scanner', label: 'Scanner' },
  { to: '/directory', label: 'EU Alternatives' },
  { to: '/guides', label: 'Guides' },
  { to: '/news', label: 'News' },
  { to: '/about', label: 'About' },
]

export default function ScannerLayout() {
  const [theme, setTheme] = useTheme()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    let mounted = true

    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (mounted) setIsAuthenticated(!!user)
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#2d4a6e] bg-[#0d1117]/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="font-mono text-base font-semibold text-white hover:text-emerald-400 transition-colors"
            >
              digitaleu.me
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    isActive(link.to)
                      ? 'text-emerald-400 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Auth */}
              {isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/scanner/dashboard"
                    className="px-3 py-1.5 rounded-md text-sm font-semibold text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="px-3 py-1.5 rounded-md text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  to="/scanner/auth/signin"
                  className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-md text-sm font-semibold border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 transition-colors"
                >
                  Sign in
                </Link>
              )}

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="md:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#2d4a6e] bg-[#0d1117]">
            <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive(link.to)
                      ? 'text-emerald-400 font-semibold bg-emerald-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-[#2d4a6e] mt-2 pt-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/scanner/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2 text-sm font-semibold text-emerald-400"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { setMobileOpen(false); handleSignOut() }}
                      className="block w-full text-left px-3 py-2 text-sm text-slate-400"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/scanner/auth/signin"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-sm font-semibold text-emerald-400"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2d4a6e] mt-16 py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; 2026 digitaleu.me — Privacy first, always.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy policy</Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
            <a href="mailto:support@digitaleu.me" className="hover:text-slate-300 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
