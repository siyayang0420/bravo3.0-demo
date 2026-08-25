// Component — the dashed "nothing here yet" card (Figma 19895:20914).
//
// One shape, reused by every surface a brand-new account lands on: a dashed
// outline, a line or two of copy, an optional black CTA, and an optional fan
// of photos that is deliberately CLIPPED by the card's bottom edge. The fan is
// the part that makes it feel designed rather than blank — it shows what the
// space will hold once you have filled it, half-hidden, like a stack of
// prints slid under the card.
//
// Each screen supplies its own copy. The shape stays fixed, so a first
// session reads as one idea repeated rather than five different apologies.
import Button from './Button'

export default function EmptyState({
  lines,
  cta,
  onCta,
  photos,
}: {
  /** One line per string — the design stacks two, centred. */
  lines: string[]
  /** Label for the black button. Omitted where there is nothing to do yet. */
  cta?: string
  onCta?: () => void
  /**
   * Three photos for the fan. Omitted where a preview would mislead — the
   * card still reads correctly as copy plus CTA.
   */
  photos?: string[]
}) {
  return (
    <div className="bv-empty-card">
      <p className="bv-empty-copy">
        {lines.map((line, i) => (
          // Not <br>-joined into one string: keeping them as elements lets a
          // screen pass one line or three without the copy changing shape.
          <span key={i}>{line}</span>
        ))}
      </p>

      {cta && (
        <Button size="sm" variant="solid" onClick={onCta}>
          {cta}
        </Button>
      )}

      {photos && photos.length > 0 && (
        // Fixed 162×52 in the design — the cards inside are taller than that
        // and run past the card's bottom edge, where the card clips them.
        <div className="bv-empty-fan" aria-hidden>
          {photos.slice(0, 3).map((photo, i) => (
            <span
              key={i}
              className={`bv-empty-fan-card i${i}`}
              style={{ backgroundImage: `url(${photo})` }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
