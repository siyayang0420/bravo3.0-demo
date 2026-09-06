// Component — Figma bottom nav row (node 19453:11130)
// Icons per design layer names: map, users-round, scan-qr-code, circle-star
// (all Lucide), plus the profile avatar.
import { Map, UsersRound, ScanQrCode } from 'lucide-react'
import CircleStar from './icons/CircleStar'
import { BOBBY } from '../data/people'

export type NavId = 'map' | 'friends' | 'scan' | 'rewards' | 'profile'

const ITEMS: { id: NavId; icon: React.ReactNode; label: string }[] = [
  { id: 'map', icon: <Map size={24} strokeWidth={1.9} />, label: 'Map' },
  { id: 'friends', icon: <UsersRound size={24} strokeWidth={1.9} />, label: 'Friends' },
  { id: 'scan', icon: <ScanQrCode size={24} strokeWidth={1.9} />, label: 'Scan' },
  { id: 'rewards', icon: <CircleStar size={24} strokeWidth={1.9} />, label: 'Rewards' },
]

export default function BottomNav({
  active,
  onSelect,
  // Every real call site (Home, Friends, your own profile) passes the
  // current demo user's avatar explicitly — this default only covers the
  // Design System's standalone preview, which renders the nav on its own.
  avatar = BOBBY.avatar,
}: {
  active: NavId
  onSelect: (id: NavId) => void
  /** The signed-in user's own face — the last nav item is always theirs. */
  avatar?: string
}) {
  return (
    <nav className="sv-bottom-nav">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          className={`sv-nav-item ${active === item.id ? '' : 'inactive'}`}
          aria-label={item.label}
          onClick={() => onSelect(item.id)}
        >
          {item.icon}
        </button>
      ))}
      {/* background, not <img> — see .sv-post-avatar in the CSS.
          The other items show selection by dropping the dimming; a photo
          cannot, so this one rings itself instead. */}
      <button
        type="button"
        className={`sv-nav-avatar ${active === 'profile' ? 'active' : ''}`}
        aria-label="Profile"
        aria-current={active === 'profile' ? 'page' : undefined}
        style={{ backgroundImage: `url(${avatar})` }}
        onClick={() => onSelect('profile')}
      />
    </nav>
  )
}
