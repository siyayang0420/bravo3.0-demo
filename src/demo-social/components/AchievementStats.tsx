// Component — the stats popover behind the header chips (Figma 19982:31109).
//
// The two chips in the Rewards header say "8X" and "Lv.1" and nothing else;
// tapping them opens this to explain what each one is counting — how far into
// the current streak you are, and what is left before the next spend level.
//
// Both cards read off the signed-in profile rather than carrying their own
// copy of the numbers, so the popover can never disagree with the chips that
// opened it. The glyphs come from the same ramp AchievementLabel draws, for
// the same reason: a level IS its spark, and two sources would drift.
import { ChevronRight } from 'lucide-react'
import { FLAME_GLYPH, SPARKS, type AchievementLevel } from './AchievementLabel'
import { ACHIEVEMENT_STATS } from '../data/rewardsDemo'

/** "8X" / "2x" -> 8. Falls back to 0 rather than NaN-ing into the copy. */
function streakCount(streak: string) {
  return parseInt(streak, 10) || 0
}

/** 'lv3' -> 3. */
function levelNumber(level: AchievementLevel) {
  return Number(level.slice(2))
}

/** The level above this one, capped at the top of the seven-step ramp. */
function nextLevel(level: AchievementLevel): AchievementLevel {
  return `lv${Math.min(7, levelNumber(level) + 1)}` as AchievementLevel
}

export default function AchievementStats({
  streak,
  level,
  onOpenLevels,
}: {
  /** The streak chip's value, e.g. "8X". */
  streak: string
  level: AchievementLevel
  /** Tapping the Spend Level card — opens the full ramp. */
  onOpenLevels?: () => void
}) {
  const current = streakCount(streak)
  const lv = levelNumber(level)
  const next = nextLevel(level)
  const atTop = lv >= 7

  return (
    <div className="sv-stats">
      <div className="sv-stats-row">
        {/* ---- dining record: the streak, and how far into it you are ---- */}
        <section className="sv-stats-card">
          <div className="sv-stats-head">
            <span className="sv-stats-label">Dining Record</span>
            <span className="sv-stats-value">
              {/* Same optical crop the 11px chip uses — the render carries
                  transparent margin the sparks do not, so without it the
                  flame reads a size smaller than the star beside it. */}
              <span className="sv-stats-glyph sv-stats-glyph-zoom">
                <img src={FLAME_GLYPH} alt="" width={32} height={32} />
              </span>
              <b>{current}x</b>
            </span>
          </div>
          <div className="sv-stats-foot">
            <div className="sv-stats-track">
              <div
                className="sv-stats-fill"
                style={{ width: `${ACHIEVEMENT_STATS.diningProgress * 100}%` }}
              />
            </div>
            <span className="sv-stats-caption">
              Current {current} · Next {current + 1}
            </span>
          </div>
        </section>

        {/* ---- spend level: which spark you are on, and what is left ----
            The whole card is the target, not just the chevron — it is one
            thing to tap, and a 16px arrow is not it. */}
        <section
          className={`sv-stats-card${onOpenLevels ? ' is-link' : ''}`}
          role={onOpenLevels ? 'button' : undefined}
          tabIndex={onOpenLevels ? 0 : undefined}
          aria-label={onOpenLevels ? 'See all spend levels' : undefined}
          onClick={onOpenLevels}
          onKeyDown={(e) => {
            if (!onOpenLevels) return
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onOpenLevels()
            }
          }}
        >
          <div className="sv-stats-head">
            {/* The chevron marks this card as a way through to the spend
                levels in full — the streak card beside it is the whole story
                already, which is why only this one carries it. Tied to the
                handler, not hard-coded: an instance mounted without one is
                not a way through, and must not claim to be. */}
            <span className={`sv-stats-label${onOpenLevels ? ' sv-stats-label-link' : ''}`}>
              Spend Level
              {onOpenLevels && <ChevronRight size={16} strokeWidth={2} />}
            </span>
            <span className="sv-stats-value sv-stats-value-spark">
              <span className="sv-stats-glyph">
                <img src={SPARKS[level]} alt="" width={32} height={32} />
              </span>
              <b>Lv.{lv}</b>
            </span>
          </div>
          <div className="sv-stats-foot">
            <div className="sv-stats-track">
              <div
                className="sv-stats-fill"
                style={{ width: `${ACHIEVEMENT_STATS.levelProgress * 100}%` }}
              />
            </div>
            <span className="sv-stats-caption-row">
              <span className="sv-stats-caption">
                {atTop
                  ? 'Top level reached'
                  : `${ACHIEVEMENT_STATS.toNextLevel} more to Lv.${lv + 1}`}
              </span>
              {/* The spark you are spending TOWARDS, not the one you have —
                  which is why it is a different colour from the big one. */}
              {!atTop && (
                <img className="sv-stats-next-spark" src={SPARKS[next]} alt="" width={14} height={14} />
              )}
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}
