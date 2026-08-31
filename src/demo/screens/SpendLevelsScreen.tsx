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
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { type AchievementLevel } from '../components/AchievementLabel'
import { SPEND_LEVELS, spendLevel } from '../data/spendLevelsDemo'
import { ACHIEVEMENT_STATS } from '../data/rewardsDemo'
import glow from '../assets/levels/levels-glow.svg'
import wash from '../assets/levels/levels-wash.svg'
import ribbon from '../assets/levels/levels-ribbon.svg'
import spark1 from '../assets/social/spark-1.png'
import spark2 from '../assets/social/spark-2.png'
import spark3 from '../assets/social/spark-3.png'
import spark4 from '../assets/social/spark-4.png'
import spark5 from '../assets/social/spark-5.png'
import spark6 from '../assets/social/spark-6.png'
import spark7 from '../assets/social/spark-7.png'

// The 300px ORIGINALS, not the 48px WebPs the chips use. AchievementLabel
// draws these at 11px and its WebPs are sized for that; here the middle slot
// is 151px, which those cannot carry — every spark on this screen comes from
// the full-size render beside them in the same folder.
const SPARK_ART: Record<AchievementLevel, string> = {
  lv1: spark1,
  lv2: spark2,
  lv3: spark3,
  lv4: spark4,
  lv5: spark5,
  lv6: spark6,
  lv7: spark7,
}

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

/** Distance + throw needed to move the arc, so a lazy nudge springs back. */
const SWIPE_COMMIT = 55

export default function SpendLevelsScreen({
  level,
  onBack,
}: {
  /** Which tier you are on — the arc centres on it. */
  level: AchievementLevel
  onBack: () => void
}) {
  const reduce = useReducedMotion()
  // Where you actually are, and which tier the arc is parked on. They start
  // the same; swiping moves the focus without moving you.
  const reached = SPEND_LEVELS.findIndex((l) => l.level === level)
  const [focus, setFocus] = useState(reached)
  const tier = spendLevel(SPEND_LEVELS[focus].level)
  const atTop = focus >= SPEND_LEVELS.length - 1
  // You can look back over everything you have climbed, and no further: the
  // tiers above are visible in the outer slots but cannot be brought to the
  // middle, because you have not earned the right to stand on them.
  const canGoBack = focus > 0
  const canGoOn = focus < reached
  const step = (d: number) => setFocus((f) => Math.max(0, Math.min(reached, f + d)))

  // The staggered entrance is a first-impression thing; on later re-renders
  // (every swipe) sparks slide between slots instead.
  const firstRun = useRef(true)
  useEffect(() => {
    firstRun.current = false
  }, [])

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

      {/* Drag surface for the arc. It spans the screen but sits under the
          header and the copy, so those keep their own taps. */}
      <motion.div
        className="bv-levels-arc"
        role="group"
        aria-label={`Spend level ${SPEND_LEVELS[focus].level.slice(2)} of ${SPEND_LEVELS.length}`}
        tabIndex={0}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.28}
        dragMomentum={false}
        onDragEnd={(_, info) => {
          // Velocity counts too, so a flick pages without much travel.
          const throwX = info.offset.x + info.velocity.x * 0.2
          if (Math.abs(throwX) < SWIPE_COMMIT) return
          step(throwX < 0 ? 1 : -1)
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' && canGoOn) step(1)
          if (e.key === 'ArrowLeft' && canGoBack) step(-1)
        }}
      >
        <img className="bv-levels-ribbon" src={ribbon} alt="" draggable={false} />
        <AnimatePresence initial={false}>
          {SLOTS.map((slot) => {
            // Steps that fall off either end of the ramp simply have no spark:
            // at Lv.1 there is nothing below you, and the arc thins out on that
            // side rather than inventing tiers to fill the slot.
            const tierAt = SPEND_LEVELS[focus + slot.step]
            if (!tierAt) return null
            const isCurrent = slot.step === 0
            return (
              <motion.img
                // Keyed by LEVEL, not slot, so a spark keeps its identity as
                // the arc moves and `layout` slides it between slots instead
                // of one image swapping for another in place.
                key={tierAt.level}
                layout
                className={`bv-levels-spark${isCurrent ? ' is-current' : ''}`}
                src={SPARK_ART[tierAt.level]}
                alt=""
                draggable={false}
                style={{
                  width: slot.size,
                  height: slot.size,
                  left: `calc(50% + ${slot.dx}px - ${slot.size / 2}px)`,
                  top: slot.cy - slot.size / 2,
                }}
                initial={reduce ? false : { opacity: 0, scale: 0.7, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 24,
                  // Out from the middle on the first look; on a swipe they
                  // all move together, so no stagger.
                  delay: firstRun.current ? 0.06 + Math.abs(slot.step) * 0.07 : 0,
                }}
              />
            )
          })}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="bv-levels-copy"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.18 }}
      >
        {/* ONE keyed block for the whole caption. Keying it remounts it on
            every swipe, so framer replays the fade — and because the name and
            the spend line change together, the two can never sit a frame apart
            describing different tiers.
            Deliberately not AnimatePresence: an exit animation would either
            hold the old tier on screen while the new one is already current,
            or collapse the block's height mid-swap. */}
        <div className="bv-levels-caption" key={tier.level}>
          <motion.div
            className="bv-levels-identity"
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <span className="bv-levels-lv">Lv.{tier.level.slice(2)}</span>
            <span className="bv-levels-name">{tier.name}</span>
            <span className="bv-levels-tagline">{tier.tagline}</span>
          </motion.div>
          {/* Every tier you can bring to the middle is one you have already
              reached, so this line is always a record of an event that
              happened: what it took, and when you crossed. */}
          <motion.p
            className="bv-levels-spent"
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut', delay: 0.04 }}
          >
            {tier.threshold} spent • {tier.achievedOn}
            {/* Only where you actually stand. Looking back at a tier you have
                already passed, there is no "next" to count towards from here —
                the gap is measured from your real level, not the one on screen. */}
            {focus === reached && !atTop && (
              <>
                <br />
                {/* The same figure the stats popover quotes — one number, so
                    the card you tapped and the screen it opened cannot
                    disagree. */}
                {ACHIEVEMENT_STATS.toNextLevel} until your next glow-up.
              </>
            )}
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}
