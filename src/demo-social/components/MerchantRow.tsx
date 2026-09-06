// Component — eligible-merchant row (Figma 19612:9555 and its six siblings).
//
// 79x89 photo with the cashback rate burned into a bottom gradient, then a
// 279px column that pushes the name/meta to the top and the savers row to
// the bottom. The save button here DOES carry a drop shadow — unlike the
// VenueCard one, which Siya had flattened.
import { useState } from 'react'
import { motion } from 'framer-motion'
import SaveGlyph from './SaveGlyph'

export type Merchant = {
  id: string
  name: string
  meta: string
  photo: string
  cashback: string
  /** Faces of people who saved it — the design shows three. */
  savers: string[]
  savedCount: number
}

export default function MerchantRow({ merchant }: { merchant: Merchant }) {
  const [saved, setSaved] = useState(false)
  // The count animates on change, but not on mount — otherwise all seven
  // numbers fade in when the list opens.
  const [touched, setTouched] = useState(false)
  const count = merchant.savedCount + (saved ? 1 : 0)

  const toggle = () => {
    setSaved((s) => !s)
    setTouched(true)
  }

  return (
    <article className="sv-merchant">
      <div className="sv-merchant-photo">
        <img src={merchant.photo} alt="" />
        <span className="sv-merchant-rate">{merchant.cashback}</span>
      </div>

      <div className="sv-merchant-body">
        <div className="sv-merchant-copy">
          <h3 className="sv-merchant-name">{merchant.name}</h3>
          <p className="sv-merchant-meta">{merchant.meta}</p>
        </div>

        <div className="sv-merchant-foot">
          <div className="sv-merchant-savers">
            <span className="sv-merchant-saver-stack">
              {merchant.savers.map((src, i) => (
                <span key={i} style={{ backgroundImage: `url(${src})` }} />
              ))}
            </span>
            <span className="sv-merchant-saved">
              Saved{' '}
              {/* Remounting on the value replays `initial`, so the number
                  rises into place without an AnimatePresence exit — which
                  would pull it out of the sentence and shift the line. */}
              <motion.span
                key={count}
                className="sv-merchant-saved-count"
                initial={touched ? { y: -5, opacity: 0 } : false}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
              >
                {count}
              </motion.span>{' '}
              times
            </span>
          </div>

          <motion.button
            type="button"
            className="sv-merchant-save"
            aria-label={saved ? 'Saved' : 'Save'}
            aria-pressed={saved}
            onClick={toggle}
            whileTap={{ scale: 0.86 }}
            transition={{ type: 'spring', stiffness: 520, damping: 24 }}
          >
            {/* The pop lives inside SaveGlyph, on its own layer, so it never
                fights whileTap on the button. */}
            <SaveGlyph saved={saved} />
          </motion.button>
        </div>
      </div>
    </article>
  )
}
