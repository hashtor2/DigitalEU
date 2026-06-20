import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface Guide {
  id: string;
  title: string;
  description: string;
  category: "email" | "browser" | "privacy" | "password";
  difficulty: "Easy" | "Medium" | "Advanced";
}

const GUIDES: Guide[] = [
  {
    id: "degoogle-checklist",
    title: "The Step-by-Step 'De-Googling' Master Checklist",
    description: "A methodical, stress-free sequence to migrate your calendar, photos, files, and email folders away from Google Workspace into fully private Swiss-hosted nodes without losing access to accounts.",
    category: "privacy",
    difficulty: "Medium",
  },
  {
    id: "browser-wars",
    title: "Uncensored Web: Browser Privacy and Security Compared",
    description: "We audit Google Chrome, Brave, Mullvad Browser, Safari, and LibreWolf. Learn which browsers actively prevent hardware fingerprinting, isolate cookies, and represent safe European choices.",
    category: "browser",
    difficulty: "Easy",
  },
  {
    id: "password-manager-migration",
    title: "Dump LastPass: How to Safely Port Credentials to Proton Pass",
    description: "Following LastPass's security breaches, we guide you on exporting your encrypted vault as a secure CSV, converting hash sets, importing into Swiss nodes, and purging old server logs.",
    category: "password",
    difficulty: "Easy",
  },
  {
    id: "email-forwarding-maze",
    title: "Mastering Email Forwarding: The Secret to Wiping Your Gmail Account",
    description: "How to set up wildcards, aliases, and automated catch-alls during your transition year. We show you how to safely forward incoming mail so you can test if you can finally hit delete.",
    category: "email",
    difficulty: "Advanced",
  },
];

const DIFFICULTY_STYLE: Record<string, string> = {
  Easy: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  Medium: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  Advanced: "bg-red-500/10 text-red-300 border-red-500/20",
};

export function GuidesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-4xl w-full px-6 py-10">
        <div className="border-b border-white/5 pb-6 mb-10 text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/5 px-3.5 py-1 text-xs font-semibold text-sky-400 mb-3">
            📖 Deep-Dive Education
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Migration & Privacy Guides
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-xl leading-relaxed">
            Detailed, objective tutorials designed to take the technical friction out of privacy. Learn how to export, clean, secure, and safely delete your Big Tech footprints.
          </p>
        </div>

        <div className="grid gap-6">
          {GUIDES.map((guide) => (
            <div
              key={guide.id}
              className="group flex flex-col md:flex-row gap-4 justify-between items-start md:items-center rounded-2xl border border-white/10 bg-slate-900/30 p-6 hover:border-white/15 hover:bg-slate-900/50 transition duration-200"
            >
              <div className="space-y-2 flex-1 pr-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-400 bg-sky-500/5 px-2 py-0.5 rounded border border-sky-500/10">
                    {guide.category}
                  </span>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.2 rounded border ${
                      DIFFICULTY_STYLE[guide.difficulty]
                    }`}
                  >
                    {guide.difficulty}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition leading-snug">
                  {guide.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {guide.description}
                </p>
              </div>
              <button
                onClick={() => alert("This comprehensive guide will deploy in Phase 2!")}
                className="w-full md:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold px-4 py-2.5 rounded-xl whitespace-nowrap transition"
              >
                Read Guide →
              </button>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
