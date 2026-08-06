// Component — the assistant's "thinking" line (Figma 19559:168175).
//
// The orb, the step it is on, and the dimmer detail line under it. Steps
// crossfade in place rather than the block re-laying out, so the row never
// jumps while the text length changes.
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import OrbSphere from './OrbSphere'
import type { ThinkingStep } from '../data/aiChatDemo'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

export default function AiThinking({ step }: { step: ThinkingStep }) {
  const reduce = useReducedMotion()

  const swap = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
      }

  return (
    <div className="bv-ai-thinking">
      <div className="bv-ai-thinking-row">
        {/* The orb is live, not the flat PNG Figma exports — it is the one
            thing on screen that has to look like it is working. Size and
            speed come from OrbSphere's own defaults so there is one place
            to tune them. */}
        <OrbSphere />
        <div className="bv-ai-thinking-label">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={step.label}
              {...swap}
              transition={{ duration: 0.24, ease: EASE_OUT }}
            >
              {step.label}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Indented to clear the orb (33 + 10 gap), per the node. */}
      <AnimatePresence initial={false}>
        {step.detail && (
          <motion.div
            className="bv-ai-thinking-detail"
            initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, height: 16 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
          >
            <span>{step.detail}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
