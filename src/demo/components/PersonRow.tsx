// Component — a person in the search results (Figma 19380:5763, with the
// follow-state variants at 19559:167807).
//
// Avatar, name, "N visited · N posts", and a follow control whose state is
// the only thing that varies between the two nodes.
import { motion } from 'framer-motion'
import Button from './Button'

export type FollowState = 'follow' | 'follow-back' | 'following' | 'mutual'

// Yellow = an action available to you. Grey = you are already following,
// and the label names the way out.
//
// Figma (19559:167807) labels the followed state "Following" — a status.
// Siya's call is "Unfollow": once you are in, the useful thing to show is
// the undo, not a restatement of the state you can already see.
const LABELS: Record<FollowState, string> = {
  follow: 'Follow',
  'follow-back': 'Follow back',
  following: 'Unfollow',
  mutual: 'Mutual',
}

const IS_ACTION: Record<FollowState, boolean> = {
  follow: true,
  'follow-back': true,
  following: false,
  mutual: false,
}

export default function PersonRow({
  name,
  avatar,
  visited,
  posts,
  follow,
  onToggleFollow,
}: {
  name: string
  avatar: string
  visited: number
  posts: number
  follow: FollowState
  onToggleFollow?: () => void
}) {
  const action = IS_ACTION[follow]

  return (
    <article className="bv-person">
      <span className="bv-person-avatar" style={{ backgroundImage: `url(${avatar})` }} />

      <div className="bv-person-copy">
        <span className="bv-person-name">{name}</span>
        <span className="bv-person-meta">
          {visited} visited • {posts} posts
        </span>
      </div>

      {/* The label changes width between states, so it crossfades through a
          slight blur rather than swapping hard — the two words otherwise
          read as two objects rather than one control changing. */}
      <Button size="sm" variant={action ? 'primary' : 'quiet'} onClick={onToggleFollow}>
        <motion.span
          key={follow}
          className="bv-person-follow-label"
          initial={{ opacity: 0, filter: 'blur(2px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
        >
          {LABELS[follow]}
        </motion.span>
      </Button>
    </article>
  )
}
