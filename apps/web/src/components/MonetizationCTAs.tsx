import { redirectToCheckout } from '@/lib/stripe'
import { AFFILIATE_LINKS } from '@digitaleu/shared'

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
    redirectToCheckout({ sessionId: reportId })
  }

  const protonLink = AFFILIATE_LINKS['proton-mail'].url

  return (
    <div className="rounded-sm border border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas p-8 space-y-4">
      <div>
        <h3 className="text-2xl font-mono font-bold text-text-primary dark:text-dark-text-primary mb-2">
          {title}
        </h3>
        <p className="text-text-secondary dark:text-dark-text-secondary">{description}</p>
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
          className="px-6 py-3 rounded-sm font-mono font-semibold bg-accent text-white hover:bg-accent-hover transition whitespace-nowrap"
        >
          €5 — Unlock Now
        </button>

        {/* OR divider */}
        <div className="flex items-center gap-3 text-text-secondary/40 dark:text-dark-text-secondary/40">
          <div className="flex-1 h-px bg-current" />
          <span className="text-xs font-mono uppercase">or</span>
          <div className="flex-1 h-px bg-current" />
        </div>

        {/* Proton Affiliate */}
        <a
          href={protonLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-sm font-mono font-semibold border border-accent text-accent hover:bg-accent/10 transition whitespace-nowrap text-center"
        >
          Free with Proton
        </a>
      </div>

      {/* Benefit list */}
      <div className="pt-4 border-t border-border dark:border-dark-border space-y-2 text-sm text-text-secondary dark:text-dark-text-secondary">
        <p className="font-semibold text-text-primary dark:text-dark-text-primary">What you get:</p>
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
