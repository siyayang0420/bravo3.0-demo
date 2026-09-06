// Component — the Home search sheet.
//
// One sheet covers all five Figma screens; they are states, not screens:
//   19380:5446    empty     — prompt starters
//   19542:163494  All       — people rail + merchant hits
//   19380:5586    Restaurant— merchant hits only
//   19380:5756    People    — person rows
//   19559:167807  People    — the same rows in their other follow states
//
// Which one you see falls out of `query` and the active tab, exactly as it
// would in the product.
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import PromptBox from './PromptBox'
import PromptStarter from './PromptStarter'
import { type PromptStarterItem } from '../data/promptDemo'
import IosKeyboard from './IosKeyboard'
import SearchTabs, { type SearchTabId } from './SearchTabs'
import SearchResultRow from './SearchResultRow'
import PersonRow, { type FollowState } from './PersonRow'
import LeaderboardRail from './LeaderboardRail'
import { useDemoUser } from './DemoIdentity'
import { SEARCH_MERCHANTS, SEARCH_PEOPLE, type SearchPerson } from '../data/searchDemo'
import useStandalone from '../../hooks/useStandalone'
import useWebFrame from '../../hooks/useWebFrame'

// Emil's strong ease-out. The built-in curves are too weak to read as
// intentional at these durations.
const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const SEARCH_INPUT_ID = 'sv-search-sheet-input'

const AUTOCORRECT = ['“Happy”', 'happy', 'happily']

/** The cast, with the follow states that belong to the signed-in account. */
function seedPeople(isNew: boolean | undefined): SearchPerson[] {
  if (!isNew) return SEARCH_PEOPLE
  return SEARCH_PEOPLE.map((p) => ({ ...p, follow: 'follow' as FollowState }))
}

// Cycle order when you tap a follow control.
const NEXT_FOLLOW: Record<FollowState, FollowState> = {
  follow: 'following',
  following: 'follow',
  'follow-back': 'mutual',
  mutual: 'follow-back',
}

export default function SearchSheet({
  starters = [],
  onClose,
  onAsk,
  onVoiceMode,
}: {
  /** The empty state's chips — per screen, see promptDemo.ts. */
  starters?: PromptStarterItem[]
  onClose?: () => void
  /** Submitting the query hands off to the bravo AI thread. */
  onAsk?: (query: string) => void
  /** Tapping the voice-mode (audio-lines) button — opens the listening orb. */
  onVoiceMode?: () => void
}) {
  const { isNew } = useDemoUser()
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<SearchTabId>('all')
  // Restaurants are the world's and stay put — a new account can search the
  // whole map on day one. The FOLLOW STATES are yours, though, and "Following"
  // or "Follow back" would both be claims about a relationship you have not
  // had time to form. Everyone starts as someone you could follow.
  const [people, setPeople] = useState<SearchPerson[]>(() => seedPeople(isNew))
  // Re-seed when the reviewer switches identity in the tweaker. The sheet is
  // not remounted by that switch, so without this it would keep showing the
  // previous person's relationships — and any follows toggled by hand are
  // meant to reset with the identity anyway.
  useEffect(() => {
    setPeople(seedPeople(isNew))
  }, [isNew])
  const reduce = useReducedMotion()
  const standalone = useStandalone()
  const web = useWebFrame()

  const hasQuery = query.trim().length > 0

  // Results stagger the FIRST time they appear, then never again. Staggering
  // on every keystroke would animate something the user sees dozens of times
  // per search — that reads as lag, not polish.
  const staggered = useRef(false)
  useEffect(() => {
    if (!hasQuery) staggered.current = false
  }, [hasQuery])
  const shouldStagger = hasQuery && !staggered.current
  useEffect(() => {
    if (shouldStagger) staggered.current = true
  })

  // Blurring the field closes the phone's keyboard, which drops --sv-kb-inset
  // to 0 — so the sheet settles back to the bottom on its own rather than
  // needing its own "snap" animation.
  const dismissKeyboard = () => {
    const el = document.activeElement
    if (el instanceof HTMLElement && el.tagName === 'INPUT') el.blur()
  }

  // Open each tab at the top — without this the browser keeps the previous
  // pane's offset and the list opens mid-row.
  const scroller = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
  }, [tab, query])

  const rise = (i: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.15 } }
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.26,
            ease: EASE_OUT,
            delay: shouldStagger ? i * 0.04 : 0,
          },
        }

  const merchants = SEARCH_MERCHANTS.filter((m) =>
    m.name.toLowerCase().includes(query.trim().toLowerCase()),
  )
  const matchedPeople = people.filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase()),
  )

  const toggleFollow = (id: string) =>
    setPeople((prev) =>
      prev.map((p) => (p.id === id ? { ...p, follow: NEXT_FOLLOW[p.follow] } : p)),
    )

  const showPeople = tab === 'all' || tab === 'people'
  const showMerchants = tab === 'all' || tab === 'restaurant'

  // Nothing matched at all: there is nothing to filter, so the tabs go too
  // and the sheet collapses to just the offer to ask.
  const hasResults = merchants.length > 0 || matchedPeople.length > 0

  return (
    <motion.div
      className={`sv-search-sheet${hasQuery && hasResults ? ' results' : ''}`}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', duration: 0.44, bounce: 0.06 }}
      // --sv-kb-inset is set by PresentMode on the artboard, in artboard
      // units — it cannot be computed here, where the scale is unknown.
    >
      <span className="sv-offers-handle" />

      <div className="sv-search-body">
        {!hasQuery ? (
          // ---- empty state (19380:5446) ----
          <div className="sv-prompt-starters">
            {starters.map((s, i) => (
              <motion.div key={s.label} {...rise(i)}>
                {/* A starter is a question for the assistant, not a search
                    term — tapping one sends it, so the thinking line reads
                    back the chip you chose. It used to only fill the field,
                    which left the chip's own copy going nowhere.
                    Only the LABEL is sent: the emoji is a signpost on the
                    chip, not part of the question. */}
                <PromptStarter emoji={s.emoji} label={s.label} onSelect={() => onAsk?.(s.label)} />
              </motion.div>
            ))}
          </div>
        ) : (
          // ---- results (19542:163494 and its tab variants) ----
          <div className="sv-search-results">
            {hasResults && <SearchTabs active={tab} onSelect={setTab} />}

            {/* Dragging the list puts the keyboard away, so the sheet drops
                back down and you can see the whole thing — the standard
                phone behaviour. Bound to touchmove, not scroll: scroll also
                fires when a tab change resets the offset, which would
                dismiss the keyboard the instant the sheet opened. */}
            <div
              className="sv-search-scroll"
              ref={scroller}
              onTouchMove={dismissKeyboard}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={tab}
                  className="sv-search-pane"
                  initial={{ opacity: 0, y: reduce ? 0 : 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16, ease: EASE_OUT }}
                >
                  {showPeople && tab === 'all' && matchedPeople.length > 0 && (
                    <motion.section className="sv-search-people-rail" {...rise(0)}>
                      <LeaderboardRail
                        entries={matchedPeople.slice(0, 4).map((p) => ({
                          id: p.id,
                          name: p.name,
                          avatar: p.avatar,
                        }))}
                      />
                      {/* Only worth offering when the rail is actually
                          hiding someone — it shows four. */}
                      {matchedPeople.length >= 5 && (
                        <button
                          type="button"
                          className="sv-search-more"
                          onClick={() => setTab('people')}
                        >
                          View more people
                        </button>
                      )}
                    </motion.section>
                  )}

                  {showPeople && tab === 'people' && (
                    <div className="sv-search-person-list">
                      {matchedPeople.map((p, i) => (
                        <motion.div key={p.id} {...rise(i)}>
                          <PersonRow
                            name={p.name}
                            avatar={p.avatar}
                            visited={p.visited}
                            posts={p.posts}
                            follow={p.follow}
                            onToggleFollow={() => toggleFollow(p.id)}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {showMerchants && (
                    <div className="sv-search-result-list">
                      {merchants.map((m, i) => (
                        <motion.div key={m.id} {...rise(tab === 'all' ? i + 1 : i)}>
                          <SearchResultRow name={m.name} distance={m.distance} />
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Nothing matched, so hand the query to the assistant
                      rather than dead-ending on "no results". */}
                  {merchants.length === 0 && matchedPeople.length === 0 && (
                    <motion.button
                      type="button"
                      className="sv-search-ask"
                      {...rise(0)}
                      onClick={() => onAsk?.(query)}
                    >
                      Ask{' '}
                      <span className="sv-search-ask-brand" role="img" aria-label="bravo AI" />{' '}
                      about “{query}”
                    </motion.button>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Floats over the list rather than sitting under it, so results
            keep going behind the bar — stopping them above it read as
            "that's all of them". Takes the caret from the dock's box,
            which the sheet has just covered. */}
        <div className="sv-search-dock">
          <PromptBox
            inputId={SEARCH_INPUT_ID}
            placeholder="Ask or search anything..."
            value={query}
            autoFocus
            /* Recording "hears" this and hands it to the AI thread on Stop →
               send, the same handoff a typed query makes. */
            voiceTranscript="Happy"
            onVoiceMode={onVoiceMode}
            onChange={setQuery}
            onSubmit={(v) => onAsk?.(v)}
          />
        </div>
      </div>

      {/* Installed to the home screen the phone raises its OWN keyboard when
          the input takes focus, so ours would be a second one stacked under
          it. On the web build there is no on-screen keyboard at all — the
          reviewer types on a real one — so the mock would be a drawing of a
          keyboard under a field already taking keystrokes. Inside the phone
          frame in a browser tab it stays: there it is the device chrome that
          makes the sheet read as a phone. */}
      {!standalone && !web && <IosKeyboard suggestions={AUTOCORRECT} />}

      {/* Figma 19661:16109 — 36px, 12px in from the top and right. */}
      <button
        type="button"
        className="sv-sheet-close sv-sheet-close-corner"
        aria-label="Close search"
        onClick={onClose}
      >
        <X size={20} strokeWidth={2} />
      </button>
    </motion.div>
  )
}
