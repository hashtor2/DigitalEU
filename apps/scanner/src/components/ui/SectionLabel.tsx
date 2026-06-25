import type { ReactNode } from 'react'

/** Liten "eyebrow"-etikett over en seksjonsoverskrift. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
      {children}
    </p>
  )
}
