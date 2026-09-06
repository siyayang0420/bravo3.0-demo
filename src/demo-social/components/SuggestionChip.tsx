// Component — Figma suggestion chip (node 19453:11120)
//
// A question you can tap, led by an emoji standing for the KIND of thing it
// asks about. It used to carry a photo of one restaurant, which read as a
// promise that the chip would take you to that specific place — the emoji
// says "dim sum" or "new places" without naming anything it cannot deliver.
export default function SuggestionChip({
  emoji,
  label,
  onClick,
}: {
  /** One glyph, chosen for the question — see SUGGESTIONS in HomeScreen. */
  emoji: string
  label: string
  onClick?: () => void
}) {
  return (
    <button className="sv-suggestion-chip" onClick={onClick}>
      <span className="sv-suggestion-emoji" aria-hidden>
        {emoji}
      </span>
      {label}
    </button>
  )
}
