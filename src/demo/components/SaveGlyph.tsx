// Component — the bookmark glyph in its saved / unsaved states.
//
// Extracted so every save control animates identically: the merchant row's
// own 30px button and the 35px CircleIconButton on VenueCard both render
// this, so there is one definition of what "saved" looks like.
//
// The fill is set in CSS, not through Lucide's `fill` prop: Lucide writes
// fill="none" as a presentation attribute, and a CSS rule outranks it —
// which is what makes the fill transition instead of snapping.
import { motion } from 'framer-motion'
import { Bookmark } from 'lucide-react'

export default function SaveGlyph({
  saved,
  size = 20,
}: {
  saved: boolean
  size?: number
}) {
  return (
    <motion.span
      className={`bv-save-glyph${saved ? ' is-saved' : ''}`}
      animate={saved ? { scale: [1, 1.28, 1] } : { scale: 1 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      <Bookmark size={size} strokeWidth={1.9} />
    </motion.span>
  )
}
