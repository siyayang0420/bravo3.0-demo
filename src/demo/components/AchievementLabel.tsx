// Component — Figma "AchievementLabels" (19895:20504)
//
// Two chips of one shape: a streak multiplier and a level. Both are
// neutral-150 with neutral-600 text (2px/6px, radius-full, DM Sans Bold 12),
// so the pill says nothing on its own — the GLYPH carries the meaning. The
// level is told entirely by which of the seven sparks is in it.
//
// The glyphs are 3D renders, delivered at 300px for an 11px slot; they are
// committed as 48px WebP (4x) at ~1KB each.
import flame from '../assets/social/flame.webp'
import spark1 from '../assets/social/spark-1.webp'
import spark2 from '../assets/social/spark-2.webp'
import spark3 from '../assets/social/spark-3.webp'
import spark4 from '../assets/social/spark-4.webp'
import spark5 from '../assets/social/spark-5.webp'
import spark6 from '../assets/social/spark-6.webp'
import spark7 from '../assets/social/spark-7.webp'

export type AchievementLevel = 'lv1' | 'lv2' | 'lv3' | 'lv4' | 'lv5' | 'lv6' | 'lv7'

/** The flame, for anywhere else that has to draw the streak's glyph. */
export const FLAME_GLYPH = flame

// Straight across, 1 to 7 — spark-1 is the rose gold Figma names
// "star-01-rose-gold", which fixes the direction of the whole ramp.
// Exported because the level's meaning IS its glyph: anything that shows a
// level (the chip here, the stats popover's big icon, the little star on
// "more to Lv.4") has to pull from this one ramp or they drift apart.
export const SPARKS: Record<AchievementLevel, string> = {
  lv1: spark1,
  lv2: spark2,
  lv3: spark3,
  lv4: spark4,
  lv5: spark5,
  lv6: spark6,
  lv7: spark7,
}

/** Streak multiplier — flame glyph, e.g. "2X". */
export function StreakLabel({ value }: { value: string }) {
  return (
    <span className="bv-achievement bv-achievement-streak">
      {/* Zoomed a little inside its box: the render carries transparent
          margin the star does not, so at 11px it would otherwise read a
          size smaller than the spark beside it. Figma crops it the same
          way (117% inside an 11px clip). */}
      <span className="bv-achievement-icon bv-achievement-icon-zoom">
        <img src={flame} alt="" width={11} height={11} />
      </span>
      {value}
    </span>
  )
}

/** Level badge — one of the seven sparks, e.g. "Lv.6". */
export function LevelLabel({ level }: { level: AchievementLevel }) {
  return (
    <span className={`bv-achievement bv-achievement-${level}`}>
      <img className="bv-achievement-icon" src={SPARKS[level]} alt="" width={11} height={11} />
      Lv.{level.slice(2)}
    </span>
  )
}
