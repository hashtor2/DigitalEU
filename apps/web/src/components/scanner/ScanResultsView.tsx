import type { EnrichedScanResult } from '@/lib/scan'

const categoryLabels: Record<string, string> = {
  email: '📧 Email Services',
  streaming: '🎬 Streaming',
  music: '🎵 Music',
  storage: '☁️ Cloud Storage',
  'cloud-storage': '☁️ Cloud Storage',
  ai: '🤖 AI Tools',
  productivity: '📝 Productivity',
  messaging: '💬 Messaging',
  communication: '💬 Communication',
  development: '👨‍💻 Development',
  ecommerce: '🛍️ E-commerce',
  creative: '🎨 Creative',
  design: '✏️ Design',
  social: '👥 Social Media',
  'social-media': '👥 Social Media',
  analytics: '📊 Analytics',
  video: '📹 Video',
  other: '📦 Other',
}

interface ScanResultsViewProps {
  grouped: Record<string, EnrichedScanResult[]>
  scannedCount?: number
  providerLabel?: string
  backHref: string
  backLabel?: string
  showExport?: boolean
}

export function ScanResultsView({
  grouped,
  scannedCount,
  providerLabel,
  backHref,
  backLabel = 'Back to dashboard',
  showExport = false,
}: ScanResultsViewProps) {
  const flatResults = Object.values(grouped).flat()
  const total = flatResults.length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-mono font-bold mb-2 text-text-primary dark:text-dark-text-primary">
          Your digital footprint
        </h1>
        <p className="text-text-secondary dark:text-dark-text-secondary">
          We found {total} service{total === 1 ? '' : 's'} linked to your inbox.
          {scannedCount ? ` Analyzed ${scannedCount} messages from ${providerLabel ?? 'your inbox'}.` : ''}
        </p>
      </div>

      {Object.entries(grouped).map(([category, services]) => (
        <section key={category} className="space-y-4">
          <h2 className="text-2xl font-mono font-semibold text-text-primary dark:text-dark-text-primary">
            {categoryLabels[category] || category}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {services.map((result) => (
              <div
                key={result.service_id}
                className="rounded-sm border border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-mono font-semibold text-lg text-text-primary dark:text-dark-text-primary">
                      {result.service?.name}
                    </h3>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">
                      Detected from {result.sample_senders?.length || 1} sender
                      {result.sample_senders?.length !== 1 ? 's' : ''}
                      {result.detected_count > 1 ? ` (${result.detected_count} messages)` : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="inline-block rounded-sm bg-accent/10 px-3 py-1">
                      <span className="text-sm font-mono font-semibold text-accent">
                        {Math.round((result.confidence || 0.9) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {result.service?.website_url && (
                    <a
                      href={result.service.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary truncate"
                    >
                      {result.service.website_url}
                    </a>
                  )}

                  <a
                    href={`/scanner/cancel/${result.service_id}`}
                    className="inline-block rounded-sm bg-accent/10 px-3 py-2 text-sm font-mono font-semibold text-accent hover:bg-accent/20 transition"
                  >
                    How to cancel →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="rounded-sm border border-border dark:border-dark-border bg-surface dark:bg-dark-surface p-6">
        <h3 className="font-mono font-semibold mb-3 text-text-primary dark:text-dark-text-primary">
          Next steps
        </h3>
        <ol className="space-y-2 text-text-secondary dark:text-dark-text-secondary">
          <li className="flex gap-3">
            <span className="font-mono font-bold text-accent">1</span>
            <span>Review the European alternatives for each service.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono font-bold text-accent">2</span>
            <span>Follow the cancellation guides to migrate your data.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono font-bold text-accent">3</span>
            <span>Update your email subscriptions to your new European service.</span>
          </li>
        </ol>
      </div>

      <div className="flex gap-4 justify-center">
        <a
          href={backHref}
          className="px-6 py-2 rounded-sm border border-border dark:border-dark-border text-text-primary dark:text-dark-text-primary font-mono font-semibold hover:bg-border dark:hover:bg-dark-border transition"
        >
          {backLabel}
        </a>
        {showExport && (
          <button
            type="button"
            className="px-6 py-2 rounded-sm bg-accent font-mono font-semibold text-white hover:bg-accent-hover transition"
          >
            Export results
          </button>
        )}
      </div>
    </div>
  )
}
