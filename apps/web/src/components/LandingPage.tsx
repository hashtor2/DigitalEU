import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-canvas text-text-primary dark:bg-dark-canvas dark:text-dark-text-primary flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="flex flex-1 items-center justify-center px-4 py-24 sm:py-32">
        <div className="w-full max-w-2xl text-center">
          <h1 className="mb-6 text-h1 font-mono">
            Reclaim Your Digital Life
          </h1>
          <p className="mb-12 text-lg text-text-secondary dark:text-dark-text-secondary">
            Move away from Big Tech to trusted European tools.
            Privacy first, zero tracking, your data stays yours.
          </p>

          {/* Dual CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              onClick={() => navigate("/selector")}
              className="h-12 rounded-sm bg-accent px-8 font-mono font-semibold text-white hover:bg-accent-hover"
            >
              Check Services
            </Button>
            <Button
              onClick={() => navigate("/scanner")}
              variant="outline"
              className="h-12 rounded-sm border-2 border-accent px-8 font-mono font-semibold text-accent hover:bg-accent/10"
            >
              Scan Inbox
            </Button>
          </div>

          {/* Trust Signals */}
          <div className="mt-12 flex flex-col gap-3 text-sm text-text-secondary dark:text-dark-text-secondary sm:flex-row sm:justify-center">
            <span>✓ Zero-knowledge</span>
            <span className="hidden sm:inline">•</span>
            <span>🇪🇺 EU-first</span>
            <span className="hidden sm:inline">•</span>
            <span>No tracking</span>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default LandingPage;
