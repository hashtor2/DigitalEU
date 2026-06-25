import { redirectToCheckout, getProtonAffiliateLink } from '@/lib/stripe'

interface MonetizationCTAsProps {
  title?: string
  description?: string
  reportId?: string
  layout?: 'horizontal' | 'vertical' | 'stacked'
}

export function MonetizationCTAs({
  title = 'Unlock the Scanner',
  description = 'Get instant, automatic detection of all your online accounts',
  reportId,
  layout = 'horizontal',
}: MonetizationCTAsProps) {
  const handleStripeClick = () => {
    redirectToCheckout()
  }

  const protonLink = getProtonAffiliateLink('mail')

  return (
    <div className="rounded-lg border border-[#e0dbd2] dark:border-[#2a251f] bg-white dark:bg-[#1a1510] p-8 space-y-4">
      <div>
        <h3 className="text-2xl font-mono font-bold text-[#1a1815] dark:text-[#faf8f5] mb-2">
          {title}
        </h3>
        <p className="text-black/70 dark:text-slate-400">{description}</p>
      </div>

      <div
        className={
          layout === 'horizontal'
            ? 'flex flex-wrap gap-4 items-center'
            : layout === 'vertical'
              ? 'space-y-4'
              : 'grid grid-cols-1 md:grid-cols-2 gap-4'
        }
      >
        {/* Stripe Payment */}
        <button
          onClick={handleStripeClick}
          className="px-6 py-3 rounded font-mono font-semibold bg-[#b8705c] dark:bg-[#a8664f] text-white hover:bg-[#b8705c]/90 dark:hover:bg-[#a8664f]/90 transition whitespace-nowrap"
        >
          €5 — Unlock Now
        </button>

        {/* OR divider */}
        <div className="flex items-center gap-3 text-black/40 dark:text-slate-400/40">
          <div className="flex-1 h-px bg-current" />
          <span className="text-xs font-mono uppercase">or</span>
          <div className="flex-1 h-px bg-current" />
        </div>

        {/* Proton Affiliate */}
        <a
          href={protonLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded font-mono font-semibold border border-[#b8705c] dark:border-[#a8664f] text-[#b8705c] dark:text-[#a8664f] hover:bg-[#b8705c]/10 dark:hover:bg-[#a8664f]/10 transition whitespace-nowrap text-center"
        >
          Free with Proton
        </a>
      </div>

      {/* Benefit list */}
      <div className="pt-4 border-t border-slate-200 dark:border-navy-dark space-y-2 text-sm text-black/70 dark:text-slate-400">
        <p className="font-semibold text-[#1a1815] dark:text-[#faf8f5]">What you get:</p>
        <ul className="space-y-1">
          <li>✓ Auto-detect all your online accounts</li>
          <li>✓ Scan Gmail or Outlook metadata</li>
          <li>✓ Instant privacy risk assessment</li>
          <li>✓ Switch guides for each service</li>
        </ul>
      </div>
    </div>
  )
}
