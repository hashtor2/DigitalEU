import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-slate-950 py-10 text-xs text-slate-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">

          {/* Brand */}
          <div className="space-y-2 max-w-xs">
            <p className="text-sm font-bold text-white">
              DigitalEU<span className="text-sky-400">.me</span>
            </p>
            <p className="leading-relaxed">
              Helping Europeans reclaim their digital lives. Privacy-first, built in Europe, open by design.
            </p>
            <p className="text-slate-600">🇪🇺 Data hosted in Switzerland (Zürich)</p>
          </div>

          {/* Nav links */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-2 sm:gap-x-16">
            <div className="space-y-2">
              <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Product</p>
              <Link to="/" className="block hover:text-white transition">Privacy Check</Link>
              <Link to="/dashboard" className="block hover:text-white transition">Dashboard</Link>
              <Link to="/directory" className="block hover:text-white transition">EU Alternatives</Link>
              <Link to="/guides" className="block hover:text-white transition">Guides</Link>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Company</p>
              <Link to="/about" className="block hover:text-white transition">About & Manifesto</Link>
              <Link to="/news" className="block hover:text-white transition">EU Tech News</Link>
              <a href="mailto:info@digitaleu.me" className="block hover:text-white transition">
                info@digitaleu.me
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} DigitalEU.me — All rights reserved.</p>
          <p>
            Some links are affiliate links and support our independent journalism.{" "}
            <Link to="/about" className="underline hover:text-white transition">Learn more.</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
