import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

const QA_STEPS = [
  "Open Plausible dashboard in another tab",
  "Send QA Ping and confirm it appears in events",
  "Send Affiliate Click and confirm event + provider props",
  "Send Catalog CTA Click and confirm event + source props",
];

function fireEvent(eventName: string, props: Record<string, string>) {
  if (typeof window === "undefined") {
    return false;
  }

  const plausibleFn = (window as any).plausible;
  if (typeof plausibleFn !== "function") {
    return false;
  }

  plausibleFn(eventName, { props });
  return true;
}

export function AnalyticsQAPage() {
  const [lastResult, setLastResult] = useState<string>("No events sent yet.");
  const [checklistState, setChecklistState] = useState<boolean[]>(() => QA_STEPS.map(() => false));

  const scriptState = useMemo(() => {
    if (typeof document === "undefined") {
      return { scriptLoaded: false, domain: "n/a", scriptSrc: "n/a" };
    }

    const script = document.querySelector('script[data-plausible="true"]') as HTMLScriptElement | null;
    return {
      scriptLoaded: !!script,
      domain: script?.dataset.domain || "missing",
      scriptSrc: script?.src || "missing",
    };
  }, []);

  const runtimeStatus =
    typeof window !== "undefined" && typeof (window as any).plausible === "function"
      ? "ready"
      : "not-ready";

  const send = (eventName: string) => {
    const sent = fireEvent(eventName, {
      source: "analytics-qa-page",
      env: import.meta.env.PROD ? "production" : "development",
      ts: new Date().toISOString(),
    });

    setLastResult(
      sent
        ? `Sent ${eventName} at ${new Date().toLocaleTimeString()}`
        : `Could not send ${eventName} because window.plausible is unavailable.`
    );
  };

  const checkedCount = checklistState.filter(Boolean).length;
  const allDone = checkedCount === QA_STEPS.length;

  const toggleStep = (index: number) => {
    setChecklistState((prev) => prev.map((value, i) => (i === index ? !value : value)));
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col">
      <title>Analytics QA — digitaleu.me</title>
      <meta name="robots" content="noindex,nofollow" />
      <Header />

      <main className="flex-1 mx-auto max-w-3xl w-full px-6 py-10">
        <h1 className="text-2xl font-bold mb-2">Plausible Analytics QA</h1>
        <p className="text-sm text-slate-400 mb-8">
          Use this page to quickly validate production event delivery without opening the scanner or checkout flow.
        </p>

        <div className="rounded border border-[#30363d] bg-[#161b22] p-5 mb-6">
          <h2 className="text-sm font-semibold text-slate-200 mb-4">Runtime status</h2>
          <div className="space-y-2 text-xs text-slate-300">
            <p>
              Plausible function: <span className={runtimeStatus === "ready" ? "text-emerald-300" : "text-red-300"}>{runtimeStatus}</span>
            </p>
            <p>
              Script tag detected: <span className={scriptState.scriptLoaded ? "text-emerald-300" : "text-red-300"}>{scriptState.scriptLoaded ? "yes" : "no"}</span>
            </p>
            <p>Configured domain: <span className="text-slate-200">{scriptState.domain}</span></p>
            <p className="break-all">Script src: <span className="text-slate-200">{scriptState.scriptSrc}</span></p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 mb-6">
          <Button
            onClick={() => send("QA Ping")}
            className="bg-[#1a56db] hover:bg-[#2563eb] text-white"
          >
            Send QA Ping
          </Button>
          <Button
            onClick={() => send("Affiliate Click")}
            variant="outline"
            className="border-[#30363d] text-slate-100 hover:bg-[#21262d]"
          >
            Send Affiliate Click
          </Button>
          <Button
            onClick={() => send("Catalog CTA Click")}
            variant="outline"
            className="border-[#30363d] text-slate-100 hover:bg-[#21262d]"
          >
            Send Catalog CTA
          </Button>
        </div>

        <div className="rounded border border-[#30363d] bg-[#161b22] p-5 mb-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-200">2-minute QA checklist</h2>
              <p className="text-xs text-slate-400 mt-1">Mark each step as you verify events in Plausible.</p>
            </div>
            <span className="text-xs font-mono text-slate-300 border border-[#30363d] rounded px-2 py-1">
              {checkedCount}/{QA_STEPS.length}
            </span>
          </div>

          <div className="space-y-2">
            {QA_STEPS.map((step, index) => (
              <label key={step} className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklistState[index]}
                  onChange={() => toggleStep(index)}
                  className="mt-0.5 h-4 w-4 accent-[#1a56db]"
                />
                <span className="text-xs text-slate-300">{step}</span>
              </label>
            ))}
          </div>

          <div className="mt-4 border-t border-[#30363d] pt-3">
            <p className={`text-xs ${allDone ? "text-emerald-300" : "text-slate-400"}`}>
              {allDone
                ? "QA completed. Events and key props have been verified for this release."
                : "Complete all four checks to close analytics QA for this release."}
            </p>
          </div>
        </div>

        <div className="rounded border border-[#30363d] bg-[#0d1117] p-4 text-xs text-slate-300">
          <p className="mb-2">Last action</p>
          <p>{lastResult}</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
