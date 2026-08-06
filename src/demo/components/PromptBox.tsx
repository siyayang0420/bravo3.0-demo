// Component — Figma "Prompt Box" (node 19453:11129).
//
// Two variants of the same Figma component, so one component here too:
//   'ai'     — the dock box: gradient ring (cyan → orange), plus, mic, voice
//   'search' — the merchants list (19612:9735): plain neutral-400 hairline,
//              a search icon in Start Actions and nothing in End Actions
// Everything else — the pill, the 8/12 padding, the 14px input — is shared.
//
// The 'ai' variant has two END states, not two components (19542:163538):
// with text in the field the mic and voice CTA give way to a single dark
// submit button, because sending is now the obvious next action.
import { useEffect, useRef, useState } from 'react'
import { Plus, Mic, AudioLines, Search, ArrowUp } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

export default function PromptBox({
  placeholder,
  variant = 'ai',
  value,
  autoFocus = false,
  inputId,
  interactive = true,
  onChange,
  onSubmit,
}: {
  placeholder: string
  variant?: 'ai' | 'search'
  /** Controlled value. Omit to let the box hold its own. */
  value?: string
  /** Take the caret on mount — see the note in SearchSheet. */
  autoFocus?: boolean
  /** Lets gesture handlers focus this input synchronously after mounting. */
  inputId?: string
  /** False for visual trigger boxes that should never take native focus. */
  interactive?: boolean
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
}) {
  const [internal, setInternal] = useState('')
  const input = useRef<HTMLInputElement>(null)

  // iOS standalone PWAs are touchy about focused inputs inside transformed
  // artboards. Prevent scroll jumps whenever focus is programmatic.
  useEffect(() => {
    if (autoFocus) input.current?.focus({ preventScroll: true })
  }, [autoFocus])
  const controlled = value !== undefined
  const text = controlled ? value : internal
  const isSearch = variant === 'search'

  const setText = (next: string) => {
    if (!controlled) setInternal(next)
    onChange?.(next)
  }

  const submit = () => {
    if (!text.trim()) return
    onSubmit?.(text.trim())
    if (!controlled) setInternal('')
  }

  return (
    <div className={`bv-prompt-box${isSearch ? ' search' : ''}`}>
      <div className="bv-prompt-inner">
        {isSearch ? (
          <span className="bv-prompt-search-icon">
            <Search size={20} strokeWidth={1.9} />
          </span>
        ) : (
          <button className="bv-prompt-plus" aria-label="Add">
            <Plus size={20} strokeWidth={2.2} />
          </button>
        )}
        <input
          id={inputId}
          ref={input}
          className="bv-prompt-input"
          placeholder={placeholder}
          value={text}
          readOnly={!interactive}
          tabIndex={interactive ? undefined : -1}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
          }}
        />
        {!isSearch && (
          <div className="bv-prompt-end">
            {/* Scale from 0.9, never 0 — nothing in the real world appears
                out of nothing. Exit is quicker than enter. */}
            <AnimatePresence mode="wait" initial={false}>
              {text ? (
                <motion.button
                  key="submit"
                  type="button"
                  className="bv-prompt-voice"
                  aria-label="Search"
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
                  <Mic size={22} strokeWidth={1.8} />
                  <motion.button
                    className="bv-prompt-voice"
                    aria-label="Voice mode"
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
