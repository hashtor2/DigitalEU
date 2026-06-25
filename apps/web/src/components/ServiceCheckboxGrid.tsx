import { useState, useMemo } from 'react'
import type { ServiceCategory } from '@digitaleu/shared'
import { ALTERNATIVES } from '@digitaleu/shared'
import { COUNTRY_FLAGS } from '@/lib/flags'

const CATEGORY_LABELS: Record<ServiceCategory | string, string> = {
  email: 'Email',
  vpn: 'VPN',
  'cloud-storage': 'Cloud Storage',
  browser: 'Browser',
  'password-manager': 'Password Manager',
  search: 'Search',
  office: 'Office Suite',
  messaging: 'Messaging',
  'code-hosting': 'Code Hosting',
  'cloud-infra': 'Infrastructure',
  analytics: 'Analytics',
  hardware: 'Hardware',
  ai: 'AI Tools',
  fintech: 'Fintech',
  'project-management': 'Project Management',
  security: 'Security',
  social: 'Social Media',
  transport: 'Transport',
}

interface ServiceCheckboxGridProps {
  selected: Set<string>
  onToggle: (serviceId: string) => void
  onSelectAll?: () => void
  onClearAll?: () => void
}

export function ServiceCheckboxGrid({
  selected,
  onToggle,
  onSelectAll,
  onClearAll,
}: ServiceCheckboxGridProps) {
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  )

  const allCategories = useMemo(
    () => Array.from(new Set(ALTERNATIVES.map(a => a.category))),
    []
  )

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return ALTERNATIVES.filter(alt => {
      const matchesSearch =
        !q ||
        alt.name.toLowerCase().includes(q) ||
        alt.description.toLowerCase().includes(q) ||
        alt.replaces.some(r => r.toLowerCase().includes(q))
      const matchesCategory =
        selectedCategories.size === 0 || selectedCategories.has(alt.category)
      return matchesSearch && matchesCategory
    })
  }, [search, selectedCategories])

  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <input
        type="search"
        placeholder="Search services or what you want to replace..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-4 py-3 rounded-sm border border-border dark:border-dark-border
                   bg-canvas dark:bg-dark-canvas text-text-primary dark:text-dark-text-primary
                   placeholder:text-text-secondary dark:placeholder:text-dark-text-secondary
                   focus:outline-none focus:border-accent dark:focus:border-accent"
      />

      {/* Category Filter */}
      <div className="space-y-2">
        <p className="text-xs font-mono font-semibold uppercase tracking-wider text-text-primary dark:text-dark-text-primary">
          Categories
        </p>
        <div className="flex flex-wrap gap-2">
          {allCategories.map(cat => {
            const active = selectedCategories.has(cat)
            return (
              <button
                key={cat}
                onClick={() => handleCategoryToggle(cat)}
                className={`px-3 py-1.5 rounded-sm text-xs font-mono transition ${
                  active
                    ? 'bg-accent text-white'
                    : 'border border-border dark:border-dark-border text-text-primary dark:text-dark-text-primary hover:border-accent dark:hover:border-accent'
                }`}
              >
                {CATEGORY_LABELS[cat] ?? cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Service Grid */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(service => (
            <label
              key={service.id}
              className="flex items-start gap-3 p-4 rounded-sm border border-border dark:border-dark-border
                         bg-canvas dark:bg-dark-canvas hover:border-accent dark:hover:border-accent
                         cursor-pointer transition group"
            >
              <input
                type="checkbox"
                checked={selected.has(service.id)}
                onChange={() => onToggle(service.id)}
                className="mt-1 w-5 h-5 rounded-sm accent-accent"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-semibold text-text-primary dark:text-dark-text-primary">
                    {service.name}
                  </span>
                  {service.country && (
                    <span className="text-sm" title={service.country}>
                      {COUNTRY_FLAGS[service.country as keyof typeof COUNTRY_FLAGS] || '🌍'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                  {service.description}
                </p>
                {service.replaces && service.replaces.length > 0 && (
                  <p className="text-[10px] text-text-secondary/70 dark:text-dark-text-secondary/70 mt-2">
                    Replaces: {service.replaces.join(', ')}
                  </p>
                )}
              </div>
            </label>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-text-secondary dark:text-dark-text-secondary py-8">
            No services found. Try a different search or category.
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        {onSelectAll && (
          <button
            onClick={onSelectAll}
            className="px-3 py-2 rounded-sm text-xs font-mono border border-border dark:border-dark-border
                       text-text-primary dark:text-dark-text-primary hover:bg-border dark:hover:bg-dark-border transition"
          >
            Select all
          </button>
        )}
        {onClearAll && selected.size > 0 && (
          <button
            onClick={onClearAll}
            className="px-3 py-2 rounded-sm text-xs font-mono border border-border dark:border-dark-border
                       text-text-primary dark:text-dark-text-primary hover:bg-border dark:hover:bg-dark-border transition"
          >
            Clear all
          </button>
        )}
        <span className="text-xs text-text-secondary dark:text-dark-text-secondary ml-auto">
          {selected.size} selected
        </span>
      </div>
    </div>
  )
}
