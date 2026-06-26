import { useState } from 'react'
import { DOMAIN_MAPPINGS } from '@digitaleu/shared'
import type { MigrationStatus } from '@digitaleu/shared'
import type { EnrichedScanResult } from '@/lib/scan'
import { AccountActionCard } from './AccountActionCard'

const categoryLabels: Record<string, string> = {
  email: 'Email Services',
  streaming: 'Streaming',
  music: 'Music',
  storage: 'Cloud Storage',
  'cloud-storage': 'Cloud Storage',
  ai: 'AI Tools',
  productivity: 'Productivity',
  messaging: 'Messaging',
  communication: 'Communication',
  development: 'Development',
  ecommerce: 'E-commerce',
  creative: 'Creative',
  design: 'Design',
  social: 'Social Media',
  'social-media': 'Social Media',
  analytics: 'Analytics',
  video: 'Video',
  other: 'Other',
}

interface ScanResultsViewProps {
  grouped: Record<string, EnrichedScanResult[]>
  scannedCount?: number
  providerLabel?: string
  backHref: string
  backLabel?: string
  showExport?: boolean
  /** When true, Action Cards are shown in full instead of the teaser lock. */
  toolkitUnlocked?: boolean
}

export function ScanResultsView({
  grouped,
  scannedCount,
  providerLabel,
  backHref,
  backLabel = 'Back to dashboard',
  showExport = false,
  toolkitUnlocked = false,
}: ScanResultsViewProps) {
  const flatResults = Object.values(grouped).flat()
  const total = flatResults.length

  // Local migration status per service_id (guest-mode: lives only in this render)
  const [statusMap, setStatusMap] = useState<Record<string, MigrationStatus>>({})
  const setStatus = (serviceId: string, status: MigrationStatus) =>
    setStatusMap((prev) => ({ ...prev, [serviceId]: status }))

  const switchedCount = Object.values(statusMap).filter((s) => s === 'switched').length

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
          Scan Results
        </p>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Your digital footprint
        </h1>
        <p className="text-slate-400">
          Found <span className="text-white font-semibold">{total} service{total === 1 ? '' : 's'}</span> linked to your inbox.
          {scannedCount ? (
            <> Analyzed <span className="text-white font-semibold">{scannedCount}</span> messages from {providerLabel ?? 'your inbox'}.</>
          ) : null}
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-[#2d4a6e] bg-[#1e293b] p-4 text-center">
          <p className="text-2xl font-bold text-white">{total}</p>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">Services found</p>
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{total}</p>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">EU alternatives</p>
        </div>
        <div className="rounded-lg border border-[#2d4a6e] bg-[#1e293b] p-4 text-center">
          <p className="text-2xl font-bold text-slate-300">{scannedCount ?? '—'}</p>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">Emails scanned</p>
        </div>
        <div className="rounded-lg border border-[#2d4a6e] bg-[#1e293b] p-4 text-center">
          <p className="text-2xl font-bold text-slate-300">{Object.keys(grouped).length}</p>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">Categories</p>
        </div>
      </div>

      {/* Toolkit progress bar (only when unlocked) */}
      {toolkitUnlocked && total > 0 && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-300">Migration progress</span>
            <span className="text-slate-400">
              <span className="text-white font-semibold">{switchedCount}</span> of {total} switched
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#1e293b] overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: total > 0 ? `${(switchedCount / total) * 100}%` : '0%' }}
            />
          </div>
        </div>
      )}

      {/* Results by category */}
      {Object.entries(grouped).map(([category, services]) => (
        <section key={category} className="space-y-4">
          <h2 className="text-lg font-semibold text-white border-b border-[#2d4a6e] pb-2">
            {categoryLabels[category] || category}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {services.map((result) => {
              const mapping = DOMAIN_MAPPINGS.find((m) => m.id === result.service_id)
              const status = statusMap[result.service_id] ?? 'detected'

              // If toolkit is unlocked and we have a mapping, show the full Action Card
              if (toolkitUnlocked && mapping) {
                return (
                  <AccountActionCard
                    key={result.service_id}
                    mapping={mapping}
                    status={status}
                    onStatusChange={(s) => setStatus(result.service_id, s)}
                  />
                )
              }

              // Default: simple service card (free tier)
              return (
                <div
                  key={result.service_id}
                  className="rounded-lg border border-[#2d4a6e] bg-[#1e293b] p-5 hover:border-emerald-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white">
                        {result.service?.name ?? result.service_id}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {result.detected_count} message{result.detected_count !== 1 ? 's' : ''} detected
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                      {Math.round((result.confidence || 0.9) * 100)}%
                    </span>
                  </div>

                  {result.service?.website_url && (
                    <a
                      href={result.service.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs text-slate-500 hover:text-slate-300 truncate mb-3 transition-colors"
                    >
                      {result.service.website_url}
                    </a>
                  )}

                  <a
                    href={`/scanner/cancel/${result.service_id}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                  >
                    Migration guide →
                  </a>
                </div>
              )
            })}
          </div>
        </section>
      ))}

      {/* Migration Toolkit upsell */}
      <div className="rounded-lg border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-[#1e293b] p-6 space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-1">
            Migration Toolkit — €5
          </p>
          <h3 className="text-lg font-bold text-white">
            Your personal migration plan is one step away
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            The scan showed you the problem. The Toolkit gives you everything to act on it.
          </p>
        </div>
        <ul className="space-y-2">
          {[
            ['Action Cards', 'Step-by-step migration guide for each detected service'],
            ['Progress Tracker', 'Tick off services as you migrate — stay on top of your plan'],
            ['GDPR Generator', 'Ready-to-send erasure letters for every Big Tech company'],
          ].map(([title, desc]) => (
            <li key={title} className="flex gap-3 items-start">
              <span className="text-emerald-400 flex-shrink-0 mt-0.5">✓</span>
              <span className="text-sm text-slate-300">
                <span className="font-semibold text-white">{title}</span>
                {' '}— {desc}
              </span>
            </li>
          ))}
        </ul>
        <a
          href="/scanner/toolkit"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-600 transition-colors"
        >
          Unlock Migration Toolkit — €5
        </a>
      </div>

      {/* Footer actions */}
      <div className="flex flex-wrap gap-3">
        <a
          href={backHref}
          className="px-5 py-2 rounded-lg border border-[#2d4a6e] text-sm font-semibold text-slate-300 hover:border-slate-500 transition-colors"
        >
          {backLabel}
        </a>
        {showExport && (
          <button
            type="button"
            className="px-5 py-2 rounded-lg bg-emerald-500 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors"
          >
            Export results
          </button>
        )}
      </div>
    </div>
  )
}
