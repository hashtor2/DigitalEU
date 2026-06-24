import type { Alternative } from '@digitaleu/shared'

function getPrivacyScore(service: Alternative): number {
  // Simple scoring: lower is worse, higher is better (0-10)
  // US-based = 1, EU = 7, Sweden/Nordic = 8-9, etc.
  // Open-source bonus +1, Audited bonus +0.5

  let score = 5 // Neutral baseline

  // Country assessment
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
    // Other EU-adjacent or reasonable countries
    score = 6
  } else if (service.country === 'US') {
    score = 2
  } else if (service.country === 'CN') {
    score = 1
  }

  // Adjustments based on service details (if available in future)
  // Open source often adds transparency
  // Audits add credibility

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
    <div className="rounded-lg border border-[#e0dbd2] dark:border-[#2a251f] 
                    bg-white dark:bg-[#1a1510] p-6 space-y-4">
      <h3 className="font-mono font-semibold text-[#1a1815] dark:text-[#faf8f5]">
        Risk Summary
      </h3>

      {/* Risk distribution */}
      <div className="space-y-3">
        {/* High Risk */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm flex items-center gap-2">
              <span className="text-lg">🔴</span>
              <span className="font-mono text-[#1a1815] dark:text-[#faf8f5]">
                High Risk
              </span>
            </span>
            <span className="text-sm font-mono text-[#1a1815]/70 dark:text-[#a89d96]">
              {risks.high} services
            </span>
          </div>
          <div className="h-2 bg-[#e0dbd2] dark:bg-[#2a251f] rounded overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all"
              style={{ width: `${highPercent}%` }}
            />
          </div>
        </div>

        {/* Medium Risk */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm flex items-center gap-2">
              <span className="text-lg">🟡</span>
              <span className="font-mono text-[#1a1815] dark:text-[#faf8f5]">
                Medium Risk
              </span>
            </span>
            <span className="text-sm font-mono text-[#1a1815]/70 dark:text-[#a89d96]">
              {risks.medium} services
            </span>
          </div>
          <div className="h-2 bg-[#e0dbd2] dark:bg-[#2a251f] rounded overflow-hidden">
            <div
              className="h-full bg-yellow-500 transition-all"
              style={{ width: `${mediumPercent}%` }}
            />
          </div>
        </div>

        {/* Low Risk */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm flex items-center gap-2">
              <span className="text-lg">🟢</span>
              <span className="font-mono text-[#1a1815] dark:text-[#faf8f5]">
                Low Risk
              </span>
            </span>
            <span className="text-sm font-mono text-[#1a1815]/70 dark:text-[#a89d96]">
              {risks.low} services
            </span>
          </div>
          <div className="h-2 bg-[#e0dbd2] dark:bg-[#2a251f] rounded overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${lowPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Overall message */}
      <div className="text-xs text-[#1a1815]/60 dark:text-[#a89d96] pt-2">
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
