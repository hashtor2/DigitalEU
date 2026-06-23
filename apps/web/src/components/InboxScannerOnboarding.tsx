import { useState } from "react";
import { Button } from "@/components/ui/button";

interface InboxScannerOnboardingProps {
  onStart?: () => void;
  onSkip?: () => void;
  isScanning?: boolean;
  scanProgress?: number;
}

export function InboxScannerOnboarding({
  onStart,
  onSkip,
  isScanning,
  scanProgress = 0,
}: InboxScannerOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<"intro" | "scanning" | "results">(
    "intro"
  );

  const handleStart = () => {
    setCurrentStep("scanning");
    onStart?.();
  };

  const handleScanComplete = () => {
    setCurrentStep("results");
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
      <div className="w-full max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h2 font-mono mb-2">Scanning your inbox...</h1>
          <p className="text-text-secondary dark:text-dark-text-secondary">
            Finding services in your email. This usually takes 10–30 seconds.
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono font-semibold">Progress</span>
              <span className="text-sm text-text-secondary dark:text-dark-text-secondary">
                {scanProgress}%
              </span>
            </div>
            <div className="w-full h-2 bg-border dark:bg-dark-border rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Scanning Animation */}
        <div className="p-6 bg-accent/5 dark:bg-accent/10 border border-accent rounded-sm">
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <div className="h-3 bg-border dark:bg-dark-border rounded-sm flex-1 animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-canvas dark:bg-dark-canvas border border-border dark:border-dark-border rounded-sm">
          <p className="text-xs text-center text-text-secondary dark:text-dark-text-secondary">
            🔒 Scanning happens in your browser only.{" "}
            <span className="font-medium">
              We never see your emails or store your data.
            </span>
          </p>
        </div>

        {/* Note */}
        <p className="text-xs text-center text-text-secondary dark:text-dark-text-secondary">
          Having trouble? You can{" "}
          <button
            onClick={onSkip}
            className="font-medium text-accent hover:underline"
          >
            select services manually
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-h2 font-mono mb-2">Scan complete!</h1>
        <p className="text-text-secondary dark:text-dark-text-secondary">
          We found {scanProgress || 12} services in your inbox.
        </p>
      </div>

      {/* Results Placeholder */}
      <div className="p-6 bg-accent/5 dark:bg-accent/10 border border-accent rounded-sm">
        <p className="text-center text-sm text-text-secondary dark:text-dark-text-secondary">
          Services will appear here once scanning is complete.
        </p>
      </div>

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
            <span>Check which ones are exposed in a breach</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent flex-shrink-0">→</span>
            <span>Get your personalized migration plan</span>
          </li>
        </ul>
      </div>

      {/* Action */}
      <Button
        onClick={() => {
          /* Navigate to report or next step */
        }}
        className="w-full h-12 rounded-sm bg-accent px-8 font-mono font-semibold text-white hover:bg-accent-hover"
      >
        See Your Privacy Report
      </Button>
    </div>
  );
}

export default InboxScannerOnboarding;
