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
    const popularServices = ['gmail', 'proton-mail', 'outlook', 'facebook', 'instagram', 'twitter', 'youtube', 'dropbox', 'google-drive', 'onedrive', 'slack', 'notion']
    setSelected(new Set(popularServices.filter(s => s)))
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
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-mono font-bold text-text-primary dark:text-dark-text-primary leading-[0.95] tracking-tight max-w-4xl mx-auto">
            Find out which of your accounts put your privacy at risk
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-text-secondary dark:text-dark-text-secondary leading-relaxed">
            Tick the services you use. We&apos;ll score each one for privacy risk, data breaches, and GDPR compliance — then show you the best European alternatives.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-text-secondary dark:text-dark-text-secondary">
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

        <div className="mx-auto max-w-2xl rounded-sm border border-border dark:border-dark-border bg-surface dark:bg-dark-surface px-6 py-5 text-center">
          <p className="mb-4 font-mono text-sm uppercase tracking-[0.22em] text-text-secondary dark:text-dark-text-secondary">
            Scan your inbox
          </p>
          {connectedProvider && (
            <p className="mb-3 text-sm font-mono text-text-secondary dark:text-dark-text-secondary">
              Connected via {connectedProvider === 'gmail' ? 'Gmail' : 'Outlook'}.
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
            <Link
              to="/scanner/auth/signin"
              className="inline-flex items-center justify-center rounded-sm border border-accent bg-accent px-8 py-3.5 font-mono text-sm font-semibold text-white transition hover:bg-accent-hover"
            >
              {connectedProvider ? 'Reconnect inbox' : 'Scan my inbox'}
            </Link>
            <Link
              to="/scanner/scan"
              className="inline-flex items-center justify-center rounded-sm border border-border dark:border-dark-border bg-transparent px-8 py-3.5 font-mono text-sm font-semibold text-text-primary dark:text-dark-text-primary transition hover:bg-border dark:hover:bg-dark-border"
            >
              Try the demo
            </Link>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
            Connect Gmail or Outlook to see which services are linked to your email.
          </p>
        </div>
      </section>

      <section id="manual-check" className="space-y-6">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-2xl font-mono font-bold text-text-primary dark:text-dark-text-primary">
            Manual service check
          </h2>
          <p className="text-text-secondary dark:text-dark-text-secondary">
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
            className="flex-1 rounded-sm border border-accent bg-accent px-6 py-3 font-mono font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Generate my report ({selected.size})
          </button>
          <button
            onClick={handleClearAll}
            className="rounded-sm border border-border dark:border-dark-border bg-transparent px-6 py-3 font-mono font-semibold text-text-primary dark:text-dark-text-primary transition hover:bg-border dark:hover:bg-dark-border"
          >
            Clear selection
          </button>
        </div>
      </section>
    </div>
  )
}
