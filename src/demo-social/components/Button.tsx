// Component — Figma "Button" (DS component 1344:21875)
//
// Sizes seen in the designs so far:
//   'lg' — full width, 48px, radius 16 (Combined Spendable CTA)
//   'sm' — hugs its label, radius 8 (promo cards, offer CTAs)
//
// Fills, all at the same box:
//   'solid'   — black on white text (default)
//   'outline' — white with a 0.5px border-strong hairline ("Activate it")
//   'success' — success-400, white text, usually with a trailing check
//               ("Activated", Figma 19650:15243)
//   'primary' — primary-500 on black text: an action available to you
//               ("Follow" / "Follow back", Figma 19380:5768)
//   'quiet'   — neutral-100 on neutral-500 text: a state you are already
//               in ("Following" / "Mutual", Figma 19559:167807)
//
// `ButtonAccent` is the highlighted run inside the label (Figma paints it
// primary-500 within the same text node).
import type { ReactNode } from 'react'

export type ButtonSize = 'lg' | 'sm'
export type ButtonVariant = 'solid' | 'outline' | 'success' | 'primary' | 'quiet'

export default function Button({
  children,
  size = 'lg',
  variant = 'solid',
  icon,
  onClick,
}: {
  children: ReactNode
  size?: ButtonSize
  variant?: ButtonVariant
  /** Trailing icon, e.g. the check on "Activated". */
  icon?: ReactNode
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      className={`sv-button sv-button-${size} sv-button-${variant}`}
      onClick={onClick}
    >
      {children}
      {icon}
    </button>
  )
}

export function ButtonAccent({ children }: { children: ReactNode }) {
  return <span className="sv-button-accent">{children}</span>
}
