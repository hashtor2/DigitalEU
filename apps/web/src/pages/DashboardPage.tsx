import { Link } from "react-router-dom";
import { ALTERNATIVES, type MigrationStatus } from "@digitaleu/shared";
import { Button } from "@/components/ui/button";
import { useMigrationState } from "@/hooks/useMigrationState";
import { isSupabaseConfigured } from "@/lib/supabase";

const STATUS_LABEL: Record<MigrationStatus, string> = {
  detected: "Oppdaget",
  "in-progress": "Påbegynt",
  switched: "Byttet",
  skipped: "Hoppet over",
};

const STATUS_STYLE: Record<MigrationStatus, string> = {
  detected: "bg-sky-500/15 text-sky-300",
  "in-progress": "bg-amber-500/15 text-amber-300",
  switched: "bg-emerald-500/15 text-emerald-300",
  skipped: "bg-slate-500/15 text-slate-400",
};

function alternativeName(id?: string): string | undefined {
  return ALTERNATIVES.find((a) => a.id === id)?.name;
}

export function DashboardPage() {
  const { mode, setMode, state, setStatus, reset } = useMigrationState();

  const switched = state.accounts.filter((a) => a.status === "switched").length;
  const total = state.accounts.length;

  return (
    <div className="min-h-full bg-slate-950 text-slate-100">
      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-sm text-slate-400 hover:text-slate-200">
            ← digitaleu.me
          </Link>
          <div className="flex gap-1 rounded-lg border border-white/10 p-1">
            <button
              onClick={() => setMode("guest")}
              className={`rounded-md px-3 py-1 text-sm transition ${
                mode === "guest" ? "bg-white/10 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Gjest
            </button>
            <button
              onClick={() => setMode("profile")}
              className={`rounded-md px-3 py-1 text-sm transition ${
                mode === "profile" ? "bg-white/10 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Profil
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Ditt dashbord</h1>

        {mode === "guest" ? (
          <p className="mt-2 text-sm text-slate-400">
            🔒 Gjestemodus: data lagres kun i denne fanen og forsvinner når du
            lukker den. Ingenting sendes til oss.
          </p>
        ) : (
          <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/5 p-5">
            <p className="font-medium text-amber-200">Profilmodus</p>
            <p className="mt-1 text-sm text-slate-400">
              Lagre fremgangen din ende-til-ende-kryptert. Vi kan aldri lese
              dataene dine — mister du passordet, finnes ingen baksdør.
            </p>
            <p className="mt-3 text-sm text-slate-500">
              {isSupabaseConfigured
                ? "Innlogging kommer snart."
                : "⚙️ Ikke konfigurert ennå (mangler Supabase-tilkobling)."}
            </p>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-slate-400">
            <span className="font-semibold text-white">{switched}</span> av{" "}
            <span className="font-semibold text-white">{total}</span> kontoer byttet
          </p>
          <Button variant="ghost" size="sm" onClick={reset} className="text-slate-400">
            Nullstill
          </Button>
        </div>

        <p className="mt-6 text-xs uppercase tracking-widest text-slate-600">
          Oppdagede kontoer (demo inntil innboksskanneren er bygget)
        </p>

        <ul className="mt-3 flex flex-col gap-3">
          {state.accounts.map((acc) => {
            const altName = alternativeName(acc.suggestedAlternativeId);
            return (
              <li
                key={acc.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{acc.serviceName}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLE[acc.status]}`}>
                      {STATUS_LABEL[acc.status]}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {acc.domain}
                    {altName && (
                      <>
                        {" → "}
                        <span className="text-sky-400">{altName}</span>
                      </>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setStatus(acc.id, "in-progress")}
                  >
                    Påbegynt
                  </Button>
                  <Button
                    size="sm"
                    className="bg-emerald-600 text-white hover:bg-emerald-500"
                    onClick={() => setStatus(acc.id, "switched")}
                  >
                    Byttet
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-slate-400"
                    onClick={() => setStatus(acc.id, "skipped")}
                  >
                    Hopp over
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
