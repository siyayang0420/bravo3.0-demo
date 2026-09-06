// Drag a horizontal rail with the pointer, the way a finger drags it.
//
// The rails in this app (the achievements badges, the venue photo strip) are
// plain `overflow-x: auto`, which is right on a phone — you swipe them. On
// the review site the phone is driven with a MOUSE, and a mouse has no
// horizontal gesture: the content past the right edge is unreachable, so a
// seven-card rail looks like a two-card rail.
//
// Grabbing and pulling is what a mouse has instead of a swipe, so that is
// what this adds. Touch is left alone — the browser's own momentum scrolling
// is better than anything reimplemented here.
import { useEffect, useRef } from 'react'

/** Past this many pixels the gesture is a drag, and the click it would
 *  otherwise land on is swallowed — so pulling the rail by a card's CTA
 *  scrolls instead of firing it. */
const DRAG_THRESHOLD = 4

export default function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let startX = 0
    let startScroll = 0
    let dragging = false
    let moved = false

    const onPointerDown = (e: PointerEvent) => {
      // Touch already pans natively, and pen inherits that behaviour.
      if (e.pointerType === 'touch') return
      dragging = true
      moved = false
      startX = e.clientX
      startScroll = el.scrollLeft
      el.classList.add('is-grabbing')
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - startX
      if (!moved && Math.abs(dx) > DRAG_THRESHOLD) {
        moved = true
        // Captured only once the gesture is definitely a drag: capturing on
        // every mousedown would steal the pointer from the buttons inside.
        el.setPointerCapture(e.pointerId)
      }
      if (!moved) return
      e.preventDefault()
      el.scrollLeft = startScroll - dx
    }

    const end = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      el.classList.remove('is-grabbing')
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
    }

    // Capture phase, so the click is killed before it reaches the CTA that
    // happened to be under the cursor when the drag ended.
    const onClick = (e: MouseEvent) => {
      if (!moved) return
      e.stopPropagation()
      e.preventDefault()
      moved = false
    }

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', end)
    el.addEventListener('pointercancel', end)
    el.addEventListener('click', onClick, true)

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', end)
      el.removeEventListener('pointercancel', end)
      el.removeEventListener('click', onClick, true)
    }
  }, [])

  return ref
}
