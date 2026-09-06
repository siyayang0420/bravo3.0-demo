// Component — Figma promotion card (19564:172570 / 19564:172586)
// Two variants for the expiry, which is the only difference between the
// two instances in the design:
//   'text'  — plain grey line under the title
//   'badge' — neutral pill above the title
import Coin from './Coin'
import Button from './Button'
import ExpiryPill from './ExpiryPill'

export type PromoExpiryStyle = 'text' | 'badge'

export default function PromoCard({
  title,
  expiry,
  expiryStyle = 'text',
  onTopUp,
}: {
  title: string
  expiry: string
  expiryStyle?: PromoExpiryStyle
  onTopUp?: () => void
}) {
  return (
    <div className="sv-promo-card">
      <div className="sv-promo-card-head">
        <Coin size={42} />
        <div className="sv-promo-card-copy">
          {expiryStyle === 'badge' ? (
            <>
              <ExpiryPill>{expiry}</ExpiryPill>
              <span className="sv-promo-card-title">{title}</span>
            </>
          ) : (
            <>
              <span className="sv-promo-card-title">{title}</span>
              <span className="sv-promo-card-expiry">{expiry}</span>
            </>
          )}
        </div>
      </div>

      <div className="sv-promo-card-foot">
        <span className="sv-promo-card-terms">T&amp;C Apply</span>
        <Button size="sm" onClick={onTopUp}>
          Top up now
        </Button>
      </div>
    </div>
  )
}
