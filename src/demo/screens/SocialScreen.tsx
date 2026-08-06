// Social — implements Figma node 19564:170684
// ("Home-Scroll Up Discovery-With bar"). Scrolling feed: section tabs,
// leaderboard rail, then posts. The dock and bottom nav are shared with
// Home; the compose FAB is specific to this screen.
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRightLeft, Bell, SquarePen } from 'lucide-react'
import CircleIconButton from '../components/CircleIconButton'
import SectionTabs from '../components/SectionTabs'
import LeaderboardRail, { type LeaderboardEntry } from '../components/LeaderboardRail'
import PostCard, { type Post } from '../components/PostCard'
import ChallengeCard, { type Challenge } from '../components/ChallengeCard'
import ChallengeScreen, { type ChallengeDetail } from './ChallengeScreen'
import PromptBox from '../components/PromptBox'
import BottomNav, { type NavId } from '../components/BottomNav'
import avatarHappy1 from '../assets/social/avatar-happy1.png'
import avatarHappy000 from '../assets/social/avatar-happy000.png'
import avatarHappyman from '../assets/social/avatar-happyman.png'
import avatarHappyg from '../assets/social/avatar-happyg.png'
import avatarHappy0 from '../assets/social/avatar-happy0.png'
import avatarEmma from '../assets/social/avatar-emma.png'
import avatarCat from '../assets/social/avatar-cat.png'
import avatarJoshua from '../assets/social/avatar-joshua.png'
import postPhoto from '../assets/social/post-photo.jpg'
import venueThumb from '../assets/social/venue-amcafe.jpg'
import merchantPhoto from '../assets/social/merchant-photo.png'
import saver1 from '../assets/social/saver-1.png'
import saver2 from '../assets/social/saver-2.png'
import saver3 from '../assets/social/saver-3.png'
import { type Merchant } from '../components/MerchantRow'

const TABS = [
  { id: 'foryou' as const, label: 'For you' },
  { id: 'friends' as const, label: 'Friends' },
]

type TabId = (typeof TABS)[number]['id']

// Carousel: a pane enters from the side you are heading toward and the
// outgoing one leaves the opposite way, so the two travel together.
const PANE_VARIANTS = {
  enter: (d: number) => ({ x: d >= 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: '0%', opacity: 1 },
  exit: (d: number) => ({ x: d >= 0 ? '-100%' : '100%', opacity: 0 }),
}

// EDIT ME — demo content
const LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', name: 'happy1', avatar: avatarHappy1 },
  { id: '2', name: 'happy000', avatar: avatarHappy000 },
  { id: '3', name: 'happyman', avatar: avatarHappyman },
  { id: '4', name: 'Happyg', avatar: avatarHappyg },
  { id: '5', name: 'happy0', avatar: avatarHappy0 },
]

// Both entries render through the same PostCard — only content differs.
const VENUE = {
  name: 'AM Cafe',
  meta: 'Cafe • Vancouver • 15.13km',
  thumbnail: venueThumb,
  cashback: '3%',
}

const CAPTION = 'Best Cantonese cafe, will come again soon next time when my fam visit'

// The six variants of PostCard, in the order Figma lists them.
const POSTS: Post[] = [
  // 1 — comment with images + text
  {
    id: 'p1',
    author: 'Noooodle123',
    avatar: avatarHappy1,
    streak: '2X',
    level: 'lv1',
    date: 'Jun 3, 2026',
    caption: CAPTION,
    venue: VENUE,
    photos: [postPhoto, postPhoto],
  },
  // 2 — comment with text only
  {
    id: 'p2',
    author: 'Emma',
    avatar: avatarEmma,
    streak: '8X',
    level: 'lv6',
    date: 'Jun 3, 2026',
    caption: CAPTION,
    venue: VENUE,
  },
  // 3 — comment with images only
  {
    id: 'p3',
    author: 'catTheFood',
    avatar: avatarCat,
    streak: '8X',
    level: 'lv6',
    date: 'Jun 3, 2026',
    venue: VENUE,
    photos: [postPhoto, postPhoto],
  },
  // 4 — achieved a spend badge
  {
    id: 'p4',
    author: 'Alice',
    avatar: avatarHappyg,
    streak: '8X',
    level: 'lv7',
    date: 'Jun 3, 2026',
    caption: '$2k deep into the year. too elite to be ordinary. 🍷',
    achievement: { kind: 'spend', label: 'Unlocked Master!' },
  },
  // 5 — achieved a streak badge
  {
    id: 'p5',
    author: 'Joshua',
    avatar: avatarJoshua,
    streak: '8X',
    level: 'lv7',
    date: 'Jun 3, 2026',
    caption: [
      { text: 'the dedication! just hit a ' },
      { text: '5-month', bold: true },
      { text: ' dining streak. 🔥' },
    ],
    achievement: { kind: 'streak', label: '5-month streak!' },
  },
  // 6 — earned a bonus from a challenge; the coin is interactive
  {
    id: 'p6',
    author: 'Ken',
    avatar: avatarHappy0,
    streak: '8X',
    level: 'lv7',
    date: 'Jun 3, 2026',
    caption: [
      { text: 'Earn extra ' },
      { text: '$5', bold: true },
      { text: ' bonus from completing a challenge.' },
    ],
    achievement: { kind: 'bonus', amount: 5 },
  },
]

// ---- Friends tab (Figma 19582:175875) ----
const CHALLENGE: Challenge = {
  name: 'Summer Dining Challenge',
  participantsLabel: 'Bonnie and 2+ are in this challenge with you',
  participants: [avatarHappy000, avatarHappyman, avatarHappy1, avatarHappy0],
  reward: '$5',
  spent: 512.56,
  goal: 1000,
  expires: '2026/12/15',
}

// Eligible merchants (Figma 19612:9472). The node repeats one row seven
// times; the names are varied here so the list reads as real content.
const MERCHANT_NAMES = [
  "Vera's Burger Shack Davie St",
  'AM Cafe Robson',
  'Kokoro Tokyo Mazesoba',
  'Sushi Mura Denman',
  'Cafe Medina',
  'Miku Waterfront',
  'The Praguery Gastown',
]

const ELIGIBLE_MERCHANTS: Merchant[] = MERCHANT_NAMES.map((name, i) => ({
  id: `m${i + 1}`,
  name,
  meta: 'Burger& Fried Chicken • $$ • 12km',
  photo: merchantPhoto,
  cashback: '3%',
  savers: [saver1, saver2, saver3],
  savedCount: 65,
}))

// Detail screen (Figma 19608:9122). Positions are the artboard coordinates
// from the node; sizes are derived from `share` — see FloatingAvatar.
const CHALLENGE_DETAIL: ChallengeDetail = {
  name: 'Summer Dining Challenge',
  blurb:
    'Spend $1,000 together at eligible merchants. Everyone gets an extra $5. Stackable with merchant bonuses.',
  reward: 5,
  spent: 512.56,
  goal: 1000,
  expires: '2026/12/15',
  merchantCount: 24,
  merchants: ELIGIBLE_MERCHANTS,
  participants: [
    { id: 'u1', name: 'Uuuuzili', avatar: avatarHappyman, share: 15.1, x: 79, y: 213 },
    { id: 'u2', name: 'Relxxx123', avatar: avatarHappy1, share: 13.08, x: 252, y: 8 },
    { id: 'u3', name: 'theFlex', avatar: avatarHappy0, share: 10.02, x: 258, y: 225 },
    { id: 'u4', name: 'You', avatar: avatarHappy000, share: 8.58, x: 65, y: 65 },
  ],
}

const FRIEND_POSTS: Post[] = [
  {
    id: 'f1',
    author: 'Noooodle123',
    avatar: avatarHappyg,
    streak: '2X',
    level: 'lv1',
    date: 'Jun 3, 2026',
    caption: CAPTION,
    venue: VENUE,
    photos: [postPhoto, postPhoto],
  },
  {
    id: 'f2',
    author: 'ChasiuBao',
    avatar: avatarEmma,
    streak: '2X',
    level: 'lv1',
    date: 'Jun 3, 2026',
    caption: 'Saved to my list',
    venue: VENUE,
  },
  {
    id: 'f3',
    author: 'Ken',
    avatar: avatarHappy0,
    streak: '8X',
    level: 'lv7',
    date: 'Jun 3, 2026',
    caption: [
      { text: 'Earn extra ' },
      { text: '$5', bold: true },
      { text: ' bonus from completing a challenge.' },
    ],
    achievement: { kind: 'bonus', amount: 5 },
  },
  {
    id: 'f4',
    author: 'Alice',
    avatar: avatarCat,
    streak: '8X',
    level: 'lv7',
    date: 'Jun 3, 2026',
    caption: '$2k deep into the year. too elite to be ordinary. 🍷',
    achievement: { kind: 'spend', label: 'Unlocked Master!' },
  },
  // 19582:177205 — streak badge
  {
    id: 'f5',
    author: 'Joshua',
    avatar: avatarJoshua,
    streak: '8X',
    level: 'lv7',
    date: 'Jun 3, 2026',
    caption: [
      { text: 'the dedication! just hit a ' },
      { text: '5-month', bold: true },
      { text: ' dining streak. 🔥' },
    ],
    achievement: { kind: 'streak', label: '5-month streak!' },
  },
]

export default function SocialScreen({
  active,
  onNavigate,
  intro = false,
}: {
  active: NavId
  onNavigate: (id: NavId) => void
  /** Play the entrance animation. False on tab switches — see BravoApp. */
  intro?: boolean
}) {
  const [tab, setTab] = useState<TabId>('foryou')
  const [navHidden, setNavHidden] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  // +1 when moving right through the tabs, -1 when moving left. Drives
  // which side each pane enters from and leaves toward.
  const [direction, setDirection] = useState(0)

  const selectTab = (next: TabId) => {
    if (next === tab) return
    const from = TABS.findIndex((t) => t.id === tab)
    const to = TABS.findIndex((t) => t.id === next)
    setDirection(to > from ? 1 : -1)
    setTab(next)
  }

  // Open the feed at the top. Without this the browser restores a scroll
  // offset from the previous mount and the screen opens mid-post.
  const scroller = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
    setNavHidden(false)
  }, [tab])

  // Bottom nav slides away on the way down and comes back on the way up.
  useEffect(() => {
    const el = scroller.current
    if (!el) return

    let last = el.scrollTop
    const onScroll = () => {
      const now = el.scrollTop
      const delta = now - last
      // Ignore jitter, and never hide it right at the top of the feed.
      if (Math.abs(delta) < 6) return
      last = now
      setNavHidden(delta > 0 && now > 40)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* header — tabs + actions, pinned above the scrolling feed */}
      <motion.div
        className="bv-social-header"
        initial={intro ? { opacity: 0, y: -10 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className="bv-social-header-row">
          <SectionTabs tabs={TABS} active={tab} onSelect={selectTab} />
          <div className="bv-topbar-group">
            <CircleIconButton
              icon={<ArrowRightLeft size={20} strokeWidth={1.9} />}
              label="Switch"
            />
            <CircleIconButton icon={<Bell size={20} strokeWidth={1.9} />} label="Notifications" />
          </div>
        </div>
      </motion.div>

      <div className="bv-social-scroll" ref={scroller}>
        {/* Tabs shift like a carousel: the outgoing pane leaves the way the
            new one arrives. popLayout takes the exiting pane out of flow so
            the two slide across each other instead of stacking. */}
        <AnimatePresence initial={false} mode="popLayout" custom={direction}>
          <motion.div
            key={tab}
            className="bv-social-pane"
            custom={direction}
            variants={PANE_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.7 }}
          >
            {tab === 'foryou' ? (
              <>
                <section className="bv-leaderboard">
                  <div className="bv-leaderboard-head">
                    <h2 className="bv-leaderboard-title">Leaderboard</h2>
                    <button type="button" className="bv-leaderboard-viewall">
                      View all
                    </button>
                  </div>
                  <LeaderboardRail entries={LEADERBOARD} />
                </section>

                <div className="bv-social-feed">
                  {POSTS.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </>
            ) : (
              <>
                <section className="bv-challenge-section">
                  <h2 className="bv-challenge-title">In Progress Challenge</h2>
                  <ChallengeCard challenge={CHALLENGE} onOpen={() => setDetailOpen(true)} />
                </section>

                <div className="bv-social-feed">
                  {FRIEND_POSTS.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* dock — same fade + nav as Home, plus the compose button */}
      <motion.div
        className={`bv-dock bv-dock-social${navHidden ? ' nav-hidden' : ''}`}
        initial={intro ? { y: 40, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32, delay: 0.1 }}
      >
        <div className="bv-dock-row">
          <PromptBox placeholder="New onboarded restaurants..." />
          <button type="button" className="bv-compose-btn" aria-label="New post">
            <SquarePen size={24.96} strokeWidth={1.9} />
          </button>
        </div>
        <div className="bv-nav-slot">
          <BottomNav active={active} onSelect={onNavigate} />
        </div>
      </motion.div>

      {/* Challenge detail — pushes in over the feed */}
      <AnimatePresence>
        {detailOpen && (
          <motion.div
            className="bv-challenge-screen-wrap"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.7 }}
          >
            <ChallengeScreen
              challenge={CHALLENGE_DETAIL}
              onBack={() => setDetailOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
