import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

interface ReportProps {
  selectedServices?: string[];
  breachStatus?: "exposed" | "safe";
  breachCount?: number;
}

export function ReportPage({ selectedServices = [], breachStatus = "safe", breachCount = 0 }: ReportProps) {
  const navigate = useNavigate();

  const isExposed = breachStatus === "exposed";

  return (
    <div className="min-h-screen bg-canvas text-text-primary dark:bg-dark-canvas dark:text-dark-text-primary flex flex-col">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
        {/* Report Title */}
        <div className="mb-10">
          <h1 className="text-h1 font-mono mb-2">Your Privacy Report</h1>
          <p className="text-text-secondary dark:text-dark-text-secondary">
            Generated just now
          </p>
        </div>

        {/* Breach Alert */}
        <div className={`mb-8 p-6 rounded-sm border-2 ${
          isExposed
            ? "border-error bg-error/5 dark:bg-error/10"
            : "border-success bg-success/5 dark:bg-success/10"
        }`}>
          <div className="flex gap-4">
            <div className="text-2xl flex-shrink-0">
              {isExposed ? "🔴" : "🟢"}
            </div>
            <div>
              <h2 className={`font-mono font-semibold mb-2 ${
                isExposed ? "text-error" : "text-success"
              }`}>
                {isExposed
                  ? `Your email is IN ${breachCount} known breaches`
                  : "Your email is not in known breaches"}
              </h2>
              {isExposed && (
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-3">
                  Exposed in: LinkedIn (2021), Adobe (2013), Yahoo (2014)
                </p>
              )}
              <p className="text-sm">
                {isExposed
                  ? "→ Change your password immediately and enable 2FA."
                  : "→ Your email appears safe. Keep using strong, unique passwords."}
              </p>
            </div>
          </div>
        </div>

        {/* Services Detection */}
        <div className="mb-8 p-6 border border-border dark:border-dark-border rounded-sm">
          <h2 className="font-mono font-semibold mb-4">
            Services You Use: {selectedServices.length} detected
          </h2>
          <div className="space-y-3">
            {selectedServices.length > 0 ? (
              selectedServices.map((service) => (
                <div key={service} className="flex items-center justify-between pb-3 border-b border-border dark:border-dark-border">
                  <span className="font-medium">{service}</span>
                  <span className="text-sm text-accent">→ See alternatives</span>
                </div>
              ))
            ) : (
              <p className="text-text-secondary dark:text-dark-text-secondary">
                No services selected yet.
              </p>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="mb-8 p-6 border border-border dark:border-dark-border rounded-sm">
          <h2 className="font-mono font-semibold mb-4">Next Steps</h2>
          <ol className="space-y-2 text-sm">
            <li>1. Create new email at Tutanota or Tuta Mail (🇩🇪)</li>
            <li>2. Migrate your important data and settings</li>
            <li>3. Deactivate old accounts (use our checklist)</li>
          </ol>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            onClick={() => navigate("/directory")}
            className="h-12 rounded-sm bg-accent px-8 font-mono font-semibold text-white hover:bg-accent-hover"
          >
            View Full Directory
          </Button>
          <Button
            variant="outline"
            className="h-12 rounded-sm border-2 border-accent px-8 font-mono font-semibold text-accent hover:bg-accent/10"
          >
            Save Report as PDF
          </Button>
        </div>

        {/* Optional: Premium Upsell */}
        <div className="mt-12 p-6 bg-accent/5 dark:bg-accent/10 border border-accent rounded-sm text-center">
          <p className="text-sm mb-4">
            Want help with the migration? Get our premium setup guide and checklist.
          </p>
          <Button className="bg-accent text-white hover:bg-accent-hover">
            Upgrade to Premium — €29
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ReportPage;
