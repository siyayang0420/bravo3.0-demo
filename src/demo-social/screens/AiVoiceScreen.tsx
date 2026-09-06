// bravo AI voice mode — implements Figma 19691:50951.
//
// Opened from the voice-mode (audio-lines) button in the chat's prompt box.
// Same header, brand glow and disclaimer as the chat, but the thread gives
// way to a single large orb, and the prompt box collapses to a placeholder
// plus a black X that returns to the chat.
//
// Figma exports the orb as a flat 120px PNG ("image 2"); this uses the live
// WebGL OrbSphere instead, and larger, so it reads as actively listening.
import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Menu, X } from 'lucide-react'
import OrbSphere from '../components/OrbSphere'
import { AI_DISCLAIMER } from '../data/aiChatDemo'
import wordmark from '../assets/bravo-ai-wordmark.svg'

const EASE_OUT = [0.23, 1, 0.32, 1] as const
const rand = (min: number, max: number) => min + Math.random() * (max - min)

// A breathing/speaking loop: an uneven run of scales, dipping below 1 and
// lifting above it so it reads as talking rather than a steady pulse. Built
// once per mount so every entry breathes a little differently; mirrored, so
// the sequence eases back through itself instead of snapping to the start.
function makeBreath() {
  const scale = [1]
  for (let i = 0; i < 6; i++) {
    scale.push(+(i % 2 === 0 ? 1 - rand(0.04, 0.09) : 1 + rand(0.03, 0.08)).toFixed(3))
  }
  scale.push(1)
  return { scale, duration: rand(3.6, 4.8) }
}

export default function AiVoiceScreen({ onClose }: { onClose: () => void }) {
  const reduce = useReducedMotion()
  const breath = useMemo(() => (reduce ? null : makeBreath()), [reduce])

  return (
    <div className="sv-ai-screen sv-ai-voice">
      <div className="sv-ai-glow" />

      <header className="sv-ai-header">
        <button type="button" className="sv-screen-back" aria-label="Back" onClick={onClose}>
          <ArrowLeft size={20} strokeWidth={1.9} />
        </button>
        <img className="sv-ai-wordmark" src={wordmark} alt="bravo AI" />
        <button type="button" className="sv-screen-back" aria-label="Menu">
          <Menu size={20} strokeWidth={1.9} />
        </button>
      </header>

      <p className="sv-ai-disclaimer">{AI_DISCLAIMER}</p>

      {/* Listening. The wrapper centres by flex (never by transform, which
          framer would overwrite while animating scale); the inner layer
          fades in, then breathes as if speaking. */}
      <div className="sv-ai-voice-orb">
        <motion.div
          className="sv-ai-voice-orb-inner"
          initial={{ opacity: 0 }}
          animate={breath ? { opacity: 1, scale: breath.scale } : { opacity: 1 }}
          transition={
            breath
              ? {
                  opacity: { duration: 0.32, ease: EASE_OUT },
                  scale: {
                    duration: breath.duration,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatType: 'mirror',
                  },
                }
              : { duration: 0.32, ease: EASE_OUT }
          }
        >
          <OrbSphere size={150} speed={4} />
        </motion.div>
      </div>

      {/* Prompt box with no plus and no mic — just the placeholder and a
          single black X (the "accent" button) that ends voice mode. */}
      <div className="sv-ai-voice-dock">
        <div className="sv-prompt-box">
          <div className="sv-prompt-inner">
            <input
              className="sv-prompt-input"
              placeholder="Ask or search anything..."
              readOnly
              tabIndex={-1}
            />
            <div className="sv-prompt-end">
              <button
                type="button"
                className="sv-prompt-voice"
                aria-label="Close voice mode"
                onClick={onClose}
              >
                <X size={20} strokeWidth={2.4} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
