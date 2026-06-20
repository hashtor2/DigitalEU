import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SERVICES, ALTERNATIVES, type ServiceInfo, type ThreatLevel } from "@digitaleu/shared";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";

// --- Score badge ---

const THREAT_BADGE: Record<ThreatLevel, { label: string; className: string; dot: string }> = {
  HIGH: { label: "HIGH", className: "bg-red-500/15 text-red-400 border-red-500/20", dot: "bg-red-400" },
  MEDIUM: { label: "MEDIUM", className: "bg-amber-500/15 text-amber-400 border-amber-500/20", dot: "bg-amber-400" },
  LOW: { label: "LOW", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400" },
};

const DATA_PROTECTION_BADGE: Record<ThreatLevel, { label: string; className: string }> = {
  LOW: { label: "LOW", className: "bg-red-500/15 text-red-400 border-red-500/20" },
  MEDIUM: { label: "MEDIUM", className: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  HIGH: { label: "HIGH", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
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

function ServiceRow({ service, index }: { service: ServiceInfo; index: number }) {
  const alt = service.euAlternativeId ? ALTERNATIVES.find((a) => a.id === service.euAlternativeId) : null;
  const logoUrl = `https://logo.clearbit.com/${service.domain}`;

  return (
    <tr className="border-b border-white/5 transition-colors hover:bg-white/[0.03]">
      <td className="py-4 pl-4 pr-2 text-xs text-slate-500 font-mono w-8">{index + 1}</td>
      <td className="py-4 pr-4 min-w-[160px]">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
            <img src={logoUrl} alt="" className="h-7 w-7 object-contain"
              onError={(e) => {
                const t = e.currentTarget as HTMLImageElement;
                t.style.display = "none";
                const sib = t.nextElementSibling as HTMLElement | null;
                if (sib) sib.style.display = "flex";
              }} />
            <span className="hidden h-full w-full items-center justify-center text-xs font-bold text-slate-700" aria-hidden>{service.name.charAt(0)}</span>
          </span>
          <div>
            <p className="font-semibold text-white text-sm leading-tight">{service.name}</p>
            <p className="text-[11px] text-slate-500">{service.domain}</p>
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
            <a href={service.deleteUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-400 transition hover:bg-red-500/20 hover:border-red-400/50">
              Delete
            </a>
          )}
          {service.changeEmailUrl && (
            <a href={service.changeEmailUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-400 transition hover:bg-amber-500/20 hover:border-amber-400/50">
              Change Email
            </a>
          )}
        </div>
      </td>
      <td className="py-4 pr-4 min-w-[150px]">
        {alt ? (
          <a href={service.affiliateUrl ?? alt.url} target="_blank" rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-lg border border-sky-500/20 bg-sky-500/5 px-3 py-2 transition hover:border-sky-400/40 hover:bg-sky-500/10">
            <span className="text-base" aria-hidden>🇪🇺</span>
            <div>
              <p className="text-xs font-bold text-sky-300 group-hover:text-sky-200 leading-tight">{alt.name}</p>
              <p className="text-[10px] text-slate-500">{alt.country}</p>
            </div>
            {service.affiliateUrl && (
              <span className="ml-auto rounded bg-sky-500/20 px-1 py-0.5 text-[9px] font-bold text-sky-400 uppercase">Deal</span>
            )}
          </a>
        ) : (
          <span className="text-xs text-slate-600">—</span>
        )}
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
    [services]
  );

  const highCount = sorted.filter((s) => s.threatScore === "HIGH").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
      </div>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/5 px-3 py-1 text-xs font-semibold text-sky-400">
              🇪🇺 Your Privacy Report
            </span>
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl">These are your accounts</h1>
            {highCount > 0 && (
              <p className="mt-1 text-sm text-red-400">⚠️ {highCount} service{highCount !== 1 ? "s" : ""} with HIGH threat score</p>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" asChild><Link to="/select">← Change selection</Link></Button>
            <Button size="sm" className="bg-sky-500 text-white hover:bg-sky-400 font-semibold" asChild>
              <Link to="/directory">Browse EU Alternatives</Link>
            </Button>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(["HIGH", "MEDIUM", "LOW"] as ThreatLevel[]).map((level) => {
            const count = sorted.filter((s) => s.threatScore === level).length;
            const colors = { HIGH: "text-red-400", MEDIUM: "text-amber-400", LOW: "text-emerald-400" };
            return (
              <div key={level} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <p className={`text-2xl font-extrabold ${colors[level]}`}>{count}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500 uppercase tracking-wide">{level} Threat</p>
              </div>
            );
          })}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-2xl font-extrabold text-sky-400">{sorted.length}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Services</p>
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 py-20 text-center">
            <p className="text-slate-400">No services selected.</p>
            <Button className="mt-4" onClick={() => navigate("/select")}>Select services</Button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-left">
                  <th className="py-3 pl-4 pr-2 text-xs font-semibold text-slate-500 w-8">#</th>
                  <th className="py-3 pr-4 text-xs font-semibold text-slate-500">Service</th>
                  <th className="py-3 pr-4 text-xs font-semibold text-slate-500">Threat Score</th>
                  <th className="py-3 pr-4 text-xs font-semibold text-slate-500">Data Protection</th>
                  <th className="py-3 pr-4 text-xs font-semibold text-slate-500">Known Issues</th>
                  <th className="py-3 pr-4 text-xs font-semibold text-slate-500">Actions</th>
                  <th className="py-3 pr-4 text-xs font-semibold text-slate-500">EU Alternative</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((service, i) => (
                  <ServiceRow key={service.id} service={service} index={i} />
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-6 text-center text-xs text-slate-600">
          Scores are based on publicly documented data breaches, GDPR enforcement actions, and ownership analysis. Updated regularly by the Digital Europe team.
        </p>
      </main>
    </div>
  );
}

export default DashboardPage;
