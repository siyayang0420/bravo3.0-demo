// The cast — twelve real, named people, all friends with each other. This is
// the single source of every avatar the demo needs: leaderboard rails, post
// authors, challenge partners, search results, achievement examples. Two of
// them (Bobby, Happy) are also the two switchable demo identities — see
// `DEMO_USERS` in profileDemo.ts — but nothing stops them from also showing
// up in a leaderboard or a post; they're real friends, not reserved slots.
import apple from '../assets/social/apple.jpg'
import bobby from '../assets/social/bobby.jpg'
import cathy from '../assets/social/cathy.jpg'
import coco from '../assets/social/coco.jpg'
import emma from '../assets/social/emma.jpg'
import happy from '../assets/social/happy.jpg'
import jason from '../assets/social/jason.jpg'
import jennifer from '../assets/social/jennifer.jpg'
import joshua from '../assets/social/joshua.jpg'
import ken from '../assets/social/ken.jpg'
import tom from '../assets/social/tom.jpg'
import yvon from '../assets/social/yvon.jpg'

export type PersonId =
  | 'apple'
  | 'bobby'
  | 'cathy'
  | 'coco'
  | 'emma'
  | 'happy'
  | 'jason'
  | 'jennifer'
  | 'joshua'
  | 'ken'
  | 'tom'
  | 'yvon'

export type Person = { id: PersonId; name: string; avatar: string }

// One entry per photo — the id is the filename (lowercase), the name is
// what the app shows, capitalised.
export const PEOPLE: Person[] = [
  { id: 'apple', name: 'Apple', avatar: apple },
  { id: 'bobby', name: 'Bobby', avatar: bobby },
  { id: 'cathy', name: 'Cathy', avatar: cathy },
  { id: 'coco', name: 'Coco', avatar: coco },
  { id: 'emma', name: 'Emma', avatar: emma },
  { id: 'happy', name: 'Happy', avatar: happy },
  { id: 'jason', name: 'Jason', avatar: jason },
  { id: 'jennifer', name: 'Jennifer', avatar: jennifer },
  { id: 'joshua', name: 'Joshua', avatar: joshua },
  { id: 'ken', name: 'Ken', avatar: ken },
  { id: 'tom', name: 'Tom', avatar: tom },
  { id: 'yvon', name: 'Yvon', avatar: yvon },
]

export const PERSON: Record<PersonId, Person> = Object.fromEntries(
  PEOPLE.map((p) => [p.id, p]),
) as Record<PersonId, Person>

/** Bobby (the challenge inviter) and Happy (the receiver) — see DEMO_USERS. */
export const BOBBY = PERSON.bobby
export const HAPPY = PERSON.happy

// Shuffled once, when this module first loads — so the cast is in a
// different order every time the demo is opened (a fresh page load), but
// never reshuffles mid-session (nothing re-renders differently while
// someone is looking at it). Fisher–Yates, not .sort(() => Math.random()-.5)
// — the sort trick is a well-known biased shuffle.
function shuffled<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export const PEOPLE_SHUFFLED: Person[] = shuffled(PEOPLE)

/**
 * `n` people starting at `offset` into the one shared shuffle, wrapping
 * around. Different call sites pass different offsets so the leaderboard,
 * the feed, and a challenge's partner stack don't all show the identical
 * first five names — they're reading different windows of the same order,
 * not drawing fresh randomness each time.
 *
 * The window is contiguous, so the `n` people are always distinct as long as
 * `n` is at most the cast size — **nobody is ever drawn twice within one
 * call**. That matters for challenges especially: the same person cannot
 * hold two seats.
 *
 * `exclude` drops people from the pool before the window is taken — pass the
 * ids a caller has already placed by hand (the profile owner, the "You"
 * seat) so a random draw can't duplicate them.
 */
export function pickPeople(n: number, offset = 0, exclude: PersonId[] = []): Person[] {
  const pool = exclude.length
    ? PEOPLE_SHUFFLED.filter((p) => !exclude.includes(p.id))
    : PEOPLE_SHUFFLED
  return Array.from({ length: n }, (_, i) => pool[(offset + i) % pool.length])
}
