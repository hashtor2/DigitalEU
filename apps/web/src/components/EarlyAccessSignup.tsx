import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * Tidlig-tilgang-skjema for den automatiske innboksskanneren (Gmail-beta).
 *
 * Flyt (manuell MVP, jf. designplan):
 *   1. Bruker melder seg på her  → vi skriver en `pending`-rad i `early_access`.
 *   2. Vi vurderer (invite-first) → sender Stripe-lenke (€5) på e-post.
 *   3. Betaling → status `paid`   → vi setter `active` og sender skanner-lenke.
 *
 * Tillit synlig: Gmail-only valideres her, og vi sier eksplisitt at vi kun
 * oppdager *hvilke* tjenester som har kontaktet brukeren — aldri innholdet.
 */

// Gmail-only for beta. Godtar gmail.com og googlemail.com.
const GMAIL_RE = /^[^@\s]+@(gmail|googlemail)\.com$/i;

type Status = "idle" | "submitting" | "success" | "error";

interface EarlyAccessSignupProps {
  className?: string;
}

export function EarlyAccessSignup({ className = "" }: EarlyAccessSignupProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  // Vis valideringsfeil først etter forsøk på innsending, ikke mens man skriver.
  const [touched, setTouched] = useState(false);

  const isGmail = GMAIL_RE.test(email.trim());
  const showInvalid = touched && email.trim().length > 0 && !isGmail;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setErrorMessage("");

    if (!isGmail) {
      setErrorMessage(
        "Early access is Gmail-only for now — other providers are next on the list.",
      );
      setStatus("error");
      return;
    }
    if (!consent) {
      setErrorMessage("Please tick the box so we can email you about access.");
      setStatus("error");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/early-access-signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim().toLowerCase(), consent }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 409) {
          // Allerede på listen — behandle som suksess, ikke som feil.
          setStatus("success");
          return;
        }
        setErrorMessage(
          data.error || "Something went wrong. Please try again.",
        );
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch (err) {
      console.error("Early access signup error:", err);
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const containerClass =
    "w-full max-w-xl mx-auto rounded-sm border border-border dark:border-dark-border " +
    "bg-canvas dark:bg-dark-canvas p-6 text-left shadow-sm";

  // ── Suksess-tilstand ──────────────────────────────────────────────
  if (status === "success") {
    return (
      <div className={`${containerClass} ${className}`} role="status" aria-live="polite">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
          ✦ You're on the list
        </p>
        <h3 className="mb-2 font-mono text-xl font-bold text-text-primary dark:text-dark-text-primary">
          Check your inbox soon
        </h3>
        <p className="text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
          We'll email you a private link to unlock your scan (€5 one-time).
          Spots are limited, so we onboard in small batches.
        </p>
      </div>
    );
  }

  // ── Skjema-tilstand (idle / submitting / error) ───────────────────
  const submitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} className={`${containerClass} ${className}`} noValidate>
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
        ✦ Early access · Gmail beta
      </p>
      <h3 className="mb-1 font-mono text-xl font-bold text-text-primary dark:text-dark-text-primary">
        Auto-scan your inbox
      </h3>
      <p className="mb-5 text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
        Skip the ticking. We detect which services emailed you — never the
        content. <span className="font-semibold text-text-primary dark:text-dark-text-primary">€5 one-time · limited spots.</span>
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="early-access-email" className="sr-only">
            Your Gmail address
          </label>
          <Input
            id="early-access-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            disabled={submitting}
            aria-invalid={showInvalid}
            aria-describedby={showInvalid ? "early-access-hint" : undefined}
            className={`bg-canvas dark:bg-dark-canvas text-text-primary dark:text-dark-text-primary placeholder:text-text-secondary ${
              showInvalid
                ? "border-warning focus:border-warning"
                : "border-border dark:border-dark-border focus:border-accent"
            }`}
          />
        </div>
        <Button
          type="submit"
          disabled={submitting}
          size="lg"
          className="bg-accent font-mono font-semibold text-white hover:bg-accent-hover disabled:opacity-50 rounded-sm sm:w-auto"
        >
          {submitting ? "Joining…" : "Join →"}
        </Button>
      </div>

      {showInvalid && (
        <p id="early-access-hint" className="mt-2 text-xs text-warning">
          Early access is Gmail-only for now — other providers are next on the list.
        </p>
      )}

      <label className="mt-4 flex cursor-pointer items-start gap-2 text-xs text-text-secondary dark:text-dark-text-secondary">
        <Checkbox
          checked={consent}
          onCheckedChange={(v) => setConsent(v === true)}
          disabled={submitting}
          className="mt-0.5"
          aria-label="Email me about early access"
        />
        <span>
          Email me about early access. We store only your address and delete it
          if you ask — nothing else.
        </span>
      </label>

      {status === "error" && (
        <p className="mt-3 text-sm text-warning" role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
