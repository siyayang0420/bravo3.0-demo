import { useEffect, useState, type CSSProperties } from 'react'
import PhoneFrame, { FRAME_WIDTH } from '../demo/PhoneFrame'
import BravoApp from '../demo/BravoApp'
import PresentMode from '../demo/PresentMode'
import { Maximize2 } from 'lucide-react'
import useStandalone from '../hooks/useStandalone'
import { DEMO_USERS, type DemoUserId } from '../demo/data/profileDemo'

// Demo-state tweaker. Not product UI — a control panel so the review can
// drive the demo into states that have designs, without a backend. It is
// built to grow: every setting is one labelled row (see ControlRow), so as
// more conditional states land on more pages for more users, they slot in as
// new rows and new option lists rather than reworking the layout.

// Who you are signed in as. Bobby sends a challenge, Happy receives it — a
// reviewer can play both sides. Derived from the demo users so there is one
// source of truth.
const USER_OPTIONS = DEMO_USERS.map((u) => ({ id: u.id, label: u.name, hint: u.role }))

const HOME_STATES = [
  { id: 'default', label: 'Default', hint: 'No promotion running.' },
  {
    id: 'promotion',
    label: 'Promotion live',
    hint: 'Adds the "My offers?" chip — tap it for the featured promotions.',
  },
] as const

type HomeState = (typeof HOME_STATES)[number]['id']

const rowLabelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'var(--color-text-tertiary)',
  whiteSpace: 'nowrap',
}

const rowHintStyle: CSSProperties = {
  fontSize: 13,
  color: 'var(--color-text-secondary)',
  minWidth: 0,
}

// One setting: a label, a segmented control, and the active option's hint —
// three cells that drop into the panel's shared 3-column grid so every row
// lines up. Generic over the option id so each row keeps its own type.
function ControlRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: readonly { id: T; label: string; hint?: string }[]
  value: T
  onChange: (v: T) => void
}) {
  const active = options.find((o) => o.id === value)
  return (
    <>
      <span style={rowLabelStyle}>{label}</span>
      <div style={{ display: 'flex', gap: 6 }}>
        {options.map((o) => (
          <button
            key={o.id}
            className={`btn ${value === o.id ? 'btn-primary' : 'btn-secondary'}`}
            aria-pressed={value === o.id}
            onClick={() => onChange(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
      <span style={rowHintStyle}>{active?.hint}</span>
    </>
  )
}

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
  const [userId, setUserId] = useState<DemoUserId>('bobby')
  const phoneScale = useFitScale()

  const user = DEMO_USERS.find((u) => u.id === userId)!
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
        {/* The demo control panel — one row per setting, all sharing a
            3-column grid (label · control · hint) so they line up. */}
        <div
          className="card"
          style={{
            padding: 16,
            display: 'grid',
            gridTemplateColumns: 'auto auto minmax(0, 1fr)',
            alignItems: 'center',
            columnGap: 16,
            rowGap: 12,
            width: '100%',
            maxWidth: 640,
          }}
        >
          <ControlRow label="User" options={USER_OPTIONS} value={userId} onChange={setUserId} />
          <ControlRow
            label="Home state"
            options={HOME_STATES}
            value={homeState}
            onChange={setHomeState}
          />
        </div>

        {/* The phone surface stays free for the app's own taps —
            full screen is entered from the button below only. */}
        <PhoneFrame scale={phoneScale}>
          <BravoApp hasPromotion={hasPromotion} user={user} />
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
        user={user}
      />
    </div>
  )
}
