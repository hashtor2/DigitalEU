/**
 * EmailScannerPage.tsx — Landing page for email scanner
 *
 * This page shows the EmailScannerGate (Proton affiliate + Stripe payment options).
 * Once unlocked, it redirects to the dedicated scanner app at localhost:5174
 * for the actual OAuth-based inbox scanning.
 */

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EmailScannerGate } from "@/components/EmailScannerGate";

const SCANNER_APP_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5174"
    : "https://scanner.digitaleu.me";

export function EmailScannerPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Check if scanner was unlocked via payment/Proton
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("scanner_unlocked") === "true") {
      setIsUnlocked(true);
    }
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  const handleStartScanning = () => {
    // Redirect to scanner app for OAuth
    window.location.href = `${SCANNER_APP_URL}/auth/signin`;
  };

  return (
    <div className="min-h-screen bg-canvas dark:bg-dark-canvas text-text-primary dark:text-dark-text-primary flex flex-col">
      <Header />
      <main className="flex-1 mx-auto max-w-4xl px-6 py-16 w-full">
        {!isUnlocked ? (
          <EmailScannerGate onUnlock={handleUnlock} />
        ) : (
          <div className="max-w-2xl mx-auto space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="text-h1 font-mono">Ready to scan your inbox?</h1>
              <p className="text-h3 text-text-secondary dark:text-dark-text-secondary font-sans">
                Connect your Gmail or Outlook account to get your personalized report.
              </p>
            </div>

            <button
              onClick={handleStartScanning}
              className="inline-block px-8 py-4 bg-accent hover:bg-accent-hover text-white rounded-sm transition text-lg font-medium"
            >
              Open Scanner
            </button>

            <div className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-sm p-6 text-left space-y-3">
              <h3 className="font-semibold text-text-primary dark:text-dark-text-primary">
                🔐 Your privacy is protected
              </h3>
              <ul className="space-y-2 text-sm text-text-secondary dark:text-dark-text-secondary">
                <li>✓ Metadata-only scanning (no email bodies)</li>
                <li>✓ Secure OAuth 2.0 with PKCE</li>
                <li>✓ Results never stored without your consent</li>
                <li>✓ Zero-knowledge encryption for saved profiles</li>
              </ul>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
