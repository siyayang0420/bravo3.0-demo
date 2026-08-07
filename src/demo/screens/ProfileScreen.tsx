// Profile detail — two Figma sources:
//   'public' — Profile-Public (19612:9840): someone else. Back arrow, Follow /
//              Send money, an active dining challenge, no app chrome.
//   'me'     — Profile-Sender-Private (19682:49464): the signed-in user, a
//              real tab. The Home top bar (balance pills + bell + settings)
//              and the shared bottom dock (prompt box + bottom nav) frame it,
//              and the challenge is the "start one" invite.
// The middle — header, stat cards, tabs, Activity feed — is identical, so it
// is one component driven by `mode` and the profile data.
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Bell, Settings } from 'lucide-react'
import Button from '../components/Button'
import BalancePill from '../components/BalancePill'
import CircleIconButton from '../components/CircleIconButton'
import Coin from '../components/Coin'
import BottomNav, { type NavId } from '../components/BottomNav'
import PromptBox from '../components/PromptBox'
import useSearchLauncher from '../components/SearchLauncher'
import { formatMoney } from '../components/SpendableSheet'
import { StreakLabel, LevelLabel } from '../components/AchievementLabel'
import SectionTabs from '../components/SectionTabs'
import ProfileChallengeCard from '../components/ProfileChallengeCard'
import PostCard from '../components/PostCard'
import { type ProfileData } from '../data/profileDemo'

// Your own balances, same as Home's top bar.
const CASH_BALANCE = 2916.12
const COIN_BALANCE = 140.88

type ProfileTab = 'activity' | 'taste' | 'collectives'

const TABS: { id: ProfileTab; label: string }[] = [
  { id: 'activity', label: 'Activity' },
  { id: 'taste', label: 'Taste Identity' },
  { id: 'collectives', label: 'Collectives' },
]

const nf = new Intl.NumberFormat('en-US')

export default function ProfileScreen({
  profile,
  mode,
  onBack,
  active,
  onNavigate,
}: {
  profile: ProfileData
  mode: 'public' | 'me'
  onBack: () => void
  /** me mode only — drives the bottom nav. */
  active?: NavId
  onNavigate?: (id: NavId) => void
}) {
  const [tab, setTab] = useState<ProfileTab>('activity')
  // me mode wears the shared dock; the hook also renders its search / AI
  // overlays (used only when the dock is shown).
  const { promptProps, overlays } = useSearchLauncher()
  const isMe = mode === 'me'

  return (
    <div className={`bv-profile-screen ${mode}`}>
      {isMe ? (
        // Home top bar — balances left, bell + settings right.
        <div className="bv-profile-topbar">
          <div className="bv-topbar-group">
            <BalancePill>{formatMoney(CASH_BALANCE)}</BalancePill>
            <BalancePill leading={<Coin />}>{formatMoney(COIN_BALANCE)}</BalancePill>
          </div>
          <div className="bv-topbar-group">
            <CircleIconButton icon={<Bell size={20} strokeWidth={1.9} />} label="Notifications" />
            <CircleIconButton icon={<Settings size={20} strokeWidth={1.9} />} label="Settings" />
          </div>
        </div>
      ) : (
        <header className="bv-profile-nav">
          <button type="button" className="bv-screen-back" aria-label="Back" onClick={onBack}>
            <ArrowLeft size={20} strokeWidth={1.9} />
          </button>
          <div className="bv-profile-nav-actions">
            <Button size="sm" variant="solid">Follow</Button>
            <Button size="sm" variant="outline">Send money</Button>
          </div>
        </header>
      )}

      <div className={`bv-profile-scroll ${isMe ? 'has-dock' : ''}`}>
        {/* ---- header: avatar, identity, counts ---- */}
        <section className="bv-profile-head">
          <span
            className="bv-profile-avatar"
            style={{ backgroundImage: `url(${profile.avatar})` }}
          />
          <div className="bv-profile-identity">
            <div className="bv-profile-name-row">
              <span className="bv-profile-name">{profile.name}</span>
              <StreakLabel value={profile.streak} />
              <LevelLabel level={profile.level} />
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
          </div>
        </section>

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

        <ProfileChallengeCard
          mode={isMe ? 'start' : 'active'}
          name={profile.name}
          partners={profile.challengePartners}
        />

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
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          >
            {profile.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
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
      </div>

      {/* Shared dock — identical to Home's: the same .bv-bottom-stack
          wrapper, .bv-dock, prompt box and BottomNav. */}
      {isMe && (
        <>
          <div className="bv-bottom-stack">
            <div className="bv-dock">
              <div className="bv-dock-search-trigger">
                <PromptBox placeholder="New onboarded restaurants..." {...promptProps} />
              </div>
              <BottomNav active={active ?? 'profile'} onSelect={onNavigate ?? (() => {})} />
            </div>
          </div>
          {overlays}
        </>
      )}
    </div>
  )
}
