import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  /** Use the danger border treatment (e.g. delete account). */
  tone?: 'default' | 'danger'
}

/**
 * Hevet panel i den rikere "European Digital"-stilen: avrundede hjørner,
 * 1px ramme og en subtil overflate som løfter kortet over lerretet.
 */
export function Card({ children, className = '', tone = 'default' }: CardProps) {
  const border =
    tone === 'danger'
      ? 'border-error/30 dark:border-error/50'
      : 'border-border dark:border-dark-border'
  return (
    <div
      className={`rounded-lg border ${border} bg-surface dark:bg-dark-surface p-6 ${className}`}
    >
      {children}
    </div>
  )
}

export function CardTitle({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h2
      className={`font-mono text-lg font-semibold text-text-primary dark:text-dark-text-primary ${className}`}
    >
      {children}
    </h2>
  )
}

/**
 * Lett "underpanel" inne i et Card — brukes til listerader (tilkoblede
 * innbokser, skanninger) der vi vil ha en svak inndeling uten full kort-vekt.
 */
export function Panel({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-md border border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas p-4 ${className}`}
    >
      {children}
    </div>
  )
}
