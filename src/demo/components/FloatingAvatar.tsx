// Component — Figma challenge participant (19608:9156 and siblings), plus
// the pre-accept moment both sides see before anyone has joined
// (19743:54823 for the receiver, 19682:49684 for the sender): a floating
// bubble can be a joined person, someone you're still waiting to hear back
// from, or an open seat nobody has been invited to yet.
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
import { Hourglass, Plus } from 'lucide-react'
import crownArt from '../assets/social/crown.png'

export type ParticipantStatus = 'accepted' | 'pending-you' | 'pending-other' | 'empty'

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
  /** The challenge's creator — always shown joined, but excluded from the
   *  nav's "Invited: n/N" the same way `isYou` is: Bobby sits outside the
   *  count of friends HE invited, even on a screen where he isn't "you". */
  isHost?: boolean
  /**
   * Defaults to 'accepted' — every bubble this component originally drew.
   * The other three are the pre-accept moment: 'pending-you' is your own
   * unanswered invite (an Accept pill takes the name pill's place),
   * 'pending-other' is someone else's, 'empty' is a seat nobody has been
   * invited to yet.
   */
  status?: ParticipantStatus
}

const SIZE_BASE = 40
const SIZE_PER_SHARE = 2.07
// Pending/empty bubbles never carry a share — nobody has spent anything
// yet — so they use one fixed size straight off the node rather than the
// share-driven formula. Deliberately bigger than the 40px an accepted $0
// bubble would compute to, so an unanswered invite still reads as
// person-sized, not shrunk to a dot.
const PENDING_SIZE = 60

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
  onAccept,
  onInvite,
}: {
  participant: Participant
  isLeader: boolean
  /** Play-area size in local px, measured by the parent. */
  areaW: number
  areaH: number
  index: number
  /** 'pending-you' only — tapping the Accept pill. */
  onAccept?: () => void
  /** 'empty' only — tapping the open seat, to go pick someone. */
  onInvite?: () => void
}) {
  const status = participant.status ?? 'accepted'
  const w = status === 'accepted' ? avatarWidth(participant.share) : PENDING_SIZE
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

  // One tap handler for the whole bubble: an open seat sends you off to pick
  // someone, anyone already in gets confetti. A drag that happens to end in a
  // click is neither.
  function handleTap() {
    if (dragged.current) return
    if (status === 'empty') {
      onInvite?.()
      return
    }
    burst()
  }

  function burst() {
    // A bubble nobody has joined yet has nothing to celebrate.
    if (status !== 'accepted') return
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
      onClick={handleTap}
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
          {status === 'empty' ? (
            <div
              className="bv-float-avatar bv-float-avatar-empty"
              style={{ width: w, height: w * (4 / 3), marginBottom: -w * 0.24 }}
            >
              <Plus size={w * 0.5} strokeWidth={2} />
            </div>
          ) : (
            <div
              className="bv-float-avatar"
              style={{
                width: w,
                height: w * (4 / 3),
                backgroundImage: `url(${participant.avatar})`,
                marginBottom: -w * 0.24,
              }}
            >
              {/* Dimmed + hourglass until they answer — accepted bubbles
                  never carry this. */}
              {status !== 'accepted' && (
                <div className="bv-float-avatar-dim">
                  <Hourglass size={w * 0.5} strokeWidth={1.8} />
                </div>
              )}
            </div>
          )}

          {/* Emitter sits at the centre of the avatar (h = w x 4/3), so the
              ring is even top to bottom. Never eats a drag. Only 'accepted'
              bubbles ever populate it — see burst(). */}
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
          {isLeader && status === 'accepted' && (
            <img
              className="bv-float-crown"
              src={crownArt}
              alt=""
              style={{ width: w * 0.321, left: w * 0.591, top: -w * 0.169 }}
            />
          )}
          {status === 'pending-you' ? (
            // A real button, not the bubble's own tap — it must survive
            // inside a draggable parent without starting a drag.
            <button
              type="button"
              className="bv-float-name bv-float-accept"
              style={{ padding: `${w * 0.096}px ${w * 0.192}px` }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation()
                onAccept?.()
              }}
            >
              Accept
            </button>
          ) : (
            <span
              className="bv-float-name"
              style={{ padding: `${w * 0.096}px ${w * 0.192}px` }}
            >
              {status === 'empty' ? '---' : participant.name}
            </span>
          )}
        </div>
        <span className="bv-float-share" style={{ fontSize: w / 3 }}>
          {/* A fresh challenge (Figma 19743:54823 / 19682:49684) reads plain
              "0%" even for the accepted host — the two-decimal format below
              is for once someone has actually spent something. */}
          {participant.share === 0
            ? '0%'
            : status === 'accepted'
              ? `${participant.share.toFixed(2)}%`
              : `${Math.round(participant.share)}%`}
        </span>
      </motion.div>
    </motion.div>
  )
}
