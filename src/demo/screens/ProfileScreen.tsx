// Profile detail — two Figma sources:
//   'public' — Profile-Public (19612:9840): someone else. Back arrow, Follow /
//              Send money, an active dining challenge, no app chrome.
//   'me'     — Profile-Sender-Private (19682:49464): the signed-in user, a
//              real tab. The Home top bar (balance pills + bell + settings)
//              and the shared bottom dock (prompt box + bottom nav) frame it,
//              and the challenge is the "start one" invite.
// The middle — header, stat cards, tabs, Activity feed — is identical, so it
// is one component driven by `mode` and the profile data.
import { useEffect, useRef, useState, type Ref } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Bell, Settings } from 'lucide-react'
import Button from '../components/Button'
import BalancePill from '../components/BalancePill'
import CircleIconButton from '../components/CircleIconButton'
import Coin from '../components/Coin'
import BottomNav, { type NavId } from '../components/BottomNav'
import PromptBox from '../components/PromptBox'
import useSearchLauncher from '../components/SearchLauncher'
import SpendableSheet, { formatMoney, type SpendableTab } from '../components/SpendableSheet'
import { StreakLabel, LevelLabel } from '../components/AchievementLabel'
import AchievementStats from '../components/AchievementStats'
import SpendLevelsScreen from './SpendLevelsScreen'
import SectionTabs from '../components/SectionTabs'
import ProfileChallengeCard from '../components/ProfileChallengeCard'
import TasteIdentityPanel from '../components/TasteIdentityPanel'
import PostCard from '../components/PostCard'
import EmptyState from '../components/EmptyState'
import { useDemoUser } from '../components/DemoIdentity'
import ChallengeScreen from './ChallengeScreen'
import { RECEIVER_VIEW, SENDER_VIEW } from '../data/pendingChallengeDemo'
import { EMPTY_COPY, EMPTY_PHOTOS } from '../data/emptyStateDemo'
import { TOP_UP_BONUS } from '../data/spendableDemo'
import { type ProfileData } from '../data/profileDemo'

type ProfileTab = 'activity' | 'taste' | 'collectives'

const TABS: { id: ProfileTab; label: string }[] = [
  { id: 'activity', label: 'Activity' },
  { id: 'taste', label: 'Taste Identity' },
  { id: 'collectives', label: 'Collectives' },
]

const nf = new Intl.NumberFormat('en-US')
const EASE_OUT = [0.23, 1, 0.32, 1] as const

export default function ProfileScreen({
  profile,
  mode,
  onBack,
  active,
  onNavigate,
  avatarRef,
  avatarVisible = true,
  contentVisible = true,
}: {
  profile: ProfileData
  mode: 'public' | 'me'
  onBack: () => void
  /** me mode only — drives the bottom nav. */
  active?: NavId
  onNavigate?: (id: NavId) => void
  /** Lets ProfileLauncher measure this avatar's landing rect for the hero
   *  flight, before it's shown. */
  avatarRef?: Ref<HTMLSpanElement>
  /** False while a flying avatar clone is still travelling here — hides the
   *  real avatar so the two never show at once. */
  avatarVisible?: boolean
  /** False until the hero avatar has landed — the rest of the page (name,
   *  stats, tabs, feed) waits for that before it fades in. */
  contentVisible?: boolean
}) {
  const [tab, setTab] = useState<ProfileTab>('activity')
  const [navHidden, setNavHidden] = useState(false)
  // The pre-accept challenge detail — opened from your own 'start' or
  // 'invited' card. Which dataset depends on which side of the invite
  // you're on, not on anything the tap itself carries.
  const [challengeOpen, setChallengeOpen] = useState(false)
  // The streak and level chips explain themselves: tapping them opens the
  // two meters, the same popover the Rewards header uses.
  //
  // On Rewards the chips are in a pinned header, so the popover can hang off
  // a fixed offset. Here they live INSIDE the scroller and travel with it, so
  // the anchor is measured from the chips at open time — and the popover
  // closes if you scroll, rather than floating away from what it explains.
  const [statsOpen, setStatsOpen] = useState(false)
  const [levelsOpen, setLevelsOpen] = useState(false)
  // The balance pills up here are the same pills the map wears, so they open
  // the same Combined Spendable sheet — the top bar is pinned, not in the
  // scroller, so the sheet can hang off a fixed offset the way it does there.
  const [spendableOpen, setSpendableOpen] = useState(false)
  const [spendableTab, setSpendableTab] = useState<SpendableTab>('balance')
  const [statsTop, setStatsTop] = useState(0)
  const labelsRef = useRef<HTMLButtonElement>(null)

  const openStats = () => {
    const el = labelsRef.current
    const app = el?.closest('.bravo-app') as HTMLElement | null
    if (el && app) {
      // Into the phone's own 402-wide space, so the offset survives whatever
      // scale the review site is rendering the device at — same conversion
      // ProfileLauncher uses for the hero flight.
      const appRect = app.getBoundingClientRect()
      const rect = el.getBoundingClientRect()
      const scale = appRect.width / 402
      setStatsTop((rect.bottom - appRect.top) / scale + 12)
    }
    setStatsOpen(true)
  }
  // Same rule as the map: the pill you are already looking at closes the
  // sheet, the other one switches tabs rather than shutting it in your face.
  const openSpendable = (tab: SpendableTab) => {
    setSpendableOpen((open) => !(open && spendableTab === tab))
    setSpendableTab(tab)
  }
  // me mode wears the shared dock; the hook also renders its search / AI
  // overlays (used only when the dock is shown).
  const { searchOpen, promptProps, overlays } = useSearchLauncher('me')
  const isMe = mode === 'me'
  // The top bar shows YOUR balances, not the balances of whoever's profile
  // you are looking at — so they come from the signed-in identity, and a new
  // account reads $0.00 twice.
  const { cash, coin } = useDemoUser()
  // A brand-new account, on any of its own surfaces: no streak, no level, no
  // dining challenge, and both tab panels fall through to the empty card.
  const isNew = profile.isNew === true

  // Same as the community feed: the bottom nav folds away scrolling down and
  // returns scrolling up. Reset on tab change so it never opens hidden.
  const scroller = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
    setNavHidden(false)
  }, [tab])
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    let last = el.scrollTop
    const onScroll = () => {
      const now = el.scrollTop
      // The popover is pinned to where the chips WERE — scrolling carries
      // them out from under it, so it closes rather than hanging in mid-air.
      setStatsOpen(false)
      const delta = now - last
      if (Math.abs(delta) < 6) return
      last = now
      setNavHidden(delta > 0 && now > 40)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`bv-profile-screen ${mode}`}>
      {isMe ? (
        // Home top bar — balances left, bell + settings right. Overlays the
        // feed with a white fade, like the community header.
        // `lit` lifts the bar over the scrim while the sheet is open, so the
        // pills it hangs from stay bright — the map's top bar sits there
        // permanently, this one only needs it for the sheet.
        <div className={`bv-profile-topbar${spendableOpen ? ' lit' : ''}`}>
          <div className="bv-profile-topbar-row">
            <div className="bv-topbar-group">
              <BalancePill onClick={() => openSpendable('balance')}>
                {formatMoney(cash)}
              </BalancePill>
              <BalancePill onClick={() => openSpendable('bonus')} leading={<Coin />}>
                {formatMoney(coin)}
              </BalancePill>
            </div>
            <div className="bv-topbar-group">
              <CircleIconButton icon={<Settings size={20} strokeWidth={1.9} />} label="Settings" />
              <CircleIconButton icon={<Bell size={20} strokeWidth={1.9} />} label="Notifications" />
            </div>
          </div>
        </div>
      ) : (
        <header className="bv-profile-nav">
          <div className="bv-profile-nav-row">
            <button type="button" className="bv-screen-back" aria-label="Back" onClick={onBack}>
              <ArrowLeft size={20} strokeWidth={1.9} />
            </button>
            <div className="bv-profile-nav-actions">
              <Button size="sm" variant="solid">Follow</Button>
              <Button size="sm" variant="outline">Send money</Button>
            </div>
          </div>
        </header>
      )}

      <div className={`bv-profile-scroll ${isMe ? 'has-dock' : ''}`} ref={scroller}>
        {/* ---- header: avatar, identity, counts ----
            The avatar's own visibility is driven separately from
            everything else — see ProfileLauncher's hero-flight handoff. */}
        <section className="bv-profile-head">
          <span
            ref={avatarRef}
            className="bv-profile-avatar"
            style={{ backgroundImage: `url(${profile.avatar})`, opacity: avatarVisible ? 1 : 0 }}
          />
          <motion.div
            className="bv-profile-identity"
            initial={false}
            animate={{ opacity: contentVisible ? 1 : 0, y: contentVisible ? 0 : 6 }}
            transition={{ duration: 0.24, ease: EASE_OUT }}
          >
            <div className="bv-profile-name-row">
              <span className="bv-profile-name">{profile.name}</span>
              {/* Earned, not given — a new account has no streak to show and
                  no level to have reached, so the name stands alone. */}
              {/* The chips are public — everyone sees the streak and the
                  level. What they OPEN is not: the meters break out how much
                  has been spent and what is left to the next tier, which is
                  yours alone. On someone else's profile the pair stays a
                  plain label with nothing behind it. */}
              {!isNew &&
                (isMe ? (
                  // One button around both chips, same as the Rewards header:
                  // the popover explains the pair together, so tapping either
                  // half asks the same question.
                  <button
                    type="button"
                    className="bv-rewards-labels"
                    ref={labelsRef}
                    aria-expanded={statsOpen}
                    aria-label="What these mean"
                    onClick={() => (statsOpen ? setStatsOpen(false) : openStats())}
                  >
                    <StreakLabel value={profile.streak} />
                    <LevelLabel level={profile.level} />
                  </button>
                ) : (
                  <span className="bv-rewards-labels is-static">
                    <StreakLabel value={profile.streak} />
                    <LevelLabel level={profile.level} />
                  </span>
                ))}
            </div>
            <p className="bv-profile-joined">{profile.joined}</p>
            <div className="bv-profile-counts">
              <span>
                <b>{nf.format(profile.followers)}</b>followers
              </span>
              <span>
                <b>{nf.format(profile.following)}</b>following
              </span>
              <span>
                <b>{nf.format(profile.friends)}</b>friends
              </span>
            </div>
          </motion.div>
        </section>

        {/* ---- everything below the header, held back until the hero
            avatar lands — same fade-and-rise the activity feed already
            used, just gating more of the page ---- */}
        <motion.div
          className="bv-profile-below-head"
          initial={false}
          animate={{ opacity: contentVisible ? 1 : 0, y: contentVisible ? 0 : 10 }}
          transition={{ duration: 0.26, ease: EASE_OUT, delay: contentVisible ? 0.04 : 0 }}
        >
          {/* ---- stat cards ---- */}
          <div className="bv-profile-stats">
            <div className="bv-profile-stat">
              <b>{profile.visited}</b>
              <span>all visited</span>
            </div>
            <div className="bv-profile-stat">
              <b>{profile.saved}</b>
              <span>saved</span>
            </div>
          </div>

          {/* No challenge card at all for a new account — you have no friends
              to invite yet, so an invite card would be an empty gesture. */}
          {isNew ? null : isMe && profile.challengeCardMode === 'invited' && profile.challengeInviter ? (
            <ProfileChallengeCard
              mode="invited"
              inviter={profile.challengeInviter}
              onOpen={() => setChallengeOpen(true)}
            />
          ) : isMe ? (
            <ProfileChallengeCard
              mode="start"
              avatar={profile.avatar}
              onOpen={() => setChallengeOpen(true)}
            />
          ) : (
            <ProfileChallengeCard mode="active" name={profile.name} partners={profile.challengePartners} />
          )}

          {/* ---- tabs + panel ---- */}
          <div className="bv-profile-tabs">
            <SectionTabs tabs={TABS} active={tab} onSelect={setTab} />
          </div>

          {tab === 'activity' ? (
            <motion.div
              key="activity"
              className="bv-profile-feed"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
            >
              {/* Driven by the list, not by a flag: an empty feed is an
                  empty feed, whoever it belongs to. */}
              {profile.posts.length === 0 ? (
                <EmptyState
                  lines={[...EMPTY_COPY.activity.lines]}
                  cta={EMPTY_COPY.activity.cta}
                  photos={EMPTY_PHOTOS}
                />
              ) : (
                profile.posts.map((post) => <PostCard key={post.id} post={post} />)
              )}
            </motion.div>
          ) : tab === 'taste' ? (
            <motion.div
              key="taste"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
            >
              {/* The radar and the cuisine breakdown are read FROM your
                  history — with none, there is nothing to draw, so the panel
                  is replaced rather than rendered at zero. */}
              {isNew ? (
                <EmptyState
                  lines={[...EMPTY_COPY.taste.lines]}
                  cta={EMPTY_COPY.taste.cta}
                  photos={EMPTY_PHOTOS}
                />
              ) : (
                <TasteIdentityPanel profile={profile} />
              )}
            </motion.div>
          ) : (
            <motion.div
              key={tab}
              className="bv-profile-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              Coming soon
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Shared dock — the community dock, so the nav folds on scroll the
          same way. Same PromptBox + BottomNav, without the compose button. */}
      {isMe && (
        <>
          <div
            className={`bv-dock bv-dock-social${navHidden ? ' nav-hidden' : ''}${
              searchOpen ? ' search-hidden' : ''
            }`}
          >
            <div className="bv-dock-row">
              <div className="bv-dock-search-trigger">
                <PromptBox {...promptProps} />
              </div>
            </div>
            <div className="bv-nav-slot">
              <BottomNav
                active={active ?? 'profile'}
                onSelect={onNavigate ?? (() => {})}
                avatar={profile.avatar}
              />
            </div>
          </div>
          {overlays}
        </>
      )}

      {/* Combined Spendable sheet — the same card the map opens, hung off the
          same pills. me mode only, since the public header has no balances.
          The scrim is the plain one: the top bar is `lit` above it, so the
          pills stay readable as the sheet's anchor, exactly as on the map. */}
      {/* Keyed siblings, not a fragment — see the note in SearchLauncher. */}
      <AnimatePresence>
        {isMe && spendableOpen && (
          <motion.button
            key="spendable-scrim"
            type="button"
            className="bv-scrim"
            aria-label="Close balance details"
            onClick={() => setSpendableOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />
        )}
        {isMe && spendableOpen && (
          <motion.div
            key="spendable-sheet"
            className="bv-spendable-anchor"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          >
            <SpendableSheet
              balance={cash}
              bonus={coin}
              topUpBonus={TOP_UP_BONUS}
              tab={spendableTab}
              onTabChange={setSpendableTab}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats popover — the same two meters the Rewards header opens, hung
          off the chips that were tapped here instead. */}
      <AnimatePresence>
        {statsOpen && (
          <motion.button
            key="stats-scrim"
            type="button"
            className="bv-scrim"
            aria-label="Close"
            onClick={() => setStatsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />
        )}
        {statsOpen && (
          <motion.div
            key="stats-anchor"
            className="bv-profile-stats-anchor"
            style={{ top: statsTop }}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          >
            <AchievementStats
              streak={profile.streak}
              level={profile.level}
              onOpenLevels={() => setLevelsOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spend Levels — the full ramp, same as from the Rewards header. The
          popover stays mounted underneath, so closing this puts you back on
          the card you tapped. */}
      <AnimatePresence>
        {levelsOpen && (
          <motion.div
            className="bv-levels-wrap"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.7 }}
          >
            <SpendLevelsScreen level={profile.level} onBack={() => setLevelsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pre-accept detail — pushes in over this screen, same as it does
          from the feed. Which side of the invite you're on picks the
          dataset: RECEIVER_VIEW puts an Accept pill on your own seat,
          SENDER_VIEW shows you already in and everyone else pending. */}
      <AnimatePresence>
        {challengeOpen && (
          <motion.div
            className="bv-challenge-screen-wrap"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.7 }}
          >
            <ChallengeScreen
              challenge={profile.challengeCardMode === 'invited' ? RECEIVER_VIEW : SENDER_VIEW}
              onBack={() => setChallengeOpen(false)}
              onAccept={() => setChallengeOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
