// Component — Figma balance row (19564:172059 / 19564:172067)
// Label + sublabel on the left, amount + chevron on the right.
// Used twice inside SpendableSheet; drills into the balance detail screens.
import { ChevronRight } from 'lucide-react'

export default function BalanceRow({
  label,
  sublabel,
  amount,
  onClick,
}: {
  label: string
  sublabel: string
  amount: string
  onClick?: () => void
}) {
  return (
    <button type="button" className="sv-balance-row" onClick={onClick}>
      <span className="sv-balance-row-labels">
        <span className="sv-balance-row-label">{label}</span>
        <span className="sv-balance-row-sub">{sublabel}</span>
      </span>
      <span className="sv-balance-row-value">
        <span className="sv-balance-row-amount">{amount}</span>
        <ChevronRight size={20} strokeWidth={1.9} />
      </span>
    </button>
  )
}
