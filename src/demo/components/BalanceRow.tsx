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
    <button type="button" className="bv-balance-row" onClick={onClick}>
      <span className="bv-balance-row-labels">
        <span className="bv-balance-row-label">{label}</span>
        <span className="bv-balance-row-sub">{sublabel}</span>
      </span>
      <span className="bv-balance-row-value">
        <span className="bv-balance-row-amount">{amount}</span>
        <ChevronRight size={20} strokeWidth={1.9} />
      </span>
    </button>
  )
}
