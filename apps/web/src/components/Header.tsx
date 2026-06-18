import { Link, useLocation } from "react-router-dom";
import { useMigrationState } from "@/hooks/useMigrationState";
import { Button } from "@/components/ui/button";

export function Header() {
  const location = useLocation();
  const { mode, user } = useMigrationState();

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `text-sm font-medium transition duration-200 ${
      isActive(path)
        ? "text-sky-400 font-semibold"
        : "text-slate-400 hover:text-white"
    }`;

  return (
    <header className="border-b border-white/5 sticky top-0 bg-slate-950/80 backdrop-blur-md z-50">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-xl" aria-hidden="true">🇪🇺</span>
          <span className="font-extrabold text-base tracking-tight text-white group-hover:text-slate-200 transition">
            DigitalEU<span className="text-sky-400">.me</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className={linkClass("/")}>
            Home
          </Link>
          <Link to="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
          </Link>
          <Link to="/directory" className={linkClass("/directory")}>
            Alternatives
          </Link>
          <Link to="/news" className={linkClass("/news")}>
            EU Tech News
          </Link>
          <Link to="/guides" className={linkClass("/guides")}>
            Guides
          </Link>
          <Link to="/about" className={linkClass("/about")}>
            Manifesto
          </Link>
        </nav>

        {/* Session Indicator */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
            {mode === "profile" && user ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-mono text-slate-400 max-w-[100px] truncate">{user.email}</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                <span>Guest Mode</span>
              </>
            )}
          </span>

          <Button asChild size="sm" className="bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow-md shadow-sky-500/10">
            <Link to="/dashboard">Scan Inbox</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
