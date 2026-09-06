// Component — one badge on the Rewards rail (Figma 19970:30391).
//
// The badge art, its name, and then the one thing that matters about it:
// the date you earned it, or the single action that would earn it.
//
// The renders arrive from Figma as 1000–2880px PNGs for an 88px slot. They
// are committed as 264px WebP (3x) instead — see assets/achievements.
import { motion } from 'framer-motion'
import { type Achievement } from '../data/rewardsDemo'

export default function AchievementCard({
  achievement,
  onAct,
}: {
  achievement: Achievement
  onAct?: () => void
}) {
  return (
    <article className="sv-ach-card">
      <img
        className="sv-ach-art"
        src={achievement.image}
        alt=""
        width={88}
        height={88}
        // Otherwise the browser's native image-drag hijacks a rail pull that
        // happens to start on the art — which is most of the card.
        draggable={false}
        // Seven of these sit in a rail that opens off-screen to the right;
        // only the first two are visible at rest.
        loading="lazy"
        decoding="async"
      />
      <span className="sv-ach-title">{achievement.title}</span>

      {achievement.earnedOn ? (
        <span className="sv-ach-earned">{achievement.earnedOn}</span>
      ) : (
        <motion.button
          type="button"
          className="sv-ach-cta"
          whileTap={{ scale: 0.97 }}
          onClick={onAct}
        >
          {achievement.cta}
        </motion.button>
      )}
    </article>
  )
}
