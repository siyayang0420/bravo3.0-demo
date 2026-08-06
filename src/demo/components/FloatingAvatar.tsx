// Component — Figma challenge participant (19608:9156 and siblings)
//
// The avatar scales with how much the person has spent; the name pill does
// NOT — it stays 14px at every size. Everything else on the bubble is a
// fixed ratio of the avatar width, read straight off the Figma nodes:
//
//   height    = w x 4/3      (95.033/71.274, identical across all four)
//   share %   = w / 3        (23.758/71.274, identical across all four)
//   pill pad  = w x 0.192 / 0.096
//   pill lift = w x 0.24     (overlaps the bottom of the avatar)
//   crown     = w x 0.321, offset w x 0.591 / -w x 0.169
//
// Figma's four widths fit w = 40 + 2.07 x share to within ~1%, so the size
// is computed rather than hardcoded — a fifth participant just works.
import { useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import crownArt from '../assets/social/crown.png'

export type Participant = {
  id: string
  name: string
  avatar: string
  /** Share of the challenge total, as a percentage. Drives the size. */
  share: number
  /** Resting position inside the play area, in artboard px. */
  x: number
  y: number
}

const SIZE_BASE = 40
const SIZE_PER_SHARE = 2.07

export function avatarWidth(share: number) {
  return SIZE_BASE + SIZE_PER_SHARE * share
}

export default function FloatingAvatar({
  participant,
  isLeader,
  areaW,
  areaH,
  index,
}: {
  participant: Participant
  isLeader: boolean
  /** Play-area size in local px, measured by the parent. */
  areaW: number
  areaH: number
  index: number
}) {
  const w = avatarWidth(participant.share)
  const self = useRef<HTMLDivElement>(null)

  // Numeric constraints, not a ref. Handing framer-motion the area ref makes
  // it measure both boxes with getBoundingClientRect — screen pixels — while
  // it applies the drag transform in local pixels. The phone is CSS-scaled,
  // so the two disagree and the bubble snaps to the edge on mousedown.
  // offsetWidth/clientWidth are already local px and stay right at any scale.
  //
  // The area size arrives as props because a child's layout effect runs
  // before the parent's ref is attached — reading it from a ref here would
  // see null on mount and pin the bubble at {0,0,0,0}.
  const [bounds, setBounds] = useState<
    { left: number; right: number; top: number; bottom: number } | undefined
  >(undefined)

  useLayoutEffect(() => {
    const el = self.current
    if (!el || !areaW || !areaH) return
    setBounds({
      left: -participant.x,
      right: Math.max(0, areaW - el.offsetWidth - participant.x),
      top: -participant.y,
      bottom: Math.max(0, areaH - el.offsetHeight - participant.y),
    })
  }, [areaW, areaH, participant.x, participant.y])

  return (
    <motion.div
      ref={self}
      className="bv-float"
      style={{ left: participant.x, top: participant.y, width: w }}
      drag
      dragConstraints={bounds}
      dragElastic={0.12}
      dragMomentum={false}
      whileDrag={{ scale: 1.06, zIndex: 20, cursor: 'grabbing' }}
      whileTap={{ scale: 1.04 }}
    >
      {/* Float lives on an inner layer so it never fights the drag transform. */}
      <motion.div
        animate={{ y: [0, -9, 0] }}
        transition={{
          duration: 3.2 + index * 0.45,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.3,
        }}
      >
        <div className="bv-float-head">
          <div
            className="bv-float-avatar"
            style={{
              width: w,
              height: w * (4 / 3),
              backgroundImage: `url(${participant.avatar})`,
              marginBottom: -w * 0.24,
            }}
          />
          {isLeader && (
            <img
              className="bv-float-crown"
              src={crownArt}
              alt=""
              style={{ width: w * 0.321, left: w * 0.591, top: -w * 0.169 }}
            />
          )}
          <span
            className="bv-float-name"
            style={{ padding: `${w * 0.096}px ${w * 0.192}px` }}
          >
            {participant.name}
          </span>
        </div>
        <span className="bv-float-share" style={{ fontSize: w / 3 }}>
          {participant.share.toFixed(2)}%
        </span>
      </motion.div>
    </motion.div>
  )
}
