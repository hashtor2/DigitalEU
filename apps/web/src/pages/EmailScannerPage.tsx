import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EmailScannerGate } from "@/components/EmailScannerGate";
import { InboxScannerOnboarding } from "@/components/InboxScannerOnboarding";
import { extractAccessTokenFromUrl } from "@/lib/gmailScanner";

export function EmailScannerPage() {
  const [searchParams] = useSearchParams();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to extract token from URL hash (OAuth callback)
    const token = extractAccessTokenFromUrl();
    if (token) {
      setAccessToken(token);
      setIsUnlocked(true);
      localStorage.setItem("email_scanner_unlocked", "true");
      setLoading(false);
      return;
    }

    // Check for Stripe success param
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
      <div className="min-h-screen bg-canvas dark:bg-dark-canvas flex items-center justify-center">
        <div className="text-text-secondary dark:text-dark-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!isUnlocked) {
    return <EmailScannerGate onUnlock={() => setIsUnlocked(true)} />;
  }

  // Full scanner UI (unlocked)
  return (
    <div className="min-h-screen bg-canvas dark:bg-dark-canvas text-text-primary dark:text-dark-text-primary flex flex-col">
      <Header />
      <main className="flex-1 mx-auto max-w-4xl px-6 py-16 w-full">
        {/* Scanner */}
        <InboxScannerOnboarding
          accessToken={accessToken || undefined}
          onSkip={() => {
            /* Navigate to directory or next step */
          }}
          onComplete={(accounts) => {
            console.log("Scan complete:", accounts);
            /* Save results to state/context */
          }}
        />
      </main>
      <Footer />
    </div>
  );
}
