// Component — the All / Restaurant / People filter pills in the search
// sheet (Figma 19542:163501).
//
// Same pill box as FilterChip — neutral-100, 6/12, radius-full, DM Sans
// Medium 14 — but the active one is neutral-800 with the `accent-pressed`
// inset rather than `bubble`.
import { motion } from 'framer-motion'

export type SearchTabId = 'all' | 'restaurant' | 'people'

const TABS: { id: SearchTabId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'people', label: 'People' },
]

export default function SearchTabs({
  active,
  onSelect,
}: {
  active: SearchTabId
  onSelect: (id: SearchTabId) => void
}) {
  return (
    <div className="sv-search-tabs" role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          className={`sv-search-tab${active === tab.id ? ' active' : ''}`}
          onClick={() => onSelect(tab.id)}
        >
          {/* One shared element slides between pills, so the dark fill
              travels rather than blinking off one and on to the next. */}
          {active === tab.id && (
            <motion.span
              layoutId="sv-search-tab-fill"
              className="sv-search-tab-fill"
              transition={{ type: 'spring', duration: 0.36, bounce: 0.14 }}
            />
          )}
          <span className="sv-search-tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
