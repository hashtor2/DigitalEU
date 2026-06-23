import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NotApprovedErrorProps {
  failedEmail?: string;
  onRequestAccess?: (email: string) => void;
  onTryDifferentAccount?: () => void;
  onOpenLiveChat?: () => void;
}

export function NotApprovedError({
  failedEmail,
  onRequestAccess,
  onTryDifferentAccount,
  onOpenLiveChat,
}: NotApprovedErrorProps) {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestEmail, setRequestEmail] = useState(failedEmail || "");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onRequestAccess?.(requestEmail);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 500);
  };

  if (submitted) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-h2 font-mono mb-2">Request sent</h1>
          <p className="text-text-secondary dark:text-dark-text-secondary">
            Thanks for signing up. We'll review and email you within 24 hours.
          </p>
        </div>

        <div className="p-6 bg-accent/5 dark:bg-accent/10 border border-accent rounded-sm">
          <p className="text-sm text-center">
            <span className="font-mono font-semibold text-accent">✓</span>
            <br />
            <span className="text-text-secondary dark:text-dark-text-secondary">
              Check your inbox for updates
            </span>
          </p>
        </div>

        <Button
          onClick={onTryDifferentAccount}
          className="w-full h-12 rounded-sm bg-accent px-8 font-mono font-semibold text-white hover:bg-accent-hover"
        >
          Try a different Google account
        </Button>
      </div>
    );
  }

  if (showRequestForm) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-h2 font-mono mb-2">Request early access</h1>
          <p className="text-text-secondary dark:text-dark-text-secondary">
            Tell us which email you'd like to use for the inbox scanner.
          </p>
        </div>

        <form onSubmit={handleSubmitRequest} className="space-y-4">
          <div>
            <label
              htmlFor="request-email"
              className="block text-sm font-mono font-semibold mb-2"
            >
              Email address
            </label>
            <input
              id="request-email"
              type="email"
              value={requestEmail}
              onChange={(e) => setRequestEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-sm border border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas text-foreground dark:text-dark-foreground placeholder-text-secondary dark:placeholder-dark-text-secondary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-sm bg-accent px-8 font-mono font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send request"}
          </Button>
        </form>

        <Button
          onClick={() => setShowRequestForm(false)}
          variant="outline"
          className="w-full h-12 rounded-sm border-2 border-border dark:border-dark-border px-8 font-mono font-semibold hover:bg-border/10"
        >
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-h2 font-mono mb-2">Not approved yet</h1>
        <p className="text-text-secondary dark:text-dark-text-secondary">
          This email isn't on the early access list. You can request access or
          chat with us for more info.
        </p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={() => setShowRequestForm(true)}
          className="w-full h-12 rounded-sm bg-accent px-8 font-mono font-semibold text-white hover:bg-accent-hover"
        >
          Request access for this email
        </Button>

        <Button
          onClick={onTryDifferentAccount}
          variant="outline"
          className="w-full h-12 rounded-sm border-2 border-border dark:border-dark-border px-8 font-mono font-semibold hover:bg-border/10"
        >
          Try a different Google account
        </Button>

        <Button
          onClick={onOpenLiveChat}
          variant="outline"
          className="w-full h-12 rounded-sm border-2 border-border dark:border-dark-border px-8 font-mono font-semibold hover:bg-border/10"
        >
          Chat with us
        </Button>
      </div>
    </div>
  );
}

export default NotApprovedError;