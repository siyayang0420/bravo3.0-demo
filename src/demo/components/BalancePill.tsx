// Component — Figma "Balance Pill"
// Cash variant: node 19548:163732 · Coin variant: node 19548:163734
// Renders as a button when it has a tap handler (Home opens the
// Combined Spendable sheet from either pill), otherwise as plain text.
import type { ReactNode } from 'react'

export default function BalancePill({
  children,
  leading,
  onClick,
}: {
  children: ReactNode
  leading?: ReactNode
  onClick?: () => void
}) {
  if (onClick) {
    return (
      <button type="button" className="bv-balance-pill" onClick={onClick}>
        {leading}
        {children}
      </button>
    )
  }

  return (
    <div className="bv-balance-pill">
      {leading}
      {children}
    </div>
  )
}
