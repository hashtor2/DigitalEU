import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ScannerPaymentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function ScannerPaymentModal({ onClose, onSuccess }: ScannerPaymentModalProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !agreedToTerms) return;

    setLoading(true);
    setError(null);

    try {
      // Call create-payment-intent endpoint
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          amount: 500, // €5 in cents
          currency: "eur",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret } = await response.json();

      // Confirm the payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: { email },
        },
      });

      if (confirmError) {
        setError(confirmError.message || "Payment failed");
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        // Payment succeeded - show success state and wait for email verification
        onSuccess();
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-dark-canvas max-w-md w-full rounded-lg shadow-xl">
        {/* Header */}
        <div className="border-b border-border dark:border-dark-border p-6 flex items-center justify-between">
          <h2 className="text-lg font-mono font-bold text-text-primary dark:text-dark-text-primary">
            Unlock Scanner
          </h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Price */}
          <div className="mb-6">
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">One-time payment</p>
            <p className="text-3xl font-mono font-bold text-accent">€5.00</p>
          </div>

          {/* Email input */}
          <div>
            <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-2">
              Email address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              className="bg-canvas dark:bg-dark-canvas border-border dark:border-dark-border"
            />
          </div>

          {/* Stripe card element */}
          <div>
            <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-2">
              Card details
            </label>
            <div className="p-3 border border-border dark:border-dark-border rounded-sm bg-canvas dark:bg-dark-canvas">
              <CardElement
                options={{
                  style: {
                    base: {
                      color: "#2a2a2a",
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "14px",
                      "::placeholder": {
                        color: "#999",
                      },
                    },
                    invalid: {
                      color: "#fa755a",
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-sm text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Terms checkbox */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1"
              disabled={loading}
            />
            <span className="text-xs text-text-secondary dark:text-dark-text-secondary">
              I agree to the terms of service and privacy policy
            </span>
          </label>

          {/* Newsletter checkbox */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
              className="mt-1"
              disabled={loading}
            />
            <span className="text-xs text-text-secondary dark:text-dark-text-secondary">
              Subscribe to updates about EU tech alternatives (optional)
            </span>
          </label>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              disabled={loading}
              variant="outline"
              className="flex-1 border-border dark:border-dark-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!stripe || loading || !agreedToTerms}
              className="flex-1 bg-accent text-white hover:bg-accent-hover rounded-sm"
            >
              {loading ? "Processing..." : "Pay €5"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}