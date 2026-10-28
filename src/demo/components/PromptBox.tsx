// Component — Figma "Prompt Box" (node 19453:11129).
//
// Two variants of the same Figma component, so one component here too:
//   'ai'     — the dock box: gradient ring (cyan → orange), plus, mic, voice
//   'search' — the merchants list (19612:9735): plain neutral-400 hairline,
//              a search icon in Start Actions and nothing in End Actions
// Everything else — the pill, the 8/12 padding, the 14px input — is shared.
//
// The 'ai' variant has THREE end states, not three components:
//   idle       — mic + voice CTA
//   typed      (19542:163538) — a single dark submit button, because sending
//                is now the obvious next action
//   recording  (19377:5090) — tapping the mic: the field empties and a Voice
//                Input pill meters the audio next to the submit button
import { useEffect, useRef, useState } from 'react'
import { Plus, Mic, AudioLines, Search, ArrowUp } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import VoiceInput from './VoiceInput'
import arrowLeft from '../assets/search/arrow-left.svg'

/** How long each rotating placeholder holds before the next one turns up. */
const ROTATE_MS = 3600

export default function PromptBox({
  placeholder,
  placeholders,
  variant = 'ai',
  plain = false,
  showAdd = true,
  value,
  autoFocus = false,
  inputId,
  interactive = true,
  voiceTranscript,
  onVoiceMode,
  onActivate,
  onChange,
  onSubmit,
  onBack,
  onFocus,
  onBlur,
}: {
  /** A single, static placeholder. Ignored when `placeholders` is given. */
  placeholder?: string
  /**
   * Two or more placeholders to cycle through — the dock box uses this so
   * each screen advertises what the assistant is good for there (see
   * promptDemo.ts). With more than one, the native placeholder is dropped
   * and an animated line is painted over the field instead: the attribute
   * cannot be animated, and swapping its text would just snap.
   */
  placeholders?: string[]
  variant?: 'ai' | 'search'
  /**
   * Home's dock box (Figma 20303:28673): no gradient ring, no plus, just a
   * white pill with a soft shadow and the mic/voice pair. The 'ai' and
   * 'search' variants are both still rings-or-hairline boxes with something
   * in the leading slot, so this is a third skin rather than a variant of
   * either.
   */
  plain?: boolean
  /** False drops the ring box's leading plus — Home's dock search bar. */
  showAdd?: boolean
  /** Controlled value. Omit to let the box hold its own. */
  value?: string
  /** Take the caret on mount — see the note in SearchSheet. */
  autoFocus?: boolean
  /** Lets gesture handlers focus this input synchronously after mounting. */
  inputId?: string
  /** False for boxes whose text field should never take native focus or
   *  accept typing — the dock box, where tapping the field opens the full
   *  search sheet instead (see onActivate). The mic and voice buttons still
   *  work; only the input is inert. */
  interactive?: boolean
  /**
   * What a voice recording "hears" in the demo. Supplying it is what arms
   * the mic — without a transcript there is nothing for recording to submit,
   * so the mic stays decorative.
   */
  voiceTranscript?: string
  /** Tapping the voice-mode (audio-lines) button. Opens the listening screen. */
  onVoiceMode?: () => void
  /** Tapping the text field. When set, the field is a button that opens the
   *  full search rather than a place to type — the dock box uses this so its
   *  placeholder pops the sheet while its mic/voice buttons act in place. */
  onActivate?: () => void
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
  /** Plain skin only: a back arrow in the leading slot (the search sheet). */
  onBack?: () => void
  onFocus?: () => void
  onBlur?: () => void
}) {
  const [internal, setInternal] = useState('')
  const [recording, setRecording] = useState(false)
  // The plain box swaps voice for submit only while you are TYPING — focused
  // with text in it. Once Enter commits the search the field blurs, and the
  // same query sits there with the voice button back (Figma 20302:25288).
  const [focused, setFocused] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const reduce = useReducedMotion()

  // iOS standalone PWAs are touchy about focused inputs inside transformed
  // artboards. Prevent scroll jumps whenever focus is programmatic.
  useEffect(() => {
    if (autoFocus) input.current?.focus({ preventScroll: true })
  }, [autoFocus])
  const controlled = value !== undefined
  const text = controlled ? value : internal
  const isSearch = variant === 'search'

  // One list either way, so everything below has a single thing to read.
  const hints = placeholders?.length ? placeholders : placeholder ? [placeholder] : []
  const rotates = hints.length > 1
  const [hint, setHint] = useState(0)
  // Only while there is nothing to read instead — a rotating line under
  // someone's own typing would be noise, and during a take the field is
  // hidden anyway.
  const cycling = rotates && !text && !recording
  useEffect(() => {
    if (!cycling) return
    const id = window.setInterval(() => setHint((i) => i + 1), ROTATE_MS)
    return () => window.clearInterval(id)
  }, [cycling])
  const currentHint = hints.length ? hints[hint % hints.length] : ''

  const setText = (next: string) => {
    if (!controlled) setInternal(next)
    onChange?.(next)
  }

  // The mic is armed by a transcript, not by whether the field itself types —
  // the dock box has an inert field (onActivate opens the sheet) but a working
  // mic, just like the sheet's own box.
  const canRecord = !isSearch && !!voiceTranscript
  const showSubmit = plain ? !!text && focused : !!text

  const mic = canRecord ? (
    <motion.button
      type="button"
      className="bv-prompt-mic"
      aria-label="Record"
      onClick={() => setRecording(true)}
      whileTap={{ scale: 0.92 }}
    >
      <Mic size={plain ? 20 : 22} strokeWidth={1.8} />
    </motion.button>
  ) : plain ? (
    <span className="bv-prompt-mic">
      <Mic size={20} strokeWidth={1.8} />
    </span>
  ) : (
    <Mic size={22} strokeWidth={1.8} />
  )

  // Recording sends what it heard, not what is in the field — the field is
  // empty and hidden for the whole take.
  const submit = () => {
    const value = recording ? voiceTranscript?.trim() : text.trim()
    if (!value) return
    setRecording(false)
    onSubmit?.(value)
    if (!controlled) setInternal('')
  }

  return (
    <div className={`bv-prompt-box${isSearch ? ' search' : ''}${plain ? ' plain' : ''}`}>
      <div className="bv-prompt-inner">
        {isSearch ? (
          <span className="bv-prompt-search-icon">
            <Search size={20} strokeWidth={1.9} />
          </span>
        ) : plain ? (
          onBack && (
            <button type="button" className="bv-prompt-back" aria-label="Back" onClick={onBack}>
              <img src={arrowLeft} alt="" width={18} height={18} />
            </button>
          )
        ) : (
          showAdd && (
            <button className="bv-prompt-plus" aria-label="Add">
              <Plus size={20} strokeWidth={2.2} />
            </button>
          )
        )}
        {/* Hidden rather than unmounted while recording (Figma hides the
            placeholder at opacity 0): the pill takes the width, and the
            field keeps its caret for when the take ends. */}
        <span className="bv-prompt-field">
        <input
          id={inputId}
          ref={input}
          className={`bv-prompt-input${recording ? ' hidden' : ''}`}
          // With a rotating hint the attribute is dropped and the animated
          // line below stands in for it — otherwise both would show.
          placeholder={rotates ? '' : (placeholder ?? '')}
          aria-label={currentHint || undefined}
          value={text}
          readOnly={!interactive}
          tabIndex={interactive && !recording ? undefined : -1}
          // Dock box: the field is a button that opens the full search sheet
          // (that is where the keyboard belongs). preventDefault so the
          // readonly input never takes focus first. Only the field does this —
          // the mic and voice buttons keep their own actions.
          onPointerDown={
            onActivate && !recording
              ? (e) => {
                  e.preventDefault()
                  onActivate()
                }
              : undefined
          }
          onClick={onActivate && !recording ? () => onActivate() : undefined}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => {
            setFocused(true)
            onFocus?.()
          }}
          onBlur={() => {
            setFocused(false)
            onBlur?.()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
          }}
        />
        {/* The outgoing line flips up and away; the next one rises from
            below into its place. `mode="wait"` keeps them from overlapping
            mid-turn, and the perspective on the track is what makes the
            flip read as a turn rather than a slide. */}
        {cycling && (
          <span className="bv-prompt-rotator" aria-hidden="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={currentHint}
                className="bv-prompt-rotator-line"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: '65%', rotateX: -60 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: '0%', rotateX: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: '-65%', rotateX: 60 }}
                transition={{ duration: reduce ? 0.18 : 0.42, ease: [0.23, 1, 0.32, 1] }}
              >
                {currentHint}
              </motion.span>
            </AnimatePresence>
          </span>
        )}
        </span>
        {!isSearch && (
          <div className="bv-prompt-end">
            {/* Plain skin: the mic never leaves, so it sits outside the swap
                and only its neighbour changes. */}
            {plain && !recording && mic}
            {/* Scale from 0.9, never 0 — nothing in the real world appears
                out of nothing. Exit is quicker than enter. */}
            <AnimatePresence mode="wait" initial={false}>
              {recording ? (
                <motion.div
                  key="recording"
                  className="bv-prompt-recording"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                >
                  <VoiceInput onStop={() => setRecording(false)} />
                  <motion.button
                    type="button"
                    className="bv-prompt-voice"
                    aria-label="Send"
                    onClick={submit}
                    whileTap={{ scale: 0.92 }}
                  >
                    <ArrowUp size={20} strokeWidth={2.4} />
                  </motion.button>
                </motion.div>
              ) : showSubmit ? (
                <motion.button
                  key="submit"
                  type="button"
                  className="bv-prompt-voice"
                  aria-label="Search"
                  // Keep the field focused through the press: blurring first
                  // would swap this button back to voice under the finger
                  // before the click lands.
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={submit}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                  whileTap={{ scale: 0.92 }}
                >
                  <ArrowUp size={20} strokeWidth={2.4} />
                </motion.button>
              ) : (
                <motion.div
                  key="idle"
                  className="bv-prompt-idle"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                >
                  {!plain && mic}
                  <motion.button
                    type="button"
                    className="bv-prompt-voice"
                    aria-label="Voice mode"
                    onClick={onVoiceMode}
                    whileTap={{ scale: 0.92 }}
                  >
                    <AudioLines size={20} strokeWidth={2} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
