import { useState } from "react";
import { redirectToCheckout } from "@/lib/stripe";

const PROTON_AFFILIATE_URL = "https://go.getproton.me/SH1mR";

interface EmailScannerGateProps {
  onUnlock: () => void;
}

export function EmailScannerGate({ onUnlock }: EmailScannerGateProps) {
  const [loading, setLoading] = useState(false);

  const handleProtonClick = () => {
    // Set flag in localStorage to track Proton signup
    localStorage.setItem("email_scanner_unlock_via_proton", "true");
    // Open Proton signup link
    window.open(PROTON_AFFILIATE_URL, "_blank", "width=1200,height=800");

    // Also trigger unlock immediately with a 2-second delay (for return users)
    setTimeout(() => {
      const unlocked = localStorage.getItem("email_scanner_unlocked");
      const protonFlag = localStorage.getItem("email_scanner_unlock_via_proton");
      if (unlocked === "true" || protonFlag === "true") {
        onUnlock();
      }
    }, 2000);
  };

  const handlePaymentClick = async () => {
    setLoading(true);
    try {
      await redirectToCheckout({
        successUrl: `${window.location.origin}/emailscanner?scanner_unlocked=true`,
        cancelUrl: `${window.location.origin}/emailscanner`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-canvas dark:bg-dark-canvas text-text-primary dark:text-dark-text-primary flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full space-y-12">
        {/* Heading */}
        <div className="text-center space-y-4">
          <h1 className="text-h1 font-mono">Unlock the Email Scanner</h1>
          <p className="text-h3 text-text-secondary dark:text-dark-text-secondary font-sans">
            See all your Big Tech accounts in just 2 minutes
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-3 text-center">
            <div className="text-4xl">🔍</div>
            <h3 className="font-medium text-text-primary dark:text-dark-text-primary">Automatic Detection</h3>
            <p className="text-small text-text-secondary dark:text-dark-text-secondary">
              Scans your inbox to find all your Big Tech accounts
            </p>
          </div>
          <div className="space-y-3 text-center">
            <div className="text-4xl">🇪🇺</div>
            <h3 className="font-medium text-text-primary dark:text-dark-text-primary">EU Alternatives</h3>
            <p className="text-small text-text-secondary dark:text-dark-text-secondary">
              Get privacy-first European replacements
            </p>
          </div>
          <div className="space-y-3 text-center">
            <div className="text-4xl">🛡️</div>
            <h3 className="font-medium text-text-primary dark:text-dark-text-primary">100% Private</h3>
            <p className="text-small text-text-secondary dark:text-dark-text-secondary">
              Scanning happens locally; we never see your emails
            </p>
          </div>
        </div>

        {/* Two unlock paths */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Free path: Proton signup */}
          <button
            onClick={handleProtonClick}
            className="group relative rounded-sm border-2 border-accent bg-accent/5 dark:bg-accent/10 p-8 text-left transition-all duration-300 hover:bg-accent/10 dark:hover:bg-accent/20 hover:border-accent active:scale-95"
          >
            <div className="space-y-4">
              <div className="text-h2 font-mono font-semibold text-accent">Free</div>
              <p className="text-small text-text-secondary dark:text-dark-text-secondary">
                Sign up for a new{" "}
                <span className="font-semibold text-text-primary dark:text-dark-text-primary">Proton Mail</span>{" "}
                account
              </p>
              <div className="space-y-2 pt-2">
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">✓ Privacy-first email</p>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">✓ 500 MB storage</p>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">✓ Unlock email scanner</p>
              </div>
            </div>
          </button>

          {/* Paid path: €5 payment */}
          <button
            onClick={handlePaymentClick}
            disabled={loading}
            className="group relative rounded-sm border-2 border-warning bg-warning/5 dark:bg-warning/10 p-8 text-left transition-all duration-300 hover:bg-warning/10 dark:hover:bg-warning/20 hover:border-warning active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="space-y-4">
              <div className="text-h2 font-mono font-semibold">
                <span className="text-warning">€5</span>
                <span className="text-small text-text-secondary dark:text-dark-text-secondary font-normal ml-2">
                  one-time
                </span>
              </div>
              <p className="text-small text-text-secondary dark:text-dark-text-secondary">
                Pay once for{" "}
                <span className="font-semibold text-text-primary dark:text-dark-text-primary">
                  lifetime access
                </span>
              </p>
              <div className="space-y-2 pt-2">
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">✓ Lifetime scanner access</p>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">✓ Support open-source development</p>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">✓ Instant activation</p>
              </div>
              {loading && (
                <p className="text-xs text-warning font-medium">
                  Redirecting to payment...
                </p>
              )}
            </div>
          </button>
        </div>

        {/* Why choose Proton for free */}
        <div className="bg-canvas dark:bg-dark-canvas border-2 border-dashed border-border dark:border-dark-border rounded-sm p-6 space-y-4">
          <p className="text-small font-mono font-semibold text-accent">
            💡 Why Proton Mail free?
          </p>
          <ul className="text-small text-text-secondary dark:text-dark-text-secondary space-y-3">
            <li>
              • Proton Mail is one of the best privacy-first email alternatives
            </li>
            <li>
              • By signing up through our link, you support our independent
              mission
            </li>
            <li>
              • You get an excellent email service + our tools to migrate away
              from Big Tech
            </li>
          </ul>
        </div>

        {/* Footer note */}
        <p className="text-xs text-center text-text-secondary dark:text-dark-text-secondary">
          Both options fully unlock the scanner. Proton Mail is a one-time setup;
          payment is a one-time €5 charge.
        </p>
      </div>
    </main>
  );
}
