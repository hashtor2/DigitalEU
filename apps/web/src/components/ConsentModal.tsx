import { Button } from "@/components/ui/button";

interface ConsentModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onDecline: () => void;
  isLoading?: boolean;
}

export function ConsentModal({ isOpen, onAllow, onDecline, isLoading }: ConsentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-canvas dark:bg-dark-canvas border border-border dark:border-dark-border rounded-sm max-w-lg w-full p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-h2 font-mono">Scan Your Inbox?</h2>
          <button
            onClick={onDecline}
            className="text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-6">
          We'll check which services you use by reading email senders. Scanning runs 100% in your
          browser — we never store your email data.
        </p>

        {/* What We Read */}
        <div className="mb-6">
          <h3 className="text-sm font-mono font-semibold mb-3">What we read</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-success flex-shrink-0">✓</span>
              <span>Email sender domains only</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success flex-shrink-0">✓</span>
              <span>Message dates & counts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-error flex-shrink-0">✗</span>
              <span>Message content (never)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-error flex-shrink-0">✗</span>
              <span>Attachments (never)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-error flex-shrink-0">✗</span>
              <span>Full email addresses (never)</span>
            </li>
          </ul>
        </div>

        {/* Where It Happens */}
        <div className="mb-8">
          <h3 className="text-sm font-mono font-semibold mb-3">Where it happens</h3>
          <ul className="space-y-2 text-sm text-text-secondary dark:text-dark-text-secondary">
            <li>• Scanning runs 100% in your browser</li>
            <li>• We never store your email data</li>
            <li>• Results stay on your device</li>
            <li>• Revoke access anytime in Gmail/Outlook settings</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={onAllow}
            disabled={isLoading}
            className="flex-1 h-12 rounded-sm bg-accent px-6 font-mono font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
          >
            {isLoading ? "Connecting..." : "Allow Gmail Access"}
          </Button>
          <Button
            onClick={onDecline}
            variant="outline"
            className="flex-1 h-12 rounded-sm border-2 border-border dark:border-dark-border px-6 font-mono font-semibold hover:bg-border/10"
          >
            No, I'll select manually
          </Button>
        </div>

        {/* Footer */}
        <p className="text-xs text-text-secondary dark:text-dark-text-secondary text-center mt-6">
          OAuth scopes: gmail.readonly • Revoke anytime
        </p>
      </div>
    </div>
  );
}

export default ConsentModal;
