import type { DomainMapping, MigrationStatus } from '@digitaleu/shared'

const difficultyLabel: Record<NonNullable<DomainMapping['actions']>['difficulty'] & string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

const difficultyColor: Record<NonNullable<DomainMapping['actions']>['difficulty'] & string, string> = {
  easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  hard: 'text-red-400 bg-red-500/10 border-red-500/20',
}

const statusLabel: Record<MigrationStatus, string> = {
  'detected': 'Detected',
  'in-progress': 'In progress',
  'switched': 'Switched',
  'skipped': 'Skipped',
}

const statusColor: Record<MigrationStatus, string> = {
  'detected': 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  'in-progress': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'switched': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'skipped': 'text-slate-500 bg-slate-700/10 border-slate-700/20',
}

interface AccountActionCardProps {
  mapping: DomainMapping
  status?: MigrationStatus
  onStatusChange?: (status: MigrationStatus) => void
}

function ActionButton({
  href,
  label,
  variant,
}: {
  href: string
  label: string
  variant: 'primary' | 'secondary' | 'danger'
}) {
  const styles = {
    primary:
      'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20',
    secondary:
      'border-[#2d4a6e] bg-[#0f2040] text-slate-300 hover:border-slate-500 hover:text-slate-200',
    danger:
      'border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20',
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${styles[variant]}`}
    >
      {label}
      <span aria-hidden="true" className="opacity-60">↗</span>
    </a>
  )
}

export function AccountActionCard({
  mapping,
  status = 'detected',
  onStatusChange,
}: AccountActionCardProps) {
  const { actions } = mapping
  const difficulty = actions?.difficulty

  return (
    <div
      className={`rounded-lg border bg-[#1e293b] p-5 space-y-4 transition-colors ${
        status === 'switched'
          ? 'border-emerald-500/30 opacity-70'
          : status === 'skipped'
          ? 'border-[#2d4a6e] opacity-50'
          : 'border-[#2d4a6e] hover:border-emerald-500/20'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-white truncate">{mapping.serviceName}</h3>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{mapping.domain}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {difficulty && (
            <span
              className={`text-xs font-bold rounded-full border px-2 py-0.5 ${difficultyColor[difficulty]}`}
              title="How hard this service makes it to take action"
            >
              {difficultyLabel[difficulty]}
            </span>
          )}
          <span
            className={`text-xs font-bold rounded-full border px-2 py-0.5 ${statusColor[status]}`}
          >
            {statusLabel[status]}
          </span>
        </div>
      </div>

      {/* Notes */}
      {actions?.notes && (
        <p className="text-xs text-slate-400 leading-relaxed border-l-2 border-[#2d4a6e] pl-3">
          {actions.notes}
        </p>
      )}

      {/* Action buttons */}
      {actions && (
        <div className="flex flex-wrap gap-2">
          {actions.changeEmailUrl && (
            <ActionButton
              href={actions.changeEmailUrl}
              label="Change email"
              variant="secondary"
            />
          )}
          {actions.dataExportUrl && (
            <ActionButton
              href={actions.dataExportUrl}
              label="Export data"
              variant="secondary"
            />
          )}
          {actions.deleteAccountUrl && (
            <ActionButton
              href={actions.deleteAccountUrl}
              label="Delete account"
              variant="danger"
            />
          )}
        </div>
      )}

      {/* Status controls */}
      {onStatusChange && status !== 'switched' && status !== 'skipped' && (
        <div className="flex gap-2 pt-1 border-t border-[#2d4a6e]">
          <button
            type="button"
            onClick={() => onStatusChange('switched')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Mark as switched ✓
          </button>
          <span className="text-slate-600">·</span>
          <button
            type="button"
            onClick={() => onStatusChange('skipped')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-400 transition-colors"
          >
            Skip
          </button>
        </div>
      )}

      {status === 'switched' && onStatusChange && (
        <div className="flex gap-2 pt-1 border-t border-[#2d4a6e]">
          <button
            type="button"
            onClick={() => onStatusChange('detected')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-400 transition-colors"
          >
            Undo
          </button>
        </div>
      )}
    </div>
  )
}
