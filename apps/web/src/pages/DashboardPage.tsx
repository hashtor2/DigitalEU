import { useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SERVICES, ALTERNATIVES, type ServiceInfo, type ThreatLevel } from "@digitaleu/shared";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { COUNTRY_FLAGS } from "@/lib/flags";

// --- Badges ---

const THREAT_BADGE: Record<ThreatLevel, { label: string; className: string; dot: string }> = {
  HIGH:   { label: "HIGH",   className: "bg-red-500/15 text-red-400 border-red-500/20",       dot: "bg-red-400" },
  MEDIUM: { label: "MEDIUM", className: "bg-amber-500/15 text-amber-400 border-amber-500/20", dot: "bg-amber-400" },
  LOW:    { label: "LOW",    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400" },
};

const DATA_PROTECTION_BADGE: Record<ThreatLevel, { label: string; className: string }> = {
  LOW:    { label: "LOW",    className: "bg-red-500/15 text-red-400 border-red-500/20" },
  MEDIUM: { label: "MEDIUM", className: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  HIGH:   { label: "HIGH",   className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
};

function ScoreBadge({ level, type }: { level: ThreatLevel; type: "threat" | "data" }) {
  const badge = type === "threat" ? THREAT_BADGE[level] : DATA_PROTECTION_BADGE[level];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${badge.className}`}>
      {type === "threat" && <span className={`h-1.5 w-1.5 rounded-full ${THREAT_BADGE[level].dot}`} aria-hidden />}
      {badge.label}
    </span>
  );
}

// --- Migration tracker ---

type MigrationStatus = Record<string, "pending" | "migrated">;

function useMigrationStatus(serviceIds: string[]) {
  const [status, setStatus] = useState<MigrationStatus>(() => {
    try {
      const raw = localStorage.getItem("digitaleu_migration");
      return raw ? (JSON.parse(raw) as MigrationStatus) : {};
    } catch {
      return {};
    }
  });

  const toggle = useCallback((id: string) => {
    setStatus((prev) => {
      const next: MigrationStatus = { ...prev, [id]: prev[id] === "migrated" ? "pending" : "migrated" };
      localStorage.setItem("digitaleu_migration", JSON.stringify(next));
      return next;
    });
  }, []);

  const migratedCount = serviceIds.filter((id) => status[id] === "migrated").length;
  return { status, toggle, migratedCount };
}

// --- Proton affiliate banner ---

const PROTON_AFFILIATE = "https://go.getproton.me/SH1mR";

function ProtonBanner({ hasEmail, hasCloud }: { hasEmail: boolean; hasCloud: boolean }) {
  if (!hasEmail && !hasCloud) return null;
  return (
    <div className="relative overflow-hidden rounded-lg border border-[#1a2d4f] bg-[#0d1b33] p-6 sm:p-8">
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#f0c040]">
            🇨🇭 Recommended upgrade
          </p>
          <h3 className="text-lg font-bold text-white leading-snug">
            Your data deserves Swiss-grade protection.
          </h3>
          <p className="max-w-lg text-xs text-slate-400 leading-relaxed">
            Proton is built in Switzerland under the world's strictest privacy laws. Zero-knowledge encryption means{" "}
            <strong className="text-white">nobody — not even Proton — can read your data.</strong>{" "}
            Used by 100M+ journalists, activists, and privacy-conscious people worldwide.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          {hasEmail && (
            <a
              href={PROTON_AFFILIATE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-[#1a56db] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2563eb]"
            >
              Get Proton Mail free →
            </a>
          )}
          {hasCloud && (
            <a
              href={PROTON_AFFILIATE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-[#1a56db]/40 bg-[#1a56db]/10 px-5 py-2.5 text-sm font-semibold text-[#93c5fd] transition hover:bg-[#1a56db]/20"
            >
              Get Proton Drive free →
            </a>
          )}
          <p className="text-[10px] text-slate-600">Affiliate link — supports DigitalEU.me 🇪🇺</p>
        </div>
      </div>
    </div>
  );
}

// --- Service row ---

function ServiceRow({
  service,
  index,
  migrated,
  onToggle,
}: {
  service: ServiceInfo;
  index: number;
  migrated: boolean;
  onToggle: () => void;
}) {
  const alt = service.euAlternativeId ? ALTERNATIVES.find((a) => a.id === service.euAlternativeId) : null;
  const logoUrl = `https://www.google.com/s2/favicons?domain=${service.domain}&sz=64`;
  const fallbackUrl = `https://${service.domain}/favicon.ico`;

  return (
    <tr className={`border-b border-[#1a2d4f] transition-colors hover:bg-[#0f2040]/50 ${migrated ? "opacity-50" : ""}`}>
      <td className="py-4 pl-4 pr-2 text-xs text-slate-500 font-mono w-8">{index + 1}</td>
      <td className="py-4 pr-4 min-w-[160px]">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
            <img
              src={logoUrl}
              alt=""
              className="h-7 w-7 object-contain"
              onError={(e) => {
                const t = e.currentTarget as HTMLImageElement;
                if (t.src !== fallbackUrl) { t.src = fallbackUrl; return; }
                t.style.display = "none";
                const sib = t.nextElementSibling as HTMLElement | null;
                if (sib) sib.style.display = "flex";
              }}
            />
            <span className="hidden h-full w-full items-center justify-center text-xs font-bold text-slate-700" aria-hidden>
              {service.name.charAt(0)}
            </span>
          </span>
          <div>
            <p className="font-semibold text-white text-sm leading-tight">{service.name}</p>
            <p className="text-[11px] text-slate-500">
            {service.domain}
            {" "}<span title={service.ownerCountry}>{COUNTRY_FLAGS[service.ownerCountry] ?? ""}</span>
          </p>
          </div>
        </div>
      </td>
      <td className="py-4 pr-4"><ScoreBadge level={service.threatScore} type="threat" /></td>
      <td className="py-4 pr-4"><ScoreBadge level={service.dataProtection} type="data" /></td>
      <td className="py-4 pr-4 max-w-[220px]">
        <p className="text-xs text-slate-400 leading-snug line-clamp-2">{service.breachSummary}</p>
      </td>
      <td className="py-4 pr-4">
        <div className="flex flex-wrap gap-1.5">
          {service.deleteUrl && (
            <a
              href={service.deleteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-400 transition hover:bg-red-500/20"
            >
              Delete
            </a>
          )}
          {service.changeEmailUrl && (
            <a
              href={service.changeEmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-400 transition hover:bg-amber-500/20"
            >
              Change Email
            </a>
          )}
        </div>
      </td>
      <td className="py-4 pr-4 min-w-[150px]">
        {alt ? (
          <a
            href={service.affiliateUrl ?? alt.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-lg border border-[#1a56db]/20 bg-[#1a56db]/5 px-3 py-2 transition hover:border-[#1a56db]/40 hover:bg-[#1a56db]/10"
          >
            <span className="text-base" aria-hidden>🇪🇺</span>
            <div>
              <p className="text-xs font-bold text-[#93c5fd] group-hover:text-[#bfdbfe] leading-tight">{alt.name}</p>
              <p className="text-[10px] text-slate-500">{alt.country}</p>
            </div>
            {service.affiliateUrl && (
              <span className="ml-auto rounded bg-[#1a56db]/20 px-1 py-0.5 text-[9px] font-bold text-[#93c5fd] uppercase">Deal</span>
            )}
          </a>
        ) : (
          <span className="text-xs text-slate-600">—</span>
        )}
      </td>
      <td className="py-4 pr-4">
        <button
          onClick={onToggle}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition active:scale-95 ${
            migrated
              ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/10"
              : "border-[#1a2d4f] bg-[#0d1b33] text-slate-400 hover:border-[#2a3d5f] hover:text-white"
          }`}
        >
          {migrated ? "✓ Migrated" : "Mark done"}
        </button>
      </td>
    </tr>
  );
}

const THREAT_ORDER: ThreatLevel[] = ["HIGH", "MEDIUM", "LOW"];

export function DashboardPage() {
  const navigate = useNavigate();

  const selectedIds = useMemo<string[]>(() => {
    try {
      const raw = sessionStorage.getItem("digitaleu_selected");
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  }, []);

  const services = useMemo(() => {
    if (selectedIds.length === 0) return SERVICES;
    return SERVICES.filter((s) => selectedIds.includes(s.id));
  }, [selectedIds]);

  const sorted = useMemo(
    () => [...services].sort((a, b) => THREAT_ORDER.indexOf(a.threatScore) - THREAT_ORDER.indexOf(b.threatScore)),
    [services],
  );

  const serviceIds = useMemo(() => sorted.map((s) => s.id), [sorted]);
  const { status, toggle, migratedCount } = useMigrationStatus(serviceIds);

  const highCount = sorted.filter((s) => s.threatScore === "HIGH").length;
  const hasEmail = sorted.some((s) => s.category === "email");
  const hasCloud = sorted.some((s) => s.category === "cloud");
  const progressPct = sorted.length > 0 ? Math.round((migratedCount / sorted.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0a1628] text-slate-100">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 space-y-8">

        {/* Header row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#f0c040]">
              Your Privacy Report
            </p>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">These are your accounts</h1>
            {highCount > 0 && (
              <p className="mt-1 text-sm text-red-400">
                ⚠️ {highCount} service{highCount !== 1 ? "s" : ""} with HIGH threat score
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">← Change selection</Link>
            </Button>
            <Button size="sm" className="bg-[#1a56db] text-white hover:bg-[#2563eb] font-medium rounded-md" asChild>
              <Link to="/directory">Browse EU Alternatives</Link>
            </Button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {(["HIGH", "MEDIUM", "LOW"] as ThreatLevel[]).map((level) => {
            const count = sorted.filter((s) => s.threatScore === level).length;
            const colors = { HIGH: "text-red-400", MEDIUM: "text-amber-400", LOW: "text-emerald-400" };
            return (
              <div key={level} className="rounded-lg border border-[#1a2d4f] bg-[#0d1b33] p-4 text-center">
                <p className={`text-2xl font-bold ${colors[level]}`}>{count}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500 uppercase tracking-wide">{level} Threat</p>
              </div>
            );
          })}
          <div className="rounded-lg border border-[#1a2d4f] bg-[#0d1b33] p-4 text-center">
            <p className="text-2xl font-bold text-[#93c5fd]">{sorted.length}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Services</p>
          </div>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 text-center col-span-2 sm:col-span-1">
            <p className="text-2xl font-bold text-emerald-400">{migratedCount}/{sorted.length}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500 uppercase tracking-wide">Migrated</p>
          </div>
        </div>

        {/* Migration progress bar */}
        {sorted.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Migration progress</span>
              <span className="font-semibold text-emerald-400">{progressPct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#1a2d4f] overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            {progressPct === 100 && (
              <p className="text-xs text-emerald-400 font-semibold">🎉 Migration complete! You're Big-Tech free.</p>
            )}
          </div>
        )}

        {/* Proton affiliate banner */}
        <ProtonBanner hasEmail={hasEmail} hasCloud={hasCloud} />

        {/* Table or empty state */}
        {sorted.length === 0 ? (
          <div className="rounded-lg border border-[#1a2d4f] bg-[#0d1b33] py-20 text-center">
            <p className="text-slate-400">No services selected.</p>
            <Button className="mt-4 bg-[#1a56db] hover:bg-[#2563eb] rounded-md" onClick={() => navigate("/")}>Select services</Button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[#1a2d4f]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a2d4f] bg-[#0d1b33] text-left">
                  <th className="py-3 pl-4 pr-2 text-xs font-semibold text-slate-500 w-8">#</th>
                  <th className="py-3 pr-4 text-xs font-semibold text-slate-500">Service</th>
                  <th className="py-3 pr-4 text-xs font-semibold text-slate-500">Threat Score</th>
                  <th className="py-3 pr-4 text-xs font-semibold text-slate-500">Data Protection</th>
                  <th className="py-3 pr-4 text-xs font-semibold text-slate-500">Known Issues</th>
                  <th className="py-3 pr-4 text-xs font-semibold text-slate-500">Actions</th>
                  <th className="py-3 pr-4 text-xs font-semibold text-slate-500">EU Alternative</th>
                  <th className="py-3 pr-4 text-xs font-semibold text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((service, i) => (
                  <ServiceRow
                    key={service.id}
                    service={service}
                    index={i}
                    migrated={status[service.id] === "migrated"}
                    onToggle={() => toggle(service.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-center text-xs text-slate-600">
          Scores are based on publicly documented data breaches, GDPR enforcement actions, and ownership analysis. Updated regularly by the Digital Europe team.
        </p>
      </main>
      <Footer />
    </div>
  );
}

export default DashboardPage;
