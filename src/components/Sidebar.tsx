import type { ReactNode } from 'react'
import {
  GitCompareArrows,
  Smartphone,
  Lightbulb,
  Code2,
  Component,
} from 'lucide-react'

export type SectionId =
  | 'changes'
  | 'demo'
  | 'system'
  | 'rationale'
  | 'flutter'

// Live UI Demo leads — it is the thing to look at first.
const NAV_ITEMS: { id: SectionId; label: string; icon: ReactNode }[] = [
  { id: 'demo', label: 'Live UI Demo', icon: <Smartphone size={16} /> },
  { id: 'changes', label: "What's Changed", icon: <GitCompareArrows size={16} /> },
  { id: 'system', label: 'Design System', icon: <Component size={16} /> },
  { id: 'rationale', label: 'Design Rationale', icon: <Lightbulb size={16} /> },
  { id: 'flutter', label: 'Flutter Handoff', icon: <Code2 size={16} /> },
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
