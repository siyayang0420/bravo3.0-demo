// Component — bottom nav row, eyeballed from the Home frame (20303:28671).
//
// That frame's nav is part of a flattened screenshot, not layers, so the
// icons are read off the picture: map (now a house), compass, scan, wallet, then your
// avatar. The destinations behind them are the demo's existing tabs —
// compass is the friends feed (discovery), wallet is Rewards — and scan has
// no screen yet, so it opens the "design in progress" placeholder.
import { House, Compass, ScanQrCode, WalletCards } from 'lucide-react'
import { BOBBY } from '../data/people'

export type NavId = 'map' | 'friends' | 'scan' | 'rewards' | 'profile'

const ITEMS: { id: NavId; icon: React.ReactNode; label: string }[] = [
  // Home opens on the restaurant list now, so a house rather than a map; the
  // id stays 'map' so the tabs wired to it keep working.
  { id: 'map', icon: <House size={24} strokeWidth={1.9} />, label: 'Home' },
  { id: 'friends', icon: <Compass size={24} strokeWidth={1.9} />, label: 'Discover' },
  { id: 'scan', icon: <ScanQrCode size={24} strokeWidth={1.9} />, label: 'Scan & Pay' },
  { id: 'rewards', icon: <WalletCards size={24} strokeWidth={1.9} />, label: 'Wallet' },
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
