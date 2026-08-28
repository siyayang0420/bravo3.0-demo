// The cast — twelve real, named people, all friends with each other. This is
// the single source of every avatar the demo needs: leaderboard rails, post
// authors, challenge partners, search results, achievement examples. Two of
// them (Bobby, Happy) are also the two switchable demo identities — see
// `DEMO_USERS` in profileDemo.ts — but nothing stops them from also showing
// up in a leaderboard or a post; they're real friends, not reserved slots.
import type { AchievementLevel } from '../components/AchievementLabel'
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

/** The three switchable identities — see DEMO_USERS. Bobby invites, Happy
 *  receives, Apple signed up moments ago and has nothing yet. */
export const BOBBY = PERSON.bobby
export const HAPPY = PERSON.happy
export const APPLE = PERSON.apple

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

const LEVELS: AchievementLevel[] = ['lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'lv6', 'lv7']

/**
 * A level per person, drawn once when this module loads — the same lifetime
 * as the shuffle above.
 *
 * A level belongs to the PERSON, not to the post: the same face has to carry
 * the same spark in the feed, on a venue page and in their own profile, or
 * one person shows three different levels on one screen. The posts used to
 * hardcode a level each, which did exactly that — and clustered on lv1, lv6
 * and lv7, so four of the seven sparks never appeared at all.
 *
 * Walking the list with a random START rather than drawing each person
 * independently: twelve independent draws can easily land nine people on the
 * same level, and the point of this is to SHOW the set.
 */
const levelStart = Math.floor(Math.random() * LEVELS.length)

export const LEVEL_BY_PERSON: Record<PersonId, AchievementLevel> = Object.fromEntries(
  PEOPLE.map((p, i) => [p.id, LEVELS[(levelStart + i) % LEVELS.length]]),
) as Record<PersonId, AchievementLevel>

/** The level this person is at — see LEVEL_BY_PERSON. */
export const levelFor = (id: PersonId): AchievementLevel => LEVEL_BY_PERSON[id]

/**
 * The same, for the call sites that only ever carry a face. Profiles and
 * venue posts are threaded as `{ name, avatar }` — no id — so the avatar is
 * the identity there. Falls back to lv1 for the handful of stock faces
 * (savers, merchant photos) that are not cast members.
 */
export function levelForAvatar(avatar: string): AchievementLevel {
  const person = PEOPLE.find((p) => p.avatar === avatar)
  return person ? LEVEL_BY_PERSON[person.id] : 'lv1'
}

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
