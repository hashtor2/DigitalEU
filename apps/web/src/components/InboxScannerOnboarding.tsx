import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScanProgress } from "@/components/InboxScanner/ScanProgress";
import { scanGmailInbox, type DiscoveredAccount } from "@/lib/scanGmail";

interface InboxScannerOnboardingProps {
  onSkip?: () => void;
  onComplete?: (accounts: DiscoveredAccount[]) => void;
  accessToken?: string;
}

export function InboxScannerOnboarding({
  onSkip,
  onComplete,
  accessToken,
}: InboxScannerOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<"intro" | "scanning" | "results">(
    "intro"
  );
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredAccounts, setDiscoveredAccounts] = useState<DiscoveredAccount[]>([]);

  const handleStart = async () => {
    if (!accessToken) {
      alert("No access token provided. Please sign in first.");
      return;
    }
    setIsScanning(true);
    setCurrentStep("scanning");

    try {
      const accounts = await scanGmailInbox(accessToken);
      setDiscoveredAccounts(accounts);
      setCurrentStep("results");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Scan failed");
      setCurrentStep("intro");
    } finally {
      setIsScanning(false);
    }
  };

  const handleScanComplete = () => {
    setCurrentStep("results");
    if (onComplete) {
      onComplete(discoveredAccounts);
    }
  };

  if (currentStep === "intro") {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h2 font-mono mb-2">Scan Your Inbox</h1>
          <p className="text-text-secondary dark:text-dark-text-secondary">
            We'll find which services you use and suggest European alternatives.
          </p>
        </div>

        {/* How It Works */}
        <div className="space-y-4">
          <h2 className="text-sm font-mono font-semibold">How it works</h2>
          <div className="space-y-3">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-accent/10 dark:bg-accent/20 flex items-center justify-center font-mono font-semibold text-accent">
                1
              </div>
              <div>
                <p className="font-medium text-sm">We read email sender domains</p>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                  Your Gmail or Outlook grants us read-only access
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-accent/10 dark:bg-accent/20 flex items-center justify-center font-mono font-semibold text-accent">
                2
              </div>
              <div>
                <p className="font-medium text-sm">
                  We check which services you use
                </p>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                  100% in your browser — nothing leaves your device
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-accent/10 dark:bg-accent/20 flex items-center justify-center font-mono font-semibold text-accent">
                3
              </div>
              <div>
                <p className="font-medium text-sm">We show you European alternatives</p>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                  For each service, we suggest privacy-first swaps
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What We Don't Read */}
        <div className="p-4 bg-canvas dark:bg-dark-canvas border border-border dark:border-dark-border rounded-sm">
          <p className="text-sm font-mono font-semibold mb-3">We never read</p>
          <ul className="space-y-2 text-xs text-text-secondary dark:text-dark-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-error flex-shrink-0">✗</span>
              <span>Message content or attachments</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-error flex-shrink-0">✗</span>
              <span>Full email addresses</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-error flex-shrink-0">✗</span>
              <span>Any data beyond sender domains</span>
            </li>
          </ul>
        </div>

        {/* Privacy Promise */}
        <div className="p-4 border-2 border-dashed border-accent rounded-sm">
          <p className="text-xs text-center">
            <span className="font-mono font-semibold text-accent">🔒 Zero-knowledge</span>
            <br />
            <span className="text-text-secondary dark:text-dark-text-secondary">
              Your emails never reach our servers
            </span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={handleStart}
            className="flex-1 h-12 rounded-sm bg-accent px-8 font-mono font-semibold text-white hover:bg-accent-hover"
          >
            Start Scanning
          </Button>
          <Button
            onClick={onSkip}
            variant="outline"
            className="flex-1 h-12 rounded-sm border-2 border-border dark:border-dark-border px-8 font-mono font-semibold hover:bg-border/10"
          >
            Choose Manually
          </Button>
        </div>
      </div>
    );
  }

  if (currentStep === "scanning") {
    return (
      <div className="w-full py-16">
        <ScanProgress
          isScanning={isScanning}
          mode="real"
          onComplete={handleScanComplete}
        />
      </div>
    );
  }

  if (currentStep === "results") {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h2 font-mono mb-2">Scan complete!</h1>
          <p className="text-text-secondary dark:text-dark-text-secondary">
            We found {discoveredAccounts.length} services in your inbox.
          </p>
        </div>

        {/* Results List */}
        {discoveredAccounts.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-sm font-mono font-semibold">Detected Services</h2>
            <div className="space-y-3">
              {discoveredAccounts.map((account) => (
                <div
                  key={account.domain}
                  className="p-4 border border-border dark:border-dark-border rounded-sm bg-canvas dark:bg-dark-canvas"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-text-primary dark:text-dark-text-primary">
                        {account.name}
                      </p>
                      <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                        {account.domain} · {account.count} email{account.count !== 1 ? "s" : ""}
                      </p>
                    </div>
                    {account.matchedServiceId && (
                      <span className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-sm">
                        ✓ Has EU alternative
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 bg-accent/5 dark:bg-accent/10 border border-accent rounded-sm">
            <p className="text-center text-sm text-text-secondary dark:text-dark-text-secondary">
              No services found. Try connecting more emails or scanning manually.
            </p>
          </div>
        )}

        {/* Next Steps */}
        <div className="space-y-3">
          <h2 className="text-sm font-mono font-semibold">What's next?</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-accent flex-shrink-0">→</span>
              <span>Review detected services above</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent flex-shrink-0">→</span>
              <span>Get your personalized migration plan</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onSkip}
            className="flex-1 h-12 rounded-sm bg-accent px-8 font-mono font-semibold text-white hover:bg-accent-hover"
          >
            Continue
          </Button>
          <Button
            onClick={handleStart}
            variant="outline"
            className="h-12 rounded-sm border border-border dark:border-dark-border px-8 font-mono font-semibold hover:bg-border/10"
          >
            Scan Again
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

export default InboxScannerOnboarding;
