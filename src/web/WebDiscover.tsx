// Discover — the phone's Home screen, plus what the extra width buys.
//
// The screen itself is HomeScreen, unmodified: the map at the base layer, the
// balance pills and the scan/bell buttons over it, the filter chips, the
// suggestion chips, the AI dock and the bottom nav floating at the bottom. At
// a phone width that is the whole of it, and it is identical to the Live UI
// Demo because it IS the Live UI Demo.
//
// What a wide frame adds is one thing, and it is deliberately additive: the
// results the phone can only show you one at a time — a pin opens a card, you
// close it, you open the next — become a standing list beside the map. The map
// does not shrink to make room for it; the list floats over the map, because
// the map is still the screen.
//
// The rows are MerchantRow, the same component the eligible-merchants screen
// uses, over the same venues the pins are drawn from (webDemo.ts projects one
// venue list into both) — so a place can never be on the map with one rate and
// in the list with another.
import HomeScreen from '../demo/screens/HomeScreen'
import MerchantRow from '../demo/components/MerchantRow'
import { type NavId } from '../demo/components/BottomNav'
import { WEB_MERCHANTS } from './webDemo'

export default function WebDiscover({
  active,
  onNavigate,
  avatar,
}: {
  active: NavId
  onNavigate: (id: NavId) => void
  avatar?: string
}) {
  return (
    <>
      <HomeScreen active={active} onNavigate={onNavigate} avatar={avatar} />

      {/* Hidden under 1180 by the container query in web.css — at that width
          the phone's own flow is the whole answer and a second panel would be
          covering the map it sits on. */}
      <aside className="w-results" aria-label="Places around you">
        <header className="w-results-head">
          <h2 className="w-results-title">Around you</h2>
          <p className="w-results-sub">{WEB_MERCHANTS.length} places your friends rate</p>
        </header>
        <div className="w-results-list">
          {WEB_MERCHANTS.map((m) => (
            <MerchantRow key={m.id} merchant={m} />
          ))}
        </div>
      </aside>
    </>
  )
}
