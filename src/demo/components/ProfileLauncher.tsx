// Opens a public profile from anywhere a person is shown — a post author, a
// leaderboard face — without threading callbacks through every screen.
//
// A component calls useOpenProfile()(person, avatarEl); the provider (mounted
// once, in BravoApp) pushes the ProfileScreen over everything. Outside the
// provider — e.g. the Design System previews — the hook is a no-op, so those
// components stay renderable on their own.
//
// The open is an Airbnb-style hero transition, not a hard slide: the tapped
// avatar flies from its list position to its resting spot in the profile
// header (enlarging as it goes), and only once it lands does the rest of the
// page — name, stats, tabs, feed — fade in. Two rects drive it, both in the
// phone's own 402-wide coordinate space (the same space every absolutely
// positioned overlay in this app already uses), so the effect stays correct
// at any on-page zoom:
//   sourceRect — the tapped avatar's rect, captured at click time
//   targetRect — the real profile avatar's rect, measured the instant it
//                mounts (hidden) via useLayoutEffect, before the browser paints
import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ProfileScreen from '../screens/ProfileScreen'
import { publicProfile, type ProfilePerson } from '../data/profileDemo'

type OpenProfile = (person: ProfilePerson, avatarEl?: HTMLElement | null) => void

const OpenProfileContext = createContext<OpenProfile>(() => {})

export const useOpenProfile = () => useContext(OpenProfileContext)

type LocalRect = { left: number; top: number; width: number; height: number }

/** `el`'s rect, converted into the phone's local 402-wide coordinate space
 *  by dividing out whatever on-page scale `.bravo-app` is currently rendered
 *  at (PhoneFrame's `scale` prop, or any ancestor zoom). Returns null outside
 *  the phone (shouldn't happen for a real avatar element). */
function measureLocalRect(el: HTMLElement): LocalRect | null {
  const app = el.closest('.bravo-app') as HTMLElement | null
  if (!app) return null
  const appRect = app.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  const scale = appRect.width / 402
  return {
    left: (elRect.left - appRect.left) / scale,
    top: (elRect.top - appRect.top) / scale,
    width: elRect.width / scale,
    height: elRect.height / scale,
  }
}

// 'measuring' and 'flying' both hide the real avatar/content — split in two
// only so the clone (which exists solely during 'flying') has a precise
// mount/unmount window.
type Phase = 'idle' | 'measuring' | 'flying' | 'settled'

export default function ProfileProvider({ children }: { children: ReactNode }) {
  const [person, setPerson] = useState<ProfilePerson | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [sourceRect, setSourceRect] = useState<LocalRect | null>(null)
  const [targetRect, setTargetRect] = useState<LocalRect | null>(null)
  const avatarRef = useRef<HTMLSpanElement>(null)

  const openProfile: OpenProfile = (p, avatarEl) => {
    const rect = avatarEl ? measureLocalRect(avatarEl) : null
    setSourceRect(rect)
    setTargetRect(null)
    // No captured origin — nothing to fly from, so skip straight to settled
    // rather than measuring toward nowhere. Set on the SAME render as
    // `person` so there is never a frame where the real avatar/content are
    // visible-but-about-to-be-hidden (that flash is what briefly let the
    // page underneath show through).
    setPhase(rect ? 'measuring' : 'settled')
    setPerson(p)
  }

  const close = () => {
    setPerson(null)
    setPhase('idle')
  }

  // The instant the real (hidden) profile avatar has laid out, measure where
  // it landed and start the flight — before the browser paints, so the
  // 'measuring' phase never actually paints anything itself.
  useLayoutEffect(() => {
    if (phase !== 'measuring') return
    const el = avatarRef.current
    if (!el) return
    const rect = measureLocalRect(el)
    if (rect) {
      setTargetRect(rect)
      setPhase('flying')
    }
  }, [phase])

  const settled = phase === 'settled'

  return (
    <OpenProfileContext.Provider value={openProfile}>
      {children}
      <AnimatePresence>
        {person && (
          <motion.div
            className="bv-profile-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
          >
            <ProfileScreen
              profile={publicProfile(person)}
              mode="public"
              onBack={close}
              avatarRef={avatarRef}
              avatarVisible={settled}
              contentVisible={settled}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* A sibling of the wrap, not nested inside it — so the clone is never
          subject to the wrap's own entrance fade and stays fully opaque
          through the whole flight, exactly continuing the tapped avatar. */}
      <AnimatePresence>
        {phase === 'flying' && sourceRect && targetRect && person && (
          <FlyingAvatar
            photo={person.avatar}
            from={sourceRect}
            to={targetRect}
            onComplete={() => setPhase('settled')}
          />
        )}
      </AnimatePresence>
    </OpenProfileContext.Provider>
  )
}

/** The "hero" clone: rendered once at its FINAL rect (`to`), then animated in
 *  purely with a transform (translate + scale) from `from`'s position/size
 *  down to identity — a GPU-accelerated FLIP, so width/height never animate
 *  and the browser never re-lays-out mid-flight. */
function FlyingAvatar({
  photo,
  from,
  to,
  onComplete,
}: {
  photo: string
  from: LocalRect
  to: LocalRect
  onComplete: () => void
}) {
  const scaleX = from.width / to.width
  const scaleY = from.height / to.height
  const dx = from.left + from.width / 2 - (to.left + to.width / 2)
  const dy = from.top + from.height / 2 - (to.top + to.height / 2)

  return (
    <motion.span
      className="bv-avatar-fly"
      style={{
        left: to.left,
        top: to.top,
        width: to.width,
        height: to.height,
        backgroundImage: `url(${photo})`,
      }}
      initial={{ x: dx, y: dy, scaleX, scaleY }}
      animate={{ x: 0, y: 0, scaleX: 1, scaleY: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.9 }}
      onAnimationComplete={onComplete}
    />
  )
}
