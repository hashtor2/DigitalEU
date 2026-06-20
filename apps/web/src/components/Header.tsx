import { Link, useLocation } from "react-router-dom";
import { useMigrationState } from "@/hooks/useMigrationState";
import { Button } from "@/components/ui/button";
import { storeMarket } from "@/pages/AudienceSelectorPage";
import { EuStarRing } from "@/components/Logo";

export function Header() {
  const location = useLocation();
  const { mode, user } = useMigrationState();

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
          <Link to="/b2c" className={linkClass("/b2c")} onClick={() => storeMarket("b2c")}>
            For You
          </Link>
          <Link to="/b2b" className={linkClass("/b2b")} onClick={() => storeMarket("b2b")}>
            For Business
          </Link>
          <Link to="/dashboard" className={linkClass("/dashboard")}>Dashboard</Link>
          <Link to="/directory" className={linkClass("/directory")}>Alternatives</Link>
          <Link to="/guides" className={linkClass("/guides")}>Guides</Link>
          <Link to="/about" className={linkClass("/about")}>Manifesto</Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {mode === "profile" && user && (
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="font-mono text-slate-400 max-w-[100px] truncate">{user.email}</span>
            </span>
          )}

          {isB2B ? (
            <Button
              asChild
              size="sm"
              className="bg-[#1a56db] hover:bg-[#2563eb] text-white text-xs px-4 rounded-md font-medium h-8"
            >
              <a href="/b2b#contact">Contact Us</a>
            </Button>
          ) : (
            <Button
              asChild
              size="sm"
              className="bg-[#1a56db] hover:bg-[#2563eb] text-white text-xs px-4 rounded-md font-medium h-8"
            >
              <Link to="/dashboard">Scan Inbox</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
