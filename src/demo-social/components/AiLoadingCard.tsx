// Component — the assistant working (Figma 20031:22467).
//
// One bordered card: what it is doing, and a bar filling underneath. It sits
// in the same box the answer will occupy, so when the reply lands the card
// grows into place rather than one thing being swapped for another.
import { motion, useReducedMotion } from 'framer-motion'
import { loadingLine } from '../data/aiChatDemo'

export default function AiLoadingCard({
  query,
  /** How long the bar takes to reach its mark — matched to the hold above. */
  duration = 2.4,
}: {
  query: string
  duration?: number
}) {
  const reduce = useReducedMotion()

  return (
    <div className="sv-ai-card sv-ai-loading">
      <p className="sv-ai-loading-line">{loadingLine(query)}</p>
      <div className="sv-ai-loading-track">
        {/* scaleX, not width: the card sits inside an AnimatePresence swap,
            and animating a layout property there gets distorted by framer's
            projection — the bar jumped to its mark instead of travelling.
            A transform is also GPU-cheap and cannot reflow the card.
            Eased out, so it races ahead early and creeps at the end — a
            linear bar reads as a countdown, promising a finish time nothing
            here can actually predict. */}
        <motion.div
          className="sv-ai-loading-fill"
          initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration, ease: [0.22, 0.8, 0.3, 1] }}
        />
      </div>
    </div>
  )
}
