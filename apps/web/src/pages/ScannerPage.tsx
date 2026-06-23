import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { ScannerOnboarding } from "@/components/ScannerOnboarding";
import { ScannerPaymentModal } from "@/components/ScannerPaymentModal";
import { ScannerDashboard } from "@/components/ScannerDashboard";

export function ScannerPage() {
  const [user, setUser] = useState<any>(null);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!supabase) {
          setLoading(false);
          return;
        }
        // Check if user is authenticated
        const { data } = await supabase.auth.getSession();
        const session = data?.session;
        setUser(session?.user ?? null);

        if (session?.user) {
          // Check if email is verified in user_scanner_metadata
          const { data: metadata } = await supabase
            .from("user_scanner_metadata")
            .select("gmail_verified")
            .eq("user_id", session.user.id)
            .single();

          setVerified(metadata?.gmail_verified ?? false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas dark:bg-dark-canvas flex items-center justify-center">
        <div className="text-text-primary dark:text-dark-text-primary">Loading...</div>
      </div>
    );
  }

  // Guest mode or unauthenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-canvas dark:bg-dark-canvas flex flex-col">
        <Header />
        <main className="flex-1">
          <ScannerOnboarding onPaymentClick={() => setShowPaymentModal(true)} />
        </main>
        <Footer />
        {showPaymentModal && (
          <ScannerPaymentModal
            onClose={() => setShowPaymentModal(false)}
            onSuccess={() => {
              setShowPaymentModal(false);
              // Redirect to verification page or show success state
            }}
          />
        )}
      </div>
    );
  }

  // Authenticated but not verified
  if (!verified) {
    return (
      <div className="min-h-screen bg-canvas dark:bg-dark-canvas flex flex-col">
        <Header />
        <main className="flex-1">
          <ScannerOnboarding onPaymentClick={() => setShowPaymentModal(true)} />
        </main>
        <Footer />
        {showPaymentModal && (
          <ScannerPaymentModal
            onClose={() => setShowPaymentModal(false)}
            onSuccess={() => {
              setShowPaymentModal(false);
            }}
          />
        )}
      </div>
    );
  }

  // Authenticated and verified - show dashboard
  return (
    <div className="min-h-screen bg-canvas dark:bg-dark-canvas flex flex-col">
      <Header />
      <main className="flex-1">
        <ScannerDashboard userId={user.id} />
      </main>
      <Footer />
    </div>
  );
}