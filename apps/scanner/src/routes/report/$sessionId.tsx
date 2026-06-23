import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ALTERNATIVES } from '@digitaleu/shared'
import { RiskOverview, getPrivacyScore, getRiskLevel } from '@/components/RiskOverview'
import { ServiceCard } from '@/components/ServiceCard'
import { MonetizationCTAs } from '@/components/MonetizationCTAs'
import { useReport } from '@/hooks/useReport'

export default function ReportPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const { report } = useReport()

  useEffect(() => {
    if (!report || report.id !== sessionId) {
      // Report not found, redirect to home
      navigate('/')
    }
  }, [report, sessionId, navigate])

  if (!report || report.id !== sessionId) {
    return (
      <div className="space-y-4 text-center py-12">
        <p className="text-[#1a1815]/70 dark:text-[#a89d96]">Loading report...</p>
      </div>
    )
  }

  // Group services by risk level
  const grouped = {
    high: report.services.filter(
      s => getRiskLevel(getPrivacyScore(s.service)) === 'high'
    ),
    medium: report.services.filter(
      s => getRiskLevel(getPrivacyScore(s.service)) === 'medium'
    ),
    low: report.services.filter(
      s => getRiskLevel(getPrivacyScore(s.service)) === 'low'
    ),
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-mono font-bold text-[#1a1815] dark:text-[#faf8f5]">
          Your Privacy Report
        </h1>
        <p className="text-[#1a1815]/70 dark:text-[#a89d96]">
          Here's how your {report.selectedServiceIds.length} services score for privacy and data protection.
        </p>
      </section>

      {/* Risk Overview */}
      <RiskOverview services={report.services.map(s => s.service)} />

      {/* Grouped Services */}
      {grouped.high.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-mono font-bold text-[#1a1815] dark:text-[#faf8f5] flex items-center gap-2">
            <span className="text-3xl">🔴</span>
            High Risk ({grouped.high.length})
          </h2>
          <p className="text-sm text-[#1a1815]/60 dark:text-[#a89d96]">
            These services are exposed to US CLOUD Act jurisdiction or have significant privacy concerns.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grouped.high.map(item => (
              <ServiceCard key={item.serviceId} service={item.service} />
            ))}
          </div>
        </section>
      )}

      {grouped.medium.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-mono font-bold text-[#1a1815] dark:text-[#faf8f5] flex items-center gap-2">
            <span className="text-3xl">🟡</span>
            Medium Risk ({grouped.medium.length})
          </h2>
          <p className="text-sm text-[#1a1815]/60 dark:text-[#a89d96]">
            These services have mixed privacy records or operate in jurisdictions with moderate concerns.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grouped.medium.map(item => (
              <ServiceCard key={item.serviceId} service={item.service} />
            ))}
          </div>
        </section>
      )}

      {grouped.low.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-mono font-bold text-[#1a1815] dark:text-[#faf8f5] flex items-center gap-2">
            <span className="text-3xl">🟢</span>
            Low Risk ({grouped.low.length})
          </h2>
          <p className="text-sm text-[#1a1815]/60 dark:text-[#a89d96]">
            These services are privacy-respecting, often EU-based or open-source.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grouped.low.map(item => (
              <ServiceCard key={item.serviceId} service={item.service} />
            ))}
          </div>
        </section>
      )}

      {/* Scanner CTA */}
      <MonetizationCTAs
        title="Found your blind spot?"
        description="The manual approach only catches what you remember. Connect Gmail or Outlook to auto-detect every account you're signed up for."
        reportId={sessionId}
        layout="vertical"
      />

      {/* Next Steps */}
      <section className="rounded-lg border border-[#e0dbd2] dark:border-[#2a251f] bg-white dark:bg-[#1a1510] p-8 space-y-6">
        <h2 className="text-2xl font-mono font-bold text-[#1a1815] dark:text-[#faf8f5]">
          What's next?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Option 1: Browse Alternatives */}
          <div className="rounded-lg border border-[#e0dbd2] dark:border-[#2a251f] p-4 space-y-3">
            <h3 className="font-mono font-semibold text-[#1a1815] dark:text-[#faf8f5]">
              1. Browse EU Alternatives
            </h3>
            <p className="text-sm text-[#1a1815]/70 dark:text-[#a89d96]">
              Visit our full catalog of {ALTERNATIVES.length}+ European tech services.
            </p>
            <a
              href="/alternatives"
              className="inline-block text-xs font-mono font-semibold text-[#b8705c] dark:text-[#a8664f] hover:underline"
            >
              Explore alternatives →
            </a>
          </div>

          {/* Option 2: View Switching Guides */}
          <div className="rounded-lg border border-[#e0dbd2] dark:border-[#2a251f] p-4 space-y-3">
            <h3 className="font-mono font-semibold text-[#1a1815] dark:text-[#faf8f5]">
              2. Switching Guides
            </h3>
            <p className="text-sm text-[#1a1815]/70 dark:text-[#a89d96]">
              Step-by-step instructions for migrating to safer alternatives.
            </p>
            <a
              href="/guides"
              className="inline-block text-xs font-mono font-semibold text-[#b8705c] dark:text-[#a8664f] hover:underline"
            >
              Read guides →
            </a>
          </div>

          {/* Option 3: Email Reminder */}
          <div className="rounded-lg border border-[#e0dbd2] dark:border-[#2a251f] p-4 space-y-3">
            <h3 className="font-mono font-semibold text-[#1a1815] dark:text-[#faf8f5]">
              3. Email Reminders
            </h3>
            <p className="text-sm text-[#1a1815]/70 dark:text-[#a89d96]">
              Get weekly tips on switching to EU alternatives.
            </p>
            <form
              className="space-y-2"
              onSubmit={e => {
                e.preventDefault()
                const email = (e.currentTarget.querySelector('input') as HTMLInputElement)?.value
                if (email) {
                  console.log('Subscribe:', email)
                  // TODO: integrate with email service
                }
              }}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-3 py-2 rounded text-xs border border-[#e0dbd2] dark:border-[#2a251f] 
                           bg-white dark:bg-[#1a1510] text-[#1a1815] dark:text-[#faf8f5]
                           placeholder:text-[#a89d96]"
              />
              <button
                type="submit"
                className="w-full px-3 py-2 rounded text-xs font-mono font-semibold bg-[#b8705c] dark:bg-[#a8664f] text-white hover:bg-[#b8705c]/90 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 pt-6 border-t border-[#e0dbd2] dark:border-[#2a251f]">
        <button
          onClick={() => navigate('/')}
          className="rounded border border-[#e0dbd2] dark:border-[#2a251f] px-6 py-3 font-mono font-semibold text-[#1a1815] dark:text-[#faf8f5] hover:bg-[#f5f3ef] dark:hover:bg-[#2a251f] transition"
        >
          Create New Report
        </button>
        <button
          onClick={() => {
            const text = `I just analyzed my digital privacy. ${grouped.high.length} high-risk, ${grouped.medium.length} medium-risk services. Check yours at europa.digitaleu.me`
            const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
            window.open(url, '_blank')
          }}
          className="rounded bg-[#b8705c] dark:bg-[#a8664f] px-6 py-3 font-mono font-semibold text-white hover:bg-[#b8705c]/90 transition"
        >
          Share on Twitter
        </button>
      </div>
    </div>
  )
}
