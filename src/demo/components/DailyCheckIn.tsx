// Component — Daily Check-in (Figma 19905:21350).
//
// A week of squares above one button. The week is the whole story: three
// filled, today waiting as a dashed outline, the rest greyed ahead of you —
// so the streak reads at a glance, before any of the numbers do.
import { Clock, HandMetal } from 'lucide-react'
import { motion } from 'framer-motion'
import { type CheckIn } from '../data/rewardsDemo'

export default function DailyCheckIn({
  checkIn,
  onCollect,
}: {
  checkIn: CheckIn
  onCollect?: () => void
}) {
  return (
    <section className="bv-checkin">
      <div className="bv-checkin-head">
        <div className="bv-checkin-titles">
          <h2 className="bv-checkin-title">Daily Check-in</h2>
          <p className="bv-checkin-ends">
            {/* Figma rotates the clock 180°, which lands the 12 at the bottom —
                deliberate in the file, so it is kept. */}
            <Clock size={14} strokeWidth={1.9} style={{ transform: 'rotate(180deg)' }} />
            {checkIn.endsLabel}
          </p>
        </div>
        {/* Two stacked lines, pushed to the two edges so the count sits level
            with the title and the best with the "ends" line beside it. */}
        <div className="bv-checkin-score">
          <span className="bv-checkin-streak">{checkIn.streakLabel}</span>
          {checkIn.bestLabel && <span className="bv-checkin-best">{checkIn.bestLabel}</span>}
        </div>
      </div>

      <div className="bv-checkin-week">
        {checkIn.week.map((day, i) => (
          // Index, not label, as the key: the initials repeat (T/T, S/S), so
          // they are not unique — they are a strip of seven, not a set.
          <div className={`bv-checkin-day is-${day.state}`} key={i}>
            <span className="bv-checkin-dow">{day.label}</span>
            <span className="bv-checkin-mark">
              <HandMetal size={16} strokeWidth={1.9} />
            </span>
            <span className="bv-checkin-amount">{day.amount}</span>
          </div>
        ))}
      </div>

      <motion.button
        type="button"
        className="bv-checkin-collect"
        whileTap={{ scale: 0.98 }}
        onClick={onCollect}
      >
        {checkIn.collectLabel}
      </motion.button>
    </section>
  )
}
