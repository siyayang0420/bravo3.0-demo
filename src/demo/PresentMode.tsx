// Full-screen presentation mode.
//
// Desktop: shows the device mockup (bezel + island) on a dark stage.
// Mobile:  drops the mockup entirely and scales the 402x874 artboard to
//          fill the real screen — the phone in your hand IS the bezel,
//          the same way Expo Go renders a build.
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import PhoneFrame, { FRAME_WIDTH, FRAME_HEIGHT } from './PhoneFrame'
import BravoApp from './BravoApp'
import { DEMO_USERS, type DemoUser } from './data/profileDemo'
import useStandalone from '../hooks/useStandalone'
import useKeyboardInset from '../hooks/useKeyboardInset'

const DEVICE_HEIGHT = FRAME_HEIGHT + 20 // frame incl. bezel

const COMPACT_QUERY = '(max-width: 820px), (pointer: coarse)'

/** True on phone-sized / touch-primary viewports. */
function useIsCompact() {
  // Resolved synchronously: starting false made the first paint the desktop
  // mockup, so a phone briefly showed the bezel before switching.
  const [compact, setCompact] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(COMPACT_QUERY).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(COMPACT_QUERY)
    const update = () => setCompact(mq.matches)
    update()

    // addEventListener on a MediaQueryList is Safari 14+; older iOS only has
    // the deprecated addListener, and throwing here left compact stuck.
    if (mq.addEventListener) {
      mq.addEventListener('change', update)
    } else {
      mq.addListener(update)
    }
    // Orientation changes do not always fire the media query on iOS.
    window.addEventListener('orientationchange', update)

    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', update)
      } else {
        mq.removeListener(update)
      }
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  return compact
}

/**
 * How to lay the artboard into the live viewport.
 *
 * `scale` is the zoom; `height` is how tall the artboard itself should be,
 * which is NOT always the 874 it was drawn at — see below.
 */
function useFitScale(compact: boolean, standalone: boolean) {
  const [fit, setFit] = useState({ scale: 1, height: FRAME_HEIGHT })
  const standaloneFit = useRef({ width: 0, height: 0 })

  useEffect(() => {
    const fit = () => {
      const vw = window.innerWidth
      // In a browser tab, visualViewport is the area left after the URL bar
      // and toolbar — the number that actually matters there.
      //
      // Installed, it is the wrong number: iOS shrinks visualViewport when
      // the keyboard opens, so tracking it rescaled the whole app down to a
      // postage stamp the moment you tapped the search field. innerHeight
      // ignores the keyboard, which is what we want — the keyboard covers
      // the app, it does not resize it.
      const vh = standalone
        ? window.innerHeight
        : window.visualViewport?.height ?? window.innerHeight

      if (compact && standalone) {
        // Installed, the phone IS the device — so fill its width exactly and
        // take the height from the screen rather than the drawing.
        //
        // min(w, h) was still letterboxing: the artboard is 874 tall but the
        // status bar is now the phone's, outside our box, so only ~793 is
        // ours. Fitting 874 into 793 shrank everything to ~91% and left a
        // margin down both sides. Deriving the height instead means the app
        // is edge to edge on any device, and a taller phone simply gets more
        // map — which is what a real app does.
        const s = vw / FRAME_WIDTH
        // Keyboard focus can shrink innerHeight in installed iOS PWAs. The
        // artboard must keep the keyboard-closed height; only a wider viewport
        // or a taller observed viewport should change the stable baseline.
        if (standaloneFit.current.width !== vw || vh > standaloneFit.current.height) {
          standaloneFit.current = { width: vw, height: vh }
        }
        setFit({ scale: s, height: standaloneFit.current.height / s })
      } else if (compact) {
        // In a browser tab the artboard keeps its drawn height: the mock
        // keyboard and status bar are still in it, so squeezing it into
        // whatever Safari leaves would clip them. FIT, not cover — cover
        // cropped the top bar and bottom nav.
        setFit({
          scale: Math.min(vw / FRAME_WIDTH, vh / FRAME_HEIGHT),
          height: FRAME_HEIGHT,
        })
      } else {
        setFit({ scale: Math.min(1.15, (vh - 80) / DEVICE_HEIGHT), height: FRAME_HEIGHT })
      }
    }
    fit()
    window.addEventListener('resize', fit)
    // Only follow visualViewport in a tab — installed, its shrink is the
    // keyboard, not a layout change.
    if (!standalone) window.visualViewport?.addEventListener('resize', fit)
    return () => {
      window.removeEventListener('resize', fit)
      window.visualViewport?.removeEventListener('resize', fit)
    }
  }, [compact, standalone])

  return fit
}

export default function PresentMode({
  open,
  onClose,
  hasPromotion = false,
  user = DEMO_USERS[0],
}: {
  open: boolean
  onClose: () => void
  hasPromotion?: boolean
  user?: DemoUser
}) {
  const compact = useIsCompact()
  const standalone = useStandalone()
  const { scale, height: artboardHeight } = useFitScale(compact, standalone)
  // Measured in device px but consumed inside the artboard, which is scaled
  // — so convert here, where the scale is known. Handing the raw number to
  // the sheet made it lift by the wrong amount.
  const keyboardPx = useKeyboardInset(compact && standalone)
  const keyboardInset = scale ? keyboardPx / scale : 0
  const [dim, setDim] = useState(false)

  // Fade the exit button back after a few idle seconds so it stops
  // covering the design; any interaction restores it.
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

  // Esc to exit (desktop), and lock the page behind the overlay so the
  // review site doesn't scroll or rubber-band under the app.
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

    // Ask for true fullscreen where supported (Android Chrome, desktop).
    // iOS Safari has no Fullscreen API — there, "Add to Home Screen"
    // gives the same result via the standalone meta tags in index.html.
    const el = document.documentElement
    if (compact && el.requestFullscreen) {
      el.requestFullscreen().catch(() => {})
    }

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      document.body.style.overscrollBehavior = prevOverscroll
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {})
      }
    }
  }, [open, onClose, compact])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`bv-stage ${compact ? 'compact' : ''}`}
        >
          <button
            onClick={onClose}
            className={`bv-stage-close ${dim ? 'dim' : ''}`}
            aria-label="Exit presentation"
          >
            <X size={20} />
          </button>

          {!compact && <div className="bv-stage-hint">Press Esc to exit</div>}

          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {compact ? (
              // Bare artboard — no bezel, no mockup chrome.
              <div
                style={{
                  width: FRAME_WIDTH,
                  height: artboardHeight,
                  transform: `scale(${scale})`,
                  transformOrigin: 'center center',
                  overflow: 'hidden',
                  position: 'relative',
                  background: '#fff',
                  // cascades to any bottom-anchored sheet inside
                  ['--bv-kb-inset' as string]: `${keyboardInset}px`,
                  // 1 while the phone's keyboard is up. The gaps that hold a
                  // bar clear of the home indicator are multiplied by
                  // (1 - this), so they collapse against the keyboard rather
                  // than leaving a dead band of frosted glass above the keys.
                  // A flag rather than a length, so each sheet keeps its own
                  // number instead of sharing one.
                  ['--bv-kb-open' as string]: keyboardInset > 0 ? '1' : '0',
                }}
              >
                <BravoApp hasPromotion={hasPromotion} user={user} />
              </div>
            ) : (
              <PhoneFrame scale={scale}>
                <BravoApp hasPromotion={hasPromotion} user={user} />
              </PhoneFrame>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
