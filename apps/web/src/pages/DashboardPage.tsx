import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ALTERNATIVES, type MigrationStatus, type DetectedAccount, MIGRATION_GUIDES, MigrationGuideStep } from "@digitaleu/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useMigrationState } from "@/hooks/useMigrationState";
import { analyzePastedList } from "@/lib/pastedListParser";

const STATUS_LABEL: Record<MigrationStatus, string> = {
  detected: "Detected",
  "in-progress": "In Progress",
  switched: "Switched",
  skipped: "Skipped",
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

const MIGRATION_GUIDES_MAP: Record<string, { title: string; steps: MigrationGuideStep[] }> = MIGRATION_GUIDES;

function MigrationItemRow({
  acc,
  setStatus,
}: {
  acc: DetectedAccount;
  setStatus: (id: string, status: MigrationStatus) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const altName = alternativeName(acc.suggestedAlternativeId);
  const guide = acc.suggestedAlternativeId ? MIGRATION_GUIDES_MAP[acc.suggestedAlternativeId] : null;

  return (
    <li
      className="flex flex-col rounded-xl border border-white/10 bg-white/5 p-4 hover:border-white/15 transition overflow-hidden"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{acc.serviceName}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${STATUS_STYLE[acc.status]}`}>
              {STATUS_LABEL[acc.status]}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {acc.domain}
            {altName && (
              <>
                {" → "}
                <span className="text-sky-400 font-bold">{altName} 🇨🇭</span>
              </>
            )}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {guide && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold px-2 py-1"
            >
              {isExpanded ? "Close Guide" : "How to Migrate 📖"}
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            disabled={acc.status === "switched"}
            onClick={() => setStatus(acc.id, "in-progress")}
            className="text-xs font-semibold px-3 py-1.5"
          >
            In Progress
          </Button>
          <Button
            size="sm"
            disabled={acc.status === "switched"}
            className="bg-emerald-600 text-white hover:bg-emerald-500 transition text-xs font-bold px-3 py-1.5"
            onClick={() => setStatus(acc.id, "switched")}
          >
            Switched ✓
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-slate-500 hover:text-slate-300 text-xs px-2"
            onClick={() => setStatus(acc.id, "skipped")}
          >
            Skip
          </Button>
        </div>
      </div>

      {isExpanded && guide && (
        <div className="mt-4 border-t border-white/5 pt-4 space-y-3">
          <h4 className="text-sm font-bold text-sky-300">{guide.title}</h4>
          <div className="grid gap-3 sm:grid-cols-3">
            {guide.steps.map((s) => (
              <div key={s.step} className="rounded-lg border border-white/5 bg-white/[0.02] p-3 space-y-1.5">
                <span className="text-[10px] font-extrabold text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded-full">
                  Step {s.step}
                </span>
                <h5 className="text-xs font-bold text-white pt-1">{s.title}</h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 leading-normal italic pt-1">
            💡 **Tip:** Our Chrome/Firefox companion extension automatically detects this settings page and fills your secure details in one click!
          </p>
        </div>
      )}
    </li>
  );
}

export default function DashboardPage() {
  const { user, loading: authLoading, error: authError, signUp, signIn, signOut } = useAuth();
  const { state, setStatus, setAccounts, clearState, error: migrationError } = useMigrationState();
  const [pastedList, setPastedList] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzePastedList = async () => {
    if (!pastedList.trim()) {
      setError("The list is empty. Please paste a list of services, one per line.");
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    try {
      const detected = await analyzePastedList(pastedList);
      setAccounts(detected);
    } catch (e: any) {
      setError(`Analysis failed: ${e.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sortedAccounts = [...state.accounts].sort((a, b) => {
    if (a.status === b.status) return a.serviceName.localeCompare(b.serviceName);
    if (a.status === "switched") return 1;
    if (b.status === "switched") return -1;
    if (a.status === "skipped") return 1;
    if (b.status === "skipped") return -1;
    return 0;
  });

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Your Migration Dashboard</h1>
        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-300">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={signOut}>Sign Out</Button>
            </div>
          ) : (
            <Link to="/login">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </header>

      {authLoading && <p>Loading authentication...</p>}
      {authError && <p className="text-red-400">{authError}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>1. Find Your Accounts</CardTitle>
              <CardDescription>
                Paste a list of services you use (e.g., from a password manager export). We'll identify them and suggest European alternatives.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your list here, one service per line. For example:&#10;Netflix&#10;dropbox.com&#10;Spotify"
                className="h-40 bg-slate-900/50 border-slate-700"
                value={pastedList}
                onChange={(e) => setPastedList(e.target.value)}
                disabled={isAnalyzing}
              />
              <Button onClick={handleAnalyzePastedList} disabled={isAnalyzing}>
                {isAnalyzing ? "Analyzing..." : "Analyze List"}
              </Button>
              {migrationError && <p className="text-sm text-red-400 mt-2">{migrationError}</p>}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>2. Your Migration Checklist</CardTitle>
              <CardDescription>
                Here are the accounts we identified. Work through the list to migrate them.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {state.accounts.length > 0 ? (
                <ul className="space-y-3">
                  {sortedAccounts.map((acc) => (
                    <MigrationItemRow key={acc.id} acc={acc} setStatus={setStatus} />
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 text-center py-8">
                  Your checklist is empty. Analyze a list above to get started.
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={clearState} size="sm">Clear Checklist</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}