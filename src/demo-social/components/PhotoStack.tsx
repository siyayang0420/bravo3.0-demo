// Component — a leaning deck of photos you can swipe through.
//
// The front photo sits square, the next one peeks out from behind at an
// angle, and an "n/N" pill counts the deck. Swiping the front card deals it
// under the deck and brings the one behind up into its place — the same move
// whichever way you push, mirrored; the direction only decides whether you
// move forward or back through the photos. Tapping opens the full-screen
// viewer (PhotoLightbox), which shares this same index — so whatever photo
// you land on in the viewer is the one the stack shows when you close it.
//
// Controlled on purpose: the index lives with whoever renders the post, so
// the stack and the viewer can never disagree about which photo is current.
import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

// Three layers, and every card knows which one it is on. They stay inside the
// deck because .sv-photostack isolates its own stacking context.
//   0  under the deck — a card being dealt away
//   1  the static leaning card behind (set in CSS)
//   2  a card rising out of the rear slot
//   3  the card in play at the front
/** Offset/scale/tilt that lines a card up exactly over the leaning back card. */
const BACK_SLOT = { x: 14, y: -2, scale: 0.9, rotate: 6.51, opacity: 1, zIndex: 2 }
const FRONT_SLOT = { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, zIndex: 3 }

/** How far out of the deck a card swings on its way round. */
const ARC = 130

/** Swiping doesn't throw the photo away — it deals it to the BOTTOM of the
 *  deck. The card swings a little further out the way it was pushed, then
 *  curves back down into the deck's rear slot, shrinking as it goes. It drops
 *  to z-index 0 the moment the gesture commits, so it travels UNDER the cards
 *  still on the deck instead of over them, and only fades once it is already
 *  hidden behind them.
 *
 *  `dir` only mirrors the arc. Both directions do the same thing — the card
 *  under your finger always leaves the way you pushed it, and the next one
 *  always rises out of the rear slot. Only WHICH photo comes next differs. */
const tuckUnder = (dir: number) => ({
  // `null` = "carry on from wherever the finger left it". The tuple casts
  // are for framer's types, which only accept a leading null on a tuple.
  x: [null, dir * -ARC, BACK_SLOT.x] as [null, number, number],
  y: [null, 10, BACK_SLOT.y] as [null, number, number],
  scale: [null, 0.9, BACK_SLOT.scale] as [null, number, number],
  rotate: [null, dir * -9, BACK_SLOT.rotate] as [null, number, number],
  opacity: [1, 1, 0],
  zIndex: 0,
  transition: {
    duration: 0.5,
    times: [0, 0.42, 1],
    ease: 'easeInOut',
    // Both are steps, not glides: the card must fall behind the deck the
    // instant it commits, and it must not start fading until it is covered.
    zIndex: { duration: 0 },
    opacity: { duration: 0.5, times: [0, 0.72, 1], ease: 'linear' },
  },
})

/** Distance + throw needed to commit a swipe, so a lazy nudge springs back. */
const SWIPE_COMMIT = 60

export default function PhotoStack({
  photos,
  index,
  onIndex,
  onOpen,
}: {
  photos: string[]
  index: number
  onIndex: (next: number) => void
  /** Tapping the deck — opens the full-screen viewer. */
  onOpen?: () => void
}) {
  const reduce = useReducedMotion()
  const [dir, setDir] = useState(1)
  // A drag that ends on the card also fires a click. This remembers that the
  // gesture was a drag, so swiping never opens the viewer by accident.
  const dragged = useRef(false)

  const count = photos.length
  const canSwipe = count > 1
  const step = (d: number) => {
    setDir(d)
    onIndex((index + d + count) % count)
  }

  return (
    <div
      className="sv-photostack"
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
      aria-label={onOpen ? `Photo ${index + 1} of ${count} — open full screen` : undefined}
      onClick={() => {
        if (dragged.current) return
        onOpen?.()
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' && canSwipe) return step(1)
        if (e.key === 'ArrowLeft' && canSwipe) return step(-1)
        if (onOpen && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onOpen()
        }
      }}
    >
      {/* The card peeking out behind is always the one after the front, so as
          soon as the index moves the deck already shows what comes next. */}
      {canSwipe && <img className="sv-photostack-back" src={photos[(index + 1) % count]} alt="" />}

      {/* Both cards are absolutely positioned in CSS, so the outgoing and
          incoming ones can overlap during the swap without any layout shift. */}
      <AnimatePresence initial={false} custom={dir}>
        <motion.img
          key={index}
          className="sv-photostack-front"
          src={photos[index]}
          alt=""
          draggable={false}
          custom={dir}
          // Same move either way, just mirrored: the card you pushed is dealt
          // under the deck in the direction you pushed it, and the next one
          // rises out of the rear slot to take its place.
          initial={reduce ? FRONT_SLOT : BACK_SLOT}
          animate={FRONT_SLOT}
          exit={reduce ? { opacity: 0 } : tuckUnder(dir)}
          transition={{ type: 'spring', stiffness: 340, damping: 34, mass: 0.7 }}
          drag={canSwipe ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.55}
          dragMomentum={false}
          onDragStart={() => {
            dragged.current = true
          }}
          onDragEnd={(_, info) => {
            // Velocity counts too, so a quick flick commits without travel.
            const throwX = info.offset.x + info.velocity.x * 0.2
            if (Math.abs(throwX) > SWIPE_COMMIT) step(throwX < 0 ? 1 : -1)
            // Let the click that follows this drag pass by first.
            window.setTimeout(() => {
              dragged.current = false
            }, 0)
          }}
        />
      </AnimatePresence>

      <span className="sv-photostack-count">
        {index + 1}/{count}
      </span>
    </div>
  )
}
