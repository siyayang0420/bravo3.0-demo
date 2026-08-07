// Component — Figma bottom nav row (node 19453:11130)
// Icons per design layer names: map, users-round, scan-qr-code, circle-star
// (all Lucide), plus the profile avatar.
import { Map, UsersRound, ScanQrCode } from 'lucide-react'
import CircleStar from './icons/CircleStar'
import avatar from '../assets/avatar.png'

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
}: {
  active: NavId
  onSelect: (id: NavId) => void
}) {
  return (
    <nav className="bv-bottom-nav">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          className={`bv-nav-item ${active === item.id ? '' : 'inactive'}`}
          aria-label={item.label}
          onClick={() => onSelect(item.id)}
        >
          {item.icon}
        </button>
      ))}
      {/* background, not <img> — see .bv-post-avatar in the CSS.
          The other items show selection by dropping the dimming; a photo
          cannot, so this one rings itself instead. */}
      <button
        type="button"
        className={`bv-nav-avatar ${active === 'profile' ? 'active' : ''}`}
        aria-label="Profile"
        aria-current={active === 'profile' ? 'page' : undefined}
        style={{ backgroundImage: `url(${avatar})` }}
        onClick={() => onSelect('profile')}
      />
    </nav>
  )
}
