import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Signal, Wifi, BatteryFull } from 'lucide-react'
import HomeScreen from './screens/HomeScreen'
import SocialScreen from './screens/SocialScreen'
import ProfileScreen from './screens/ProfileScreen'
import RewardsScreen from './screens/RewardsScreen'
import ProfileProvider from './components/ProfileLauncher'
import DemoUserProvider from './components/DemoIdentity'
import UnlockSheet from './components/UnlockSheet'
import { DEMO_USERS, meProfile, type DemoUser } from './data/profileDemo'
import { UNLOCKS, type UnlockKind } from './data/unlockDemo'
import type { NavId } from './components/BottomNav'
import useStandalone from '../hooks/useStandalone'

const TAB_LABELS: Record<NavId, string> = {
  map: 'Map',
  friends: 'Friends',
  scan: 'Scan & Pay',
  rewards: 'Rewards',
  profile: 'Profile',
}

/** Tabs with an implemented design — the rest show the placeholder. */
const BUILT_TABS: NavId[] = ['map', 'friends', 'rewards', 'profile']

export default function BravoApp({
  hasPromotion = false,
  unlock = 'none',
  user = DEMO_USERS[0],
}: {
  /** Demo state toggled from the review site — see LiveDemo. */
  hasPromotion?: boolean
  /**
   * Which unlock sheet is up, if any. A demo-state toggle for now: the app
   * has no event that fires these yet, so the tweaker stands in for one.
   */
  unlock?: UnlockKind
  /** Who you are signed in as — drives your own profile. */
  user?: DemoUser
}) {
  const [tab, setTab] = useState<NavId>('map')
  // Dismissing puts the sheet away without touching the tweaker, so the
  // reviewer can look behind it and then flip the control to bring it back.
  const [unlockShown, setUnlockShown] = useState(true)
  useEffect(() => {
    setUnlockShown(true)
  }, [unlock])
  // Your own profile, for whichever demo user is active.
  const me = useMemo(() => meProfile(user), [user])

  // Installed to the home screen, the phone draws its OWN status bar over
  // the top of the app. Ours would sit under it, so it hides — the real
  // clock and battery take its place, which is what makes it read as an app
  // rather than a mock. The band stays in the layout (visibility, not
  // display) so every screen below it keeps its measured position.
  const standalone = useStandalone()

  // The screens animate in once, when the app first appears. Switching
  // tabs remounts them, so without this the header and dock would replay
  // their entrance every time — distracting rather than polished.
  const introPlayed = useRef(false)
  const intro = !introPlayed.current
  useEffect(() => {
    introPlayed.current = true
  }, [])

  return (
    // Who you are signed in as, for the surfaces that hold no profile of
    // their own — the map, the feed, the search sheet — so they can empty
    // out for a brand-new account without a `user` prop reaching them.
    <DemoUserProvider user={user}>
      <div className={`bravo-app${standalone ? ' standalone' : ''}`}>
        <div className="bv-statusbar" aria-hidden={standalone}>
          <span>9:41</span>
          <span className="bv-statusbar-levels">
            <Signal size={16} strokeWidth={2.4} />
            <Wifi size={16} strokeWidth={2.4} />
            <BatteryFull size={18} strokeWidth={1.8} />
          </span>
        </div>

        {/* Any person tapped inside a screen opens their public profile over
            the top — see ProfileProvider. */}
        <ProfileProvider>
          {tab === 'profile' ? (
            // The nav avatar is your own profile — a full tab with the app's
            // top bar and bottom nav.
            <ProfileScreen
              profile={me}
              mode="me"
              active={tab}
              onNavigate={setTab}
              onBack={() => setTab('map')}
            />
          ) : tab === 'friends' ? (
            <SocialScreen active={tab} onNavigate={setTab} intro={intro} avatar={user.avatar} />
          ) : tab === 'rewards' ? (
            <RewardsScreen profile={me} active={tab} onNavigate={setTab} intro={intro} />
          ) : (
            <HomeScreen
              active={tab}
              onNavigate={setTab}
              hasPromotion={hasPromotion}
              intro={intro}
              avatar={user.avatar}
            />
          )}

          {/* Tabs without designs yet show a placeholder over the map.
              Will be replaced as Figma screens land. */}
          <AnimatePresence>
            {!BUILT_TABS.includes(tab) && (
              <motion.div
                className="bv-coming-soon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={() => setTab('map')}
              >
                <h3>{TAB_LABELS[tab]}</h3>
                <p>
                  Design in progress — tap anywhere
                  <br />
                  to return to the map.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unlock sheets — over everything, including whichever tab you
              are on, because in the product these arrive on top of what you
              were doing rather than living on a screen. */}
          <AnimatePresence>
            {unlock !== 'none' && unlockShown && (
              <UnlockSheet
                unlock={UNLOCKS[unlock]}
                onClaim={() => setUnlockShown(false)}
                onDismiss={() => setUnlockShown(false)}
              />
            )}
          </AnimatePresence>
        </ProfileProvider>
      </div>
    </DemoUserProvider>
  )
}
