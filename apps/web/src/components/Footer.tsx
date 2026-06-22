import { Link } from "react-router-dom";
import { NewsletterSignup } from "./NewsletterSignup";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#2d4a6e] bg-[#080e1c] py-10 text-xs text-slate-400">
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
            <p className="text-slate-500">🇪🇺 Data hosted in Switzerland (Zürich)</p>
            <div className="flex flex-col gap-3">
              <a
                href="https://digitaleu.me"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition"
                aria-label="Visit DigitalEU.me"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                  <path d="M19.54 5.23l-1.39-1.39c-.78-.78-2.05-.78-2.84 0l-1.83 1.83.76.76c.39.39.39 1.02 0 1.41-.39.39-1.02.39-1.41 0l-.76-.76-2.69 2.69.76.76c.39.39.39 1.02 0 1.41-.39.39-1.02.39-1.41 0l-.76-.76-1.83 1.83c-.78.78-.78 2.05 0 2.84l1.39 1.39c.78.78 2.05.78 2.84 0l1.83-1.83-.76-.76c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l.76.76 2.69-2.69-.76-.76c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l.76.76 1.83-1.83c.78-.78.78-2.05 0-2.84z" />
                </svg>
                digitaleu.me
              </a>
              <a
                href="mailto:info@digitaleu.me"
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition"
                aria-label="Email us"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                info@digitaleu.me
              </a>
              <a
                href="https://x.com/digitaleume"
                target="_blank"
                rel="noopener noreferrer me"
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition"
                aria-label="Follow us on X"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.207-6.807-5.974 6.807H2.882l7.432-8.489L1.766 2.25h6.837l4.716 6.231 5.43-6.231zM17.009 18.875h1.829L6.875 3.541H4.956l12.053 15.334z" />
                </svg>
                @digitaleume
              </a>
              <a
                href="https://www.reddit.com/user/DigitalEUme/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition"
                aria-label="Follow us on Reddit"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-3 8a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm6-2c1.657 0 3 1.343 3 3 0 1.4-1.028 2.578-2.365 2.922.13.866.130 1.538.130 2.078 0 2.289-1.953 4.5-4.765 4.5-2.812 0-4.765-2.211-4.765-4.5 0-.54 0-1.212.13-2.078C6.028 11.578 5 10.4 5 9c0-1.657 1.343-3 3-3h6z" />
                </svg>
                u/DigitalEUme
              </a>
              <a
                href="https://substack.com/@digitaleurope"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition"
                aria-label="Subscribe on Substack"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                  <path d="M22.539 8.242H1.46V4h21.079v4.242zM1.46 10.042V21h21.079v-10.958H1.46zM4.017 13.524h3.073v4.303H4.017z" />
                </svg>
                @digitaleurope
              </a>
              <a
                href="https://bsky.app/profile/digitaleu.me"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition"
                aria-label="Follow us on Bluesky"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.828 0 1.5-.672 1.5-1.5S16.328 8 15.5 8 14 8.672 14 9.5s.672 1.5 1.5 1.5zm-7 0c.828 0 1.5-.672 1.5-1.5S9.828 8 9 8 7.5 8.672 7.5 9.5 8.172 11 9 11z" />
                </svg>
                digitaleu.me
              </a>
              <a
                href="https://mastodon.social/@digitaleu"
                target="_blank"
                rel="noopener noreferrer me"
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition"
                aria-label="Follow us on Mastodon"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                  <path d="M21.327 7.824c0-3.848-2.521-4.977-2.521-4.977C17.427 2.163 14.763 2 12 2h-.028C9.209 2 6.547 2.163 5.196 2.847c0 0-2.523 1.129-2.523 4.977-.024.819-.048 1.958-.024 3.172.06 3.34.529 6.63 3.199 7.56 1.202.416 2.019.502 2.708.429 1.256-.134 1.956-.847 1.956-.847l-.043-1.149s-.868.3-1.926.263c-1.047-.035-2.149-.112-2.328-1.418a3.6 3.6 0 0 1-.032-.441s1.007.248 2.368.376c.833.078 1.652.091 2.498.091s1.921 0 3.842-.091c1.361-.128 2.368-.376 2.368-.376a3.6 3.6 0 0 1-.032.441c-.179 1.306-1.281 1.383-2.328 1.418-1.058.037-1.926-.263-1.926-.263l-.043 1.149s.7.713 1.956.847c.689.073 1.506-.013 2.708-.429 2.67-.93 3.139-4.22 3.199-7.56.024-1.214 0-2.353 0-3.172zM16.808 13.4h-1.947V8.609c0-1.058-.443-1.6-1.368-1.6-1.022 0-1.533.654-1.533 1.947v2.683h-1.935V8.956c0-1.293-.511-1.947-1.532-1.947-.925 0-1.368.542-1.368 1.6V13.4H5.191V8.477c0-1.056.274-1.898.824-2.521.567-.623 1.314-.946 2.247-.946 1.084 0 1.891.41 2.421 1.23l.329.559.329-.559c.53-.82 1.337-1.23 2.421-1.23.933 0 1.68.323 2.248.946.549.623.823 1.465.823 2.521L16.808 13.4z" />
                </svg>
                @digitaleu@mastodon.social
              </a>
            </div>
          </div>

          {/* Nav links */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-2 sm:gap-x-16">
            <div className="space-y-2">
              <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Product</p>
              <Link to="/" className="block hover:text-slate-200 transition">Privacy Check</Link>
              <Link to="/emailscanner" className="block hover:text-slate-200 transition">Email Scanner</Link>
              <Link to="/dashboard" className="block hover:text-slate-200 transition">Dashboard</Link>
              <Link to="/directory" className="block hover:text-slate-200 transition">EU Alternatives</Link>
              <Link to="/guides" className="block hover:text-slate-200 transition">Guides</Link>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Company</p>
              <Link to="/about" className="block hover:text-slate-200 transition">About & Manifesto</Link>
              <Link to="/news" className="block hover:text-slate-200 transition">EU Tech News</Link>
            </div>
          </div>

          {/* Newsletter signup */}
          <div className="max-w-xs">
            <NewsletterSignup showName={false} compact={true} />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-[#2d4a6e] pt-6 sm:flex-row sm:items-center sm:justify-between">
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
