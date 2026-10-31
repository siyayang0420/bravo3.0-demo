// Component — a committed search result (Figma 20302:25317, quote variant
// 20337:10882).
//
// 63x85 photo with the cashback rate pinned to its top-left corner, then name,
// meta, a grey tag (plus the yellow pickup tag, 20349:21032, when the venue
// takes pickup orders) and who saved it, with the bookmark on the right. The
// same card shows while typing and after Enter.
import { useState } from 'react'
import { motion } from 'framer-motion'
import SaveGlyph from './SaveGlyph'
import useDragScroll from '../hooks/useDragScroll'
import shoppingBag from '../assets/search/shopping-bag.svg'
import { type SearchHit } from '../data/searchDemo'

export default function SearchHitRow({
  hit,
  onOpen,
}: {
  hit: SearchHit
  /** Tapping the card — opens the store's detail page. */
  onOpen?: () => void
}) {
  const [saved, setSaved] = useState(false)
  // The tags stay on one line; when they outgrow the card they scroll
  // sideways (touch, trackpad, or a mouse drag on the review site).
  const tagRail = useDragScroll<HTMLDivElement>()

  return (
    <article className={`bv-hit${onOpen ? ' openable' : ''}`} onClick={onOpen}>
      <div className="bv-hit-photo">
        <img src={hit.photo} alt="" />
        <span className="bv-hit-rate">{hit.cashback}</span>
      </div>

      <div className="bv-hit-body">
        <div className="bv-hit-copy">
          <h3 className="bv-hit-name">{hit.name}</h3>
          <p className="bv-hit-meta">{hit.meta}</p>
        </div>
        <div className="bv-hit-tags" ref={tagRail}>
          <span className="bv-hit-tag">{hit.tag}</span>
          {hit.pickup && (
            <span className="bv-hit-tag pickup">
              <img src={shoppingBag} alt="" />
              Pickup order available
            </span>
          )}
        </div>
        <div className="bv-hit-savers">
          {/* No faces = a reason line ("Close to you…"), text only. */}
          {hit.savers.length > 0 && (
            <span className="bv-hit-faces">
              {hit.savers.map((src, i) => (
                <span key={i} style={{ backgroundImage: `url(${src})` }} />
              ))}
            </span>
          )}
          <span className="bv-hit-note">{hit.quote ? `“${hit.note}”` : hit.note}</span>
        </div>
      </div>

      <motion.button
        type="button"
        className="bv-hit-save"
        aria-label={saved ? 'Saved' : 'Save'}
        aria-pressed={saved}
        // Saving is its own action — it must not also open the store.
        onClick={(e) => {
          e.stopPropagation()
          setSaved((s) => !s)
        }}
        whileTap={{ scale: 0.86 }}
        transition={{ type: 'spring', stiffness: 520, damping: 24 }}
      >
        <SaveGlyph saved={saved} size={16} />
      </motion.button>
    </article>
  )
}
