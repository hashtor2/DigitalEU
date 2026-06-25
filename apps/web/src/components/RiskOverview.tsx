import type { Alternative } from '@digitaleu/shared'

function getPrivacyScore(service: Alternative): number {
  let score = 5

  if (
    service.country === 'CH' ||
    service.country === 'IS' ||
    service.country === 'NO'
  ) {
    score = 9
  } else if (
    ['DE', 'SE', 'FI', 'NL', 'AT', 'FR', 'ES', 'IT', 'DK', 'EE', 'PT', 'PL', 'CZ'].includes(service.country)
  ) {
    score = 7
  } else if (service.country !== 'US' && service.country !== 'CN') {
    score = 6
  } else if (service.country === 'US') {
    score = 2
  } else if (service.country === 'CN') {
    score = 1
  }

  return Math.max(1, Math.min(10, Math.round(score)))
}

export function getRiskLevel(score: number): 'high' | 'medium' | 'low' {
  if (score <= 3) return 'high'
  if (score <= 6) return 'medium'
  return 'low'
}

interface RiskOverviewProps {
  services: Alternative[]
}

export function RiskOverview({ services }: RiskOverviewProps) {
  const risks = services.reduce(
    (acc, service) => {
      const score = getPrivacyScore(service)
      const level = getRiskLevel(score)
      acc[level]++
      return acc
    },
    { high: 0, medium: 0, low: 0 }
  )

  const total = services.length
  const highPercent = total > 0 ? Math.round((risks.high / total) * 100) : 0
  const mediumPercent = total > 0 ? Math.round((risks.medium / total) * 100) : 0
  const lowPercent = total > 0 ? Math.round((risks.low / total) * 100) : 0

  return (
    <div className="rounded-sm border border-border dark:border-dark-border
                    bg-canvas dark:bg-dark-canvas p-6 space-y-4">
      <h3 className="font-mono font-semibold text-text-primary dark:text-dark-text-primary">
        Risk Summary
      </h3>

      <div className="space-y-3">
        {/* High Risk */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm flex items-center gap-2">
              <span className="text-lg">🔴</span>
              <span className="font-mono text-text-primary dark:text-dark-text-primary">
                High Risk
              </span>
            </span>
            <span className="text-sm font-mono text-text-secondary dark:text-dark-text-secondary">
              {risks.high} services
            </span>
          </div>
          <div className="h-2 bg-border dark:bg-dark-border rounded-sm overflow-hidden">
            <div
              className="h-full bg-error transition-all"
              style={{ width: `${highPercent}%` }}
            />
          </div>
        </div>

        {/* Medium Risk */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm flex items-center gap-2">
              <span className="text-lg">🟡</span>
              <span className="font-mono text-text-primary dark:text-dark-text-primary">
                Medium Risk
              </span>
            </span>
            <span className="text-sm font-mono text-text-secondary dark:text-dark-text-secondary">
              {risks.medium} services
            </span>
          </div>
          <div className="h-2 bg-border dark:bg-dark-border rounded-sm overflow-hidden">
            <div
              className="h-full bg-warning transition-all"
              style={{ width: `${mediumPercent}%` }}
            />
          </div>
        </div>

        {/* Low Risk */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm flex items-center gap-2">
              <span className="text-lg">🟢</span>
              <span className="font-mono text-text-primary dark:text-dark-text-primary">
                Low Risk
              </span>
            </span>
            <span className="text-sm font-mono text-text-secondary dark:text-dark-text-secondary">
              {risks.low} services
            </span>
          </div>
          <div className="h-2 bg-border dark:bg-dark-border rounded-sm overflow-hidden">
            <div
              className="h-full bg-success transition-all"
              style={{ width: `${lowPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="text-xs text-text-secondary dark:text-dark-text-secondary pt-2">
        {risks.high > 0 && (
          <p>
            💡 <strong>{risks.high} services</strong> are exposed to US CLOUD Act
            jurisdiction. Consider switching to EU alternatives.
          </p>
        )}
      </div>
    </div>
  )
}

export { getPrivacyScore }
