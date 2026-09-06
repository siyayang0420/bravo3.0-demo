// The prompt dock's behaviour, shared by every screen that shows one.
//
// The dock box's mic and voice buttons act in place, exactly like the ones in
// the search sheet: mic → inline recording, voice → the listening orb. Only
// its text field is different — tapping the placeholder opens the full search
// sheet, because that is where the keyboard belongs on device. Sending from
// either place pushes the AI thread over the screen. Home and Community both
// run this hook, so the prompt box behaves the same wherever it appears.
import { useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import SearchSheet, { SEARCH_INPUT_ID } from './SearchSheet'
import AiChatScreen from '../screens/AiChatScreen'
import AiVoiceScreen from '../screens/AiVoiceScreen'
import { PROMPTS, type PromptContext } from '../data/promptDemo'

/**
 * @param context Which screen the dock is sitting on. Picks the rotating
 *   placeholders and the sheet's starter chips — the assistant is useful for
 *   different things on the map, in the feed, and on your own profile.
 */
export default function useSearchLauncher(context: PromptContext = 'map') {
  const prompts = PROMPTS[context]
  const [searchOpen, setSearchOpen] = useState(false)
  const [askQuery, setAskQuery] = useState('')
  const [voiceOpen, setVoiceOpen] = useState(false)

  const openSearch = () => {
    flushSync(() => setSearchOpen(true))
    document.getElementById(SEARCH_INPUT_ID)?.focus({ preventScroll: true })
  }

  // Send a query straight to the AI thread, skipping the search sheet — the
  // suggestion chips use this, so tapping one reads as "asked and sent".
  const ask = (query: string) => {
    setSearchOpen(false)
    setAskQuery(query)
  }

  // Spread onto the dock's PromptBox. The box is the same component the sheet
  // uses; these props make its field inert-but-tappable (onActivate opens the
  // sheet) while arming the mic (voiceTranscript) and the voice orb
  // (onVoiceMode). A completed recording sends straight to the AI thread.
  const promptProps = {
    interactive: false,
    placeholders: prompts.placeholders,
    voiceTranscript: 'Happy',
    onVoiceMode: () => setVoiceOpen(true),
    onActivate: openSearch,
    onSubmit: ask,
  } as const

  // Render last in the screen so both layers sit above its own content.
  const overlays: ReactNode = (
    <>
      {/* Search — slides up over the dock, keyboard and all. The keyboard
          lives inside the sheet, so it stays above the scrim with it. */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.button
              type="button"
              className="sv-scrim over-topbar"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            />
            <SearchSheet
              starters={prompts.starters}
              onClose={() => setSearchOpen(false)}
              onAsk={(q) => {
                setAskQuery(q)
                setSearchOpen(false)
              }}
              onVoiceMode={() => setVoiceOpen(true)}
            />
          </>
        )}
      </AnimatePresence>

      {/* bravo AI thread — pushes in over everything once you send a query */}
      <AnimatePresence>
        {askQuery && (
          <motion.div
            className="sv-ai-screen-wrap"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
          >
            <AiChatScreen query={askQuery} onBack={() => setAskQuery('')} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice mode — the listening orb. Tapping the search box's audio-lines
          button opens it over the sheet; its back/X returns to the sheet.
          Rendered here at phone-root so it covers the full frame, not just
          the bottom sheet it was launched from. */}
      <AnimatePresence>
        {voiceOpen && (
          <motion.div
            className="sv-ai-screen-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
          >
            <AiVoiceScreen onClose={() => setVoiceOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )

  return { searchOpen, openSearch, ask, promptProps, overlays }
}
