// Eligible merchants — implements Figma node 19612:9472
// ("Community-Challenge"). Pushed on top of the challenge detail when the
// "View N eligible merchants" chip is tapped.
//
// Header and list scroll independently: the nav is pinned, the rows run
// under it and under the search bar's white fade at the bottom.
import ScreenNav from '../components/ScreenNav'
import MerchantRow, { type Merchant } from '../components/MerchantRow'
import PromptBox from '../components/PromptBox'

export default function MerchantsScreen({
  merchants,
  onBack,
}: {
  merchants: Merchant[]
  onBack: () => void
}) {
  return (
    <div className="bv-merchants-screen">
      <ScreenNav title="Eligible merchants" onBack={onBack} />

      <div className="bv-merchants-list">
        {merchants.map((m) => (
          <MerchantRow key={m.id} merchant={m} />
        ))}
      </div>

      {/* Same fade the dock uses — transparent to solid white at 34.4%. */}
      <div className="bv-merchants-dock">
        <PromptBox variant="search" placeholder="Search a restaurant" />
      </div>
    </div>
  )
}
