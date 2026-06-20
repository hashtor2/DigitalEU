import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#1a2d4f] bg-[#080e1c] py-10 text-xs text-slate-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">

          {/* Brand */}
          <div className="space-y-2 max-w-xs">
            <p className="text-sm font-semibold text-white">
              DigitalEU<span className="text-[#f0c040]">.me</span>
            </p>
            <p className="leading-relaxed text-slate-400">
              Helping Europeans reclaim their digital lives. Privacy-first, built in Europe, open by design.
            </p>
            <p className="text-slate-600">🇪🇺 Data hosted in Switzerland (Zürich)</p>
            <a
              href="https://mastodon.social/@digitaleu"
              target="_blank"
              rel="noopener noreferrer me"
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-200 transition"
              aria-label="Follow us on Mastodon"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M21.327 7.824c0-3.848-2.521-4.977-2.521-4.977C17.427 2.163 14.763 2 12 2h-.028C9.209 2 6.547 2.163 5.196 2.847c0 0-2.523 1.129-2.523 4.977-.024.819-.048 1.958-.024 3.172.06 3.34.529 6.63 3.199 7.56 1.202.416 2.019.502 2.708.429 1.256-.134 1.956-.847 1.956-.847l-.043-1.149s-.868.3-1.926.263c-1.047-.035-2.149-.112-2.328-1.418a3.6 3.6 0 0 1-.032-.441s1.007.248 2.368.376c.833.078 1.652.091 2.498.091s1.921 0 3.842-.091c1.361-.128 2.368-.376 2.368-.376a3.6 3.6 0 0 1-.032.441c-.179 1.306-1.281 1.383-2.328 1.418-1.058.037-1.926-.263-1.926-.263l-.043 1.149s.7.713 1.956.847c.689.073 1.506-.013 2.708-.429 2.67-.93 3.139-4.22 3.199-7.56.024-1.214 0-2.353 0-3.172zM16.808 13.4h-1.947V8.609c0-1.058-.443-1.6-1.368-1.6-1.022 0-1.533.654-1.533 1.947v2.683h-1.935V8.956c0-1.293-.511-1.947-1.532-1.947-.925 0-1.368.542-1.368 1.6V13.4H5.191V8.477c0-1.056.274-1.898.824-2.521.567-.623 1.314-.946 2.247-.946 1.084 0 1.891.41 2.421 1.23l.329.559.329-.559c.53-.82 1.337-1.23 2.421-1.23.933 0 1.68.323 2.248.946.549.623.823 1.465.823 2.521L16.808 13.4z" />
              </svg>
              @digitaleu@mastodon.social
            </a>
          </div>

          {/* Nav links */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-2 sm:gap-x-16">
            <div className="space-y-2">
              <p className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Product</p>
              <Link to="/" className="block hover:text-slate-200 transition">Privacy Check</Link>
              <Link to="/dashboard" className="block hover:text-slate-200 transition">Dashboard</Link>
              <Link to="/directory" className="block hover:text-slate-200 transition">EU Alternatives</Link>
              <Link to="/guides" className="block hover:text-slate-200 transition">Guides</Link>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Company</p>
              <Link to="/about" className="block hover:text-slate-200 transition">About & Manifesto</Link>
              <Link to="/news" className="block hover:text-slate-200 transition">EU Tech News</Link>
              <a href="mailto:info@digitaleu.me" className="block hover:text-slate-200 transition">
                info@digitaleu.me
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-[#1a2d4f] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} DigitalEU.me — All rights reserved.</p>
          <p>
            Some links are affiliate links and support our independent journalism.{" "}
            <Link to="/about" className="underline hover:text-slate-200 transition">Learn more.</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
