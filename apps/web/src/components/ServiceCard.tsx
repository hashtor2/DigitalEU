import type { Alternative } from '@digitaleu/shared'
import { ALTERNATIVES } from '@digitaleu/shared'
import { COUNTRY_FLAGS } from '@/lib/flags'
import { getPrivacyScore, getRiskLevel } from './RiskOverview'

const RISK_COLORS = {
  high: 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400',
  medium: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400',
  low: 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400',
}

const RISK_ICONS = {
  high: '🔴',
  medium: '🟡',
  low: '🟢',
}

const CLOUD_ACT_EXPOSURE: Record<string, boolean> = {
  US: true,
  CN: true,
  CA: false,
}

interface ServiceCardProps {
  service: Alternative
  logoUrl?: string
  onClick?: () => void
}

export function ServiceCard({ service, onClick }: ServiceCardProps) {
  const score = getPrivacyScore(service)
  const riskLevel = getRiskLevel(score)
  const hasCloudActExposure = CLOUD_ACT_EXPOSURE[service.country] ?? false

  const categoryAlternatives = ALTERNATIVES.filter(
    a =>
      a.category === service.category &&
      a.id !== service.id &&
      ['CH', 'DE', 'SE', 'FI', 'NL', 'AT', 'FR', 'ES', 'IT', 'DK', 'EE', 'PT', 'PL', 'CZ', 'IS', 'NO'].includes(a.country)
  )

  const protonAlternative = categoryAlternatives.find(a => a.id.startsWith('proton-'))

  const bestAlternative =
    protonAlternative ??
    categoryAlternatives.sort((a, b) => getPrivacyScore(b) - getPrivacyScore(a))[0]

  const protonAffiliateLink =
    service.category === 'email'
      ? 'https://go.getproton.me/SH2jh'
      : undefined

  return (
    <div
      className={`rounded-sm border p-5 space-y-3 transition ${RISK_COLORS[riskLevel]} ${onClick ? 'cursor-pointer hover:opacity-80' : ''}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl leading-none">{RISK_ICONS[riskLevel]}</span>
            <h4 className="font-mono font-semibold text-text-primary dark:text-dark-text-primary">
              {service.name}
            </h4>
            {service.country && (
              <span className="text-lg" title={service.country}>
                {COUNTRY_FLAGS[service.country as keyof typeof COUNTRY_FLAGS] || '🌍'}
              </span>
            )}
          </div>
          <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
            {service.description}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-3xl font-mono font-bold text-text-primary dark:text-dark-text-primary">
            {score}
          </div>
          <p className="text-[10px] font-mono uppercase tracking-wide text-text-secondary dark:text-dark-text-secondary">
            Privacy Score
          </p>
        </div>
      </div>

      {/* Risk Details */}
      <div className="text-xs space-y-1 pt-2 border-t border-current/20">
        {hasCloudActExposure && (
          <p>
            ⚠️ <strong>CLOUD Act Exposure:</strong> US jurisdiction allows
            government data access without warrant.
          </p>
        )}
        {service.replaces && (
          <p>
            <strong>Replaces:</strong> {service.replaces.join(', ')}
          </p>
        )}
      </div>

      {/* Recommendation */}
      {bestAlternative && (
        <div className="rounded-sm bg-canvas/50 dark:bg-dark-canvas/50 border border-border/40 dark:border-dark-border/40 p-3 space-y-2">
          <p className="text-xs font-mono font-semibold">✓ Recommended Alternative</p>
          <p className="text-xs">
            <strong>{bestAlternative.name}</strong> ({bestAlternative.country}) —{' '}
            {bestAlternative.description}
          </p>
          <div className="flex gap-2 pt-2">
            <a
              href={bestAlternative.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline hover:no-underline text-accent font-mono"
            >
              Learn more →
            </a>
            {protonAffiliateLink && (
              <a
                href={protonAffiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs underline hover:no-underline text-accent font-mono"
              >
                Try Proton →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
