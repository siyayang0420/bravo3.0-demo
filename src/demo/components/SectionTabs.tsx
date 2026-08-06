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
    <div className="bv-section-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`bv-section-tab ${active === tab.id ? 'active' : ''}`}
          onClick={() => onSelect(tab.id)}
        >
          <span className="bv-section-tab-label">{tab.label}</span>
          <span className="bv-section-tab-rule" />
        </button>
      ))}
    </div>
  )
}
