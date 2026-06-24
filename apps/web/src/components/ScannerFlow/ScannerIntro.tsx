/**
 * ScannerIntro.tsx — First step of the scanner flow
 *
 * Explains how the scanner works, emphasizes privacy,
 * and provides entry points to demo mode or real scanning.
 */

interface ScannerIntroProps {
  onStartGmailScan: () => void;
  onStartOutlookScan: () => void;
  onTryDemo: () => void;
}

export function ScannerIntro({
  onStartGmailScan,
  onStartOutlookScan,
  onTryDemo,
}: ScannerIntroProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Hero */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-text-primary dark:text-dark-text-primary">
          Scan your inbox in 2 minutes.
        </h1>
        <p className="text-lg text-text-secondary dark:text-dark-text-secondary">
          We'll read your sender list — never your emails — and show you which
          services you use. Then switch to private, European alternatives with
          one click.
        </p>
      </div>

      {/* How it works (3-step explainer) */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">
          Here's what we do:
        </h2>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-canvas dark:text-dark-canvas text-sm font-bold">
              1
            </span>
            <div>
              <p className="font-medium text-text-primary dark:text-dark-text-primary">
                Connect your email
              </p>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                Sign in with Gmail or Outlook. We only request read-only metadata
                access.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-canvas dark:text-dark-canvas text-sm font-bold">
              2
            </span>
            <div>
              <p className="font-medium text-text-primary dark:text-dark-text-primary">
                We analyze sender names only
              </p>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                Never email bodies, attachments, or contacts. Processing happens
                on our secure servers, not your device.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-canvas dark:text-dark-canvas text-sm font-bold">
              3
            </span>
            <div>
              <p className="font-medium text-text-primary dark:text-dark-text-primary">
                Discover EU alternatives
              </p>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                See private, European replacements for the services you use —
                and get step-by-step "how to switch" guides.
              </p>
            </div>
          </li>
        </ul>
      </div>

      {/* Privacy guarantee */}
      <div className="bg-canvas-elevated dark:bg-dark-canvas-elevated rounded-lg p-4 border border-border-subtle dark:border-dark-border-subtle space-y-2">
        <p className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
          🔒 Your privacy is guaranteed:
        </p>
        <ul className="text-sm space-y-1">
          <li className="text-text-secondary dark:text-dark-text-secondary">
            ✓ Email bodies never accessed
          </li>
          <li className="text-text-secondary dark:text-dark-text-secondary">
            ✓ Your Gmail/Outlook password is never stored
          </li>
          <li className="text-text-secondary dark:text-dark-text-secondary">
            ✓ Results are encrypted when saved to your account
          </li>
          <li className="text-text-secondary dark:text-dark-text-secondary">
            ✓ You can delete everything in one click
          </li>
        </ul>
      </div>

      {/* CTA buttons */}
      <div className="space-y-2">
        <div className="flex gap-3">
          <button
            onClick={onStartGmailScan}
            className="flex-1 px-6 py-3 bg-accent hover:bg-accent/90 text-canvas dark:text-dark-canvas font-medium rounded-lg transition"
          >
            Scan Gmail →
          </button>
          <button
            onClick={onStartOutlookScan}
            className="flex-1 px-6 py-3 bg-canvas-elevated dark:bg-dark-canvas-elevated hover:bg-canvas-elevated/90 dark:hover:bg-dark-canvas-elevated/90 text-text-primary dark:text-dark-text-primary font-medium border border-border-subtle dark:border-dark-border-subtle rounded-lg transition"
          >
            Scan Outlook →
          </button>
        </div>
        <p className="text-xs text-text-secondary dark:text-dark-text-secondary text-center">
          or{" "}
          <button
            onClick={onTryDemo}
            className="underline hover:no-underline text-accent"
          >
            try the demo (no account needed)
          </button>
        </p>
      </div>
    </div>
  );
}
