// Component — the venue card a map pin opens (Figma 19868:16231).
//
// Two photos side by side: the cashback rate burns onto the first, the
// savers pill and bookmark sit on the second. Below them the venue's logo,
// name, and a meta/distance line. Frosted rather than solid, because it
// sits over the map and the street underneath should still read through.
import { Bookmark } from 'lucide-react'
import { type MapVenue } from './MapView'

export default function MapVenueCard({
  venue,
  onOpen,
}: {
  venue: MapVenue
  /** Tapping the card — opens the venue's full detail screen. */
  onOpen?: () => void
}) {
  return (
    <div
      className="bv-venue-card"
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (!onOpen) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      }}
    >
      <div className="bv-venue-photos">
        <div className="bv-venue-photo">
          <img src={venue.photos[0]} alt="" />
          <span className="bv-venue-rate">{venue.cashback}</span>
        </div>
        <div className="bv-venue-photo">
          <img src={venue.photos[1]} alt="" />
          <div className="bv-venue-savers">
            <span className="bv-venue-saver-stack">
              {venue.savers.map((face, i) => (
                <span key={i} style={{ backgroundImage: `url(${face})` }} />
              ))}
            </span>
            <span className="bv-venue-saver-count">{venue.savedLabel}</span>
            <Bookmark size={20} strokeWidth={1.9} />
          </div>
        </div>
      </div>

      <div className="bv-venue-copy">
        <div className="bv-venue-title-row">
          <img className="bv-venue-logo" src={venue.logo} alt="" />
          <span className="bv-venue-title">{venue.title}</span>
        </div>
        <div className="bv-venue-meta">
          <span>{venue.meta}</span>
          <span>{venue.distance}</span>
        </div>
      </div>
    </div>
  )
}
