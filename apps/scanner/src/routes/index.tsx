export default function IndexPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-4xl font-mono font-bold text-[#1a2332] dark:text-[#f5f1ea]">Your digital footprint, mapped.</h2>
        <p className="text-lg text-[#1a2332]/70 dark:text-[#a89d96]">
          Connect your email inbox and discover which US digital services you use.
          We'll show you privacy-first, European alternatives—and how to make the switch.
        </p>
      </section>

      <div className="rounded-lg border border-[#1a2332]/10 dark:border-[#3a3530] bg-white dark:bg-[#2a251f] p-8">
        <h3 className="mb-4 text-xl font-mono font-semibold text-[#1a2332] dark:text-[#f5f1ea]">Get started</h3>
        <p className="mb-6 text-[#1a2332]/70 dark:text-[#a89d96]">
          Sign in with email or Google to scan your inbox. We scan metadata only—sender, subject line.
          Your email content never leaves your device.
        </p>
        <a
          href="/auth/signin"
          className="inline-block rounded bg-[#c17a5c] dark:bg-[#a86650] px-6 py-2 font-mono font-semibold text-[#f9f7f2] hover:bg-[#c17a5c]/90 dark:hover:bg-[#a86650]/90 transition"
        >
          Sign in
        </a>
      </div>

      <section className="space-y-4">
        <h3 className="text-2xl font-mono font-semibold text-[#1a2332] dark:text-[#f5f1ea]">How it works</h3>
        <ol className="space-y-3 text-[#1a2332]/70 dark:text-[#a89d96]">
          <li className="flex gap-4">
            <span className="font-mono font-bold text-[#c17a5c] dark:text-[#a86650]">1</span>
            <span>Connect your Gmail or Outlook account via OAuth (no password sharing).</span>
          </li>
          <li className="flex gap-4">
            <span className="font-mono font-bold text-[#c17a5c] dark:text-[#a86650]">2</span>
            <span>We analyze sender metadata to detect subscriptions and accounts.</span>
          </li>
          <li className="flex gap-4">
            <span className="font-mono font-bold text-[#c17a5c] dark:text-[#a86650]">3</span>
            <span>See your results grouped by category, with EU alternatives and cancellation guides.</span>
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h3 className="text-2xl font-mono font-semibold text-[#1a2332] dark:text-[#f5f1ea]">Privacy first</h3>
        <ul className="space-y-2 text-[#1a2332]/70 dark:text-[#a89d96]">
          <li>✓ Metadata only — never your email bodies</li>
          <li>✓ GDPR-compliant, EU-hosted</li>
          <li>✓ Scans auto-delete after 30 days</li>
          <li>✓ Disconnect anytime; all data wiped immediately</li>
        </ul>
      </section>
    </div>
  )
}

