// Eligible merchants — implements Figma node 19612:9472
// ("Community-Challenge"). Pushed on top of the challenge detail when the
// "View N eligible merchants" chip is tapped.
//
// Header and list scroll independently: the nav is pinned, the rows run
// under it and under the search bar's white fade at the bottom.
import ScreenNav from '../components/ScreenNav'
import MerchantRow, { type Merchant } from '../components/MerchantRow'
import PromptBox from '../components/PromptBox'
import EmptyState from '../components/EmptyState'
import { EMPTY_COPY } from '../data/emptyStateDemo'

export default function MerchantsScreen({
  merchants,
  onBack,
}: {
  merchants: Merchant[]
  onBack: () => void
}) {
  return (
    <div className="sv-merchants-screen">
      <ScreenNav title="Eligible merchants" onBack={onBack} />

      <div className="sv-merchants-list">
        {/* Reached only through a challenge, so a new account cannot get here
            today — but a list screen that renders nothing at all when handed
            an empty list is a bug waiting for the first challenge with no
            merchants signed up. No photo fan: there is nothing to preview. */}
        {merchants.length === 0 ? (
          <EmptyState lines={[...EMPTY_COPY.merchants.lines]} />
        ) : (
          merchants.map((m) => <MerchantRow key={m.id} merchant={m} />)
        )}
      </div>

      {/* Same fade the dock uses — transparent to solid white at 34.4%. */}
      <div className="sv-merchants-dock">
        <PromptBox variant="search" placeholder="Search a restaurant" />
      </div>
    </div>
  )
}
