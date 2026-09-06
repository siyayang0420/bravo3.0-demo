// Component — the neutral "Expired on …" pill (Figma 19299:7837, and the
// same box on the promo card at 19344:8461).
//
// Extracted because the offers sheet and the promo card use an identical
// box: neutral-150, 6/8 padding, radius-full, DM Sans 12 regular on black.
export default function ExpiryPill({ children }: { children: string }) {
  return <span className="sv-expiry-pill">{children}</span>
}
