import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error" | "expired">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get("token");
        if (!token) {
          setStatus("error");
          setMessage("No verification token provided");
          return;
        }

        if (!supabase) {
          setStatus("error");
          setMessage("Verification not available at this time");
          return;
        }

        // Query email_verifications table
        const { data: verificationRecord, error: queryError } = await supabase
          .from("email_verifications")
          .select("*")
          .eq("token", token)
          .single();

        if (queryError || !verificationRecord) {
          setStatus("error");
          setMessage("Verification token not found or already used");
          return;
        }

        // Check if token has expired
        const expiresAt = new Date(verificationRecord.expires_at);
        if (expiresAt < new Date()) {
          setStatus("expired");
          setMessage("Verification link has expired. Please request a new one.");
          return;
        }

        // Mark as verified
        const { error: updateError } = await supabase
          .from("email_verifications")
          .update({ verified_at: new Date().toISOString() })
          .eq("token", token);

        if (updateError) {
          throw updateError;
        }

        // Update user_scanner_metadata if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await supabase
            .from("user_scanner_metadata")
            .update({
              gmail_verified: true,
              verified_at: new Date().toISOString(),
            })
            .eq("user_id", session.user.id);
        }

        setStatus("success");
        setMessage("Email verified successfully!");

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate("/scanner");
        }, 2000);
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setMessage("An error occurred during verification. Please try again.");
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-canvas dark:bg-dark-canvas flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          {status === "loading" && (
            <div className="text-center">
              <div className="mb-4 inline-block animate-spin rounded-full h-12 w-12 border-2 border-accent border-t-transparent"></div>
              <h1 className="text-xl font-mono font-bold text-text-primary dark:text-dark-text-primary mb-2">
                Verifying your email...
              </h1>
              <p className="text-text-secondary dark:text-dark-text-secondary">
                This should only take a moment.
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="mb-4 h-12 w-12 inline-block bg-accent rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-xl font-mono font-bold text-text-primary dark:text-dark-text-primary mb-2">
                {message}
              </h1>
              <p className="text-text-secondary dark:text-dark-text-secondary">
                Redirecting you to the scanner...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <div className="mb-4 h-12 w-12 inline-block bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-xl font-mono font-bold text-text-primary dark:text-dark-text-primary mb-2">
                Verification Failed
              </h1>
              <p className="text-text-secondary dark:text-dark-text-secondary mb-6">
                {message}
              </p>
              <button
                onClick={() => navigate("/scanner")}
                className="px-4 py-2 bg-accent text-white rounded-sm hover:bg-accent-hover"
              >
                Back to Scanner
              </button>
            </div>
          )}

          {status === "expired" && (
            <div className="text-center">
              <div className="mb-4 h-12 w-12 inline-block bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-xl font-mono font-bold text-text-primary dark:text-dark-text-primary mb-2">
                Link Expired
              </h1>
              <p className="text-text-secondary dark:text-dark-text-secondary mb-6">
                {message}
              </p>
              <button
                onClick={() => navigate("/scanner")}
                className="px-4 py-2 bg-accent text-white rounded-sm hover:bg-accent-hover"
              >
                Request New Link
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}