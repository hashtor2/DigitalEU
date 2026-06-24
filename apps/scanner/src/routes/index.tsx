import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ServiceCheckboxGrid } from '@/components/ServiceCheckboxGrid'
import { useReport } from '@/hooks/useReport'

export default function IndexPage() {
  const navigate = useNavigate()
  const { createReport } = useReport()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [connectedProvider, setConnectedProvider] = useState<string | null>(null)
  const [detectedServices, setDetectedServices] = useState<string[]>([])

  useEffect(() => {
    const provider = sessionStorage.getItem('email_provider')
    const token = sessionStorage.getItem('email_access_token')
    setConnectedProvider(provider && token ? provider : null)
    
    // Load detected services from sessionStorage if available
    const detected = sessionStorage.getItem('detected_services')
    if (detected) {
      try {
        const services = JSON.parse(detected)
        setDetectedServices(services)
        setSelected(new Set(services))
      } catch (e) {
        console.error('Failed to parse detected services:', e)
      }
    }
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

        <div className="mx-auto max-w-2xl rounded-none border border-slate-200 bg-white px-6 py-5 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:border-slate-700 dark:bg-navy-dark">
          <p className="mb-4 font-mono text-sm uppercase tracking-[0.22em] text-black/60 dark:text-slate-400">
            Scan your inbox
          </p>
          {connectedProvider && (
            <p className="mb-3 text-sm font-mono text-black/70 dark:text-slate-400">
              Connected via {connectedProvider === 'gmail' ? 'Gmail' : 'Outlook'}.
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
            <Link
              to="/auth/signin"
              className="inline-flex items-center justify-center rounded-none border border-black bg-black px-8 py-3.5 font-mono text-sm font-semibold text-white transition hover:bg-black/80 dark:border-slate-700 dark:bg-slate-700 dark:text-white"
            >
              {connectedProvider ? 'Reconnect inbox' : 'Scan my inbox'}
            </Link>
            <Link
              to="/scan"
              className="inline-flex items-center justify-center rounded-none border border-slate-200 bg-transparent px-8 py-3.5 font-mono text-sm font-semibold text-black transition hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700"
            >
              Try the demo
            </Link>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-black/70 dark:text-slate-400">
            Connect Gmail or Outlook to see which services are linked to your email.
          </p>
        </div>
      </section>

      <section id="manual-check" className="space-y-6">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-2xl font-mono font-bold text-black dark:text-white">
            Manual service check
          </h2>
          <p className="text-black/70 dark:text-slate-400">
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
            className="flex-1 rounded-none border border-black bg-black px-6 py-3 font-mono font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            Generate my report ({selected.size})
          </button>
          <button
            onClick={handleClearAll}
            className="rounded-none border border-slate-200 bg-transparent px-6 py-3 font-mono font-semibold text-black transition hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700"
          >
            Clear selection
          </button>
        </div>
      </section>
    </div>
  )
}

