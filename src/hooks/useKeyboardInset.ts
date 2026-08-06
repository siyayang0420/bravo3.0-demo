// How much of the viewport the on-screen keyboard is covering, in px.
//
// iOS does not resize the window when the keyboard opens — it shrinks the
// *visual* viewport and leaves `innerHeight` alone. The difference between
// the two is the keyboard, which is the number you need to lift a
// bottom-anchored sheet clear of it.
//
// Returns 0 when no keyboard is up, and on browsers without visualViewport.
import { useEffect, useRef, useState } from 'react'

export default function useKeyboardInset(enabled: boolean) {
  const [inset, setInset] = useState(0)
  const baselineHeight = useRef(0)

  useEffect(() => {
    const vv = window.visualViewport
    if (!enabled || !vv) {
      setInset(0)
      return
    }

    const update = () => {
      // Some iOS standalone PWAs shrink window.innerHeight with the keyboard,
      // others only shrink visualViewport. Keep the largest seen height as the
      // keyboard-closed baseline so both behaviours produce the same inset.
      baselineHeight.current = Math.max(baselineHeight.current, window.innerHeight)
      // offsetTop matters when the page itself has been scrolled up to reveal
      // a focused field — without it the sheet over-corrects.
      const covered = baselineHeight.current - vv.height - vv.offsetTop
      setInset(Math.max(0, Math.round(covered)))
    }

    update()
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
    }
  }, [enabled])

  return inset
}
