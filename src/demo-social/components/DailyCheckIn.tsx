// Component — Daily Check-in (Figma 19905:21350).
//
// A week of squares above one button. The week is the whole story: three
// filled, today waiting as a dashed outline, the rest greyed ahead of you —
// so the streak reads at a glance, before any of the numbers do.
import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { type CheckIn, type CheckInDay } from '../data/rewardsDemo'

export default function DailyCheckIn({
  checkIn,
  onCollect,
}: {
  checkIn: CheckIn
  onCollect?: () => void
}) {
  // Collecting is the one thing this card does, so it owns the state rather
  // than asking the screen to carry a flag it has no other use for.
  const [collected, setCollected] = useState(false)

  // Switching demo user swaps the whole week out — the claim belongs to the
  // week that was on screen, not to the component.
  useEffect(() => setCollected(false), [checkIn])

  // What the tap does to the week: the NEXT day fills, not the dashed one.
  // The dashed square is a day that went by unclaimed — it stays open, because
  // a missed day is missed for good, and the bonus you are collecting is
  // today's. So the first day still ahead of you is the one that turns blue.
  const claimIndex = checkIn.week.findIndex((d) => d.state === 'upcoming')
  const week: CheckInDay[] =
    collected && claimIndex >= 0
      ? checkIn.week.map((day, i): CheckInDay =>
          i === claimIndex ? { ...day, state: 'collected' } : day,
        )
      : checkIn.week

  return (
    <section className="sv-checkin">
      <div className="sv-checkin-head">
        <div className="sv-checkin-titles">
          <h2 className="sv-checkin-title">Daily Check-in</h2>
          <p className="sv-checkin-ends">
            {/* Figma rotates the clock 180°, which lands the 12 at the bottom —
                deliberate in the file, so it is kept. */}
            <Clock size={14} strokeWidth={1.9} style={{ transform: 'rotate(180deg)' }} />
            {checkIn.endsLabel}
          </p>
        </div>
        {/* Two stacked lines, pushed to the two edges so the count sits level
            with the title and the best with the "ends" line beside it. */}
        {/* The count is the other half of the receipt: claiming the day is
            what starts the run, so it ticks up with the square that fills. */}
        <div className="sv-checkin-score">
          <span className="sv-checkin-streak">
            {collected ? checkIn.collectedStreakLabel : checkIn.streakLabel}
          </span>
          {checkIn.bestLabel && <span className="sv-checkin-best">{checkIn.bestLabel}</span>}
        </div>
      </div>

      <div className="sv-checkin-week">
        {week.map((day, i) => (
          // Index, not label, as the key: the initials repeat (T/T, S/S), so
          // they are not unique — they are a strip of seven, not a set.
          <div className={`sv-checkin-day is-${day.state}`} key={i}>
            <span className="sv-checkin-dow">{day.label}</span>
            <span className="sv-checkin-mark">
              {/* Figma's own filled glyph (20002:31281 / 19936:28061), not
                  lucide's outline. Drawn as a mask rather than an <img> so
                  the one exported silhouette can take the three different
                  tints the three states need — see .sv-checkin-glyph. */}
              <span className="sv-checkin-glyph" />
            </span>
            <span className="sv-checkin-amount">{day.amount}</span>
          </div>
        ))}
      </div>

      {/* One button, two states. Collected it stops being a control: no press
          scale, no pointer, disabled — the row of blue above it is the
          receipt, and this line only says when to come back. */}
      <motion.button
        type="button"
        className={`sv-checkin-collect${collected ? ' is-collected' : ''}`}
        whileTap={collected ? undefined : { scale: 0.98 }}
        disabled={collected}
        onClick={() => {
          if (collected) return
          setCollected(true)
          onCollect?.()
        }}
      >
        {/* The labels swap in place rather than cutting: the old line leaves
            upward and the new one arrives from below, so the button reads as
            having changed its mind rather than been replaced. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={collected ? 'collected' : 'collect'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {collected ? checkIn.collectedLabel : checkIn.collectLabel}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </section>
  )
}
