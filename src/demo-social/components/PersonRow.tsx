// Component — a person in the search results (Figma 19380:5763, with the
// follow-state variants at 19559:167807).
//
// Avatar, name, "N visited · N posts", and a follow control whose state is
// the only thing that varies between the two nodes.
import { type ReactNode } from 'react'
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

type PersonRowBase = {
  name: string
  avatar: string
  visited: number
  posts: number
}

/**
 * The trailing control is either the follow button this row was built for,
 * or — for a caller with its own vocabulary, like the challenge invite
 * picker — whatever it hands over in `action`. A union rather than two
 * optional props, so it is impossible to pass both or neither.
 */
type PersonRowProps = PersonRowBase &
  (
    | { follow: FollowState; onToggleFollow?: () => void; action?: never }
    | { action: ReactNode; follow?: never; onToggleFollow?: never }
  )

export default function PersonRow({
  name,
  avatar,
  visited,
  posts,
  follow,
  onToggleFollow,
  action,
}: PersonRowProps) {
  const isAction = follow ? IS_ACTION[follow] : false

  return (
    <article className="sv-person">
      <span className="sv-person-avatar" style={{ backgroundImage: `url(${avatar})` }} />

      <div className="sv-person-copy">
        <span className="sv-person-name">{name}</span>
        <span className="sv-person-meta">
          {visited} visited • {posts} posts
        </span>
      </div>

      {follow ? (
        /* The label changes width between states, so it crossfades through a
           slight blur rather than swapping hard — the two words otherwise
           read as two objects rather than one control changing. */
        <Button size="sm" variant={isAction ? 'primary' : 'quiet'} onClick={onToggleFollow}>
          <motion.span
            key={follow}
            className="sv-person-follow-label"
            initial={{ opacity: 0, filter: 'blur(2px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          >
            {LABELS[follow]}
          </motion.span>
        </Button>
      ) : (
        action
      )}
    </article>
  )
}
