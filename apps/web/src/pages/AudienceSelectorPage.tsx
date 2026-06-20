import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EuStarRing } from "@/components/Logo";

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
    <div className="min-h-screen bg-[#0a1628] text-slate-100 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-14 flex flex-col items-center gap-3">
        <EuStarRing size={52} />
        <span className="text-lg font-semibold text-white tracking-wide">
          DigitalEU<span className="text-[#f0c040]">.me</span>
        </span>
      </div>

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Who are you here for?
        </h1>
        <p className="mt-3 text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
          We'll show you the most relevant European alternatives and tools for your situation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 w-full max-w-lg">
        {/* Private */}
        <button
          onClick={() => choose("b2c")}
          className="group flex flex-col items-start gap-5 rounded-lg border border-[#1a2d4f] bg-[#0d1b33] p-6 text-left transition-all hover:border-[#1a56db]/50 hover:bg-[#0f2040]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a56db]/10 border border-[#1a56db]/20">
            <svg
              className="h-5 w-5 text-[#5b8ff9]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </div>
          <div>
            <p className="text-base font-semibold text-white">Private Person</p>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Protect your personal data. Find European alternatives to Gmail, Google Drive,
              WhatsApp, and more.
            </p>
          </div>
          <span className="mt-auto text-xs font-medium text-[#5b8ff9] group-hover:text-white transition-colors">
            Get started free →
          </span>
        </button>

        {/* Business */}
        <button
          onClick={() => choose("b2b")}
          className="group flex flex-col items-start gap-5 rounded-lg border border-[#1a2d4f] bg-[#0d1b33] p-6 text-left transition-all hover:border-[#f0c040]/30 hover:bg-[#121b2e]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0c040]/10 border border-[#f0c040]/20">
            <svg
              className="h-5 w-5 text-[#f0c040]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
              />
            </svg>
          </div>
          <div>
            <p className="text-base font-semibold text-white">Business</p>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Reduce US cloud dependency, achieve GDPR compliance, and build on sovereign
              European infrastructure.
            </p>
          </div>
          <span className="mt-auto text-xs font-medium text-[#f0c040]/70 group-hover:text-[#f0c040] transition-colors">
            See migration services →
          </span>
        </button>
      </div>

      <p className="mt-10 text-xs text-slate-600">
        We remember your choice — switch anytime from the menu.
      </p>
    </div>
  );
}
