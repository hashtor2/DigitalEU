import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EmailScannerGate } from "@/components/EmailScannerGate";
import { useMigrationState } from "@/hooks/useMigrationState";
import { getGoogleAuthUrl } from "@/lib/gmailScanner";

export function EmailScannerPage() {
  const [searchParams] = useSearchParams();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { state } = useMigrationState();

  // Check unlock status on mount
  useEffect(() => {
    // Check for query param from Stripe success
    if (searchParams.get("scanner_unlocked") === "true") {
      localStorage.setItem("email_scanner_unlocked", "true");
      setIsUnlocked(true);
      setLoading(false);
      return;
    }

    // Check localStorage flags
    const unlocked = localStorage.getItem("email_scanner_unlocked");
    const protonFlag = localStorage.getItem("email_scanner_unlock_via_proton");

    if (unlocked === "true" || protonFlag === "true") {
      setIsUnlocked(true);
    }

    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <EmailScannerGate onUnlock={() => setIsUnlocked(true)} />
    );
  }

  // Full scanner UI (unlocked)
  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col">
      <Header />
      <main className="flex-1 mx-auto max-w-4xl px-4 sm:px-6 py-10 w-full">
        
        {/* Header section */}
        <div className="space-y-4 mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold">Email Scanner</h1>
          <p className="text-lg text-slate-400">
            Find all your Big Tech accounts by scanning your inbox
          </p>
        </div>

        {/* Scanner interface */}
        <div className="space-y-8">
          {/* Start scanning section */}
          <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Ready to scan?</h2>
              <p className="text-slate-400 text-sm">
                We'll scan your Gmail or Outlook inbox to detect which Big Tech
                services you have accounts with. Your emails never leave your
                device.
              </p>
            </div>

            {/* OAuth buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={getGoogleAuthUrl()}
                className="px-6 py-3 rounded-lg border border-[#1a56db] bg-[#1a56db]/10 text-white font-semibold hover:bg-[#1a56db]/20 transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.9 10.7L12 16.1l-8.9-5.4c-.5-.3-.9-.9-.9-1.6V6.5C2.2 5.1 3.3 4 4.7 4h14.6c1.4 0 2.5 1.1 2.5 2.5v2.6c0 .7-.4 1.3-.9 1.6z" />
                  <path d="M2.2 6.8v10.5c0 1.4 1.1 2.5 2.5 2.5h14.6c1.4 0 2.5-1.1 2.5-2.5V6.8L12 12.2 2.2 6.8z" />
                </svg>
                Scan Gmail
              </a>

              <button
                disabled
                className="px-6 py-3 rounded-lg border border-slate-700 bg-slate-900 text-slate-500 font-semibold cursor-not-allowed flex items-center justify-center gap-2 opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 5.5C2 4.119 3.119 3 4.5 3h15C20.881 3 22 4.119 22 5.5v13C22 19.881 20.881 21 19.5 21h-15C3.119 21 2 19.881 2 18.5v-13zM4.5 4.5c-.276 0-.5.224-.5.5v13c0 .276.224.5.5.5h3V4.5h-3zm4.5 0v14h10.5c.276 0 .5-.224.5-.5v-13c0-.276-.224-.5-.5-.5H9z" />
                </svg>
                Outlook (coming soon)
              </button>
            </div>

            <div className="bg-slate-900 p-4 rounded border border-slate-700">
              <p className="text-xs text-slate-400">
                💡 <strong>Note:</strong> Outlook scanning is coming soon. For now, you can export your Gmail accounts.
              </p>
            </div>
          </div>

          {/* Results section */}
          {state.accounts && state.accounts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">
                Found {state.accounts.length} accounts
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-700 text-slate-400 text-xs font-semibold uppercase">
                    <tr>
                      <th className="text-left py-3 px-4">Service</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Alternative</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {state.accounts.map((account) => (
                      <tr key={account.id} className="hover:bg-slate-900/30 transition">
                        <td className="py-3 px-4">
                          <span className="font-semibold">{account.serviceName}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-medium">
                            Detected
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {account.suggestedAlternativeId ? (
                            <Link
                              to={`/alternative/${account.suggestedAlternativeId}`}
                              className="text-[#1a56db] hover:text-[#2563eb] transition underline"
                            >
                              View alternative →
                            </Link>
                          ) : (
                            <span className="text-slate-500">No alternative</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Next steps */}
              <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6 space-y-4 mt-6">
                <h3 className="font-semibold">Next steps:</h3>
                <ol className="space-y-2 text-sm text-slate-400 list-decimal list-inside">
                  <li>
                    Click "View alternative" to learn about each privacy-friendly option
                  </li>
                  <li>
                    Create an account with your new provider
                  </li>
                  <li>
                    Migrate your data and update passwords
                  </li>
                </ol>
                <div className="pt-4">
                  <Link
                    to="/directory"
                    className="inline-block px-6 py-2 bg-[#1a56db] text-white rounded-lg font-semibold hover:bg-[#2563eb] transition"
                  >
                    Browse all alternatives
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {state.accounts.length === 0 && (
            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-12 text-center space-y-4">
              <p className="text-slate-400">
                👆 Click "Scan Gmail" above to discover your Big Tech accounts
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
