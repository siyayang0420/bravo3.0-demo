import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Signal, Wifi, BatteryFull } from 'lucide-react'
import HomeScreen from './screens/HomeScreen'
import SocialScreen from './screens/SocialScreen'
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
const BUILT_TABS: NavId[] = ['map', 'friends']

export default function BravoApp({
  hasPromotion = false,
}: {
  /** Demo state toggled from the review site — see LiveDemo. */
  hasPromotion?: boolean
}) {
  const [tab, setTab] = useState<NavId>('map')

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
    <div className={`bravo-app${standalone ? ' standalone' : ''}`}>
      <div className="bv-statusbar" aria-hidden={standalone}>
        <span>9:41</span>
        <span className="bv-statusbar-levels">
          <Signal size={16} strokeWidth={2.4} />
          <Wifi size={16} strokeWidth={2.4} />
          <BatteryFull size={18} strokeWidth={1.8} />
        </span>
      </div>

      {tab === 'friends' ? (
        <SocialScreen active={tab} onNavigate={setTab} intro={intro} />
      ) : (
        <HomeScreen
          active={tab}
          onNavigate={setTab}
          hasPromotion={hasPromotion}
          intro={intro}
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
    </div>
  )
}
