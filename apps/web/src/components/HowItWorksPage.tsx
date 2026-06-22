import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function HowItWorksPage() {
  const steps = [
    {
      num: 1,
      title: "You Tell Us (or We Scan)",
      details: [
        "Manual: Check boxes for services you use.",
        "OR Scan: Give OAuth → we read *only* metadata.",
        "✓ Your password never leaves your device.",
        "✓ We see sender domains only, not content.",
      ],
    },
    {
      num: 2,
      title: "We Check for Breaches",
      details: [
        "Your email is cross-checked against Have I Been Pwned (HIBP) — a database of known leaks.",
        "✓ We don't store your email.",
        "✓ Zero-knowledge: we can't see the result.",
      ],
    },
    {
      num: 3,
      title: "You Get a Report",
      details: [
        "Your report shows: breach status, services detected, and verified EU alternatives for each.",
        "✓ Data lives only on your device (unless you save).",
        "✓ Guest mode: no account needed.",
      ],
    },
    {
      num: 4,
      title: "Optional: Sign Up & Get a Dashboard",
      details: [
        "Save your report, build a migration checklist, track your progress, get email updates.",
        "✓ Your data is encrypted on our servers (we can't read it).",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-canvas text-text-primary dark:bg-dark-canvas dark:text-dark-text-primary flex flex-col">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-h1 font-mono mb-4">How digitaleu.me Works</h1>
        <p className="text-text-secondary dark:text-dark-text-secondary mb-12">
          We believe in transparency. Here's exactly what happens when you use our service — and what we can and cannot see.
        </p>

        <div className="space-y-8">
          {steps.map((step) => (
            <div key={step.num} className="p-6 border border-border dark:border-dark-border rounded-sm">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-sm bg-accent text-white font-mono font-semibold">
                    {step.num}
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-h3 font-mono mb-3">{step.title}</h2>
                  <ul className="space-y-2 text-sm">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="text-text-secondary dark:text-dark-text-secondary leading-relaxed">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Extra Info */}
        <div className="mt-12 p-6 bg-accent/5 dark:bg-accent/10 border border-accent rounded-sm">
          <h2 className="font-mono font-semibold mb-3">Your Privacy Matters</h2>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-3">
            We built digitaleu.me because we believe your digital privacy is not optional. We practice what we preach:
            zero-knowledge architecture, EU data residency, and no tracking.
          </p>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
            Read our full security and privacy policy in the footer. Or check our code on GitHub for complete transparency.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default HowItWorksPage;
