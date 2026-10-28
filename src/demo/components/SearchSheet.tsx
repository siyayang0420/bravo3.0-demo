// Component — the Home search sheet.
//
// Full-page search until a search runs; Enter (or a recent chip) drops it to
// a bottom sheet so the map above can show where the results are — the
// results go up through onResults. Tapping the field again goes full-page.
//
// One sheet, five Figma states; they are states, not screens:
//   20301:24988  tapped     — recent + other searches, keyboard up
//   20301:24443  typing     — "Ask bravo AI about …", people rail, the
//                              same result cards as Enter, under the keyboard
//   20302:25288  Enter      — keyboard down, full result cards (All)
//   20302:25498  Restaurant — result cards only
//   20303:28516  People     — the people rail only
//
// Which one you see falls out of `query`, whether the field is focused, and
// the active tab. The sheet is bottom-anchored and sizes to what it holds —
// tall while the keyboard is up, as short as its results once it is down —
// which is why the People tab sits low over the map in the design.
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'framer-motion'
import { ChevronDown, History, Sparkles, X } from 'lucide-react'
import PromptBox from './PromptBox'
import IosKeyboard from './IosKeyboard'
import SearchTabs, { type SearchTabId } from './SearchTabs'
import SearchHitRow from './SearchHitRow'
import PersonRow, { type FollowState } from './PersonRow'
import { useDemoUser } from './DemoIdentity'
import {
  SEARCH_HITS,
  SEARCH_OTHER,
  SEARCH_PEOPLE,
  SEARCH_RECENT,
  type SearchHit,
  type SearchPerson,
} from '../data/searchDemo'
import useStandalone from '../../hooks/useStandalone'
import useWebFrame from '../../hooks/useWebFrame'

// Emil's strong ease-out. The built-in curves are too weak to read as
// intentional at these durations.
const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const SEARCH_INPUT_ID = 'bv-search-sheet-input'

const AUTOCORRECT = ['“The”', 'the', 'to']
/** Recent searches shown before the chevron expands the rest. */
const RECENT_FOLDED = 2
/** The rail's width holds four faces; more than that earns "View more". */
const RAIL = 4

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
  onClose,
  onAsk,
  onVoiceMode,
  onResults,
}: {
  onClose?: () => void
  /** A search was run — these are the venues it found, for the map. */
  onResults?: (hits: SearchHit[]) => void
  /** Hands a question to the bravo AI thread. */
  onAsk?: (query: string) => void
  /** Tapping the voice-mode (audio-lines) button — opens the listening orb. */
  onVoiceMode?: () => void
}) {
  const { isNew } = useDemoUser()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  // False: the full-page search. True once a search has run: a sheet over the
  // map, which is showing the results.
  const [committed, setCommitted] = useState(false)
  const [tabPicked, setTab] = useState<SearchTabId>('all')
  const [recent, setRecent] = useState(SEARCH_RECENT)
  const [recentOpen, setRecentOpen] = useState(false)
  // "View more people" swaps the four-face rail for the full follow list.
  const [peopleOpen, setPeopleOpen] = useState(false)
  // Restaurants are the world's and stay put — a new account can search the
  // whole map on day one. The FOLLOW STATES are yours, though, so a brand-new
  // account starts with everyone as someone you could follow.
  const [people, setPeople] = useState<SearchPerson[]>(() => seedPeople(isNew))
  useEffect(() => {
    setPeople(seedPeople(isNew))
  }, [isNew])
  const reduce = useReducedMotion()
  const standalone = useStandalone()
  const web = useWebFrame()
  // False from the moment the sheet starts closing. A closing sheet takes no
  // clicks, so a slide-out that stalls (the review pane can stop delivering
  // animation frames) can never leave it sitting over the dock eating taps.
  const present = useIsPresent()

  const q = query.trim().toLowerCase()
  const hasQuery = q.length > 0
  const hits = SEARCH_HITS.filter((h) => h.name.toLowerCase().includes(q))
  // Only people whose name matches — a restaurant query shows no faces.
  const matchedPeople = people.filter((p) => p.name.toLowerCase().includes(q))
  const hasResults = hits.length > 0 || matchedPeople.length > 0
  // A tab with nothing in it loses its chip — and if you were on it when the
  // query stopped matching, you land back on All.
  const emptyTabs: SearchTabId[] = []
  if (!matchedPeople.length) emptyTabs.push('people')
  if (!hits.length) emptyTabs.push('restaurant')
  const tab = emptyTabs.includes(tabPicked) ? 'all' : tabPicked
  // Make the fallback stick, so a later query that fills the tab again
  // doesn't jump you back onto it.
  useEffect(() => {
    if (tab !== tabPicked) setTab(tab)
  }, [tab, tabPicked])

  const showPeople = tab === 'all' || tab === 'people'
  const showHits = tab === 'all' || tab === 'restaurant'

  // Open each tab at the top — without this the browser keeps the previous
  // pane's offset and the list opens mid-row.
  const scroller = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
  }, [tab, query])

  const blur = () => document.getElementById(SEARCH_INPUT_ID)?.blur()

  // Enter, the submit arrow and a recent chip all land here: the query is
  // run, it joins your recent searches, and the keyboard goes away so the
  // results get the screen.
  const commit = (value: string) => {
    const v = value.trim()
    if (!v) return
    setQuery(v)
    setCommitted(true)
    onResults?.(SEARCH_HITS.filter((h) => h.name.toLowerCase().includes(v.toLowerCase())))
    setTab('all')
    setPeopleOpen(false)
    setRecent((r) => [v, ...r.filter((x) => x.toLowerCase() !== v.toLowerCase())])
    blur()
  }

  const toggleFollow = (id: string) =>
    setPeople((prev) =>
      prev.map((p) => (p.id === id ? { ...p, follow: NEXT_FOLLOW[p.follow] } : p)),
    )

  const rise = (i: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.15 } }
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.26, ease: EASE_OUT, delay: i * 0.04 },
        }

  const shownRecent = recentOpen ? recent : recent.slice(0, RECENT_FOLDED)

  return (
    <motion.div
      className={`bv-search-sheet${committed ? '' : ' full'}`}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', duration: 0.44, bounce: 0.06 }}
      style={{ pointerEvents: present ? undefined : 'none' }}
      // Taps inside the sheet keep the field focused. The sheet is bottom-
      // anchored and shrinks when the keyboard goes, so letting a press blur
      // the field would move whatever you were pressing out from under your
      // finger before the click landed. Committing a search, or dragging the
      // list, is what puts the keyboard away.
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).tagName !== 'INPUT') e.preventDefault()
      }}
    >
      <span className="bv-search-handle" />

      <div className="bv-search-head">
        <div className="bv-search-ai">
          <span className="bv-search-ai-mark">
            <span className="bv-search-wordmark" role="img" aria-label="bravo AI" />
            <em>is here</em>
          </span>
          {/* With something typed it asks about that; empty, there is nothing
              to send yet, so it opens the voice assistant to ask out loud. */}
          <button
            type="button"
            className="bv-search-ai-ask"
            onClick={() => (hasQuery ? onAsk?.(query.trim()) : onVoiceMode?.())}
          >
            Ask anything
          </button>
        </div>
        <PromptBox
          plain
          inputId={SEARCH_INPUT_ID}
          placeholder="Search"
          value={query}
          autoFocus
          voiceTranscript="Happy"
          onVoiceMode={onVoiceMode}
          onBack={onClose}
          onChange={(v) => {
            setQuery(v)
            setPeopleOpen(false)
          }}
          onSubmit={commit}
          onFocus={() => {
            setFocused(true)
            setCommitted(false)
          }}
          onBlur={() => setFocused(false)}
        />
      </div>

      {/* Dragging the list puts the keyboard away — the standard phone
          behaviour. Bound to touchmove, not scroll: scroll also fires when a
          tab change resets the offset. */}
      <div className="bv-search-scroll" ref={scroller} onTouchMove={blur}>
        {!hasQuery ? (
          // ---- tapped (20301:24988) ----
          <div className="bv-search-starters">
            <section className="bv-search-group">
              <h4 className="bv-search-group-title">Recent searches</h4>
              <div className="bv-search-chips">
                {shownRecent.map((r) => (
                  <span key={r} className="bv-search-chip">
                    <button type="button" className="bv-search-chip-main" onClick={() => commit(r)}>
                      <History size={14} strokeWidth={1.8} />
                      {r}
                    </button>
                    <button
                      type="button"
                      className="bv-search-chip-x"
                      aria-label={`Remove ${r}`}
                      onClick={() => setRecent((all) => all.filter((x) => x !== r))}
                    >
                      <X size={14} strokeWidth={1.8} />
                    </button>
                  </span>
                ))}
                {recent.length > RECENT_FOLDED && (
                  <button
                    type="button"
                    className={`bv-search-chip bv-search-chip-more${recentOpen ? ' open' : ''}`}
                    aria-label={recentOpen ? 'Show fewer' : 'Show all recent searches'}
                    aria-expanded={recentOpen}
                    onClick={() => setRecentOpen((o) => !o)}
                  >
                    <ChevronDown size={14} strokeWidth={1.8} />
                  </button>
                )}
              </div>
            </section>

            <section className="bv-search-group">
              <h4 className="bv-search-group-title">Other searches</h4>
              {/* Sparkles mark these as questions for the assistant rather
                  than search terms, so they go to the AI thread. */}
              {SEARCH_OTHER.map((o) => (
                <button key={o} type="button" className="bv-search-chip ai" onClick={() => onAsk?.(o)}>
                  <Sparkles size={14} strokeWidth={1.8} />
                  {o}
                </button>
              ))}
            </section>
          </div>
        ) : (
          <div className="bv-search-results">
            {/* Only while typing: once Enter has run the search, the results
                ARE the answer and the offer to ask instead steps away. */}
            {focused && (
              <button type="button" className="bv-search-askpill" onClick={() => onAsk?.(query.trim())}>
                <span className="bv-search-askpill-chip">
                  Ask <span className="bv-search-wordmark" role="img" aria-label="bravo AI" /> about “
                  {query.trim()}”
                </span>
              </button>
            )}

            {hasResults && (
              <SearchTabs
                active={tab}
                hidden={emptyTabs}
                onSelect={(t) => {
                  setTab(t)
                  setPeopleOpen(false)
                }}
              />
            )}

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                className="bv-search-pane"
                initial={{ opacity: 0, y: reduce ? 0 : 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16, ease: EASE_OUT }}
              >
                {showPeople && matchedPeople.length > 0 && (
                  peopleOpen ? (
                    <div className="bv-search-person-list">
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
                  ) : (
                    <section className="bv-search-people">
                      <div className="bv-search-rail">
                        {matchedPeople.slice(0, RAIL).map((p, i) => (
                          <motion.div key={p.id} className="bv-search-face" {...rise(i)}>
                            <span style={{ backgroundImage: `url(${p.avatar})` }} />
                            <b>{p.name}</b>
                          </motion.div>
                        ))}
                      </div>
                      {matchedPeople.length > RAIL && (
                        <button
                          type="button"
                          className="bv-search-more"
                          onClick={() => {
                            setTab('people')
                            setPeopleOpen(true)
                          }}
                        >
                          View more people
                        </button>
                      )}
                    </section>
                  )
                )}

                {/* Full result cards in every state — typing shows the same
                    list Enter does, so the results don't change shape when
                    the keyboard drops. */}
                {showHits && hits.length > 0 && (
                  <div className="bv-search-hits">
                    {hits.map((h, i) => (
                      <motion.div key={h.id} {...rise(i)}>
                        <SearchHitRow hit={h} />
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Nothing matched, so hand the query to the assistant
                    rather than dead-ending on "no results". Only once the
                    search is committed: while typing, the pill above is
                    already that offer, and two of them read as two actions. */}
                {!hasResults && !focused && (
                  <button type="button" className="bv-search-ask" onClick={() => onAsk?.(query.trim())}>
                    Ask <span className="bv-search-ask-brand" role="img" aria-label="bravo AI" /> about “
                    {query.trim()}”
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Only while the field has focus — the keyboard is what the field
          raises, not part of the sheet. Installed to the home screen the phone
          draws its own, and on the web build there is a real one, so the
          drawing only appears inside the phone frame in a browser tab. */}
      {focused && !standalone && !web && <IosKeyboard suggestions={AUTOCORRECT} />}
    </motion.div>
  )
}
