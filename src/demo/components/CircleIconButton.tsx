// Component — Figma "Icon Button" (circular, white, 35x35)
// Scan: 19548:163745 · Bell: 19548:163747 · Bookmark: 19577:173694
//
// `flat` drops the drop shadow. The shadow lifts the button off the map on
// Home; inside a bordered card (VenueCard) Figma has none.
import type { ReactNode } from 'react'

export default function CircleIconButton({
  icon,
  label,
  flat = false,
  pressed,
  onClick,
}: {
  icon: ReactNode
  label: string
  flat?: boolean
  /** Set only when the button is a toggle (VenueCard's bookmark). */
  pressed?: boolean
  onClick?: () => void
}) {
  return (
    <button
      className={`bv-circle-btn ${flat ? 'bv-circle-btn-flat' : ''}`}
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
    >
      {icon}
    </button>
  )
}
