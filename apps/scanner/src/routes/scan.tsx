import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

interface ServiceResult {
  service_id: string
  name: string
  category: string
  detected_count: number
  confidence: number
  logo_url: string
  website_url: string
}

interface CategoryGroup {
  category: string
  services: ServiceResult[]
}

export default function DemoScanPage() {
  const navigate = useNavigate()
  const [results, setResults] = useState<CategoryGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [sessionId] = useState(() => `demo-${Date.now()}`)

  useEffect(() => {
    const loadDemoResults = async () => {
      try {
        // Mock demo services for demonstration
        const mockServices = [
          {
            id: 'gmail',
            name: 'Gmail',
            category: 'email',
            logo_url: 'https://www.gstatic.com/images/branding/product/1x/gmail_2020q4_512dp.png',
            website_url: 'https://mail.google.com',
          },
          {
            id: 'proton-mail',
            name: 'Proton Mail',
            category: 'email',
            logo_url: 'https://proton.me/download/brand/proton-mail-icon.svg',
            website_url: 'https://proton.me/mail',
          },
          {
            id: 'google-drive',
            name: 'Google Drive',
            category: 'cloud-storage',
            logo_url: 'https://www.gstatic.com/images/branding/product/1x/drive_2020q4_512dp.png',
            website_url: 'https://drive.google.com',
          },
          {
            id: 'dropbox',
            name: 'Dropbox',
            category: 'cloud-storage',
            logo_url: 'https://djzheuzskyaie.cloudfront.net/images/brand-guidelines/logos/dropbox-logo-blue.png',
            website_url: 'https://dropbox.com',
          },
          {
            id: 'slack',
            name: 'Slack',
            category: 'messaging',
            logo_url: 'https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_256.png',
            website_url: 'https://slack.com',
          },
          {
            id: 'notion',
            name: 'Notion',
            category: 'project-management',
            logo_url: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg',
            website_url: 'https://notion.so',
          },
          {
            id: 'netflix',
            name: 'Netflix',
            category: 'social',
            logo_url: 'https://www.netflix.com/favicon.ico',
            website_url: 'https://netflix.com',
          },
          {
            id: 'spotify',
            name: 'Spotify',
            category: 'social',
            logo_url: 'https://www.spotify.com/favicon.ico',
            website_url: 'https://spotify.com',
          },
          {
            id: 'facebook',
            name: 'Facebook',
            category: 'social',
            logo_url: 'https://www.facebook.com/favicon.ico',
            website_url: 'https://facebook.com',
          },
          {
            id: 'google-analytics',
            name: 'Google Analytics',
            category: 'analytics',
            logo_url: 'https://www.gstatic.com/images/branding/product/1x/analytics_2020q4_512dp.png',
            website_url: 'https://analytics.google.com',
          },
          {
            id: 'zoom',
            name: 'Zoom',
            category: 'messaging',
            logo_url: 'https://www.zoom.us/favicon.ico',
            website_url: 'https://zoom.us',
          },
          {
            id: 'instagram',
            name: 'Instagram',
            category: 'social',
            logo_url: 'https://www.instagram.com/favicon.ico',
            website_url: 'https://instagram.com',
          },
        ]

        // Map to sample results grouped by category
        const sampleServices = mockServices.map((service: any) => ({
          service_id: service.id,
          name: service.name,
          category: service.category || 'other',
          detected_count: 1,
          confidence: 0.85 + Math.random() * 0.15, // 85-100% confidence
          logo_url: service.logo_url || '',
          website_url: service.website_url || '',
        }))

        // Group by category
        const grouped = sampleServices.reduce(
          (acc: Record<string, ServiceResult[]>, service: ServiceResult) => {
            const category = service.category || 'other'
            if (!acc[category]) {
              acc[category] = []
            }
            const categoryArray = acc[category]
            if (categoryArray) {
              categoryArray.push(service)
            }
            return acc
          },
          {} as Record<string, ServiceResult[]>
        )

        // Convert to array with category labels
        const categoryOrder = [
          'email',
          'cloud-storage',
          'productivity',
          'messaging',
          'streaming',
          'social-media',
          'analytics',
          'video',
          'other',
        ]

        const sortedResults = categoryOrder
          .filter((cat) => grouped[cat] && grouped[cat].length > 0)
          .map((category) => ({
            category,
            services: grouped[category] || [],
          }))

        setResults(sortedResults)
      } catch (error) {
        console.error('Error loading demo data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDemoResults()
  }, [])

  const categoryLabels: Record<string, string> = {
    email: '📧 Email',
    'cloud-storage': '☁️ Cloud Storage',
    productivity: '📋 Productivity',
    messaging: '💬 Messaging',
    streaming: '🎬 Streaming',
    'social-media': '👥 Social Media',
    analytics: '📊 Analytics',
    video: '📹 Video',
    other: '🔧 Other',
  }

  const totalServices = results.reduce((sum, group) => sum + group.services.length, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-green dark:border-green-dark border-t-transparent rounded-full mx-auto"></div>
          <p className="text-black/70 dark:text-slate-400 font-mono">Loading demo results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="space-y-6">
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-mono font-bold text-black dark:text-white leading-tight">
            Sample scan results
          </h1>
          <p className="text-base text-black/70 dark:text-slate-400 max-w-2xl">
            This is what a real inbox scan looks like. We found {totalServices} services across your typical email patterns. Scan your own Gmail or Outlook to see which services are actually connected to your inbox.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 md:gap-6">
          <div className="rounded-none border border-[#1a2332]/10 dark:border-[#3a3530] bg-white dark:bg-[#2a251f] p-4">
            <p className="text-3xl font-mono font-bold text-black dark:text-white">{totalServices}</p>
            <p className="text-sm text-black/70 dark:text-slate-400 mt-1">Services detected</p>
          </div>
          <div className="rounded-none border border-black/10 dark:border-slate-700 bg-white dark:bg-navy-dark p-4">
            <p className="text-3xl font-mono font-bold text-green dark:text-green">18</p>
            <p className="text-sm text-black/70 dark:text-slate-400 mt-1">EU alternatives</p>
          </div>
          <div className="rounded-none border border-[#1a2332]/10 dark:border-[#3a3530] bg-white dark:bg-[#2a251f] p-4">
            <p className="text-3xl font-mono font-bold text-[#10b981]">💪</p>
            <p className="text-sm text-black/70 dark:text-slate-400 mt-1">High risk</p>
          </div>
        </div>

        <div className="rounded-none border border-[#d9d3c8] bg-[#faf8f4] dark:border-[#2a251f] dark:bg-[#f4efe6]/5 p-6 space-y-4">
          <h2 className="text-lg font-mono font-semibold text-black dark:text-white">This is just a sample</h2>
          <p className="text-sm text-black/70 dark:text-slate-400">
            Your actual scan will be customized based on what&apos;s really in your inbox. Connect Gmail or Outlook to get your personalized report with recommendations tailored to your actual service usage.
          </p>
          <div className="flex flex-col gap-3 pt-2">
            <a
              href="/auth/signin"
              className="inline-flex items-center justify-center rounded-none border border-[#1a1815] bg-[#1a1815] px-6 py-3 font-mono font-semibold text-[#faf8f5] transition hover:bg-[#2a241d] dark:border-[#2a251f] dark:bg-[#2a251f] dark:hover:bg-[#3a3128]"
            >
              Scan your real inbox
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-none border border-[#d9d3c8]/50 bg-transparent px-6 py-3 font-mono font-semibold text-[#1a1815] transition hover:bg-[#d9d3c8]/10 dark:border-[#2a251f] dark:text-[#faf8f5] dark:hover:bg-[#2a251f]"
            >
              Back to home
            </a>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-mono font-bold text-black dark:text-white">Services by category</h2>

        {results.map((group) => (
          <div key={group.category} className="space-y-3">
            <h3 className="text-lg font-mono font-semibold text-black/70 dark:text-slate-400">
              {categoryLabels[group.category] || group.category}
            </h3>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {group.services.map((service) => (
                <a
                  key={service.service_id}
                  href={`/cancel/${service.service_id}`}
                  className="rounded-none border border-black/10 dark:border-slate-700 bg-white dark:bg-navy-dark p-4 hover:border-green/50 dark:hover:border-green-dark/50 transition group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {service.logo_url && (
                        <img
                          src={service.logo_url}
                          alt={service.name}
                          className="w-10 h-10 rounded object-contain flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-mono font-semibold text-black dark:text-white group-hover:text-green dark:group-hover:text-green-dark transition">
                          {service.name}
                        </h4>
                        <p className="text-xs text-black/60 dark:text-slate-400 mt-1">
                          {Math.round(service.confidence * 100)}% match
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-green dark:text-green-dark flex-shrink-0">
                      Learn how to cancel →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-none border border-black/10 dark:border-slate-700 bg-white dark:bg-navy-dark p-6 space-y-4">
        <h2 className="text-lg font-mono font-semibold text-black dark:text-white">
          Want your real results?
        </h2>
        <p className="text-black/70 dark:text-slate-400">
          Connect your email in less than 2 minutes. We read metadata only (sender addresses and subject lines), never the contents of your emails. Your token is stored safely and cleared from our systems once the scan is complete.
        </p>
        <div className="flex flex-col gap-3 pt-2">
          <a
            href="/auth/signin"
            className="inline-flex items-center justify-center rounded-none border border-[#1a1815] bg-[#1a1815] px-6 py-3 font-mono font-semibold text-[#faf8f5] transition hover:bg-[#2a241d] dark:border-[#2a251f] dark:bg-[#2a251f] dark:hover:bg-[#3a3128] w-full sm:w-auto"
          >
            Scan Gmail
          </a>
        </div>
      </section>
    </div>
  )
}
