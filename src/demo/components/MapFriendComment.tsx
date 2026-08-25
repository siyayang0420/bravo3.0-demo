// Component — a friend's note on a venue (Figma 19869:16905).
//
// Arrives a beat after the venue card and hangs just above it: their face,
// then a dark bubble with what they said. The bubble's top-right corner is
// square while the other three are round — the tail, pointing back at the
// avatar, the same trick the AI chat bubble uses.
//
// It keeps drifting once it lands, the way a reaction sits on an Instagram
// story rather than snapping into place and going dead. The float is a
// separate inner layer so it never fights the entrance transform on the
// wrapper — same split as the challenge screen's floating avatars.
import { motion, useReducedMotion } from 'framer-motion'

export default function MapFriendComment({
  avatar,
  text,
}: {
  avatar: string
  text: string
}) {
  const reduce = useReducedMotion()

  return (
    <div className="bv-venue-comment">
      <motion.div
        className="bv-venue-comment-inner"
        animate={reduce ? undefined : { y: [0, -4.5, 0], rotate: [0, -0.6, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span
          className="bv-venue-comment-avatar"
          style={{ backgroundImage: `url(${avatar})` }}
        />
        <span className="bv-venue-comment-bubble">{text}</span>
      </motion.div>
    </div>
  )
}
