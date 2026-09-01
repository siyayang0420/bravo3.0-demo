// bravo AI chat — implements Figma 19559:168018, 19559:168156 and
// 19560:168548.
//
// Those three nodes are the SAME screen at three moments of the assistant
// thinking, so they are steps in one sequence here rather than three
// screens. Opened when you submit a query from the search sheet.
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Menu, ThumbsUp, ThumbsDown } from 'lucide-react'
import PromptBox from '../components/PromptBox'
import PromptStarter from '../components/PromptStarter'
import IosKeyboard from '../components/IosKeyboard'
import AiLoadingCard from '../components/AiLoadingCard'
import AiAnswerCard from '../components/AiAnswerCard'
import AiVoiceScreen from './AiVoiceScreen'
import useStandalone from '../../hooks/useStandalone'
import { AI_ANSWER, AI_DISCLAIMER } from '../data/aiChatDemo'
import wordmark from '../assets/bravo-ai-wordmark.svg'

const AUTOCORRECT = ['“The”', 'the', 'to']
const EASE_OUT = [0.23, 1, 0.32, 1] as const
/** How long the bar runs before the answer lands. */
const LOADING_MS = 2400

export default function AiChatScreen({
  query,
  onBack,
}: {
  query: string
  onBack: () => void
}) {
  const standalone = useStandalone()
  const reduce = useReducedMotion()
  const [voiceOpen, setVoiceOpen] = useState(false)

  // Two moments, not three thinking lines: the bar runs, then the answer
  // lands in the same card. Re-armed on a new query so asking again puts the
  // assistant back to work rather than leaving the old reply up.
  const [answered, setAnswered] = useState(false)
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  useEffect(() => {
    setAnswered(false)
    const t = window.setTimeout(() => setAnswered(true), LOADING_MS)
    return () => window.clearTimeout(t)
  }, [query])

  // Installed, the phone raises its own keyboard and --bv-kb-inset already
  // moves everything; the mock one only exists in a browser tab.
  const kbShown = keyboardOpen && !standalone

  // The keyboard takes the bottom of the screen away from the thread, so the
  // thread has to give up the same amount — `.kb-open` lifts the scroll box's
  // bottom edge (see the CSS). Lifting the box alone would just clip what you
  // were reading, so the scroll position moves with it by exactly the height
  // that was taken: the content slides up, and everything is still reachable
  // above the keys.
  const scroll = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = scroll.current
    if (!el) return
    const h = parseFloat(getComputedStyle(el).getPropertyValue('--bv-keyboard-h')) || 0
    // Next frame: the bottom edge is mid-transition on this one, so
    // scrollHeight has not settled and the clamp would cut the scroll short.
    const id = requestAnimationFrame(() => {
      el.scrollTop += kbShown ? h : -h
    })
    return () => cancelAnimationFrame(id)
  }, [kbShown])

  // Tapping anything that is not the dock puts the keyboard away, the way it
  // does on a phone. Blurring matters as much as the flag: leaving focus on
  // the field means the next tap on it fires no focus event, so the keyboard
  // would never come back.
  const dismissKeyboard = (e: React.PointerEvent) => {
    if (!keyboardOpen) return
    if ((e.target as HTMLElement).closest('.bv-ai-dock')) return
    setKeyboardOpen(false)
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  }

  return (
    <div
      className={`bv-ai-screen${kbShown ? ' kb-open' : ''}`}
      onPointerDown={dismissKeyboard}
    >
      {/* Pinned. The thread scrolls UNDER it and dissolves into a white fade
          rather than sliding behind a hard edge — the same treatment the
          Rewards and venue headers wear. No brand wash: the reply below is
          the content, and a coloured bloom at the top competed with it (the
          voice screen keeps its own .bv-ai-glow, where there is nothing to
          read). */}
      <div className="bv-ai-topbar">
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
      </div>

      <div className="bv-ai-scroll" ref={scroll}>
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
            {/* popLayout, so the loading card is out of the flow while the
                answer measures itself — otherwise the two stack for a frame
                and the thread jumps to twice its height and back. */}
            {/* NOT initial={false}: that flag propagates down the presence
                tree and suppressed the loading bar's own mount animation, so
                the bar rendered already full instead of filling. */}
            <AnimatePresence mode="popLayout">
              {answered ? (
                <motion.div key="answer">
                  <AiAnswerCard answer={AI_ANSWER} />
                </motion.div>
              ) : (
                <motion.div
                  key="loading"
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.18, ease: EASE_OUT }}
                >
                  <AiLoadingCard query={query} duration={LOADING_MS / 1000} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Only once there is an answer to judge, and only then are there
              follow-ups to offer — both are about the reply, not the wait. */}
          <AnimatePresence>
            {answered && (
              <motion.div
                className="bv-ai-after"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: EASE_OUT, delay: 0.34 }}
              >
                <div className="bv-ai-helpful">
                  <span>Was this helpful?</span>
                  <button type="button" className="bv-ai-vote" aria-label="Helpful">
                    <ThumbsUp size={14} strokeWidth={1.9} />
                  </button>
                  <button type="button" className="bv-ai-vote" aria-label="Not helpful">
                    <ThumbsDown size={14} strokeWidth={1.9} />
                  </button>
                </div>
                <div className="bv-ai-followups">
                  {AI_ANSWER.followUps.map((label) => (
                    <PromptStarter key={label} label={label} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Pinned too — the box you type in should not scroll away from you.
          The thread dissolves into it the same way it does under the header. */}
      <div className="bv-ai-dock">
        {/* The keyboard is raised by TAPPING THE FIELD, not by arriving on
            the screen — you come here to read a reply, and a keyboard
            covering half of it before you have asked anything is in the
            way. Focus is the trigger, so the mic and voice buttons (which
            are not the field) leave it down. */}
        <div className="bv-ai-dock-box" onFocusCapture={() => setKeyboardOpen(true)}>
          <PromptBox
            placeholder="Ask or search anything..."
            onVoiceMode={() => setVoiceOpen(true)}
          />
        </div>

        {/* Same rule as the search sheet — the phone raises its own. */}
        <AnimatePresence>
          {kbShown && (
            <motion.div
              initial={reduce ? { opacity: 0 } : { y: '100%' }}
              animate={reduce ? { opacity: 1 } : { y: 0 }}
              exit={reduce ? { opacity: 0 } : { y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36, mass: 0.7 }}
            >
              <IosKeyboard suggestions={AUTOCORRECT} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Voice mode fades in over the thread; its X fades it back out. */}
      <AnimatePresence>
        {voiceOpen && (
          <motion.div
            className="bv-ai-voice-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: EASE_OUT }}
          >
            <AiVoiceScreen onClose={() => setVoiceOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
