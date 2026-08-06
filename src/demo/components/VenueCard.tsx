// Component — Figma venue card (19577:173665 / 19577:173703)
// The tagged place inside a post: thumbnail with a cashback badge, name
// and meta line, and a bookmark action.
import { useState } from 'react'
import CircleIconButton from './CircleIconButton'
import SaveGlyph from './SaveGlyph'

export type Venue = {
  name: string
  meta: string
  thumbnail: string
  cashback: string
}

export default function VenueCard({
  venue,
  onSave,
}: {
  venue: Venue
  onSave?: (saved: boolean) => void
}) {
  const [saved, setSaved] = useState(false)

  // Computed outside the updater: StrictMode invokes updaters twice, so a
  // side effect in there would fire the callback twice per tap.
  const toggle = () => {
    const next = !saved
    setSaved(next)
    onSave?.(next)
  }

  return (
    <div className="bv-venue">
      <div className="bv-venue-main">
        <div className="bv-venue-thumb">
          <img src={venue.thumbnail} alt="" />
          <span className="bv-venue-cashback">{venue.cashback}</span>
        </div>
        <div className="bv-venue-copy">
          <span className="bv-venue-name">{venue.name}</span>
          <span className="bv-venue-meta">{venue.meta}</span>
        </div>
      </div>
      {/* Same SaveGlyph as the merchants list, so both fill and pop
          identically. The press comes from .bv-circle-btn:active. */}
      <CircleIconButton
        icon={<SaveGlyph saved={saved} />}
        label={saved ? 'Saved' : 'Save place'}
        pressed={saved}
        flat
        onClick={toggle}
      />
    </div>
  )
}
