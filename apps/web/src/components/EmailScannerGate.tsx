import { useState } from "react";

const PROTON_AFFILIATE_URL = "https://go.getproton.me/SH1mR";
const STRIPE_CHECKOUT_ENDPOINT = "/.netlify/functions/create-checkout";

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
      const response = await fetch(STRIPE_CHECKOUT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          successUrl: `${window.location.origin}/emailscanner?scanner_unlocked=true`,
          cancelUrl: `${window.location.origin}/emailscanner`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to start payment. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-bold">
            Unlock the Email Scanner
          </h1>
          <p className="text-xl text-slate-400">
            See all your Big Tech accounts in just 2 minutes
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-8">
          <div className="space-y-2">
            <div className="text-2xl">🔍</div>
            <p className="font-semibold">Automatic Detection</p>
            <p className="text-sm text-slate-400">
              Scans your inbox to find all your Big Tech accounts
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl">🇪🇺</div>
            <p className="font-semibold">EU Alternatives</p>
            <p className="text-sm text-slate-400">
              Get privacy-first European replacements
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl">🛡️</div>
            <p className="font-semibold">100% Private</p>
            <p className="text-sm text-slate-400">
              Scanning happens locally; we never see your emails
            </p>
          </div>
        </div>

        {/* Two unlock paths */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-8">
          {/* Free path: Proton signup */}
          <button
            onClick={handleProtonClick}
            className="relative group rounded-lg border-2 border-[#1a56db] bg-[#1a56db]/10 p-8 text-left transition-all duration-300 hover:bg-[#1a56db]/20 hover:border-[#1a56db] active:scale-95"
          >
            <div className="space-y-3">
              <div className="text-3xl font-bold text-white">Free</div>
              <p className="text-sm text-slate-400">
                Sign up for a new{" "}
                <span className="font-semibold text-slate-200">Proton Mail</span>{" "}
                account
              </p>
              <div className="text-xs text-slate-500 space-y-1 py-2">
                <p>✓ Privacy-first email</p>
                <p>✓ 500 MB storage</p>
                <p>✓ Unlock email scanner</p>
              </div>
            </div>
          </button>

          {/* Paid path: €9.99 payment */}
          <button
            onClick={handlePaymentClick}
            disabled={loading}
            className="relative group rounded-lg border-2 border-[#f0c040] bg-[#f0c040]/10 p-8 text-left transition-all duration-300 hover:bg-[#f0c040]/20 hover:border-[#f0c040] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="space-y-3">
              <div className="text-3xl font-bold">
                <span className="text-[#f0c040]">€9.99</span>
                <span className="text-sm text-slate-400 font-normal ml-2">
                  one-time
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Pay once for{" "}
                <span className="font-semibold text-slate-200">
                  lifetime access
                </span>
              </p>
              <div className="text-xs text-slate-500 space-y-1 py-2">
                <p>✓ Lifetime scanner access</p>
                <p>✓ Support open-source development</p>
                <p>✓ Instant activation</p>
              </div>
              {loading && (
                <p className="text-xs text-[#f0c040]">
                  Redirecting to payment...
                </p>
              )}
            </div>
          </button>
        </div>

        {/* Why choose Proton for free */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6 text-left space-y-3">
          <p className="text-sm font-semibold text-slate-300">
            💡 Why Proton Mail free?
          </p>
          <ul className="text-sm text-slate-400 space-y-2">
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
        <p className="text-xs text-slate-500">
          Both options fully unlock the scanner. Proton Mail is a one-time setup;
          payment is a one-time €9.99 charge.
        </p>
      </div>
    </div>
  );
}
