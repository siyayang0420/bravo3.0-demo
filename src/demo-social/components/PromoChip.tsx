// Component — Figma "My offers?" promo chip (node 19453:10434)
// Leads the suggestion row on Home, but only while a promotion is live.
// Orange surface with the same "bubble" inset the other chips use.
import coinMark from '../assets/coin-mark.svg'

export default function PromoChip({
  label = 'My offers?',
  onClick,
}: {
  label?: string
  onClick?: () => void
}) {
  return (
    <button type="button" className="sv-promo-chip" onClick={onClick}>
      <span className="sv-promo-chip-icon">
        <img src={coinMark} alt="" />
      </span>
      {label}
    </button>
  )
}
