// Rewards — implements Figma node 19457:11305.
//
// The fourth tab, and the one place the loyalty mechanics are gathered: who
// you are and what you have earned, the daily check-in, the challenge you are
// in, and the badges rail. Everything below the header scrolls under the same
// dock the other tabs wear.
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ScanLine, Bell } from 'lucide-react'
import CircleIconButton from '../components/CircleIconButton'
import { StreakLabel, LevelLabel } from '../components/AchievementLabel'
import AchievementStats from '../components/AchievementStats'
import DailyCheckIn from '../components/DailyCheckIn'
import AchievementCard from '../components/AchievementCard'
import ChallengeCard from '../components/ChallengeCard'
import ChallengeScreen from './ChallengeScreen'
import SpendLevelsScreen from './SpendLevelsScreen'
import PromptBox from '../components/PromptBox'
import useSearchLauncher from '../components/SearchLauncher'
import BottomNav, { type NavId } from '../components/BottomNav'
import EmptyState from '../components/EmptyState'
import useDragScroll from '../components/useDragScroll'
import { useDemoUser } from '../components/DemoIdentity'
import { CHALLENGE, CHALLENGE_DETAIL } from './SocialScreen'
import { EMPTY_COPY, EMPTY_PHOTOS } from '../data/emptyStateDemo'
import {
  ACHIEVEMENTS,
  CHECK_IN,
  NEW_ACHIEVEMENTS,
  NEW_CHECK_IN,
} from '../data/rewardsDemo'
import { type ProfileData } from '../data/profileDemo'

export default function RewardsScreen({
  profile,
  active,
  onNavigate,
  intro = false,
}: {
  /** The signed-in user — their face, name, streak and level head the page. */
  profile: ProfileData
  active: NavId
  onNavigate: (id: NavId) => void
  /** Play the entrance animation. False on tab switches — see BravoApp. */
  intro?: boolean
}) {
  const { searchOpen, promptProps, overlays } = useSearchLauncher('me')
  const { isNew } = useDemoUser()
  const [detailOpen, setDetailOpen] = useState(false)
  const [navHidden, setNavHidden] = useState(false)
  // The header chips explain themselves: tapping them opens the two meters,
  // and the Spend Level card in there opens the ramp in full.
  const [statsOpen, setStatsOpen] = useState(false)
  const [levelsOpen, setLevelsOpen] = useState(false)
  // Seven badges in a 402-wide phone: five of them live off the right edge,
  // and a mouse has no swipe to go and get them.
  const railRef = useDragScroll<HTMLDivElement>()

  // A brand-new account has collected nothing and earned nothing, and is in
  // no challenge — the same swap the other tabs make.
  const checkIn = isNew ? NEW_CHECK_IN : CHECK_IN
  const achievements = isNew ? NEW_ACHIEVEMENTS : ACHIEVEMENTS

  // Same as the feed and your own profile: the nav folds away scrolling down
  // and comes back on the way up.
  const scroller = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    let last = el.scrollTop
    const onScroll = () => {
      const now = el.scrollTop
      const delta = now - last
      if (Math.abs(delta) < 6) return
      last = now
      setNavHidden(delta > 0 && now > 40)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="bv-rewards-screen">
      {/* ---- header: who you are, and the two app-wide actions ---- */}
      <motion.div
        className="bv-rewards-topbar"
        initial={intro ? { opacity: 0, y: -10 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className="bv-rewards-topbar-row">
          <div className="bv-rewards-identity">
            <span
              className="bv-rewards-face"
              style={{ backgroundImage: `url(${profile.avatar})` }}
            />
            <div className="bv-rewards-who">
              <span className="bv-rewards-name">{profile.name}</span>
              {/* Earned, not given — a new account has neither yet. */}
              {!profile.isNew && (
                <button
                  type="button"
                  className="bv-rewards-labels"
                  aria-expanded={statsOpen}
                  aria-label="What these mean"
                  onClick={() => setStatsOpen((o) => !o)}
                >
                  <StreakLabel value={profile.streak} />
                  <LevelLabel level={profile.level} />
                </button>
              )}
            </div>
          </div>
          <div className="bv-topbar-group">
            <CircleIconButton icon={<ScanLine size={20} strokeWidth={1.9} />} label="Scan" />
            <CircleIconButton icon={<Bell size={20} strokeWidth={1.9} />} label="Notifications" />
          </div>
        </div>
      </motion.div>

      <div className="bv-rewards-scroll" ref={scroller}>
        <DailyCheckIn checkIn={checkIn} />

        <section className="bv-rewards-section">
          <h2 className="bv-rewards-section-title">In Progress Challenge</h2>
          {isNew ? (
            <EmptyState lines={[...EMPTY_COPY.friends.lines]} cta={EMPTY_COPY.friends.cta} />
          ) : (
            <ChallengeCard challenge={CHALLENGE} onOpen={() => setDetailOpen(true)} />
          )}
        </section>

        <section className="bv-rewards-section">
          <div className="bv-rewards-section-head">
            <h2 className="bv-rewards-section-title">Welcome Badges</h2>
            {/* Counted off the badges themselves, not carried as a number:
                a badge is earned exactly when it has an earnedOn date, so a
                new account reads 0/7 without anything else being told. */}
            <span className="bv-rewards-section-count">
              {achievements.filter((a) => a.earnedOn).length}/{achievements.length}
            </span>
          </div>
          {/* A rail, because Figma lays seven 179px cards in a row far wider
              than the phone — two and a bit are visible, the rest are pulled
              in. The right edge fades so it is visibly cut off rather than
              looking like the list simply ends there. */}
          <div className="bv-ach-rail-wrap">
            <div className="bv-ach-rail" ref={railRef}>
              {achievements.map((a) => (
                <AchievementCard key={a.id} achievement={a} />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ---- dock: the shared prompt box and nav ---- */}
      <motion.div
        className={`bv-dock bv-dock-social${navHidden ? ' nav-hidden' : ''}${
          searchOpen ? ' search-hidden' : ''
        }`}
        initial={intro ? { y: 40, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32, delay: 0.1 }}
      >
        <div className="bv-dock-row">
          <div className="bv-dock-search-trigger">
            {/* Spread first, then override: this tab's prompt is about people,
                not places. */}
            <PromptBox
              {...promptProps}
              placeholders={['Look for a friend ...']}
              placeholder="Look for a friend ..."
            />
          </div>
        </div>
        <div className="bv-nav-slot">
          <BottomNav active={active} onSelect={onNavigate} avatar={profile.avatar} />
        </div>
      </motion.div>

      {/* Stats popover — hangs off the header chips that opened it. Same
          scrim-plus-anchor pattern as Home's Combined Spendable sheet, but
          the scrim covers the header too: this explains the whole identity
          row, so there is nothing up there left to keep lit. */}
      <AnimatePresence>
        {statsOpen && (
          <>
            <motion.button
              type="button"
              className="bv-scrim"
              aria-label="Close"
              onClick={() => setStatsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            />
            <motion.div
              className="bv-rewards-stats-anchor"
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
          </>
        )}
      </AnimatePresence>

      {/* Spend Levels — the full ramp, pushed in over the popover that
          opened it. The popover stays mounted underneath, so closing this
          puts you back on the card you tapped. */}
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

      {/* Challenge detail — pushes in over this tab, same as from the feed. */}
      <AnimatePresence>
        {detailOpen && (
          <motion.div
            className="bv-challenge-screen-wrap"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.7 }}
          >
            <ChallengeScreen challenge={CHALLENGE_DETAIL} onBack={() => setDetailOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {overlays}
    </div>
  )
}
