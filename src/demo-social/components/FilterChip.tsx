// Component — Figma "Button" filter chip (node 19453:11111)
// Annotation from Figma: other than Cuisine and Price (default),
// remaining 2–3 tags are LLM-generated from user preferences.
import { ChevronDown } from 'lucide-react'

export default function FilterChip({
  label,
  hasDropdown = false,
  onClick,
}: {
  label: string
  hasDropdown?: boolean
  onClick?: () => void
}) {
  return (
    <button className="sv-filter-chip" onClick={onClick}>
      {label}
      {hasDropdown && <ChevronDown size={16} strokeWidth={2.2} />}
    </button>
  )
}
