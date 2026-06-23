import { Button } from "@/components/ui/button";
import { getProtonAffiliateUrl, trackAffiliateClick } from "@/lib/affiliateLinks";

interface ScannerOnboardingProps {
  onPaymentClick: () => void;
}

export function ScannerOnboarding({ onPaymentClick }: ScannerOnboardingProps) {
  const protonUrl = getProtonAffiliateUrl();

  const handleProtonClick = () => {
    trackAffiliateClick("proton");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Hero section */}
      <div className="max-w-2xl text-center mb-12">
        <div className="mb-4 inline-block px-3 py-1 rounded-sm border border-accent text-accent text-xs font-semibold">
          Closed Beta
        </div>
        <h1 className="text-h1 font-mono mb-6 text-text-primary dark:text-dark-text-primary leading-tight">
          See your digital footprint across 200+ services
        </h1>
        <p className="text-lg text-text-secondary dark:text-dark-text-secondary mb-8 leading-relaxed font-semibold">
          Scan your inbox to discover which services hold your data. Get a privacy score and find EU alternatives.
        </p>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-text-secondary dark:text-dark-text-secondary mb-10">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="font-medium">100% private scan</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="font-medium">On-device processing</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-warning" />
            <span className="font-medium">No email stored</span>
          </span>
        </div>
      </div>

      {/* Dual CTA */}
      <div className="max-w-md w-full flex flex-col gap-3">
        <a
          href={protonUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleProtonClick}
        >
          <Button className="w-full bg-white dark:bg-dark-canvas border-2 border-accent text-accent hover:bg-accent/5 rounded-sm font-semibold py-6">
            Scan with Proton (Free)
          </Button>
        </a>
        <Button
          onClick={onPaymentClick}
          className="w-full bg-accent text-white hover:bg-accent-hover rounded-sm font-semibold py-6"
        >
          €5 Instant Unlock
        </Button>
      </div>

      {/* Privacy note */}
      <p className="max-w-md text-center text-xs text-text-secondary dark:text-dark-text-secondary mt-8">
        Your inbox is never uploaded to our servers. We use OAuth to check which services have sent you emails—nothing else.
      </p>
    </div>
  );
}