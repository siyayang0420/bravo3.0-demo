// Component — the standard pushed-screen header (Figma 19608:9127 on the
// challenge detail, 19612:9480 on the merchants list). Identical in both:
// a 32px borderless back button, 6px gap, Boldonse 14px title, sitting
// 65px down so it clears the status bar and the dynamic island.
import { ArrowLeft } from 'lucide-react'

export default function ScreenNav({
  title,
  trailing,
  onBack,
}: {
  title: string
  /** Optional right-aligned label, e.g. "Invited: 4/4". Same type as the
      title — it reads as a second heading, not as metadata. */
  trailing?: string
  onBack: () => void
}) {
  return (
    <header className="sv-screen-nav">
      <button type="button" className="sv-screen-back" aria-label="Back" onClick={onBack}>
        <ArrowLeft size={20} strokeWidth={1.9} />
      </button>
      <span className="sv-screen-nav-title">{title}</span>
      {trailing && <span className="sv-screen-nav-trailing">{trailing}</span>}
    </header>
  )
}
