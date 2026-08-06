// Component — Figma DS "AchievementLabels" (306:8847)
// The complete set: one streak variant plus levels 1–7. Every variant
// shares the same box (2px/6px, radius-full, DM Sans Bold 12) and differs
// only in tint pair and glyph — so the shape lives in CSS and the level
// only picks a modifier class and an icon.
import flame from '../assets/social/flame.svg'
import laurelLv1 from '../assets/social/laurel-lv1.svg'
import laurelLv2 from '../assets/social/laurel-lv2.svg'
import laurelLv3 from '../assets/social/laurel-lv3.svg'
import laurelLv4 from '../assets/social/laurel-lv4.svg'
import laurelLv5 from '../assets/social/laurel-lv5.svg'
import laurelLv6 from '../assets/social/laurel-lv6.svg'
import laurelLv7 from '../assets/social/laurel-lv7.svg'

export type AchievementLevel = 'lv1' | 'lv2' | 'lv3' | 'lv4' | 'lv5' | 'lv6' | 'lv7'

const LAURELS: Record<AchievementLevel, string> = {
  lv1: laurelLv1,
  lv2: laurelLv2,
  lv3: laurelLv3,
  lv4: laurelLv4,
  lv5: laurelLv5,
  lv6: laurelLv6,
  lv7: laurelLv7,
}

/** Streak multiplier — flame glyph, e.g. "2X". */
export function StreakLabel({ value }: { value: string }) {
  return (
    <span className="bv-achievement bv-achievement-streak">
      <img className="bv-achievement-icon" src={flame} alt="" width={8.382} height={11} />
      {value}
    </span>
  )
}

/** Level badge — laurel star glyph, e.g. "Lv.6". */
export function LevelLabel({ level }: { level: AchievementLevel }) {
  return (
    <span className={`bv-achievement bv-achievement-${level}`}>
      <img className="bv-achievement-icon" src={LAURELS[level]} alt="" width={12} height={12} />
      Lv.{level.slice(2)}
    </span>
  )
}
