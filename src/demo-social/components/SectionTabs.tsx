// Component — Figma social feed tabs (19564:171669)
// "For you" / "Friends". Set in Boldonse — the only place in the app that
// uses the display face — with a 2px rule under the active tab.
export default function SectionTabs<T extends string>({
  tabs,
  active,
  onSelect,
}: {
  tabs: { id: T; label: string }[]
  active: T
  onSelect: (id: T) => void
}) {
  return (
    <div className="sv-section-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`sv-section-tab ${active === tab.id ? 'active' : ''}`}
          onClick={() => onSelect(tab.id)}
        >
          <span className="sv-section-tab-label">{tab.label}</span>
          <span className="sv-section-tab-rule" />
        </button>
      ))}
    </div>
  )
}
