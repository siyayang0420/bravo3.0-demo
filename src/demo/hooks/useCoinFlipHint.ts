// Nudges the Bravo coin ~30° when its card scrolls into view, so it reads
// as something you can grab rather than a picture.
//
// The nudge is driven through the coin's own pointer handlers instead of
// reaching into its state, because src/demo/coin/* is copied verbatim from
// the bravo-coin repo and has to stay in sync with its Flutter twin. Going
// through the public surface means the real physics runs — it turns, then
// springs back to face-on exactly as a short hand-drag would.
import { useEffect, useRef } from 'react'

/** deg per px dragged — coinConfig.dragGain. 30° / 0.55 ≈ 55px. */
const DRAG_GAIN = 0.55
const HINT_DEGREES = 30
const HINT_PX = HINT_DEGREES / DRAG_GAIN
const STEPS = 14
/** Stepped on a timer, not rAF: rAF is frozen while the tab is hidden, which
    would strand the coin mid-drag if the card scrolled in and the user then
    switched away. Timers still fire, so the gesture always completes. */
const STEP_MS = 16

function nudge(stage: HTMLElement) {
  const rect = stage.getBoundingClientRect()
  const y = rect.top + rect.height / 2
  const x0 = rect.left + rect.width / 2

  // Synthetic pointer ids are not real active pointers, so the capture
  // calls inside the coin would throw. Stub them for the duration.
  const setCapture = stage.setPointerCapture
  const releaseCapture = stage.releasePointerCapture
  stage.setPointerCapture = () => {}
  stage.releasePointerCapture = () => {}

  const send = (type: string, x: number) =>
    stage.dispatchEvent(
      new PointerEvent(type, {
        clientX: x,
        clientY: y,
        button: 0,
        pointerId: 9001,
        bubbles: true,
        isPrimary: true,
      }),
    )

  const restore = () => {
    stage.setPointerCapture = setCapture
    stage.releasePointerCapture = releaseCapture
  }

  send('pointerdown', x0)

  let i = 0
  const step = () => {
    i += 1
    // Ease out so the final delta is tiny — the coin is released with
    // almost no momentum and settles back instead of spinning on.
    const t = i / STEPS
    const eased = 1 - Math.pow(1 - t, 3)
    send('pointermove', x0 + HINT_PX * eased)

    if (i < STEPS) {
      setTimeout(step, STEP_MS)
    } else {
      send('pointerup', x0 + HINT_PX)
      restore()
    }
  }

  setTimeout(step, STEP_MS)
}

/**
 * Returns a ref for the element that wraps a <BravoCoin>. Each time that
 * element scrolls into view the coin turns ~30° and settles back.
 */
export default function useCoinFlipHint<T extends HTMLElement>(enabled: boolean) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!enabled) return
    const host = ref.current
    if (!host) return

    // Respect a stated preference for less motion.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    let visible = false
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Only on the false → true edge, so sitting on the card does not
          // re-fire, but scrolling away and back does.
          if (entry.isIntersecting && !visible) {
            visible = true
            const stage = host.querySelector<HTMLElement>('.coin-stage')
            if (stage) nudge(stage)
          } else if (!entry.isIntersecting) {
            visible = false
          }
        }
      },
      { threshold: 0.6 },
    )

    observer.observe(host)
    return () => observer.disconnect()
  }, [enabled])

  return ref
}
