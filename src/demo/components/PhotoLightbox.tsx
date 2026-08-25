// Component — full-screen photo viewer, opened by tapping a PhotoStack.
//
// Fills the phone (not the browser window), dims everything behind it, and
// pages between photos with a horizontal swipe. The index is controlled by
// the caller and shared with the stack that opened it, so closing the viewer
// leaves the deck sitting on whichever photo you stopped at.
import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'

/** Distance + throw needed to page, so a lazy nudge springs back. */
const SWIPE_COMMIT = 70

export default function PhotoLightbox({
  photos,
  index,
  onIndex,
  onClose,
}: {
  photos: string[]
  index: number
  onIndex: (next: number) => void
  onClose: () => void
}) {
  const reduce = useReducedMotion()
  const dir = useRef(1)
  const count = photos.length

  const step = (d: number) => {
    dir.current = d
    onIndex((index + d + count) % count)
  }

  // Arrow keys page, Escape closes — the viewer takes focus on open so these
  // land without the user having to click into it first.
  const shell = useRef<HTMLDivElement>(null)
  useEffect(() => {
    shell.current?.focus()
  }, [])

  return (
    <motion.div
      className="bv-lightbox"
      ref={shell}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${count}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      // Tapping the backdrop closes; taps on the photo itself stop below.
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') return onClose()
        if (count < 2) return
        if (e.key === 'ArrowRight') step(1)
        if (e.key === 'ArrowLeft') step(-1)
      }}
    >
      <button type="button" className="bv-lightbox-close" aria-label="Close" onClick={onClose}>
        <X size={20} strokeWidth={2} />
      </button>

      <div className="bv-lightbox-stage" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence initial={false} custom={dir.current}>
          <motion.img
            key={index}
            className="bv-lightbox-photo"
            src={photos[index]}
            alt=""
            draggable={false}
            custom={dir.current}
            initial={reduce ? { opacity: 0 } : { x: dir.current * 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { x: dir.current * -320, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 36, mass: 0.8 }}
            drag={count > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              const throwX = info.offset.x + info.velocity.x * 0.2
              if (Math.abs(throwX) > SWIPE_COMMIT) step(throwX < 0 ? 1 : -1)
            }}
          />
        </AnimatePresence>
      </div>

      <div className="bv-lightbox-foot" onClick={(e) => e.stopPropagation()}>
        {count > 1 && (
          <div className="bv-lightbox-dots">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`bv-lightbox-dot${i === index ? ' is-on' : ''}`}
                aria-label={`Photo ${i + 1}`}
                onClick={() => {
                  dir.current = i > index ? 1 : -1
                  onIndex(i)
                }}
              />
            ))}
          </div>
        )}
        <span className="bv-lightbox-count">
          {index + 1}/{count}
        </span>
      </div>
    </motion.div>
  )
}
