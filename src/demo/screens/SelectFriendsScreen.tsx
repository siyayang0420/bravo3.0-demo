// Select friends — implements Figma node 19686:49817.
//
// Opened by tapping an empty seat on the challenge detail. The list is the
// whole shared cast (people.ts via selectFriendsDemo), each row carrying
// where that person stands with THIS challenge: free to ask, already asked,
// or already in. Only the first is actionable.
//
// Same shell as the merchants list — pinned ScreenNav, a scrolling list, and
// a search box under a white fade — because it is the same kind of screen:
// pushed on top of the challenge, one job, back when you're done.
import { useState } from 'react'
import { motion } from 'framer-motion'
import ScreenNav from '../components/ScreenNav'
import PersonRow from '../components/PersonRow'
import PromptBox from '../components/PromptBox'
import Button from '../components/Button'
import { INVITE_CANDIDATES, type InviteCandidate } from '../data/selectFriendsDemo'

const STATE_LABEL: Record<'pending' | 'in-challenge', string> = {
  pending: 'Pending',
  // Figma reads "In a chellenge" — a typo in the file, corrected here.
  'in-challenge': 'In a challenge',
}

export default function SelectFriendsScreen({
  limit,
  onBack,
  candidates = INVITE_CANDIDATES,
}: {
  /** How many seats are open — the denominator of "Selected : n/N". */
  limit: number
  onBack: () => void
  candidates?: InviteCandidate[]
}) {
  // Who you've picked in this sitting. Invites are not actually sent in the
  // demo, so this is the whole model.
  const [picked, setPicked] = useState<string[]>([])

  const toggle = (id: string) =>
    setPicked((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : prev.length >= limit ? prev : [...prev, id],
    )

  return (
    <div className="bv-friends-screen">
      <ScreenNav
        title="Select friends"
        trailing={`Selected : ${picked.length}/${limit}`}
        onBack={onBack}
      />

      <div className="bv-friends-list">
        {candidates.map((person) => {
          const isPicked = picked.includes(person.id)

          return (
            <PersonRow
              key={person.id}
              name={person.name}
              avatar={person.avatar}
              visited={person.visited}
              posts={person.posts}
              action={
                // Compared inline rather than through a boolean alias, so the
                // else branch narrows to the two read-only states and can index
                // STATE_LABEL — which deliberately has no 'invite' key.
                person.status === 'invite' ? (
                  <Button
                    size="sm"
                    variant={isPicked ? 'quiet' : 'primary'}
                    onClick={() => toggle(person.id)}
                  >
                    {/* Crossfades like the follow control it sits beside —
                        one control changing, not two swapping. */}
                    <motion.span
                      key={isPicked ? 'invited' : 'invite'}
                      className="bv-person-follow-label"
                      initial={{ opacity: 0, filter: 'blur(2px)' }}
                      animate={{ opacity: 1, filter: 'blur(0px)' }}
                      transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                    >
                      {isPicked ? 'Invited' : 'Invite'}
                    </motion.span>
                  </Button>
                ) : (
                  <Button size="sm" variant="quiet">
                    {STATE_LABEL[person.status]}
                  </Button>
                )
              }
            />
          )
        })}
      </div>

      {/* Same fade the merchants list and the docks use. Decorative, as it is
          there — the real keyboard lives in the Home search sheet. */}
      <div className="bv-friends-dock">
        <PromptBox variant="search" placeholder="Search name..." />
      </div>
    </div>
  )
}
