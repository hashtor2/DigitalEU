import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMigrationState } from "@/hooks/useMigrationState";
import { useTheme } from "@/hooks/useTheme";
import { Menu, Moon, Sun, X } from "lucide-react";
import { MegaMenuAlternatives } from "./MegaMenuAlternatives";
import { HeaderSearch } from "./HeaderSearch";

// Hovednavigasjon: 6-punkts IA. Logoen = landing (side 1).
const NAV_ITEMS = [
  { to: "/how", label: "How it works" },
  { to: "/directory", label: "Alternatives" },
  { to: "/news", label: "News" },
  { to: "/guides", label: "Guides" },
  { to: "/about", label: "About" },
] as const;

export function Header() {
  const location = useLocation();
  const { mode, user } = useMigrationState();
  const [theme, setTheme] = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isB2B = location.pathname.startsWith("/b2b");

  const linkClass = (path: string) =>
    `text-sm transition-all duration-150 ${
      isActive(path)
        ? "text-text-primary dark:text-dark-text-primary font-semibold border-b-2 border-accent pb-1"
        : "text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary hover:bg-border/30 dark:hover:bg-dark-border/30 px-2 py-1 rounded-sm"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas">
      <a rel="me" href="https://mastodon.social/@digitaleu" className="sr-only">Mastodon</a>
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        {/* Logo: text-only branding → landing */}
        <Link
          to="/"
          className="font-mono text-h3 font-semibold text-text-primary dark:text-dark-text-primary hover:text-accent transition-colors"
        >
          digitaleu.me
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2 relative">
          {NAV_ITEMS.map((item) =>
            item.label === "Alternatives" ? (
              <div
                key={item.to}
                className={`relative ${linkClass(item.to)}`}
              >
                <Link to={item.to} className={linkClass(item.to)}>
                  {item.label}
                </Link>
                <MegaMenuAlternatives isMobile={false} />
              </div>
            ) : (
              <Link key={item.to} to={item.to} className={linkClass(item.to)}>
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-sm border border-border dark:border-dark-border hover:text-accent dark:hover:text-accent text-text-secondary dark:text-dark-text-secondary transition-colors duration-150"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {mode === "profile" && user && (
            <span className="hidden sm:flex items-center gap-2 text-small text-text-secondary dark:text-dark-text-secondary">
              <span className="h-2 w-2 rounded-full bg-success" />
              <span className="font-mono max-w-[120px] truncate">{user.email}</span>
            </span>
          )}

          {isB2B && (
            <a
              href="/b2b#contact"
              className="hidden sm:inline-flex items-center bg-accent hover:bg-accent-hover text-white text-small px-4 py-2 rounded-sm font-semibold transition-colors"
            >
              Contact Us
            </a>
          )}

          {/* Search */}
          <HeaderSearch />

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((open) => !open)}
            className="md:hidden p-2 rounded-sm border border-border dark:border-dark-border hover:bg-border dark:hover:bg-dark-border text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas animate-in fade-in duration-200">
          <div className="mx-auto max-w-6xl flex flex-col px-6 py-4">
            {NAV_ITEMS.map((item) => (
              <div key={item.to}>
                {item.label === "Alternatives" ? (
                  <>
                    <Link
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={`block py-3 border-b border-border/60 dark:border-dark-border/60 transition-all duration-150 ${linkClass(item.to)}`}
                    >
                      {item.label}
                    </Link>
                    <MegaMenuAlternatives isMobile={true} onLinkClick={() => setMobileOpen(false)} />
                  </>
                ) : (
                  <Link
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={`block py-3 border-b border-border/60 dark:border-dark-border/60 last:border-0 transition-all duration-150 ${linkClass(item.to)}`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
