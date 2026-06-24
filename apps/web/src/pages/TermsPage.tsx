import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function TermsPage() {
  return (
    <div className="min-h-screen bg-canvas text-text-primary dark:bg-dark-canvas dark:text-dark-text-primary flex flex-col">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-h1 font-mono mb-4">Terms of Service</h1>
        <p className="text-text-secondary dark:text-dark-text-secondary mb-8">
          Last updated: 2026-06-24
        </p>

        <div className="space-y-8 text-sm leading-7 text-text-primary dark:text-dark-text-primary">
          <section>
            <h2 className="text-h3 font-mono mb-2">1. Scope</h2>
            <p>
              These terms apply to your use of digitaleu.me and related tools, including the scanner and migration guidance features.
              By using the service, you agree to these terms.
            </p>
          </section>

          <section>
            <h2 className="text-h3 font-mono mb-2">2. Service Description</h2>
            <p>
              digitaleu.me provides educational guidance, catalog comparisons, and migration support for European alternatives to major technology platforms.
              Recommendations are editorial and may include affiliate links.
            </p>
          </section>

          <section>
            <h2 className="text-h3 font-mono mb-2">3. Account and Security</h2>
            <p>
              You are responsible for maintaining the security of your account credentials.
              You must not attempt to access systems or data that you are not authorized to access.
            </p>
          </section>

          <section>
            <h2 className="text-h3 font-mono mb-2">4. Payments and Refunds</h2>
            <p>
              Paid features are processed through Stripe.
              Prices, taxes, and payment methods are shown during checkout.
              If you have a billing issue or refund request, contact support at info@digitaleu.me.
            </p>
          </section>

          <section>
            <h2 className="text-h3 font-mono mb-2">5. Acceptable Use</h2>
            <p>
              You agree not to misuse the service, interfere with operations, or use the platform for unlawful activity.
              We may suspend access for abuse, fraud, or security threats.
            </p>
          </section>

          <section>
            <h2 className="text-h3 font-mono mb-2">6. No Professional Advice</h2>
            <p>
              Content is for informational purposes and does not constitute legal, security, or financial advice.
              You are responsible for your own migration and risk decisions.
            </p>
          </section>

          <section>
            <h2 className="text-h3 font-mono mb-2">7. Changes to Terms</h2>
            <p>
              We may update these terms from time to time.
              Continued use after updates means you accept the updated version.
            </p>
          </section>

          <section>
            <h2 className="text-h3 font-mono mb-2">8. Contact</h2>
            <p>
              Questions about these terms: info@digitaleu.me.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
