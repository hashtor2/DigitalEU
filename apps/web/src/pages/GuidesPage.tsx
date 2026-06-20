import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface Guide {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Advanced";
  hasContent: boolean;
}

const GUIDES: Guide[] = [
  {
    id: "best-european-email",
    title: "Best European Email Providers in 2026",
    description: "Compare Proton Mail, Tuta, Mailbox.org, and Posteo. End-to-end encrypted, GDPR-compliant alternatives to Gmail — with a free tier comparison.",
    category: "email",
    difficulty: "Easy",
    hasContent: true,
  },
  {
    id: "best-european-vpn",
    title: "Best European VPN Services in 2026",
    description: "Compare Proton VPN, Mullvad, IVPN, and AzireVPN. No-logs, independently audited VPNs based in Switzerland and Sweden.",
    category: "vpn",
    difficulty: "Easy",
    hasContent: true,
  },
  {
    id: "best-european-cloud-storage",
    title: "Best European Cloud Storage in 2026",
    description: "Compare Proton Drive, pCloud, Tresorit, and Nextcloud. Zero-knowledge encrypted alternatives to Google Drive and Dropbox.",
    category: "cloud",
    difficulty: "Easy",
    hasContent: true,
  },
  {
    id: "degoogle-checklist",
    title: "The Step-by-Step 'De-Googling' Master Checklist",
    description: "A methodical, stress-free sequence to migrate your calendar, photos, files, and email away from Google Workspace into fully private Swiss-hosted alternatives.",
    category: "privacy",
    difficulty: "Medium",
    hasContent: false,
  },
  {
    id: "browser-wars",
    title: "Uncensored Web: Browser Privacy and Security Compared",
    description: "We audit Google Chrome, Brave, Mullvad Browser, Safari, and LibreWolf. Which browsers prevent fingerprinting and represent safe European choices?",
    category: "browser",
    difficulty: "Easy",
    hasContent: false,
  },
  {
    id: "password-manager-migration",
    title: "Dump LastPass: How to Safely Migrate to Proton Pass",
    description: "Following LastPass's security breaches, learn how to export your encrypted vault and import it into a Swiss-hosted, zero-knowledge password manager.",
    category: "password",
    difficulty: "Easy",
    hasContent: false,
  },
];

const DIFFICULTY_STYLE: Record<string, string> = {
  Easy: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  Medium: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  Advanced: "bg-red-500/10 text-red-300 border-red-500/20",
};

export function GuidesPage() {
  return (
    <div className="min-h-screen bg-[#111827] text-slate-100 flex flex-col">
      <title>Privacy & Migration Guides — European Alternatives | digitaleu.me</title>
      <meta name="description" content="Step-by-step guides for switching from Big Tech to privacy-friendly European alternatives. Email, VPN, cloud storage, browsers, and more." />
      <Header />

      <main className="flex-1 mx-auto max-w-4xl w-full px-6 py-10">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-white mb-2">Privacy & Migration Guides</h1>
          <p className="text-sm text-slate-500 max-w-xl">
            Objective comparisons and step-by-step guides for switching from Big Tech to European alternatives.
          </p>
        </div>

        <div className="grid gap-4">
          {GUIDES.map((guide) => (
            <div
              key={guide.id}
              className="group flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center rounded border border-white/[0.07] bg-white/[0.01] p-5 hover:border-white/[0.12] hover:bg-white/[0.025] transition"
            >
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 border border-white/[0.06] rounded px-2 py-0.5">
                    {guide.category}
                  </span>
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${DIFFICULTY_STYLE[guide.difficulty]}`}>
                    {guide.difficulty}
                  </span>
                  {!guide.hasContent && (
                    <span className="text-[9px] text-slate-700 font-mono">coming soon</span>
                  )}
                </div>
                <h2 className="text-[14px] font-semibold text-white group-hover:text-slate-100 leading-snug mb-1">
                  {guide.title}
                </h2>
                <p className="text-[12px] text-slate-500 leading-relaxed">{guide.description}</p>
              </div>
              {guide.hasContent ? (
                <Link
                  to={`/guides/${guide.id}`}
                  className="flex-shrink-0 inline-flex items-center gap-1.5 rounded border border-[#f0c040]/20 bg-[#f0c040]/5 px-4 py-2 text-[12px] font-semibold text-[#f0c040]/80 hover:text-[#f0c040] hover:border-[#f0c040]/40 transition"
                >
                  Read guide →
                </Link>
              ) : (
                <span className="flex-shrink-0 inline-flex items-center rounded border border-white/[0.05] px-4 py-2 text-[12px] text-slate-700">
                  Coming soon
                </span>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
