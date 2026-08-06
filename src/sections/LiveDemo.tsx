import { useEffect, useState } from 'react'
import PhoneFrame, { FRAME_WIDTH } from '../demo/PhoneFrame'
import BravoApp from '../demo/BravoApp'
import PresentMode from '../demo/PresentMode'
import { Maximize2 } from 'lucide-react'
import useStandalone from '../hooks/useStandalone'

// Demo-state tweaker. Not product UI — it exists so the review can show
// the states that have designs without needing a backend. Add an entry
// here as new conditional states land in Figma.
const HOME_STATES = [
  { id: 'default', label: 'Default', hint: 'No promotion running.' },
  {
    id: 'promotion',
    label: 'Promotion live',
    hint: 'Adds the "My offers?" chip — tap it for the featured promotions.',
  },
] as const

type HomeState = (typeof HOME_STATES)[number]['id']

/** Shrink the device so it always fits the column it sits in. */
function useFitScale() {
  const [scale, setScale] = useState(0.78)

  useEffect(() => {
    const fit = () => {
      const w = window.innerWidth
      if (w > 820) return setScale(0.78)
      // section padding is var(--space-6) either side on mobile
      const available = w - 40
      setScale(Math.max(0.42, Math.min(0.78, available / (FRAME_WIDTH + 20))))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  return scale
}

export default function LiveDemo() {
  const standalone = useStandalone()
  // Launched from the home screen on a phone, open straight into the app.
  // Tapping the icon should give you the product, not a review site with a
  // sidebar — the ✕ still drops back into the written sections.
  const [presenting, setPresenting] = useState(
    () => standalone && window.matchMedia('(max-width: 820px), (pointer: coarse)').matches,
  )
  const [homeState, setHomeState] = useState<HomeState>('default')
  const phoneScale = useFitScale()

  const active = HOME_STATES.find((s) => s.id === homeState)!
  const hasPromotion = homeState === 'promotion'

  return (
    <div className="section-page" style={{ maxWidth: 1080 }}>
      <p className="eyebrow">Interactive — this is the real UI</p>
      <h1 className="page-title">Live UI demo</h1>
      <p className="page-lede">
        A working build of the 3.0 Home screen, implemented directly from Figma using
        the Bravo design tokens and DM Sans.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div
          className="card"
          style={{
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-text-tertiary)',
            }}
          >
            Home state
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            {HOME_STATES.map((s) => (
              <button
                key={s.id}
                className={`btn ${homeState === s.id ? 'btn-primary' : 'btn-secondary'}`}
                aria-pressed={homeState === s.id}
                onClick={() => setHomeState(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
            {active.hint}
          </span>
        </div>

        {/* The phone surface stays free for the app's own taps —
            full screen is entered from the button below only. */}
        <PhoneFrame scale={phoneScale}>
          <BravoApp hasPromotion={hasPromotion} />
        </PhoneFrame>
        <button className="btn btn-secondary" onClick={() => setPresenting(true)}>
          <Maximize2 size={14} />
          Present full screen
        </button>
      </div>

      <PresentMode
        open={presenting}
        onClose={() => setPresenting(false)}
        hasPromotion={hasPromotion}
      />
    </div>
  )
}
