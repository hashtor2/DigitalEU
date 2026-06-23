import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ServiceCheckboxGrid } from '@/components/ServiceCheckboxGrid'
import { MonetizationCTAs } from '@/components/MonetizationCTAs'
import { useReport } from '@/hooks/useReport'

export default function IndexPage() {
  const navigate = useNavigate()
  const { createReport } = useReport()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showSelector, setShowSelector] = useState(false)

  const handleToggle = (serviceId: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(serviceId)) next.delete(serviceId)
      else next.add(serviceId)
      return next
    })
  }

  const handleSelectAll = () => {
    // Select all from currently filtered services
    // This would require passing all services, so for now we'll select a subset of popular ones
    const popularServices = [
      'gmail',
      'proton-mail',
      'outlook',
      'facebook',
      'instagram',
      'twitter',
      'youtube',
      'dropbox',
      'google-drive',
      'onedrive',
      'slack',
      'notion',
    ]
    setSelected(new Set(popularServices.filter(s => s))) // Filter to existing
  }

  const handleClearAll = () => {
    setSelected(new Set())
  }

  const handleGenerateReport = () => {
    if (selected.size === 0) {
      alert('Please select at least one service')
      return
    }
    const reportId = createReport(Array.from(selected))
    navigate(`/report/${reportId}`)
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="space-y-6">
        <div>
          <h1 className="text-5xl md:text-6xl font-mono font-bold text-[#1a1815] dark:text-[#faf8f5] leading-tight mb-4">
            Find out which of your accounts put your privacy at risk
          </h1>
          <p className="text-lg text-[#1a1815]/70 dark:text-[#a89d96] max-w-2xl">
            Check the services you use. We'll score each for privacy risk, data breaches, and GDPR compliance — then show you the best European alternatives.
          </p>
        </div>

        {/* Trust Signals */}
        <div className="flex flex-wrap gap-6 text-sm text-[#1a1815]/60 dark:text-[#a89d96]">
          <div className="flex items-center gap-2">
            <span className="text-lg">137</span>
            <span>services tracked</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">149</span>
            <span>EU alternatives</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🔒</span>
            <span>Zero data sent to servers</span>
          </div>
        </div>
      </section>

      {/* Toggle to selector */}
      {!showSelector ? (
        <div className="rounded-lg border border-[#e0dbd2] dark:border-[#2a251f] bg-white dark:bg-[#1a1510] p-8 space-y-4">
          <h2 className="text-2xl font-mono font-bold text-[#1a1815] dark:text-[#faf8f5]">
            How it works
          </h2>
          <ol className="space-y-3 text-[#1a1815]/70 dark:text-[#a89d96]">
            <li className="flex gap-4">
              <span className="font-mono font-bold text-[#b8705c] dark:text-[#a8664f] flex-shrink-0">1</span>
              <span>Check the services you use from our curated list.</span>
            </li>
            <li className="flex gap-4">
              <span className="font-mono font-bold text-[#b8705c] dark:text-[#a8664f] flex-shrink-0">2</span>
              <span>We analyze privacy risks, CLOUD Act exposure, and data practices.</span>
            </li>
            <li className="flex gap-4">
              <span className="font-mono font-bold text-[#b8705c] dark:text-[#a8664f] flex-shrink-0">3</span>
              <span>Get your personalized report with EU alternatives and next steps.</span>
            </li>
          </ol>

          <button
            onClick={() => setShowSelector(true)}
            className="mt-6 inline-block rounded bg-[#b8705c] dark:bg-[#a8664f] px-6 py-3 font-mono font-semibold text-white hover:bg-[#b8705c]/90 dark:hover:bg-[#a8664f]/90 transition"
          >
            Check Your Services
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-mono font-bold text-[#1a1815] dark:text-[#faf8f5] mb-2">
              Service Selector
            </h2>
            <p className="text-[#1a1815]/70 dark:text-[#a89d96]">
              Search and select the services you use:
            </p>
          </div>

          <ServiceCheckboxGrid
            selected={selected}
            onToggle={handleToggle}
            onSelectAll={handleSelectAll}
            onClearAll={handleClearAll}
          />

          <div className="flex gap-4">
            <button
              onClick={handleGenerateReport}
              disabled={selected.size === 0}
              className="flex-1 rounded bg-[#b8705c] dark:bg-[#a8664f] px-6 py-3 font-mono font-semibold text-white hover:bg-[#b8705c]/90 dark:hover:bg-[#a8664f]/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Generate My Report ({selected.size})
            </button>
            <button
              onClick={() => {
                setShowSelector(false)
                setSelected(new Set())
              }}
              className="rounded border border-[#e0dbd2] dark:border-[#2a251f] px-6 py-3 font-mono font-semibold text-[#1a1815] dark:text-[#faf8f5] hover:bg-[#f5f3ef] dark:hover:bg-[#2a251f] transition"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Scanner Teaser with Monetization CTA */}
      <MonetizationCTAs
        title="Don't know what you're signed up for?"
        description="Connect your Gmail or Outlook. We'll scan your inbox metadata (sender names only — never contents) and find every account automatically."
        layout="stacked"
      />
    </div>
  )
}

