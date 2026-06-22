import { Link, useLocation } from "react-router-dom";
import { useMigrationState } from "@/hooks/useMigrationState";
import { useTheme } from "@/hooks/useTheme";
import { storeMarket } from "@/pages/AudienceSelectorPage";
import { EuStarRing } from "@/components/Logo";

export function Header() {
  const location = useLocation();
  const { mode, user } = useMigrationState();
  const [theme, setTheme] = useTheme();

  const isActive = (path: string) => location.pathname === path;
  const isB2B = location.pathname.startsWith("/b2b");

  const linkClass = (path: string) =>
    `text-sm transition duration-150 ${
      isActive(path)
        ? "text-white font-medium"
        : "text-slate-400 hover:text-slate-200"
    }`;

  return (
    <header className="border-b border-[#30363d] sticky top-0 bg-[#0d1117]/95 backdrop-blur-sm z-50">
      <a rel="me" href="https://mastodon.social/@digitaleu" className="sr-only">Mastodon</a>
      <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5"
          onClick={() => { try { localStorage.removeItem("digitaleu_market"); } catch {} }}
        >
          <EuStarRing size={22} />
          <span className="font-semibold text-sm text-white tracking-wide">
            DigitalEU<span className="text-[#f0c040]">.me</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className={linkClass("/")} onClick={() => storeMarket("b2c")}>
            For You
          </Link>
          <Link to="/b2b" className={linkClass("/b2b")} onClick={() => storeMarket("b2b")}>
            For Business
          </Link>
          <Link to="/dashboard" className={linkClass("/dashboard")}>Dashboard</Link>
          <Link to="/emailscanner" className={linkClass("/emailscanner")}>Email Scanner</Link>
          <Link to="/directory" className={linkClass("/directory")}>Alternatives</Link>
          <Link to="/guides" className={linkClass("/guides")}>Guides</Link>
          <Link to="/about" className={linkClass("/about")}>Manifesto</Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.828-2.828a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm.707 5.657a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707zM9 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          {mode === "profile" && user && (
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="font-mono text-slate-400 max-w-[100px] truncate">{user.email}</span>
            </span>
          )}

          {isB2B && (
            <a
              href="/b2b#contact"
              className="inline-flex items-center bg-[#1a56db] hover:bg-[#2563eb] text-white text-xs px-4 rounded-md font-medium h-8"
            >
              Contact Us
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
