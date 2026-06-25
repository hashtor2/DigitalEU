import type { KeyboardEvent, ReactNode } from 'react'
import { useRef } from 'react'

export interface TabItem {
  id: string
  label: string
  icon?: ReactNode
}

interface TabBarProps {
  tabs: TabItem[]
  active: string
  onChange: (id: string) => void
  /** Accessible label for the tablist. */
  ariaLabel?: string
}

/**
 * Lett, avhengighetsfri (ingen Radix) faneliste med full tastatur-tilgang:
 * pil venstre/høyre flytter fokus mellom faner, Home/End hopper til
 * første/siste. Følger WAI-ARIA Tabs-mønsteret (role=tab/tablist,
 * aria-selected, roving tabindex).
 */
export function TabBar({ tabs, active, onChange, ariaLabel = 'Sections' }: TabBarProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const focusTab = (index: number) => {
    const clamped = (index + tabs.length) % tabs.length
    const tab = tabs[clamped]
    if (!tab) return
    refs.current[clamped]?.focus()
    onChange(tab.id)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        focusTab(index + 1)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        focusTab(index - 1)
        break
      case 'Home':
        event.preventDefault()
        focusTab(0)
        break
      case 'End':
        event.preventDefault()
        focusTab(tabs.length - 1)
        break
    }
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex flex-wrap gap-1 border-b border-border dark:border-dark-border"
    >
      {tabs.map((tab, index) => {
        const selected = tab.id === active
        return (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[index] = el
            }}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-2.5 font-mono text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas dark:focus-visible:ring-offset-dark-canvas ${
              selected
                ? 'border-accent text-accent'
                : 'border-transparent text-text-secondary hover:text-text-primary dark:text-dark-text-secondary dark:hover:text-dark-text-primary'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

interface TabPanelProps {
  id: string
  active: boolean
  children: ReactNode
}

/** Innholdspanel knyttet til en fane via aria-labelledby. */
export function TabPanel({ id, active, children }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      aria-hidden={!active}
      hidden={!active}
      tabIndex={active ? 0 : -1}
      className="focus:outline-none"
    >
      {children}
    </div>
  )
}
