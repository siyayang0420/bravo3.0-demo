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
  hidden,
  onSelect,
}: {
  active: SearchTabId
  /** Tabs with nothing in them, left out of the row. */
  hidden?: SearchTabId[]
  onSelect: (id: SearchTabId) => void
}) {
  return (
    <div className="bv-search-tabs" role="tablist">
      {TABS.filter((tab) => !hidden?.includes(tab.id)).map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          className={`bv-search-tab${active === tab.id ? ' active' : ''}`}
          onClick={() => onSelect(tab.id)}
        >
          {/* One shared element slides between pills, so the dark fill
              travels rather than blinking off one and on to the next. */}
          {active === tab.id && (
            <motion.span
              layoutId="bv-search-tab-fill"
              className="bv-search-tab-fill"
              transition={{ type: 'spring', duration: 0.36, bounce: 0.14 }}
            />
          )}
          <span className="bv-search-tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
