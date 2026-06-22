import React, { useState } from "react";

interface NewsletterSignupProps {
  onSuccess?: () => void;
  showName?: boolean;
  compact?: boolean;
  className?: string;
}

export function NewsletterSignup({
  onSuccess,
  showName = true,
  compact = false,
  className = "",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/newsletter-subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            name: showName ? name.trim() : undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setErrorMessage("You're already subscribed to our newsletter!");
        } else {
          setErrorMessage(
            data.error || "Failed to subscribe. Please try again."
          );
        }
        setStatus("error");
        return;
      }

      setStatus("success");
      setEmail("");
      setName("");

      if (onSuccess) {
        onSuccess();
      }

      // Auto-reset success message after 5 seconds
      setTimeout(() => {
        setStatus("idle");
      }, 5000);
    } catch (error) {
      console.error("Newsletter signup error:", error);
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col gap-3 ${className}`}
      >
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={loading}
            className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded text-sm focus:outline-none focus:border-slate-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "..." : "Subscribe"}
          </button>
        </div>
        {status === "success" && (
          <p className="text-green-400 text-sm">
            ✓ Check your inbox for a welcome email
          </p>
        )}
        {status === "error" && (
          <p className="text-red-400 text-sm">{errorMessage}</p>
        )}
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full max-w-md mx-auto space-y-4 p-6 bg-slate-800 border border-slate-700 rounded-lg ${className}`}
    >
      <div>
        <h3 className="text-lg font-bold text-slate-100 mb-2">
          Get Daily EU Tech News
        </h3>
        <p className="text-sm text-slate-400">
          Subscribe to our newsletter for curated European tech privacy updates.
        </p>
      </div>

      {showName && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
            Name (optional)
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            disabled={loading}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 rounded font-sans focus:outline-none focus:border-blue-500 disabled:opacity-50 transition"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={loading}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 rounded font-sans focus:outline-none focus:border-blue-500 disabled:opacity-50 transition"
        />
      </div>

      {status === "success" && (
        <div className="p-3 bg-green-900 border border-green-700 text-green-200 rounded text-sm">
          ✓ Successfully subscribed! Check your inbox for a welcome email.
        </div>
      )}

      {status === "error" && (
        <div className="p-3 bg-red-900 border border-red-700 text-red-200 rounded text-sm">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || status === "success"}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium rounded transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Subscribing..." : "Subscribe to Newsletter"}
      </button>

      <p className="text-xs text-slate-500 text-center">
        We respect your privacy. Unsubscribe anytime.
      </p>
    </form>
  );
}
