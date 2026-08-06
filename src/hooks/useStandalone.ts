// True when the site is running as an installed web app — launched from the
// home screen with no browser chrome — rather than inside a browser tab.
//
// Two checks because the platforms disagree:
//   display-mode: standalone  — the standard, Android/Chrome and modern iOS
//   navigator.standalone      — iOS Safari's own, still the reliable one there
import { useEffect, useState } from 'react'

const STANDALONE_QUERY = '(display-mode: standalone)'

function detect() {
  if (typeof window === 'undefined') return false
  const iosStandalone = (window.navigator as { standalone?: boolean }).standalone
  return window.matchMedia(STANDALONE_QUERY).matches || iosStandalone === true
}

export default function useStandalone() {
  // Resolved synchronously — a false first paint would flash the demo's fake
  // status bar under the real one before the effect corrected it.
  const [standalone, setStandalone] = useState(detect)

  useEffect(() => {
    const mq = window.matchMedia(STANDALONE_QUERY)
    const update = () => setStandalone(detect())
    update()

    // addEventListener on MediaQueryList is Safari 14+; older iOS only has
    // the deprecated addListener and throwing here would strand the value.
    if (mq.addEventListener) {
      mq.addEventListener('change', update)
    } else {
      mq.addListener(update)
    }

    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', update)
      } else {
        mq.removeListener(update)
      }
    }
  }, [])

  return standalone
}
