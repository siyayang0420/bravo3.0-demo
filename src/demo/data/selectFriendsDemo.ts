// "Select friends" — the invite picker opened from an empty seat on the
// challenge screen (Figma 19686:49817).
//
// The list is the whole shared cast (people.ts), so the faces here are the
// same twelve people the leaderboard, the feed and the challenge bubbles
// draw from — invite Ken here and it is the same Ken you just scrolled past.
import { PEOPLE, type Person } from './people'

/**
 * Where someone stands relative to THIS challenge.
 *   'invite'       — free to ask (the yellow CTA)
 *   'pending'      — already asked, still waiting on them
 *   'in-challenge' — already holding a seat
 * Only 'invite' rows are actionable; the other two are read-only states.
 */
export type FriendInviteStatus = 'invite' | 'pending' | 'in-challenge'

export type InviteCandidate = Person & {
  visited: number
  posts: number
  status: FriendInviteStatus
}

// Per-person stats and status, keyed by id so they stay attached to the right
// face however people.ts is reordered. Figma shows one row repeated; these
// vary so the list reads as real content.
const DETAIL: Record<string, { visited: number; posts: number; status: FriendInviteStatus }> = {
  apple: { visited: 73, posts: 15, status: 'invite' },
  bobby: { visited: 91, posts: 34, status: 'in-challenge' },
  cathy: { visited: 44, posts: 9, status: 'pending' },
  coco: { visited: 58, posts: 21, status: 'pending' },
  emma: { visited: 66, posts: 18, status: 'invite' },
  happy: { visited: 82, posts: 27, status: 'invite' },
  jason: { visited: 39, posts: 6, status: 'invite' },
  jennifer: { visited: 70, posts: 12, status: 'invite' },
  joshua: { visited: 51, posts: 17, status: 'invite' },
  ken: { visited: 88, posts: 25, status: 'invite' },
  tom: { visited: 47, posts: 11, status: 'invite' },
  yvon: { visited: 62, posts: 14, status: 'invite' },
}

export const INVITE_CANDIDATES: InviteCandidate[] = PEOPLE.map((p) => ({
  ...p,
  ...(DETAIL[p.id] ?? { visited: 50, posts: 10, status: 'invite' as const }),
}))
