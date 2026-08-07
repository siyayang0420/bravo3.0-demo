// The heart action on a post, with its like burst and count.
//
// Tapping it toggles liked and, when liking, does three things at once:
//   1. the glyph fills red and pops 1 → 1.2 → 1 (a quick, non-bouncy pop)
//   2. a count appears to its right (Figma 19577:173449)
//   3. two small red hearts drift up out of the heart's centre
//
// The burst is not one computed arc — it picks one of five hand-tuned shapes
// at random each like, so the hearts take a different path every time. Their
// travel eases in AND out, so they lift and settle softly rather than snapping.
import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Heart } from 'lucide-react'

type Path = {
  dx: number
  dy: number
  /** Mid-flight horizontal bow — this is what curves the path. */
  curve: number
  rotate: number
  delay: number
  duration: number
  scale: number
}

// Five distinct bursts. One is chosen at random per like (see pickBurst), so
// the two hearts never trace the same path twice in a row. Each pair differs
// in spread, height, curvature, lean and stagger.
const BURSTS: Path[][] = [
  // wide symmetric fan
  [
    { dx: -15, dy: -34, curve: -11, rotate: -16, delay: 0, duration: 0.3, scale: 0.9 },
    { dx: 16, dy: -30, curve: 10, rotate: 13, delay: 0.07, duration: 0.28, scale: 0.8 },
  ],
  // tall and narrow
  [
    { dx: -7, dy: -42, curve: -6, rotate: -9, delay: 0, duration: 0.3, scale: 0.85 },
    { dx: 10, dy: -37, curve: 8, rotate: 11, delay: 0.06, duration: 0.27, scale: 0.92 },
  ],
  // leans left
  [
    { dx: -20, dy: -27, curve: -15, rotate: -20, delay: 0.06, duration: 0.28, scale: 0.82 },
    { dx: -9, dy: -36, curve: -8, rotate: -11, delay: 0, duration: 0.3, scale: 0.9 },
  ],
  // leans right
  [
    { dx: 9, dy: -37, curve: 11, rotate: 13, delay: 0, duration: 0.3, scale: 0.88 },
    { dx: 20, dy: -28, curve: 16, rotate: 19, delay: 0.07, duration: 0.27, scale: 0.78 },
  ],
  // one low, one high — asymmetric
  [
    { dx: 6, dy: -40, curve: 7, rotate: 10, delay: 0, duration: 0.3, scale: 0.9 },
    { dx: -14, dy: -24, curve: -12, rotate: -16, delay: 0.07, duration: 0.26, scale: 0.8 },
  ],
]

type Particle = Path & { id: number }

function pickBurst(seed: number): Particle[] {
  const shape = BURSTS[Math.floor(Math.random() * BURSTS.length)]
  return shape.map((p, i) => ({ ...p, id: seed * 2 + i }))
}

export default function LikeButton({
  likes = 0,
  onLike,
}: {
  /** Existing likes the tap adds to. Defaults to 0, so liking reads "1". */
  likes?: number
  onLike?: () => void
}) {
  const reduce = useReducedMotion()
  const [liked, setLiked] = useState(false)
  const [burst, setBurst] = useState<Particle[]>([])
  const seed = useRef(0)

  const count = likes + (liked ? 1 : 0)

  const toggle = () => {
    const next = !liked
    setLiked(next)
    onLike?.()
    if (next && !reduce) setBurst(pickBurst((seed.current += 1)))
  }

  const clear = (id: number) => setBurst((b) => b.filter((p) => p.id !== id))

  return (
    <button
      type="button"
      className="bv-post-action bv-like"
      aria-label="Like"
      aria-pressed={liked}
      onClick={toggle}
    >
      <span className="bv-like-heart">
        {/* zero-size origin at the heart's centre; particles hang off it */}
        <span className="bv-like-emitter" aria-hidden>
          {burst.map((p) => (
            <motion.span
              key={p.id}
              className="bv-like-particle"
              initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
              animate={{
                x: [0, p.curve, p.dx],
                y: [0, p.dy * 0.55, p.dy],
                scale: [0, p.scale * 1.15, p.scale, 0],
                opacity: [0, 1, 1, 0],
                rotate: [0, p.rotate * 0.6, p.rotate],
              }}
              // ease-in-out on every track: the hearts lift and settle softly
              // instead of shooting out (which read as stiff).
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: 'easeInOut',
                scale: { duration: p.duration, delay: p.delay, times: [0, 0.3, 0.72, 1], ease: 'easeInOut' },
                opacity: { duration: p.duration, delay: p.delay, times: [0, 0.2, 0.72, 1], ease: 'easeInOut' },
              }}
              onAnimationComplete={() => clear(p.id)}
            >
              <Heart size={12} strokeWidth={0} fill="currentColor" />
            </motion.span>
          ))}
        </span>

        <motion.span
          className="bv-like-glyph"
          animate={{ scale: liked && !reduce ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.26, times: [0, 0.42, 1], ease: 'easeOut' }}
        >
          <Heart size={20} strokeWidth={1.9} fill={liked ? 'currentColor' : 'none'} />
        </motion.span>
      </span>

      {/* Count appears with the like, gray regardless of the heart's colour. */}
      <AnimatePresence initial={false}>
        {count > 0 && (
          <motion.span
            key={count}
            className="bv-like-count"
            initial={reduce ? false : { opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
