// Component — Figma challenge participant (19608:9156 and siblings)
//
// The avatar scales with how much the person has spent; the name pill does
// NOT — it stays 14px at every size. Everything else on the bubble is a
// fixed ratio of the avatar width, read straight off the Figma nodes:
//
//   height    = w x 4/3      (95.033/71.274, identical across all four)
//   share %   = w / 3        (23.758/71.274, identical across all four)
//   pill pad  = w x 0.192 / 0.096
//   pill lift = w x 0.24     (overlaps the bottom of the avatar)
//   crown     = w x 0.321, offset w x 0.591 / -w x 0.169
//
// Figma's four widths fit w = 40 + 2.07 x share to within ~1%, so the size
// is computed rather than hardcoded — a fifth participant just works.
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import crownArt from '../assets/social/crown.png'

export type Participant = {
  id: string
  name: string
  avatar: string
  /** Share of the challenge total, as a percentage. Drives the size. */
  share: number
  /** Resting position inside the play area, in artboard px. */
  x: number
  y: number
  /** The signed-in user. Marks the one bubble that is not an invite. */
  isYou?: boolean
}

const SIZE_BASE = 40
const SIZE_PER_SHARE = 2.07

export function avatarWidth(share: number) {
  return SIZE_BASE + SIZE_PER_SHARE * share
}

/* ---------- tap reaction ---------- */

const REACTIONS = ['🎉', '✨', '🔥', '💖', '😂', '👏', '⭐️', '🥳', '💫', '🙌']

type Particle = {
  id: number
  emoji: string
  /** Peak of the arc, then where it settles after the bounce. */
  dx: number
  dy: number
  restY: number
  rotate: number
  scale: number
  duration: number
}

const rand = (min: number, max: number) => min + Math.random() * (max - min)

/**
 * One burst: 8–12 emoji thrown out from behind the avatar over the full 360°,
 * each with its own speed, size and spin. They travel out on an ease-out arc,
 * overshoot, then settle back a few px — the small bounce that reads as weight
 * without looking like a physics toy. Everything is gone inside 900ms.
 */
function makeBurst(seed: number, w: number): Particle[] {
  const count = Math.round(rand(8, 12))
  return Array.from({ length: count }, (_, i) => {
    // One slot each around the circle, jittered inside its slot so the ring
    // never looks stamped but never clumps to one side either.
    const angle = (2 * Math.PI * (i + rand(0.1, 0.9))) / count
    const dist = rand(0.7, 1.3) * w
    const dy = -Math.sin(angle) * dist
    return {
      id: seed + i,
      emoji: REACTIONS[Math.floor(rand(0, REACTIONS.length))],
      dx: Math.cos(angle) * dist,
      dy,
      // Gravity is the same for everyone, so the ones thrown down land further.
      restY: dy + rand(6, 14),
      rotate: rand(-70, 70),
      scale: rand(0.7, 1.25),
      duration: rand(0.7, 0.9),
    }
  })
}

export default function FloatingAvatar({
  participant,
  isLeader,
  areaW,
  areaH,
  index,
}: {
  participant: Participant
  isLeader: boolean
  /** Play-area size in local px, measured by the parent. */
  areaW: number
  areaH: number
  index: number
}) {
  const w = avatarWidth(participant.share)
  const self = useRef<HTMLDivElement>(null)

  // Numeric constraints, not a ref. Handing framer-motion the area ref makes
  // it measure both boxes with getBoundingClientRect — screen pixels — while
  // it applies the drag transform in local pixels. The phone is CSS-scaled,
  // so the two disagree and the bubble snaps to the edge on mousedown.
  // offsetWidth/clientWidth are already local px and stay right at any scale.
  //
  // The area size arrives as props because a child's layout effect runs
  // before the parent's ref is attached — reading it from a ref here would
  // see null on mount and pin the bubble at {0,0,0,0}.
  const [bounds, setBounds] = useState<
    { left: number; right: number; top: number; bottom: number } | undefined
  >(undefined)

  useLayoutEffect(() => {
    const el = self.current
    if (!el || !areaW || !areaH) return
    setBounds({
      left: -participant.x,
      right: Math.max(0, areaW - el.offsetWidth - participant.x),
      top: -participant.y,
      bottom: Math.max(0, areaH - el.offsetHeight - participant.y),
    })
  }, [areaW, areaH, participant.x, participant.y])

  // Live particles from every recent tap. Tapping again stacks another burst
  // rather than cutting the last one off, so a rapid double-tap feels generous.
  const [particles, setParticles] = useState<Particle[]>([])
  const seed = useRef(0)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // A drag ends with a click on most browsers. framer's own onTap doesn't fire
  // on this bubble (the drag session swallows it), so the burst hangs off a
  // plain click and this flag keeps a drag from ending in confetti.
  const dragged = useRef(false)

  function burst() {
    if (dragged.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const next = makeBurst((seed.current += 100), w)
    setParticles((p) => [...p, ...next])
    const ids = new Set(next.map((p) => p.id))
    timers.current.push(
      window.setTimeout(
        () => setParticles((p) => p.filter((q) => !ids.has(q.id))),
        1000,
      ),
    )
  }

  return (
    <motion.div
      ref={self}
      className="bv-float"
      style={{
        left: participant.x,
        top: participant.y,
        width: w,
        // Keep a bursting bubble's confetti above its neighbours.
        zIndex: particles.length ? 15 : undefined,
      }}
      onClick={burst}
      onPointerDown={() => (dragged.current = false)}
      onDragStart={() => (dragged.current = true)}
      drag
      dragConstraints={bounds}
      dragElastic={0.12}
      dragMomentum={false}
      whileDrag={{ scale: 1.06, zIndex: 20, cursor: 'grabbing' }}
      whileTap={{ scale: 1.04 }}
    >
      {/* Float lives on an inner layer so it never fights the drag transform. */}
      <motion.div
        animate={{ y: [0, -9, 0] }}
        transition={{
          duration: 3.2 + index * 0.45,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.3,
        }}
      >
        <div className="bv-float-head">
          <div
            className="bv-float-avatar"
            style={{
              width: w,
              height: w * (4 / 3),
              backgroundImage: `url(${participant.avatar})`,
              marginBottom: -w * 0.24,
            }}
          />
          {/* Emitter sits at the centre of the avatar (h = w x 4/3), so the
              ring is even top to bottom. Never eats a drag. */}
          <div className="bv-float-burst" style={{ top: w * (2 / 3) }}>
            <AnimatePresence>
              {particles.map((p) => (
                <motion.span
                  key={p.id}
                  className="bv-float-particle"
                  style={{ fontSize: w * 0.34 }}
                  initial={{ x: 0, y: 0, scale: 0.2, rotate: 0, opacity: 0 }}
                  animate={{
                    x: [0, p.dx * 0.72, p.dx],
                    y: [0, p.dy, p.restY],
                    scale: [0.2, p.scale * 1.12, p.scale],
                    rotate: [0, p.rotate * 0.7, p.rotate],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: p.duration,
                    times: [0, 0.42, 1],
                    ease: ['easeOut', 'easeInOut'],
                    opacity: {
                      duration: p.duration,
                      times: [0, 0.08, 0.55, 1],
                      ease: 'linear',
                    },
                  }}
                >
                  {p.emoji}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          {isLeader && (
            <img
              className="bv-float-crown"
              src={crownArt}
              alt=""
              style={{ width: w * 0.321, left: w * 0.591, top: -w * 0.169 }}
            />
          )}
          <span
            className="bv-float-name"
            style={{ padding: `${w * 0.096}px ${w * 0.192}px` }}
          >
            {participant.name}
          </span>
        </div>
        <span className="bv-float-share" style={{ fontSize: w / 3 }}>
          {participant.share.toFixed(2)}%
        </span>
      </motion.div>
    </motion.div>
  )
}
