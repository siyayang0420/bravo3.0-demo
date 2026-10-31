import type { ReactNode } from 'react'
import { Smartphone, Monitor, Users } from 'lucide-react'

export type SectionId = 'demo' | 'social' | 'web'

// Live UI Demo leads — it is the thing to look at first. Social UI Demo sits
// directly under it because it is a copy of it: same app, separate files, a
// place to try changes without touching the signed-off one.
const NAV_ITEMS: { id: SectionId; label: string; icon: ReactNode }[] = [
  { id: 'demo', label: 'Live UI Demo', icon: <Smartphone size={16} /> },
  { id: 'social', label: 'Social UI Demo', icon: <Users size={16} /> },
  { id: 'web', label: 'Web', icon: <Monitor size={16} /> },
]

export default function Sidebar({
  active,
  onSelect,
}: {
  active: SectionId
  onSelect: (id: SectionId) => void
}) {
  return (
    <nav className="sidebar">
      <div className="sidebar-label">Review</div>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`sidebar-item ${active === item.id ? 'active' : ''}`}
          onClick={() => onSelect(item.id)}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </nav>
  )
}
