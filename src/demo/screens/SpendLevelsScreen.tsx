// Spend Levels — implements Figma node 19988:31193.
//
// Opened from the "Spend Level" card in the Rewards stats popover. The whole
// ramp laid out as one arc: your spark large in the middle, the tiers either
// side of it falling away down a ribbon and off both edges, so where you are
// reads as a position in a run rather than a number on its own.
//
// The arc CENTRES ON YOU, so this screen shows a different five sparks at
// every level. Figma draws it at Lv.3; the slot geometry below is that frame's
// measurements, expressed as offsets from the middle so any level can sit in it.
import { ArrowLeft } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { SPARKS, type AchievementLevel } from '../components/AchievementLabel'
import { SPEND_LEVELS, spendLevel } from '../data/spendLevelsDemo'
import { ACHIEVEMENT_STATS } from '../data/rewardsDemo'
import glow from '../assets/levels/levels-glow.svg'
import wash from '../assets/levels/levels-wash.svg'
import ribbon from '../assets/levels/levels-ribbon.svg'
import sparkLg1 from '../assets/levels/spark-lg-1.png'
import sparkLg2 from '../assets/levels/spark-lg-2.png'
import sparkLg3 from '../assets/levels/spark-lg-3.png'
import sparkLg4 from '../assets/levels/spark-lg-4.png'
import sparkLg5 from '../assets/levels/spark-lg-5.png'

// The chips elsewhere draw these at 11px, so the committed 48px WebPs are
// plenty there. Here the middle one is 151px — 3x past what those hold — so
// the frame's own 300px renders are used instead.
const SPARK_LARGE: Partial<Record<AchievementLevel, string>> = {
  lv1: sparkLg1,
  lv2: sparkLg2,
  lv3: sparkLg3,
  lv4: sparkLg4,
  lv5: sparkLg5,
}
// Lv.6 and Lv.7 are not in the Figma frame (it is drawn at Lv.3, so the arc
// never reaches them) and have no large render to pull. They fall back to the
// chip art and will read soft in the middle slot — worth exporting the two
// missing sizes if the demo ever needs to sit up there.
const sparkArt = (level: AchievementLevel) => SPARK_LARGE[level] ?? SPARKS[level]

/**
 * The five slots, measured off the Figma frame and rewritten as offsets from
 * the middle of the 402 artboard. `dx`/`cy` are CENTRES, not corners — the
 * frame's left/top values are asymmetric only because the sparks differ in
 * size; centred, the arc is symmetric to within a pixel.
 */
const SLOTS = [
  { step: -2, dx: -213.4, cy: 452.2, size: 65.65 },
  { step: -1, dx: -127.8, cy: 440.7, size: 87.0 },
  { step: 0, dx: 0, cy: 409.5, size: 151.0 },
  { step: 1, dx: 127.8, cy: 440.7, size: 87.0 },
  { step: 2, dx: 213.4, cy: 452.2, size: 65.65 },
]

export default function SpendLevelsScreen({
  level,
  onBack,
}: {
  /** Which tier you are on — the arc centres on it. */
  level: AchievementLevel
  onBack: () => void
}) {
  const reduce = useReducedMotion()
  const tier = spendLevel(level)
  const index = SPEND_LEVELS.findIndex((l) => l.level === level)
  const atTop = index >= SPEND_LEVELS.length - 1

  return (
    <div className="bv-levels-screen">
      {/* Three blurred colour fields on white, straight out of the frame —
          purple and cyan across the top, a warm one low and to the left. */}
      <div className="bv-levels-bg" aria-hidden>
        <img className="bv-levels-glow" src={glow} alt="" />
        <img className="bv-levels-wash" src={wash} alt="" />
      </div>

      <header className="bv-levels-head">
        <button type="button" className="bv-screen-back" aria-label="Back" onClick={onBack}>
          <ArrowLeft size={20} strokeWidth={1.9} />
        </button>
        <h1 className="bv-levels-title">Spend Levels</h1>
      </header>

      <div className="bv-levels-arc">
        <img className="bv-levels-ribbon" src={ribbon} alt="" />
        {SLOTS.map((slot) => {
          // Steps that fall off either end of the ramp simply have no spark:
          // at Lv.1 there is nothing below you, and the arc thins out on that
          // side rather than inventing tiers to fill the slot.
          const tierAt = SPEND_LEVELS[index + slot.step]
          if (!tierAt) return null
          const isCurrent = slot.step === 0
          return (
            <motion.img
              key={tierAt.level}
              className={`bv-levels-spark${isCurrent ? ' is-current' : ''}`}
              src={sparkArt(tierAt.level)}
              alt=""
              style={{
                width: slot.size,
                height: slot.size,
                left: `calc(50% + ${slot.dx}px - ${slot.size / 2}px)`,
                top: slot.cy - slot.size / 2,
              }}
              initial={reduce ? false : { opacity: 0, scale: 0.7, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 24,
                // Out from the middle: yours lands first, the others follow.
                delay: 0.06 + Math.abs(slot.step) * 0.07,
              }}
            />
          )
        })}
      </div>

      <motion.div
        className="bv-levels-copy"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.18 }}
      >
        <div className="bv-levels-identity">
          <span className="bv-levels-lv">Lv.{level.slice(2)}</span>
          <span className="bv-levels-name">{tier.name}</span>
          <span className="bv-levels-tagline">{tier.tagline}</span>
        </div>
        <p className="bv-levels-spent">
          You’ve spent more than {tier.threshold} on Bravo.
          {!atTop && (
            <>
              <br />
              {/* The same figure the stats popover quotes — one number, so the
                  card you tapped and the screen it opened cannot disagree. */}
              {ACHIEVEMENT_STATS.toNextLevel} until your next glow-up.
            </>
          )}
        </p>
      </motion.div>
    </div>
  )
}
