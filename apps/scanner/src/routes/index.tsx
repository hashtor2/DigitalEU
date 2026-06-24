import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ServiceCheckboxGrid } from '@/components/ServiceCheckboxGrid'
import { useReport } from '@/hooks/useReport'

export default function IndexPage() {
  const navigate = useNavigate()
  const { createReport } = useReport()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [connectedProvider, setConnectedProvider] = useState<string | null>(null)

  useEffect(() => {
    const provider = sessionStorage.getItem('email_provider')
    const token = sessionStorage.getItem('email_access_token')
    setConnectedProvider(provider && token ? provider : null)
  }, [])

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
    <div className="space-y-10 md:space-y-12">
      <section className="space-y-8 pt-6 md:pt-10">
        <div className="mx-auto max-w-4xl text-center space-y-5">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-mono font-bold text-[#1a1815] dark:text-[#faf8f5] leading-[0.95] tracking-tight max-w-4xl mx-auto">
            Find out which of your accounts put your privacy at risk
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-[#1a1815]/70 dark:text-[#a89d96] leading-relaxed">
            Tick the services you use. We&apos;ll score each one for privacy risk, data breaches, and GDPR compliance — then show you the best European alternatives.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-[#1a1815]/60 dark:text-[#a89d96]">
            <div className="flex items-center gap-2">
              <span className="text-lg">137</span>
              <span>services tracked</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">149</span>
              <span>EU alternatives catalogued</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🔒</span>
              <span>Zero data sent to servers</span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-2xl rounded-none border border-[#d9d3c8] bg-[#faf8f4] px-6 py-5 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:border-[#2a251f] dark:bg-[#f4efe6]">
          <p className="mb-4 font-mono text-sm uppercase tracking-[0.22em] text-[#1a1815]/60 dark:text-[#5e5448]">
            Scan your inbox
          </p>
          {connectedProvider && (
            <p className="mb-3 text-sm font-mono text-[#1a1815]/70 dark:text-[#5e5448]">
              Connected via {connectedProvider === 'gmail' ? 'Gmail' : 'Outlook'}.
            </p>
          )}
          <Link
            to="/auth/signin"
            className="inline-flex items-center justify-center rounded-none border border-[#1a1815] bg-[#1a1815] px-8 py-3.5 font-mono text-sm font-semibold text-[#faf8f5] transition hover:bg-[#2a241d] dark:border-[#2a251f] dark:bg-[#2a251f] dark:text-[#faf8f5]"
          >
            {connectedProvider ? 'Reconnect inbox' : 'Scan my inbox'}
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-[#1a1815]/70 dark:text-[#6f655c]">
            Connect Gmail or Outlook to see which services are linked to your email.
          </p>
        </div>
      </section>

      <section id="manual-check" className="space-y-6">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-2xl font-mono font-bold text-[#1a1815] dark:text-[#faf8f5]">
            Manual service check
          </h2>
          <p className="text-[#1a1815]/70 dark:text-[#a89d96]">
            Search and select the services you already know you use. This stays free and gives you a fast report.
          </p>
        </div>

        <ServiceCheckboxGrid
          selected={selected}
          onToggle={handleToggle}
          onSelectAll={handleSelectAll}
          onClearAll={handleClearAll}
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleGenerateReport}
            disabled={selected.size === 0}
            className="flex-1 rounded-none border border-[#1a1815] bg-[#1a1815] px-6 py-3 font-mono font-semibold text-[#faf8f5] transition hover:bg-[#2a241d] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#2a251f] dark:bg-[#2a251f] dark:hover:bg-[#3a3128]"
          >
            Generate my report ({selected.size})
          </button>
          <button
            onClick={handleClearAll}
            className="rounded-none border border-[#d9d3c8] bg-transparent px-6 py-3 font-mono font-semibold text-[#1a1815] transition hover:bg-[#f3efe7] dark:border-[#2a251f] dark:text-[#faf8f5] dark:hover:bg-[#2a251f]"
          >
            Clear selection
          </button>
        </div>
      </section>
    </div>
  )
}

