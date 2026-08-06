// Component — a merchant offer in the offers sheet (Figma 19243:4657 and
// its sibling 19299:7838; activated state 19650:15243).
//
// 97x108 photo with the boosted rate burned into a bottom gradient — the
// old rate sits beside it struck through, which is the whole pitch of the
// card. The right column pushes the expiry pill to the top and the CTA to
// the bottom, so rows line up however long the name is.
import { Check } from 'lucide-react'
import Button from './Button'
import ExpiryPill from './ExpiryPill'

export type Offer = {
  id: string
  merchant: string
  meta: string
  photo: string
  /** The boosted rate, e.g. "10%". */
  rate: string
  /** The rate it replaces, struck through, e.g. "3%". */
  baseRate: string
  expiry: string
}

export default function OfferCard({
  offer,
  activated = false,
  onActivate,
}: {
  offer: Offer
  activated?: boolean
  onActivate?: () => void
}) {
  return (
    <article className="bv-offer">
      <div className="bv-offer-photo">
        <img src={offer.photo} alt="" />
        <span className="bv-offer-rate">
          <span className="bv-offer-rate-new">{offer.rate}</span>
          <span className="bv-offer-rate-old">{offer.baseRate}</span>
        </span>
      </div>

      <div className="bv-offer-body">
        <ExpiryPill>{offer.expiry}</ExpiryPill>

        <div className="bv-offer-copy">
          <span className="bv-offer-name">{offer.merchant}</span>
          <span className="bv-offer-meta">{offer.meta}</span>
        </div>

        {activated ? (
          <Button size="sm" variant="success" icon={<Check size={16} strokeWidth={2.2} />}>
            Activated
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={onActivate}>
            Activate it
          </Button>
        )}
      </div>
    </article>
  )
}
