import { useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SERVICES, ALTERNATIVES, type ServiceInfo, type ThreatLevel } from "@digitaleu/shared";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { COUNTRY_FLAGS } from "@/lib/flags";

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
  const altLogoUrl = alt ? `https://www.google.com/s2/favicons?domain=${new URL(alt.url).hostname}&sz=64` : "";

  return (
    <tr className={`border-b border-[#2d4a6e] transition-colors hover:bg-[#0f2040]/50 ${migrated ? "opacity-50" : ""}`}>
      <td className="py-4 pl-4 pr-2 text-xs text-slate-400 font-mono w-8">{index + 1}</td>
      <td className="py-4 pr-4">
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
            <span className="hidden h-full w-full items-center justify-center text-xs font-bold text-slate-600" aria-hidden>
              {service.name.charAt(0)}
            </span>
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-white text-sm leading-tight">{service.name}</p>
              {COUNTRY_FLAGS[service.ownerCountry] && (
                <span title={service.ownerCountry} className="text-sm" aria-hidden>{COUNTRY_FLAGS[service.ownerCountry]}</span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">{service.domain}</p>
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
              className="inline-flex items-center gap-1 rounded-lg border border-red-500/50 bg-red-500/20 px-3 py-1.5 text-[11px] font-semibold text-red-300 transition hover:bg-red-500/30 hover:border-red-500/70"
              title="Delete your account"
            >
              🗑️ Delete
            </a>
          )}
          {service.changeEmailUrl && (
            <a
              href={service.changeEmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-amber-500/50 bg-amber-500/20 px-3 py-1.5 text-[11px] font-semibold text-amber-300 transition hover:bg-amber-500/30 hover:border-amber-500/70"
              title="Change email address"
            >
              ✉️ Change Email
            </a>
          )}
          {!service.deleteUrl && !service.changeEmailUrl && (
            <span className="text-[10px] text-slate-500 italic">No direct links</span>
          )}
        </div>
      </td>
      <td className="py-4 pr-4">
        {alt ? (
          <a
            href={service.affiliateUrl ?? alt.affiliateUrl ?? alt.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 transition hover:border-emerald-500/60 hover:bg-emerald-500/20"
            title={`Switch to ${alt.name} (${alt.country})`}
          >
            {altLogoUrl && (
              <img
                src={altLogoUrl}
                alt=""
                className="h-4 w-4 rounded flex-shrink-0"
                onError={(e) => (e.currentTarget as HTMLImageElement).style.display = "none"}
              />
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-emerald-300 group-hover:text-emerald-200 leading-tight truncate">{alt.name}</p>
              <p className="text-[9px] text-slate-500">{alt.country}</p>
            </div>
            {(service.affiliateUrl ?? alt.affiliateUrl) && (
              <span className="ml-auto rounded bg-emerald-500/30 px-1.5 py-0.5 text-[8px] font-bold text-emerald-300 uppercase flex-shrink-0">Deal</span>
            )}
          </a>
        ) : (
          <span className="text-xs text-slate-500 italic">—</span>
        )}
      </td>
      <td className="py-4 pr-4">
        <button
          onClick={onToggle}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition active:scale-95 ${
            migrated
              ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/20"
              : "border-[#2d4a6e] bg-[#1e293b] text-slate-400 hover:border-[#2a3d5f] hover:text-white"
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
  const progressPct = sorted.length > 0 ? Math.round((migratedCount / sorted.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100">
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
              <div key={level} className="rounded-lg border border-[#2d4a6e] bg-[#1e293b] p-4 text-center">
                <p className={`text-2xl font-bold ${colors[level]}`}>{count}</p>
                <p className="mt-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">{level} Threat</p>
              </div>
            );
          })}
          <div className="rounded-lg border border-[#2d4a6e] bg-[#1e293b] p-4 text-center">
            <p className="text-2xl font-bold text-[#93c5fd]">{sorted.length}</p>
            <p className="mt-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">Total Services</p>
          </div>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 text-center col-span-2 sm:col-span-1">
            <p className="text-2xl font-bold text-emerald-400">{migratedCount}/{sorted.length}</p>
            <p className="mt-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">Migrated</p>
          </div>
        </div>

        {/* Migration progress bar */}
        {sorted.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Migration progress</span>
              <span className="font-semibold text-emerald-400">{progressPct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#2d4a6e] overflow-hidden">
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

        {/* Table or empty state */}
        {sorted.length === 0 ? (
          <div className="rounded-lg border border-[#2d4a6e] bg-[#1e293b] py-20 text-center">
            <p className="text-slate-400">No services selected.</p>
            <Button className="mt-4 bg-[#1a56db] hover:bg-[#2563eb] rounded-md" onClick={() => navigate("/")}>Select services</Button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[#2d4a6e]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2d4a6e] bg-[#1e293b] text-left">
                  <th className="py-3 pl-4 pr-2 text-xs font-semibold text-slate-400 w-8">#</th>
                  <th className="py-3 pr-4 text-xs font-semibold text-slate-400">Service</th>
                  <th className="py-3 pr-4 text-xs font-semibold text-slate-400">Threat</th>
                  <th className="py-3 pr-4 text-xs font-semibold text-slate-400">Protection</th>
                  <th className="py-3 pr-4 text-xs font-semibold text-slate-400">Known Issues</th>
                  <th className="py-3 pr-4 text-xs font-semibold text-slate-400">Actions</th>
                  <th className="py-3 pr-4 text-xs font-semibold text-slate-400">EU Alternative</th>
                  <th className="py-3 pr-4 text-xs font-semibold text-slate-400">Status</th>
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

        <p className="text-center text-xs text-slate-500">
          Scores based on public breach data, GDPR enforcement actions, and ownership analysis. Updated regularly by the Digital Europe team.
        </p>
      </main>
      <Footer />
    </div>
  );
}

export default DashboardPage;
