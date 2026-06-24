import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ServiceCheckboxGrid } from '@/components/ServiceCheckboxGrid'
import { useReport } from '@/hooks/useReport'

export default function IndexPage() {
  const navigate = useNavigate()
  const { createReport } = useReport()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [connectedProvider, setConnectedProvider] = useState<string | null>(null)
  const [detectedServices, setDetectedServices] = useState<string[]>([])
  const [hasScannedInbox, setHasScannedInbox] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

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
        setHasScannedInbox(true)
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
    const popularServices = [
      'gmail', 'proton-mail', 'outlook', 'facebook', 'instagram', 'twitter',
      'youtube', 'dropbox', 'google-drive', 'onedrive', 'slack', 'notion',
    ]
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
    setIsGenerating(true)
    const reportId = createReport(Array.from(selected))
    navigate(`/report/${reportId}`)
  }

  const handleRescan = () => {
    sessionStorage.removeItem('email_access_token')
    sessionStorage.removeItem('email_provider')
    sessionStorage.removeItem('detected_services')
    setConnectedProvider(null)
    setDetectedServices([])
    setSelected(new Set())
    setHasScannedInbox(false)
    navigate('/auth/signin')
  }

  return (
    <div className="space-y-12 md:space-y-16">
      {/* HERO SECTION */}
      <section className="pt-8 md:pt-12">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-mono font-bold text-black dark:text-white leading-[0.95] tracking-tight">
              Discover Your Digital Footprint
            </h1>
            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-black/70 dark:text-slate-300 leading-relaxed">
              See which online services have access to your personal data — and get recommendations for privacy-friendly European alternatives.
            </p>
          </div>

          {/* STATS */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-sm md:text-base">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔍</span>
              <div className="text-left">
                <div className="font-mono font-semibold text-black dark:text-white">137</div>
                <div className="text-black/60 dark:text-slate-400">services tracked</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇪🇺</span>
              <div className="text-left">
                <div className="font-mono font-semibold text-black dark:text-white">149</div>
                <div className="text-black/60 dark:text-slate-400">EU alternatives</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔒</span>
              <div className="text-left">
                <div className="font-mono font-semibold text-black dark:text-white">100%</div>
                <div className="text-black/60 dark:text-slate-400">Private scanning</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK SCAN SECTION */}
      <section className="bg-gradient-to-br from-green/10 to-green/5 dark:from-green/20 dark:to-green/10 rounded-lg border border-green/30 dark:border-green/40 p-8 md:p-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-mono font-bold text-black dark:text-white">
              🚀 Quick Inbox Scan
            </h2>
            <p className="text-black/70 dark:text-slate-300">
              Connect Gmail or Outlook to instantly see which services are in your inbox
            </p>
          </div>

          {/* SCAN BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <a
              href="/auth/signin?provider=gmail"
              className="inline-flex items-center justify-center gap-3 rounded-lg border-2 border-green bg-green text-white px-8 py-4 font-mono font-semibold transition hover:bg-green/90 dark:bg-green dark:hover:bg-green/80"
            >
              <span>🔗</span>
              <span>Connect Gmail</span>
            </a>
            <a
              href="/auth/signin?provider=outlook"
              className="inline-flex items-center justify-center gap-3 rounded-lg border-2 border-green/30 bg-transparent text-green px-8 py-4 font-mono font-semibold transition hover:bg-green/10 dark:border-green/50 dark:text-green dark:hover:bg-green/20"
            >
              <span>🔗</span>
              <span>Connect Outlook</span>
            </a>
          </div>

          <p className="text-sm text-black/60 dark:text-slate-400 pt-2">
            ✓ Read-only access only • ✓ No emails stored • ✓ Zero-knowledge scanning
          </p>

          {/* SCAN RESULTS (if available) */}
          {hasScannedInbox && (
            <div className="pt-6 border-t border-green/20 space-y-4">
              <div className="bg-white dark:bg-navy-dark rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-sm font-mono text-green font-semibold">✓ Inbox Scanned</div>
                    <div className="text-2xl font-mono font-bold text-black dark:text-white">
                      {detectedServices.length} services detected
                    </div>
                  </div>
                  <span className="text-5xl">📧</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 py-4">
                  {detectedServices.slice(0, 12).map(service => (
                    <div
                      key={service}
                      className="bg-green/10 dark:bg-green/20 rounded px-3 py-2 text-sm font-mono text-black dark:text-white text-center border border-green/20"
                    >
                      {service.replace('-', ' ')}
                    </div>
                  ))}
                  {detectedServices.length > 12 && (
                    <div className="bg-slate-100 dark:bg-slate-800 rounded px-3 py-2 text-sm font-mono text-black/60 dark:text-slate-400 text-center border border-slate-200 dark:border-slate-700">
                      +{detectedServices.length - 12} more
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleGenerateReport}
                    disabled={selected.size === 0 || isGenerating}
                    className="flex-1 rounded-lg bg-green text-white px-6 py-3 font-mono font-semibold transition hover:bg-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? '⏳ Generating...' : `✓ Generate Report (${selected.size})`}
                  </button>
                  <button
                    onClick={handleRescan}
                    className="rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent text-black dark:text-white px-6 py-3 font-mono font-semibold transition hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    ↻ Rescan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MANUAL SELECTION SECTION */}
      <section className="space-y-8">
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-mono font-bold text-black dark:text-white">
            Or pick services manually
          </h2>
          <p className="text-black/70 dark:text-slate-300 max-w-2xl">
            Search for and select the services you use. This method is quick, free, and gives you instant privacy risk insights.
          </p>
        </div>

        <ServiceCheckboxGrid
          selected={selected}
          onToggle={handleToggle}
          onSelectAll={handleSelectAll}
          onClearAll={handleClearAll}
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleGenerateReport}
            disabled={selected.size === 0 || isGenerating}
            className="flex-1 rounded-lg bg-black dark:bg-white text-white dark:text-black px-6 py-4 font-mono font-semibold transition hover:bg-black/80 dark:hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? '⏳ Generating...' : `Generate Report (${selected.size} selected)`}
          </button>
          <button
            onClick={handleClearAll}
            className="rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent text-black dark:text-white px-6 py-4 font-mono font-semibold transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Clear all
          </button>
        </div>
      </section>

      {/* INFO SECTION */}
      <section className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 p-8 md:p-12 space-y-6">
        <h3 className="text-2xl font-mono font-bold text-black dark:text-white">
          How it works
        </h3>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="text-4xl">1️⃣</div>
            <h4 className="font-mono font-bold text-black dark:text-white">Connect or Select</h4>
            <p className="text-black/70 dark:text-slate-400">
              Link Gmail/Outlook for automatic detection or manually pick the services you use.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="text-4xl">2️⃣</div>
            <h4 className="font-mono font-bold text-black dark:text-white">Get Your Report</h4>
            <p className="text-black/70 dark:text-slate-400">
              See privacy risk scores, data breach history, and GDPR compliance for each service.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="text-4xl">3️⃣</div>
            <h4 className="font-mono font-bold text-black dark:text-white">Find Alternatives</h4>
            <p className="text-black/70 dark:text-slate-400">
              Discover curated European alternatives that protect your privacy better.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
