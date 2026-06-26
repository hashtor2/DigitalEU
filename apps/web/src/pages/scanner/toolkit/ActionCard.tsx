import { Link } from 'react-router-dom'
import { AFFILIATE_LINKS } from '@digitaleu/shared'
import type { EnrichedScanResult } from '@/lib/scan'
import { entryFor, type Progress, type ProgressEntry } from './types'

export function ActionCard({
  result,
  progress,
  onProgressChange,
}: {
  result: EnrichedScanResult
  progress: Progress
  onProgressChange: (id: string, entry: ProgressEntry) => void
}) {
  const id = result.service_id
  const entry = entryFor(progress, id)
  const name = result.service?.name ?? id
  const affiliateLink = AFFILIATE_LINKS[id]

  const steps: { key: keyof ProgressEntry; label: string; desc: string }[] = [
    {
      key: 'signedUp',
      label: 'Sign up for EU alternative',
      desc: 'Create your account with a European provider.',
    },
    {
      key: 'migrated',
      label: 'Migrate your data',
      desc: 'Export from old service and import into the new one.',
    },
    {
      key: 'deleted',
      label: 'Delete or cancel account',
      desc: 'Follow the cancellation guide to remove your data.',
    },
  ]

  const doneCount = [entry.signedUp, entry.migrated, entry.deleted].filter(Boolean).length
  const allDone = doneCount === 3

  return (
    <div
      className={`rounded-lg border p-5 space-y-4 transition-colors ${
        allDone ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-[#2d4a6e] bg-[#1e293b]'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white">{name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{doneCount}/3 steps complete</p>
        </div>
        {allDone && (
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-2 py-0.5">
            Migrated
          </span>
        )}
      </div>

      <div className="w-full h-1 bg-[#2d4a6e] rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all"
          style={{ width: `${(doneCount / 3) * 100}%` }}
        />
      </div>

      <div className="space-y-2">
        {steps.map(({ key, label, desc }) => (
          <label key={key} className="flex gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={entry[key]}
              onChange={(e) => onProgressChange(id, { ...entry, [key]: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded border-[#2d4a6e] bg-[#0f2040] accent-emerald-500 flex-shrink-0"
            />
            <div>
              <p className={`text-sm font-medium ${entry[key] ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                {label}
              </p>
              <p className="text-xs text-slate-500">{desc}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Link
          to={`/scanner/cancel/${id}`}
          className="inline-flex items-center gap-1 rounded-lg border border-[#2d4a6e] px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-slate-500 transition-colors"
        >
          Cancellation guide
        </Link>
        {affiliateLink && (
          <a
            href={affiliateLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-colors"
          >
            Try EU alternative
          </a>
        )}
      </div>
    </div>
  )
}

export function ProgressTracker({
  results,
  progress,
  onProgressChange,
}: {
  results: EnrichedScanResult[]
  progress: Progress
  onProgressChange: (id: string, entry: ProgressEntry) => void
}) {
  const total = results.length
  const migrated = results.filter((r) => {
    const e = entryFor(progress, r.service_id)
    return e.signedUp && e.migrated && e.deleted
  }).length

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Action Cards</h2>
        <div className="text-sm text-slate-400">
          <span className="text-white font-semibold">{migrated}</span> / {total} migrated
        </div>
      </div>

      <div className="w-full h-2 bg-[#2d4a6e] rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all"
          style={{ width: total > 0 ? `${(migrated / total) * 100}%` : '0%' }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {results.map((r) => (
          <ActionCard
            key={r.service_id}
            result={r}
            progress={progress}
            onProgressChange={onProgressChange}
          />
        ))}
      </div>
    </section>
  )
}
