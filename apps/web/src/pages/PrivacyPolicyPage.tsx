import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-canvas text-text-primary dark:bg-dark-canvas dark:text-dark-text-primary flex flex-col">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-h1 font-mono mb-4">Privacy Policy</h1>
        <p className="text-text-secondary dark:text-dark-text-secondary mb-8">
          Last updated: 2026-06-24
        </p>

        <div className="space-y-8 text-sm leading-7 text-text-primary dark:text-dark-text-primary">
          <section>
            <h2 className="text-h3 font-mono mb-2">1. Principles</h2>
            <p>
              digitaleu.me is built with privacy-by-design. We minimize data collection, avoid hidden tracking, and keep users informed about what is processed and why.
            </p>
          </section>

          <section>
            <h2 className="text-h3 font-mono mb-2">2. What We Process</h2>
            <p>
              Depending on your use, we may process contact details, account metadata, payment status, and scanner results required to provide requested features.
              For scanner functionality, we process only the minimum data needed for service detection and migration support.
            </p>
          </section>

          <section>
            <h2 className="text-h3 font-mono mb-2">3. Legal Bases</h2>
            <p>
              We process data under GDPR legal bases including consent, performance of a contract, and legitimate interests where appropriate.
              You may withdraw consent where consent is the legal basis.
            </p>
          </section>

          <section>
            <h2 className="text-h3 font-mono mb-2">4. Payments</h2>
            <p>
              Payments are handled by Stripe.
              We do not store full payment card numbers on our systems.
              Stripe processes payment data under its own terms and privacy policy.
            </p>
          </section>

          <section>
            <h2 className="text-h3 font-mono mb-2">5. Retention</h2>
            <p>
              We retain personal data only as long as needed for service delivery, legal obligations, and security.
              We aim to keep retention periods short and proportionate.
            </p>
          </section>

          <section>
            <h2 className="text-h3 font-mono mb-2">6. Your Rights</h2>
            <p>
              You may request access, correction, deletion, restriction, portability, and objection rights under GDPR.
              Contact us to exercise your rights.
            </p>
          </section>

          <section>
            <h2 className="text-h3 font-mono mb-2">7. International Transfers</h2>
            <p>
              We prefer European infrastructure and evaluate transfer risks continuously.
              Where transfers occur, we apply appropriate safeguards.
            </p>
          </section>

          <section>
            <h2 className="text-h3 font-mono mb-2">8. Contact</h2>
            <p>
              Privacy requests and questions: info@digitaleu.me.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
