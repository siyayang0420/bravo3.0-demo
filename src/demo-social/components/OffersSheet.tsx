// Component — the "Offers for you" bottom sheet (Figma 19243:4646, shown
// in place on Home at 19650:15069).
//
// Replaces the old centred Featured-promotions modal: this slides up from
// the bottom edge, covers the dock, and carries BOTH sections — the
// activatable merchant offers and the top-up promotions under them.
//
// The surface is translucent white over a 7.5px backdrop blur, so the map
// reads through it. There is no scrim in the design; the tap-catcher above
// the sheet is transparent and exists only so tapping the map closes it.
import { useState } from 'react'
import { motion, type PanInfo } from 'framer-motion'
import { X } from 'lucide-react'
import OfferCard, { type Offer } from './OfferCard'
import PromoCard, { type PromoExpiryStyle } from './PromoCard'

export type Promotion = {
  id: string
  title: string
  expiry: string
  expiryStyle?: PromoExpiryStyle
}

// Flick down, or drag past a third of the way, to dismiss.
const DISMISS_OFFSET = 120
const DISMISS_VELOCITY = 500

export default function OffersSheet({
  offers,
  promotions,
  onClose,
  onTopUp,
}: {
  offers: Offer[]
  promotions: Promotion[]
  onClose?: () => void
  onTopUp?: (id: string) => void
}) {
  // Which offers the user has activated. Local to the demo — in the product
  // this comes back from the activation call.
  const [activated, setActivated] = useState<string[]>([])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > DISMISS_OFFSET || info.velocity.y > DISMISS_VELOCITY) {
      onClose?.()
    }
  }

  return (
    <motion.div
      className="sv-offers-sheet"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 340, damping: 36, mass: 0.8 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.5 }}
      onDragEnd={onDragEnd}
    >
      {/* The handle is the drag affordance the design shows. */}
      <span className="sv-offers-handle" />

      {/* Same corner as every other sheet (Figma 19661:16109) rather than
          inline in the header — Siya's call, for consistency. */}
      <button
        type="button"
        className="sv-sheet-close sv-sheet-close-corner"
        aria-label="Close offers"
        onClick={onClose}
      >
        <X size={20} strokeWidth={2} />
      </button>

      <div className="sv-offers-body">
        <header className="sv-offers-head">
          <div className="sv-offers-titles">
            <h2 className="sv-offers-title">Offers for you</h2>
            <p className="sv-offers-sub">Each offer can only be used once</p>
          </div>
        </header>

        <div className="sv-offers-scroll">
          <div className="sv-offers-list">
            {offers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                activated={activated.includes(offer.id)}
                onActivate={() => setActivated((prev) => [...prev, offer.id])}
              />
            ))}
          </div>

          <section className="sv-offers-promos">
            <h2 className="sv-offers-title">Featured promotions</h2>
            <div className="sv-promo-list">
              {promotions.map((promo) => (
                <PromoCard
                  key={promo.id}
                  title={promo.title}
                  expiry={promo.expiry}
                  expiryStyle={promo.expiryStyle}
                  onTopUp={() => onTopUp?.(promo.id)}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  )
}
