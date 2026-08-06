// Component — Figma "Combined Spendable" sheet (node 19564:172054)
// Opens from either balance pill in the Home top bar. Shows the combined
// total, then the two balances that make it up, then the top-up CTA.
import BalanceRow from './BalanceRow'
import Button, { ButtonAccent } from './Button'

/** `$3057` when whole, `$140.88` otherwise — matches the Figma values. */
export function formatMoney(value: number) {
  const rounded = Math.round(value * 100) / 100
  return `$${rounded % 1 === 0 ? rounded : rounded.toFixed(2)}`
}

export default function SpendableSheet({
  balance,
  bonus,
  topUpBonus,
  onSelectBalance,
  onSelectBonus,
  onTopUp,
}: {
  balance: number
  bonus: number
  topUpBonus: string
  onSelectBalance?: () => void
  onSelectBonus?: () => void
  onTopUp?: () => void
}) {
  return (
    <div className="bv-spendable-sheet">
      <div className="bv-sheet-header">
        <span className="bv-sheet-title">Combined Spendable</span>
        <span className="bv-sheet-total">{formatMoney(balance + bonus)}</span>
      </div>

      <div className="bv-sheet-rows">
        <BalanceRow
          label="Balance"
          sublabel="Top-up balance"
          amount={formatMoney(balance)}
          onClick={onSelectBalance}
        />
        <div className="bv-sheet-divider" />
        <BalanceRow
          label="Bonus"
          sublabel="Earned from payments"
          amount={formatMoney(bonus)}
          onClick={onSelectBonus}
        />
      </div>

      <Button onClick={onTopUp}>
        Top up now • <ButtonAccent>Bonus + {topUpBonus}</ButtonAccent>
      </Button>
    </div>
  )
}
