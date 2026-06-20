import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "digitaleu_market";

export function getStoredMarket(): "b2b" | "b2c" | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "b2b" || v === "b2c") return v;
  } catch {}
  return null;
}

export function storeMarket(market: "b2b" | "b2c") {
  try {
    localStorage.setItem(STORAGE_KEY, market);
  } catch {}
}

export function AudienceSelectorPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const stored = getStoredMarket();
    if (stored) navigate(`/${stored}`, { replace: true });
  }, [navigate]);

  const choose = (market: "b2b" | "b2c") => {
    storeMarket(market);
    navigate(`/${market}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center px-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-[52rem] -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      {/* Logo */}
      <div className="mb-12 flex items-center gap-2">
        <span className="text-2xl" aria-hidden>🇪🇺</span>
        <span className="text-xl font-extrabold tracking-tight text-white">
          DigitalEU<span className="text-sky-400">.me</span>
        </span>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Who are you here for?
        </h1>
        <p className="mt-3 text-slate-400 max-w-sm mx-auto">
          We'll show you the most relevant European alternatives and tools for your situation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 w-full max-w-2xl">
        {/* Private */}
        <button
          onClick={() => choose("b2c")}
          className="group flex flex-col items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition-all hover:border-sky-400/50 hover:bg-sky-500/5 hover:shadow-lg hover:shadow-sky-500/5"
        >
          <span className="text-4xl">👤</span>
          <div>
            <p className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
              Private Person
            </p>
            <p className="mt-1 text-sm text-slate-400 leading-relaxed">
              Protect your personal data. Find European alternatives to Gmail, Google Drive, WhatsApp, and more.
            </p>
          </div>
          <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400">
            Get started free →
          </span>
        </button>

        {/* Business */}
        <button
          onClick={() => choose("b2b")}
          className="group flex flex-col items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition-all hover:border-emerald-400/50 hover:bg-emerald-500/5 hover:shadow-lg hover:shadow-emerald-500/5"
        >
          <span className="text-4xl">🏢</span>
          <div>
            <p className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
              Business
            </p>
            <p className="mt-1 text-sm text-slate-400 leading-relaxed">
              Reduce US cloud dependency, achieve GDPR compliance, and build on sovereign European infrastructure.
            </p>
          </div>
          <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            See migration services →
          </span>
        </button>
      </div>

      <p className="mt-8 text-xs text-slate-600">
        We remember your choice — you can switch anytime from the menu.
      </p>
    </div>
  );
}
