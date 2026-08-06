// Drag-to-scroll for the horizontal rails.
//
// On a phone these scroll by touch, but the demo is shown on a desktop
// where a vertical wheel does nothing to a horizontal container and the
// scrollbars are hidden. This makes them draggable with a pointer, and
// forwards vertical wheel movement to horizontal scrolling.
import { useEffect, useRef } from 'react'

export default function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let down = false
    let startX = 0
    let startScroll = 0
    let moved = false

    const onPointerDown = (e: PointerEvent) => {
      // Ignore secondary buttons so right-click menus still work.
      if (e.button !== 0) return
      down = true
      moved = false
      startX = e.clientX
      startScroll = el.scrollLeft
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!down) return
      const dx = e.clientX - startX
      if (!moved && Math.abs(dx) > 3) {
        moved = true
        el.setPointerCapture(e.pointerId)
        el.classList.add('is-dragging')
      }
      if (moved) {
        el.scrollLeft = startScroll - dx
        e.preventDefault()
      }
    }

    const endDrag = (e: PointerEvent) => {
      if (moved) {
        // Swallow the click that follows a drag so a photo tap doesn't fire.
        const swallow = (ev: Event) => {
          ev.stopPropagation()
          ev.preventDefault()
        }
        el.addEventListener('click', swallow, { capture: true, once: true })
        if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
      }
      down = false
      moved = false
      el.classList.remove('is-dragging')
    }

    const onWheel = (e: WheelEvent) => {
      // Trackpads send deltaX; mice only send deltaY — map it across.
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
      const max = el.scrollWidth - el.clientWidth
      if (max <= 0) return
      const next = el.scrollLeft + e.deltaY
      // Only take over while there is somewhere left to go, so the feed
      // keeps scrolling vertically at either end.
      if ((e.deltaY < 0 && el.scrollLeft > 0) || (e.deltaY > 0 && el.scrollLeft < max)) {
        el.scrollLeft = Math.max(0, Math.min(max, next))
        e.preventDefault()
      }
    }

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', endDrag)
    el.addEventListener('pointercancel', endDrag)
    el.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', endDrag)
      el.removeEventListener('pointercancel', endDrag)
      el.removeEventListener('wheel', onWheel)
    }
  }, [])

  return ref
}
