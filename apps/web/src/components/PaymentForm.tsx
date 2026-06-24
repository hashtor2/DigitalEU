import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PaymentFormProps {
  onSubmit?: () => void;
  isLoading?: boolean;
}

export function PaymentForm({ onSubmit, isLoading }: PaymentFormProps) {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [subscribeNews, setSubscribeNews] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return;
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-h2 font-mono mb-2">Upgrade to Premium</h1>
        <p className="text-text-secondary dark:text-dark-text-secondary">
          Get setup guide + migration checklist + email support
        </p>
      </div>

      {/* Price */}
      <div className="p-6 bg-accent/5 dark:bg-accent/10 border border-accent rounded-sm">
        <p className="text-sm font-mono font-semibold">
          One-time payment: <span className="text-lg">€29</span>
        </p>
      </div>

      {/* Stripe Placeholder */}
      <div className="p-6 border-2 border-dashed border-border dark:border-dark-border rounded-sm bg-border/5 dark:bg-dark-border/5">
        <p className="text-center text-sm text-text-secondary dark:text-dark-text-secondary mb-4">
          Stripe Payment Element
          <br />
          (Card, iDEAL, EU payments)
        </p>
        <div className="space-y-3">
          <div className="h-10 bg-border dark:bg-dark-border rounded-sm animate-pulse" />
          <div className="h-10 bg-border dark:bg-dark-border rounded-sm animate-pulse" />
        </div>
        <p className="text-xs text-text-secondary dark:text-dark-text-secondary text-center mt-4">
          🔒 Secured by Stripe
        </p>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="h-5 w-5 accent-accent"
            required
          />
          <span className="text-sm">
            I agree to the{" "}
            <Link to="/terms" className="font-medium text-accent hover:underline">
              Terms & Privacy Policy
            </Link>
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={subscribeNews}
            onChange={(e) => setSubscribeNews(e.target.checked)}
            className="h-5 w-5 accent-accent"
          />
          <span className="text-sm text-text-secondary dark:text-dark-text-secondary">
            Send me tips & migration updates (optional)
          </span>
        </label>
      </div>

      {/* Submit */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="submit"
          disabled={!agreeTerms || isLoading}
          className="flex-1 h-12 rounded-sm bg-accent px-8 font-mono font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Pay €29"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 h-12 rounded-sm border-2 border-border dark:border-dark-border px-8 font-mono font-semibold hover:bg-border/10"
        >
          Cancel
        </Button>
      </div>

      {/* Footer */}
      <p className="text-xs text-text-secondary dark:text-dark-text-secondary text-center">
        🇪🇺 EU payments only • Zero-knowledge processing • Refund available within 14 days
      </p>
    </form>
  );
}

export default PaymentForm;
