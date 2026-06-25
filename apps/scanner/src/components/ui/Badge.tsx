import type { ReactNode } from 'react'

export type BadgeTone = 'ok' | 'pending' | 'error' | 'neutral' | 'info'

// Pille-badge i den rikere stilen. Tekstfargene er valgt for god kontrast i
// BÅDE lys og mørk modus (WCAG): mørkere toner i lys modus, lysere i mørk.
const TONES: Record<BadgeTone, string> = {
  ok: 'border-success/30 bg-success/10 text-[#047857] dark:text-success',
  pending: 'border-warning/40 bg-warning/10 text-[#b45309] dark:text-warning',
  error: 'border-error/30 bg-error/10 text-[#b91c1c] dark:text-error',
  neutral:
    'border-border dark:border-dark-border bg-text-secondary/10 text-text-secondary dark:text-dark-text-secondary',
  info: 'border-secondary-accent/30 bg-secondary-accent/10 text-[#0369a1] dark:text-secondary-accent',
}

interface BadgeProps {
  tone?: BadgeTone
  children: ReactNode
  /** Optional leading dot for status-at-a-glance. */
  dot?: boolean
}

const DOT_TONES: Record<BadgeTone, string> = {
  ok: 'bg-success',
  pending: 'bg-warning',
  error: 'bg-error',
  neutral: 'bg-text-secondary',
  info: 'bg-secondary-accent',
}

export function Badge({ tone = 'neutral', children, dot = false }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-xs font-bold uppercase tracking-wide ${TONES[tone]}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${DOT_TONES[tone]}`} aria-hidden />}
      {children}
    </span>
  )
}
