import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#f9f7f2] text-[#1a2332]">
      <header className="border-b border-[#1a2332]/10 py-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-mono font-semibold">Scanner</h1>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <Outlet />
      </main>
      <footer className="border-t border-[#1a2332]/10 py-6 mt-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-sm text-[#1a2332]/60">
          <p>&copy; 2026 digitaleu.me. Privacy first, always.</p>
        </div>
      </footer>
    </div>
  )
}
