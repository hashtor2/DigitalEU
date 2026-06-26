import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMigrationState } from "@/hooks/useMigrationState";
import { useTheme } from "@/hooks/useTheme";
import { Menu, Moon, Sun, X, LogOut, Settings, BarChart3, ChevronDown } from "lucide-react";
import { MegaMenuAlternatives } from "./MegaMenuAlternatives";
import { HeaderSearch } from "./HeaderSearch";

// Nye 6 menypunkter med submenyer (HOME, EMAIL SCANNER, EU ALTERNATIVES, NEWS, BUSINESS, ABOUT)
const NAV_ITEMS = [
  { to: "/", label: "HOME" },
  {
    label: "EMAIL SCANNER",
    children: [
      { to: "/emailscanner", label: "SCAN" },
      { to: "/how", label: "HOW DOES IT WORK" },
    ],
  },
  {
    label: "EU ALTERNATIVES",
    to: "/directory",
    hasMenu: true, // Bruker MegaMenuAlternatives
  },
  { to: "/news", label: "NEWS" },
  { to: "/b2b", label: "BUSINESS" },
  { to: "/about", label: "ABOUT" },
] as const;

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, user } = useMigrationState();
  const [theme, setTheme] = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [emailScannerMenuOpen, setEmailScannerMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;


  const linkClass = (path: string) =>
    `text-sm transition-all duration-150 ${
      isActive(path)
        ? "text-text-primary dark:text-dark-text-primary font-semibold border-b-2 border-accent pb-1"
        : "text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary hover:bg-border/30 dark:hover:bg-dark-border/30 px-2 py-1 rounded-sm"
    }`;

  const handleLogout = async () => {
    // TODO: Implement logout logic (clear Supabase session)
    setUserMenuOpen(false);
    // Navigate to home after logout
    navigate("/");
  };

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
          {NAV_ITEMS.map((item: any) => {
            // Handle submenu items (EMAIL SCANNER)
            if (item.children) {
              return (
                <div key={item.label} className="relative group">
                  <button className={`text-sm font-medium transition-all duration-150 px-3 py-2 rounded-sm hover:bg-border/30 dark:hover:bg-dark-border/30 text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary group-hover:text-accent`}>
                    {item.label}
                  </button>
                  {/* Submenu dropdown */}
                  <div className="opacity-0 invisible group-hover:visible group-hover:opacity-100 absolute left-0 top-full mt-1 flex flex-col gap-1 bg-border/50 dark:bg-dark-border/50 border border-secondary-accent/40 dark:border-secondary-accent/40 rounded-sm shadow-lg z-50 py-2 min-w-[200px] transition-all duration-150">
                    {item.children?.map((child: any) => (
                      <Link
                        key={child.label}
                        to={child.to}
                        className="px-3 py-2 text-sm font-medium text-text-primary dark:text-dark-text-primary hover:bg-secondary-accent/20 dark:hover:bg-secondary-accent/30 hover:text-accent transition-colors duration-150"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }
            // Handle mega menu items (EU ALTERNATIVES)
            if (item.hasMenu) {
              return (
                <div key={item.label} className={`relative group ${linkClass(item.to)}`}>
                  <Link to={item.to} className={linkClass(item.to)}>
                    {item.label}
                  </Link>
                  <MegaMenuAlternatives isMobile={false} />
                </div>
              );
            }
            // Handle regular items
            return (
              <Link key={item.label} to={item.to} className={linkClass(item.to)}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-sm border border-border dark:border-dark-border hover:text-accent dark:hover:text-accent text-text-secondary dark:text-dark-text-secondary transition-colors duration-150"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Search */}
          <HeaderSearch />

          {/* Auth Section */}
          <div className="hidden sm:flex items-center gap-2">
            {mode === "profile" && user ? (
              <>
                {/* Dashboard + User menu */}
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-3 py-2 rounded-sm text-sm font-semibold text-text-secondary dark:text-dark-text-secondary hover:text-accent hover:bg-border/30 dark:hover:bg-dark-border/30 transition-all duration-150 flex items-center gap-2"
                  title="Go to dashboard"
                >
                  <BarChart3 size={18} />
                  <span className="hidden md:inline">Dashboard</span>
                </button>
                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="p-2 rounded-sm border border-border dark:border-dark-border hover:bg-border/30 dark:hover:bg-dark-border/30 text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors flex items-center gap-2"
                    title={user.email}
                  >
                    <span className="h-2 w-2 rounded-full bg-success flex-shrink-0" />
                    <span className="text-xs font-mono max-w-[100px] truncate hidden md:inline">{user.email}</span>
                    <ChevronDown size={16} />
                  </button>
                  {/* User dropdown menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 bg-canvas dark:bg-dark-canvas border border-border dark:border-dark-border rounded-sm shadow-lg z-50 min-w-[200px]">
                      <button
                        onClick={() => { navigate("/dashboard"); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-border/50 dark:hover:bg-dark-border/50 text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary flex items-center gap-2 border-b border-border/50 dark:border-dark-border/50 transition-colors"
                      >
                        <BarChart3 size={16} /> Dashboard
                      </button>
                      <button
                        onClick={() => { navigate("/dashboard#settings"); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-border/50 dark:hover:bg-dark-border/50 text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary flex items-center gap-2 border-b border-border/50 dark:border-dark-border/50 transition-colors"
                      >
                        <Settings size={16} /> Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-border/50 dark:hover:bg-dark-border/50 text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary flex items-center gap-2 transition-colors"
                      >
                        <LogOut size={16} /> Log out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Login / Create Account buttons */}
                <button
                  onClick={() => navigate("/emailscanner")}
                  className="px-4 py-2 rounded-sm text-sm font-semibold text-accent border border-accent hover:bg-accent hover:text-white transition-all duration-150"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate("/emailscanner")}
                  className="px-4 py-2 rounded-sm text-sm font-semibold bg-accent hover:bg-accent-hover text-white transition-all duration-150"
                >
                  Create account
                </button>
              </>
            )}
          </div>

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
            {/* Auth section for mobile */}
            {!(mode === "profile" && user) && (
              <div className="flex flex-col gap-2 mb-4 pb-4 border-b border-border/60 dark:border-dark-border/60">
                <button
                  onClick={() => { navigate("/emailscanner"); setMobileOpen(false); }}
                  className="w-full px-4 py-2 rounded-sm text-sm font-semibold text-accent border border-accent hover:bg-accent hover:text-white transition-all"
                >
                  Log in
                </button>
                <button
                  onClick={() => { navigate("/emailscanner"); setMobileOpen(false); }}
                  className="w-full px-4 py-2 rounded-sm text-sm font-semibold bg-accent hover:bg-accent-hover text-white transition-all"
                >
                  Create account
                </button>
              </div>
            )}

            {NAV_ITEMS.map((item: any) => {
              // Handle submenu items (EMAIL SCANNER)
              if (item.children) {
                return (
                  <div key={item.label} className="border-b border-border/60 dark:border-dark-border/60 last:border-0">
                    <button
                      onClick={() => setEmailScannerMenuOpen(!emailScannerMenuOpen)}
                      className="w-full text-left py-3 font-semibold text-text-primary dark:text-dark-text-primary hover:text-accent transition-colors flex items-center justify-between"
                    >
                      {item.label}
                      <ChevronDown size={16} className={`transition-transform ${emailScannerMenuOpen ? "rotate-180" : ""}`} />
                    </button>
                    {emailScannerMenuOpen && (
                      <div className="flex flex-col gap-1 pl-4 pb-2">
                        {item.children.map((child: any) => (
                          <Link
                            key={child.to}
                            to={child.to}
                            onClick={() => setMobileOpen(false)}
                            className={`py-2 text-sm transition-all duration-150 ${
                              isActive(child.to)
                                ? "text-accent font-semibold"
                                : "text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary"
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              // Handle mega menu items (EU ALTERNATIVES)
              if (item.hasMenu) {
                return (
                  <div key={item.label} className="border-b border-border/60 dark:border-dark-border/60 last:border-0">
                    <Link
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={`block py-3 transition-all duration-150 ${linkClass(item.to)}`}
                    >
                      {item.label}
                    </Link>
                    <MegaMenuAlternatives isMobile={true} onLinkClick={() => setMobileOpen(false)} />
                  </div>
                );
              }
              // Handle regular items
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-3 border-b border-border/60 dark:border-dark-border/60 last:border-0 transition-all duration-150 ${linkClass(item.to)}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
