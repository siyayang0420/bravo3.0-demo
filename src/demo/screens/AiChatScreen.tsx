// bravo AI chat — implements Figma 19559:168018, 19559:168156 and
// 19560:168548.
//
// Those three nodes are the SAME screen at three moments of the assistant
// thinking, so they are steps in one sequence here rather than three
// screens. Opened when you submit a query from the search sheet.
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Menu } from 'lucide-react'
import PromptBox from '../components/PromptBox'
import IosKeyboard from '../components/IosKeyboard'
import AiThinking from '../components/AiThinking'
import useStandalone from '../../hooks/useStandalone'
import { AI_DISCLAIMER, THINKING_STEPS } from '../data/aiChatDemo'
import wordmark from '../assets/bravo-ai-wordmark.svg'

const AUTOCORRECT = ['“The”', 'the', 'to']
const EASE_OUT = [0.23, 1, 0.32, 1] as const

export default function AiChatScreen({
  query,
  onBack,
}: {
  query: string
  onBack: () => void
}) {
  const standalone = useStandalone()
  const reduce = useReducedMotion()

  // Walks the thinking steps, then stops on the last one. Each step names
  // its own hold, so the pacing is content-driven rather than a fixed tick —
  // "Looking for restaurants…" deserves longer on screen than "Let me think".
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (step >= THINKING_STEPS.length - 1) return
    const t = window.setTimeout(() => setStep((s) => s + 1), THINKING_STEPS[step].hold)
    return () => window.clearTimeout(t)
  }, [step])

  return (
    <div className="bv-ai-screen">
      {/* The blurred brand wash behind the header (19559:168158). */}
      <div className="bv-ai-glow" />

      <header className="bv-ai-header">
        <button type="button" className="bv-screen-back" aria-label="Back" onClick={onBack}>
          <ArrowLeft size={20} strokeWidth={1.9} />
        </button>
        <img className="bv-ai-wordmark" src={wordmark} alt="bravo AI" />
        <button type="button" className="bv-screen-back" aria-label="Menu">
          <Menu size={20} strokeWidth={1.9} />
        </button>
      </header>

      <p className="bv-ai-disclaimer">{AI_DISCLAIMER}</p>

      <div className="bv-ai-bottom">
        <div className="bv-ai-thread">
          {/* Your message. The 2px corner is the tail — it points back at
              you, which is why only that one corner is tight. */}
          <motion.div
            className="bv-ai-bubble-row"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.28, ease: EASE_OUT }}
          >
            <span className="bv-ai-bubble">{query}</span>
          </motion.div>

          {/* Full width, or the thread's flex-end alignment (which exists for
              your right-hand bubble) drags the assistant's turn right too. */}
          <motion.div
            className="bv-ai-turn"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: EASE_OUT, delay: 0.12 }}
          >
            <AiThinking step={THINKING_STEPS[step]} />
          </motion.div>

          <PromptBox placeholder="Ask or search anything..." />
        </div>

        {/* Same rule as the search sheet — the phone raises its own. */}
        {!standalone && <IosKeyboard suggestions={AUTOCORRECT} />}
      </div>
    </div>
  )
}
