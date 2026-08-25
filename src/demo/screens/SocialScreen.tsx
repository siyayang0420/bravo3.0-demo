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
import useSearchLauncher from '../components/SearchLauncher'
import BottomNav, { type NavId } from '../components/BottomNav'
import EmptyState from '../components/EmptyState'
import { useDemoUser } from '../components/DemoIdentity'
import { EMPTY_COPY, EMPTY_PHOTOS } from '../data/emptyStateDemo'
import { BOBBY, pickPeople } from '../data/people'
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

// EDIT ME — demo content. People drawn from the shared 12-person cast
// (people.ts), each section at a different offset so the same page doesn't
// show identical faces in two places at once. Names come from the cast too,
// so a face and the name under it always belong to the same person.
const leaderboardFaces = pickPeople(5, 0)
const postFaces = pickPeople(6, 5)
// The challenge's fourth seat is Bobby ("You"), placed by hand below — so he
// is excluded here, or he'd hold two of the four seats. The card's avatar
// stack and the detail screen's bubbles are the SAME four people: one
// challenge, one roster, whichever way you look at it.
const challengeFaces = pickPeople(3, 9, ['bobby'])
const friendPostFaces = pickPeople(5, 3)

const LEADERBOARD: LeaderboardEntry[] = leaderboardFaces.map((p, i) => ({
  id: String(i + 1),
  name: p.name,
  avatar: p.avatar,
}))

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
    author: postFaces[0].name,
    avatar: postFaces[0].avatar,
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
    author: postFaces[1].name,
    avatar: postFaces[1].avatar,
    streak: '8X',
    level: 'lv6',
    date: 'Jun 3, 2026',
    caption: CAPTION,
    venue: VENUE,
  },
  // 3 — comment with images only
  {
    id: 'p3',
    author: postFaces[2].name,
    avatar: postFaces[2].avatar,
    streak: '8X',
    level: 'lv6',
    date: 'Jun 3, 2026',
    venue: VENUE,
    photos: [postPhoto, postPhoto],
  },
  // 4 — achieved a spend badge
  {
    id: 'p4',
    author: postFaces[3].name,
    avatar: postFaces[3].avatar,
    streak: '8X',
    level: 'lv7',
    date: 'Jun 3, 2026',
    caption: '$2k deep into the year. too elite to be ordinary. 🍷',
    achievement: { kind: 'spend', label: 'Unlocked Master!' },
  },
  // 5 — achieved a streak badge
  {
    id: 'p5',
    author: postFaces[4].name,
    avatar: postFaces[4].avatar,
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
    author: postFaces[5].name,
    avatar: postFaces[5].avatar,
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
  participantsLabel: `${challengeFaces[0].name} and 2+ are in this challenge with you`,
  participants: [...challengeFaces.map((p) => p.avatar), BOBBY.avatar],
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
    'Spend $1,000 together. Everyone earns an extra $5. Stackable with merchant bonuses. Invite up to 4 friends.',
  reward: 5,
  spent: 512.56,
  goal: 1000,
  expires: '2026/12/15',
  merchantCount: 24,
  inviteLimit: 3,
  merchants: ELIGIBLE_MERCHANTS,
  participants: [
    { id: 'u1', name: challengeFaces[0].name, avatar: challengeFaces[0].avatar, share: 15.1, x: 79, y: 213 },
    { id: 'u2', name: challengeFaces[1].name, avatar: challengeFaces[1].avatar, share: 13.08, x: 252, y: 8 },
    { id: 'u3', name: challengeFaces[2].name, avatar: challengeFaces[2].avatar, share: 10.02, x: 258, y: 225 },
    // Always Bobby's own perspective in this hardcoded feed flow, so "You"
    // is his real identity, not a random pool pick — which is also why
    // `challengeFaces` excludes him: four seats, four different people.
    { id: 'u4', name: 'You', avatar: BOBBY.avatar, share: 8.58, x: 65, y: 65, isYou: true },
  ],
}

const FRIEND_POSTS: Post[] = [
  {
    id: 'f1',
    author: friendPostFaces[0].name,
    avatar: friendPostFaces[0].avatar,
    streak: '2X',
    level: 'lv1',
    date: 'Jun 3, 2026',
    caption: CAPTION,
    venue: VENUE,
    photos: [postPhoto, postPhoto],
  },
  {
    id: 'f2',
    author: friendPostFaces[1].name,
    avatar: friendPostFaces[1].avatar,
    streak: '2X',
    level: 'lv1',
    date: 'Jun 3, 2026',
    caption: 'Saved to my list',
    venue: VENUE,
  },
  {
    id: 'f3',
    author: friendPostFaces[2].name,
    avatar: friendPostFaces[2].avatar,
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
    author: friendPostFaces[3].name,
    avatar: friendPostFaces[3].avatar,
    streak: '8X',
    level: 'lv7',
    date: 'Jun 3, 2026',
    caption: '$2k deep into the year. too elite to be ordinary. 🍷',
    achievement: { kind: 'spend', label: 'Unlocked Master!' },
  },
  // 19582:177205 — streak badge
  {
    id: 'f5',
    author: friendPostFaces[4].name,
    avatar: friendPostFaces[4].avatar,
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
  avatar,
}: {
  active: NavId
  onNavigate: (id: NavId) => void
  /** Play the entrance animation. False on tab switches — see BravoApp. */
  intro?: boolean
  /** The signed-in demo user's own face — the nav's last item. */
  avatar?: string
}) {
  const [tab, setTab] = useState<TabId>('foryou')
  const [navHidden, setNavHidden] = useState(false)
  const { isNew } = useDemoUser()
  const { searchOpen, promptProps, overlays } = useSearchLauncher('social')
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
            {/* For you is discovery, not a follow graph — it is what the app
                picks FOR you, so it has plenty to show on day one and stays
                exactly as it is for a brand-new account. Friends is the pane
                built out of people you know, and that one is empty until you
                know some. */}
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
            ) : isNew ? (
              // No friends, so no challenge and no posts: the whole pane is
              // the one card rather than two empty sections stacked.
              <div className="bv-social-feed">
                <EmptyState
                  lines={[...EMPTY_COPY.friends.lines]}
                  cta={EMPTY_COPY.friends.cta}
                  photos={EMPTY_PHOTOS}
                />
              </div>
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
        className={`bv-dock bv-dock-social${navHidden ? ' nav-hidden' : ''}${
          searchOpen ? ' search-hidden' : ''
        }`}
        initial={intro ? { y: 40, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32, delay: 0.1 }}
      >
        <div className="bv-dock-row">
          {/* Same as Home — mic/voice in place, placeholder opens the sheet. */}
          <div className="bv-dock-search-trigger">
            <PromptBox {...promptProps} />
          </div>
          <button type="button" className="bv-compose-btn" aria-label="New post">
            <SquarePen size={24.96} strokeWidth={1.9} />
          </button>
        </div>
        <div className="bv-nav-slot">
          <BottomNav active={active} onSelect={onNavigate} avatar={avatar} />
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

      {/* search sheet + AI thread — the prompt dock's own layers */}
      {overlays}
    </>
  )
}
