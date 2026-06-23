import { useState } from "react";
import { Button } from "@/components/ui/button";

interface EmailVerificationStepProps {
  email: string;
  onResend: () => void;
}

export function EmailVerificationStep({ email, onResend }: EmailVerificationStepProps) {
  const [resending, setResending] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleResend = async () => {
    setResending(true);
    setResendDisabled(true);
    setCountdown(60);

    try {
      await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      onResend();

      // Countdown timer
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Resend error:", err);
      setResendDisabled(false);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-12 text-center">
      {/* Spinner */}
      <div className="mb-6 inline-block animate-spin rounded-full h-12 w-12 border-2 border-accent border-t-transparent"></div>

      <h1 className="text-2xl font-mono font-bold text-text-primary dark:text-dark-text-primary mb-4">
        Check your email
      </h1>

      <p className="text-text-secondary dark:text-dark-text-secondary mb-4">
        We sent a verification link to <strong>{email}</strong>
      </p>

      <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-8">
        Click the link in your email to verify and unlock the scanner. Link expires in 24 hours.
      </p>

      {/* Resend button */}
      <Button
        onClick={handleResend}
        disabled={resendDisabled || resending}
        variant="outline"
        className="border-border dark:border-dark-border"
      >
        {resending ? "Sending..." : resendDisabled ? `Resend in ${countdown}s` : "Resend email"}
      </Button>

      <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-6">
        Didn't get the email? Check your spam folder or try resending.
      </p>
    </div>
  );
}