// Full-screen presentation for the Web section.
//
// The same stage the phone demo uses (black backdrop, ✕ in the corner, Esc to
// leave — see demo/PresentMode), except what it presents is a browser rather
// than a device: no bezel, no island, the app simply fills the window.
//
// The one thing it will not do is squash. If the chosen width is wider than
// the reviewer's screen, the whole thing is SCALED down — the layout on show
// has to be the layout that width actually produces, which is the entire
// reason for picking a width in the first place.
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import WebApp from './WebApp'

/** The live window, as the numbers this stage has to lay itself out against. */
function useViewport() {
  const [size, setSize] = useState(() => ({
    w: typeof window === 'undefined' ? 1440 : window.innerWidth,
    h: typeof window === 'undefined' ? 900 : window.innerHeight,
  }))

  useEffect(() => {
    const measure = () =>
      setSize({
        w: window.innerWidth,
        // visualViewport is what is left after the browser's own chrome —
        // the height the app really gets.
        h: window.visualViewport?.height ?? window.innerHeight,
      })
    measure()
    window.addEventListener('resize', measure)
    window.visualViewport?.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('resize', measure)
      window.visualViewport?.removeEventListener('resize', measure)
    }
  }, [])

  return size
}

export default function WebPresentMode({
  open,
  onClose,
  width,
}: {
  open: boolean
  onClose: () => void
  /** The device width being previewed; null is "Fit", i.e. the window itself. */
  width: number | null
}) {
  const viewport = useViewport()
  const [dim, setDim] = useState(false)

  // Only ever shrinks: a 1440 preview on a 1600 screen stays 1440, because
  // blowing it up would be showing a layout at a size nothing renders it at.
  const scale = width ? Math.min(1, viewport.w / width) : 1
  const boxWidth = width ?? viewport.w
  // Scaled box, so the app has to be laid out TALLER than the window by the
  // same factor to still reach the bottom of it once the transform lands.
  const boxHeight = viewport.h / scale

  // Fade the exit button back once the presenter stops moving, so it is not
  // sitting on top of the design; any interaction brings it back.
  useEffect(() => {
    if (!open) return
    setDim(false)
    let timer = window.setTimeout(() => setDim(true), 2500)
    const wake = () => {
      setDim(false)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setDim(true), 2500)
    }
    window.addEventListener('pointerdown', wake)
    window.addEventListener('pointermove', wake)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('pointerdown', wake)
      window.removeEventListener('pointermove', wake)
    }
  }, [open])

  // Esc to leave, and lock the review site behind the overlay so it cannot
  // scroll or rubber-band under the app.
  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    const prevOverflow = document.body.style.overflow
    const prevOverscroll = document.body.style.overscrollBehavior
    document.body.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      document.body.style.overscrollBehavior = prevOverscroll
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bv-stage"
        >
          <button
            onClick={onClose}
            className={`bv-stage-close ${dim ? 'dim' : ''}`}
            aria-label="Exit presentation"
          >
            <X size={20} />
          </button>

          {/* No "Press Esc to exit" line here, unlike the phone stage: the app
              fills the window top to bottom, so the hint's slot along the
              bottom is the app's own nav bar. Esc still works; the ✕ is the
              visible way out. */}

          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.99, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* WebApp's own root is absolutely positioned, so this box is what
                gives it a width and a height to fill — the same job
                .web-viewport does for the inline preview. */}
            <div
              style={{
                position: 'relative',
                width: boxWidth,
                height: boxHeight,
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
                overflow: 'hidden',
                background: '#fff',
              }}
            >
              <WebApp />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
