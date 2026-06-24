/**
 * EmailScannerPage.tsx — Main scanner page
 *
 * Orchestrates the email scanner flow using the new backend-proxy architecture:
 * 1. User sees intro with privacy guarantees
 * 2. User clicks "Scan Gmail/Outlook" → initiates OAuth
 * 3. After OAuth callback, token is extracted from URL hash (memory-only)
 * 4. Frontend calls backend edge function with token
 * 5. Backend fetches email metadata server-side
 * 6. Frontend displays results
 * 7. Optional: save encrypted results to profile
 */

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  ScannerIntro,
  ScannerProgressStep,
  ScannerResultsStep,
} from "@/components/ScannerFlow";
import { useClientSideScanner } from "@/hooks/useClientSideScanner";
import {
  extractAccessTokenFromUrl,
  getGoogleAuthUrl,
} from "@/lib/gmailScanner";

export function EmailScannerPage() {
  const [searchParams] = useSearchParams();
  const { state, startGmailAuth, startOutlookAuth, scanWithToken, startDemo, reset } =
    useClientSideScanner();

  // After OAuth callback, token is in URL fragment
  useEffect(() => {
    const token = extractAccessTokenFromUrl();
    if (token) {
      // Determine provider from URL (or default to gmail)
      const provider = searchParams.get("provider") as "gmail" | "outlook" || "gmail";
      scanWithToken(token, provider);
    }
  }, [scanWithToken, searchParams]);

  const handleStartGmailScan = () => {
    startGmailAuth();
    // Redirect to Google OAuth
    window.location.href = getGoogleAuthUrl();
  };

  const handleStartOutlookScan = () => {
    startOutlookAuth();
    // TODO: Implement Outlook OAuth URL
    // window.location.href = getOutlookAuthUrl();
  };

  const handleTryDemo = () => {
    startDemo();
  };

  return (
    <div className="min-h-screen bg-canvas dark:bg-dark-canvas text-text-primary dark:text-dark-text-primary flex flex-col">
      <Header />
      <main className="flex-1 mx-auto max-w-4xl px-6 py-16 w-full">
        {/* Intro step */}
        {state.step === "intro" && (
          <ScannerIntro
            onStartGmailScan={handleStartGmailScan}
            onStartOutlookScan={handleStartOutlookScan}
            onTryDemo={handleTryDemo}
          />
        )}

        {/* Scanning progress */}
        {state.step === "scanning" && (
          <ScannerProgressStep
            progress={state.progress}
            scannedCount={state.scannedCount}
          />
        )}

        {/* Results */}
        {state.step === "results" && (
          <ScannerResultsStep
            results={state.results}
            isDemo={false}
            onReset={reset}
            onSaveProfile={() => {
              // TODO: Implement profile save flow
              console.log("Save to profile:", state.results);
            }}
          />
        )}

        {/* Error state */}
        {state.step === "error" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                Scan failed
              </h2>
              <p className="text-red-700 dark:text-red-200 mb-4">{state.error}</p>
              <div className="flex gap-2">
                <button
                  onClick={reset}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                  Try again
                </button>
                <a
                  href="/directory"
                  className="px-4 py-2 bg-canvas-elevated dark:bg-dark-canvas-elevated text-text-primary dark:text-dark-text-primary border border-border-subtle dark:border-dark-border-subtle rounded-lg transition"
                >
                  Browse alternatives
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
