// Component — Figma achievement panels
//   spend  19582:177102 · streak 19582:177255 · bonus 19582:177401
//
// A 230px tinted panel that carries the thing that was earned. Each kind
// has its own tint and its own artwork; the bonus kind carries the live
// Bravo coin, which can be flipped and spun by hand.
import BravoCoin from '../coin/BravoCoin.jsx'
import useCoinFlipHint from '../hooks/useCoinFlipHint'
import badgeMaster from '../assets/social/badge-master.png'
import flameLarge from '../assets/social/flame-large.svg'

export type Achievement =
  | { kind: 'spend'; label: string }
  | { kind: 'streak'; label: string }
  | { kind: 'bonus'; amount: number }

// The shared art box (--bv-achievement-art-size in the CSS). The coin is
// drawn from the same base so the panels stay a set.
const ART_BASE = 150
// The coin and the flame fill that box on their long axis, so both read
// heavier than the badge, which only paints ~95 of it. Both come down 25%;
// the badge keeps the full base. Mirrored by .streak in the CSS.
const ART_SHRINK = 0.75

export default function AchievementPanel({ achievement }: { achievement: Achievement }) {
  const isBonus = achievement.kind === 'bonus'
  // Turns the coin ~30° as the card arrives, hinting that it is grabbable.
  const hintRef = useCoinFlipHint<HTMLDivElement>(isBonus)

  if (achievement.kind === 'bonus') {
    return (
      <div className="bv-achievement-panel bonus" ref={hintRef}>
        {/* The coin is the interactive piece — drag to spin, tap to flip.
            The amount is engraved on the back face. */}
        <BravoCoin
          value={achievement.amount}
          size={ART_BASE * ART_SHRINK}
          thickness={13 * ART_SHRINK}
        />
      </div>
    )
  }

  const isSpend = achievement.kind === 'spend'

  return (
    <div className={`bv-achievement-panel ${achievement.kind}`}>
      {/* All three kinds share one art box sized to the coin, so the panels
          read as a set rather than three unrelated illustrations. */}
      <img className="bv-achievement-art" src={isSpend ? badgeMaster : flameLarge} alt="" />
      <span className="bv-achievement-caption">{achievement.label}</span>
    </div>
  )
}
