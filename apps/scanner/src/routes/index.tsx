import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ServiceCheckboxGrid } from '@/components/ServiceCheckboxGrid'
import { useReport } from '@/hooks/useReport'

export default function IndexPage() {
  const navigate = useNavigate()
  const { createReport } = useReport()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [detectedServices, setDetectedServices] = useState<string[]>([])
  const [detectedDomains, setDetectedDomains] = useState<string[]>([])
  const [hasScannedInbox, setHasScannedInbox] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const detected = sessionStorage.getItem('detected_services')
    const domains = sessionStorage.getItem('detected_domains')
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
    if (domains) {
      try {
        setDetectedDomains(JSON.parse(domains))
      } catch (e) {
        console.error('Failed to parse detected domains:', e)
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
    setSelected(new Set(popularServices))
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
    sessionStorage.removeItem('detected_domains')
    setDetectedServices([])
    setDetectedDomains([])
    setSelected(new Set())
    setHasScannedInbox(false)
    navigate('/auth/signin')
  }

  return (
    <div className="space-y-12 md:space-y-16">
      {/* HERO SECTION */}
      <section className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-mono font-bold leading-tight">
            Discover Your Digital Footprint
          </h1>
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-text-secondary dark:text-dark-text-secondary leading-relaxed">
            See which online services have access to your personal data — and get recommendations for privacy-friendly European alternatives.
          </p>
        </div>

        {/* STATS */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 pt-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔍</span>
            <div className="text-left">
              <div className="font-mono font-semibold text-lg">137</div>
              <div className="text-sm text-text-secondary dark:text-dark-text-secondary">services tracked</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🇪🇺</span>
            <div className="text-left">
              <div className="font-mono font-semibold text-lg">149</div>
              <div className="text-sm text-text-secondary dark:text-dark-text-secondary">EU alternatives</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔒</span>
            <div className="text-left">
              <div className="font-mono font-semibold text-lg">100%</div>
              <div className="text-sm text-text-secondary dark:text-dark-text-secondary">private scanning</div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK SCAN SECTION */}
      <section className="bg-accent/10 dark:bg-accent/10 border border-accent/20 dark:border-accent/30 rounded-sm p-8 md:p-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-mono font-bold">
              🚀 Quick Inbox Scan
            </h2>
            <p className="text-text-secondary dark:text-dark-text-secondary text-lg">
              Connect Gmail or Outlook to instantly see which services are in your inbox
            </p>
          </div>

          {/* SCAN BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <a
              href="/auth/signin?provider=gmail"
              className="inline-flex items-center justify-center gap-3 rounded-sm border-2 border-accent bg-accent text-white px-8 py-4 font-mono font-semibold transition hover:bg-accent-hover hover:border-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span>🔗</span>
              <span>Connect Gmail</span>
            </a>
            <a
              href="/auth/signin?provider=outlook"
              className="inline-flex items-center justify-center gap-3 rounded-sm border-2 border-accent/30 dark:border-accent/50 bg-transparent text-accent px-8 py-4 font-mono font-semibold transition hover:bg-accent/10 dark:hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span>🔗</span>
              <span>Connect Outlook</span>
            </a>
          </div>

          <p className="text-sm text-text-secondary dark:text-dark-text-secondary pt-2">
            ✓ Read-only access only • ✓ No emails stored • ✓ Zero-knowledge scanning
          </p>

          {/* SCAN RESULTS (if available) */}
          {hasScannedInbox && (
            <div className="pt-6 border-t border-accent/20 dark:border-accent/30 space-y-4">
              <div className="bg-canvas dark:bg-dark-canvas rounded-sm border border-border dark:border-dark-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-sm font-mono text-accent font-semibold">✓ Inbox Scanned</div>
                    <div className="text-2xl md:text-3xl font-mono font-bold">
                      {detectedDomains.length} services found
                    </div>
                    <div className="text-sm text-text-secondary dark:text-dark-text-secondary">
                      {detectedServices.length} with European alternatives ready to switch
                    </div>
                  </div>
                  <span className="text-5xl">📧</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 py-4">
                  {detectedDomains.slice(0, 24).map(domain => (
                    <div
                      key={domain}
                      className="bg-accent/10 dark:bg-accent/10 rounded-sm px-3 py-2 text-sm font-mono text-text-primary dark:text-dark-text-primary text-center border border-accent/20 dark:border-accent/30 truncate"
                      title={domain}
                    >
                      {domain}
                    </div>
                  ))}
                  {detectedDomains.length > 24 && (
                    <div className="bg-muted/10 dark:bg-muted/10 rounded-sm px-3 py-2 text-sm font-mono text-text-secondary dark:text-dark-text-secondary text-center border border-muted/20">
                      +{detectedDomains.length - 24} more
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleGenerateReport}
                    disabled={selected.size === 0 || isGenerating}
                    className="flex-1 rounded-sm bg-accent text-white px-6 py-3 font-mono font-semibold transition hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {isGenerating ? '⏳ Generating...' : `✓ Generate Report (${selected.size})`}
                  </button>
                  <button
                    onClick={handleRescan}
                    className="rounded-sm border border-border dark:border-dark-border bg-transparent text-text-primary dark:text-dark-text-primary px-6 py-3 font-mono font-semibold transition hover:bg-muted/5 dark:hover:bg-muted/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
          <h2 className="text-3xl md:text-4xl font-mono font-bold">
            Or pick services manually
          </h2>
          <p className="text-text-secondary dark:text-dark-text-secondary text-lg max-w-2xl">
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
            className="flex-1 rounded-sm bg-text-primary dark:bg-dark-text-primary text-white dark:text-text-primary px-6 py-4 font-mono font-semibold transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {isGenerating ? '⏳ Generating...' : `Generate Report (${selected.size} selected)`}
          </button>
          <button
            onClick={handleClearAll}
            className="rounded-sm border border-border dark:border-dark-border bg-transparent text-text-primary dark:text-dark-text-primary px-6 py-4 font-mono font-semibold transition hover:bg-muted/5 dark:hover:bg-muted/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Clear all
          </button>
        </div>
      </section>

      {/* INFO SECTION */}
      <section className="bg-muted/5 dark:bg-muted/5 border border-border dark:border-dark-border rounded-sm p-8 md:p-12 space-y-8">
        <h3 className="text-2xl font-mono font-bold">
          How it works
        </h3>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="text-4xl">1️⃣</div>
            <h4 className="font-mono font-bold">Connect or Select</h4>
            <p className="text-text-secondary dark:text-dark-text-secondary">
              Link Gmail/Outlook for automatic detection or manually pick the services you use.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="text-4xl">2️⃣</div>
            <h4 className="font-mono font-bold">Get Your Report</h4>
            <p className="text-text-secondary dark:text-dark-text-secondary">
              See privacy risk scores, data breach history, and GDPR compliance for each service.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="text-4xl">3️⃣</div>
            <h4 className="font-mono font-bold">Find Alternatives</h4>
            <p className="text-text-secondary dark:text-dark-text-secondary">
              Discover curated European alternatives that protect your privacy better.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
