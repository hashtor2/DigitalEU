import { Outlet } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export default function Layout() {
  const [theme, setTheme] = useTheme()

  return (
    <div className="min-h-screen bg-[#f9f7f2] dark:bg-[#1a1815] text-[#1a2332] dark:text-[#f5f1ea] transition-colors">
      <header className="border-b border-[#1a2332]/10 dark:border-[#3a3530] py-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-mono font-semibold">Scanner</h1>
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
      </header>
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <Outlet />
      </main>
      <footer className="border-t border-[#1a2332]/10 dark:border-[#3a3530] py-6 mt-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-sm text-[#1a2332]/60 dark:text-[#a89d96]">
          <p>&copy; 2026 digitaleu.me. Privacy first, always.</p>
        </div>
      </footer>
    </div>
  )
}

