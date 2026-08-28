// Profile demo data (Figma Profile-Public 19612:9840 / Profile-Private
// 19703:52774).
//
// One profile template. Opening a different person's profile only swaps the
// name and avatar — everything else (counts, stats, the Activity feed) is
// shared demo content, which is all a review build needs. `publicProfile`
// stamps a person onto that template; ME_PROFILE is the signed-in user.
import { type Post } from '../components/PostCard'
import { type AchievementLevel } from '../components/AchievementLabel'
import { APPLE, BOBBY, HAPPY, levelForAvatar, pickPeople } from './people'
import postPhoto from '../assets/social/post-photo.jpg'
import venueThumb from '../assets/social/venue-amcafe.jpg'

/** The minimum to open a profile — the rest is filled from the template. */
export type ProfilePerson = { name: string; avatar: string }

export type ProfileData = ProfilePerson & {
  /**
   * Signed up moments ago and has done nothing yet — Figma 19895:20914.
   * Carried on the profile rather than checked per screen so every surface
   * asks the same question, and so the empty states can never disagree about
   * who is new. Suppresses the streak and level labels (you have neither),
   * the dining-challenge card, and the Activity / Taste Identity content.
   */
  isNew?: boolean
  streak: string
  level: AchievementLevel
  joined: string
  followers: number
  following: number
  friends: number
  visited: number
  saved: number
  /** Faces in the dining-challenge avatar stack. */
  challengePartners: string[]
  /**
   * Which challenge card you see on YOUR OWN profile (mode="me" only —
   * someone else's profile always shows the 'active' card). 'start' is the
   * inviter's own view; 'invited' is what a receiver sees before joining.
   */
  challengeCardMode: 'start' | 'invited'
  /** Who invited you — only set when challengeCardMode is 'invited'. */
  challengeInviter?: ProfilePerson
  posts: Post[]
  tasteIdentity: TasteIdentity
}

/** One axis of the Taste DNA radar (Figma 19689:50291) — a dining
 *  "persona" tier and how strongly it shows up in the profile's history. */
export type TasteRadarAxis = { label: string; value: number }

/** One row of the cuisine breakdown list (Figma 19635:14218). */
export type TasteDnaItem = {
  icon: 'japanese' | 'cafe' | 'chinese' | 'bubbleTea' | 'michelin'
  label: string
  /** Share of visits, as a percentage. */
  pct: number
  count: number
  /**
   * Bar width in artboard px, straight from Figma (143 / 109 / 86 / 79 / 69).
   * Carried as data rather than derived: the design's widths are not a linear
   * function of `pct` — they fall off far more gently than the numbers do —
   * so computing them would visibly redraw the chart the designer drew.
   */
  bar: number
}

export type TasteIdentity = {
  periodLabel: string
  /** "Top {percentile}% Diner" */
  percentile: number
  restaurants: number
  cuisines: number
  posts: number
  /** "Ranked in the top {friendPercentile}% among your friends" */
  friendPercentile: number
  archetype: string
  /** The AI read, minus the "{name} is an {archetype}." lead-in — that part
   *  is assembled in TasteIdentityPanel so it always uses the live name. */
  summary: string
  radar: TasteRadarAxis[]
  dna: TasteDnaItem[]
}

// One dataset, shared by every profile that flows through the template
// below — same rationale as the rest of this file's demo content.
const TASTE_IDENTITY: TasteIdentity = {
  periodLabel: 'Past 30 Days',
  percentile: 32,
  restaurants: 5,
  cuisines: 5,
  posts: 5,
  friendPercentile: 5,
  archetype: 'Explorer',
  summary:
    'Loves discovering new restaurants, especially Japanese and cafés. Usually dines on weekends and prefers mid-range restaurants.',
  radar: [
    { label: 'Connoisseur', value: 42 },
    { label: 'Regular', value: 30 },
    { label: 'Regular', value: 35 },
    { label: 'Connector', value: 42 },
    { label: 'Loyalist', value: 58 },
    { label: 'Explorer', value: 55 },
  ],
  dna: [
    { icon: 'japanese', label: 'Japanese & Sushi', pct: 32.5, count: 12, bar: 143 },
    { icon: 'cafe', label: 'Cafe', pct: 26.5, count: 8, bar: 109 },
    { icon: 'chinese', label: 'Chinese', pct: 16.5, count: 6, bar: 86 },
    { icon: 'bubbleTea', label: 'Bubble Tea', pct: 12.3, count: 4, bar: 79 },
    { icon: 'michelin', label: 'Michelin', pct: 9.5, count: 3, bar: 69 },
  ],
}

const VENUE = {
  name: 'AM Cafe',
  meta: 'Cafe • Vancouver • 15.13km',
  thumbnail: venueThumb,
  cashback: '3%',
}

// The Activity feed — three of the PostCard variants, exactly as the design
// lists them. Author and avatar are the profile's, so the feed reads as
// theirs.
function templatePosts(author: string, avatar: string): Post[] {
  // One level for all three: they are the same person's posts. Looked up from
  // the avatar, which is the only identity threaded this far down.
  const level = levelForAvatar(avatar)
  return [
    {
      id: 'pr-1',
      author,
      avatar,
      streak: '2X',
      level,
      date: 'Jun 3, 2026',
      caption: 'Best Cantonese cafe, will come again soon next time when my fam visit',
      venue: VENUE,
      photos: [postPhoto, postPhoto],
    },
    {
      id: 'pr-2',
      author,
      avatar,
      streak: '8X',
      level,
      date: 'Jun 3, 2026',
      caption: 'Earn extra $5 bonus from completing a challenge.',
      achievement: { kind: 'streak', label: '5-month streak!' },
    },
    {
      id: 'pr-3',
      author,
      avatar,
      streak: '8X',
      level,
      date: 'Jun 3, 2026',
      caption: 'Earn extra $5 bonus from completing a challenge.',
      achievement: { kind: 'spend', label: 'Unlocked Master!' },
    },
  ]
}

export function publicProfile(person: ProfilePerson): ProfileData {
  return {
    ...person,
    streak: '8X',
    level: levelForAvatar(person.avatar),
    joined: 'Joined since April 2024',
    followers: 152,
    following: 54,
    friends: 54,
    visited: 70,
    saved: 46,
    // Three faces, and the profile's OWNER is always one of them — the card
    // reads "{name} and 3+ are in a dining challenge", so the person whose
    // profile you're on has to actually be in the stack. They lead it; the
    // other two come from offset 2 into the shared shuffle (a different
    // window from the other "pick some people" call sites, so several lists
    // on one screen don't show the identical faces). Three are drawn and the
    // owner filtered out before taking two, so they can't appear twice.
    challengePartners: [
      person.avatar,
      ...pickPeople(3, 2)
        .filter((p) => p.avatar !== person.avatar)
        .slice(0, 2)
        .map((p) => p.avatar),
    ],
    // Only meaningful on your own profile — someone else's always shows
    // the 'active' card, decided in ProfileScreen, not from this field.
    challengeCardMode: 'start',
    posts: templatePosts(person.name, person.avatar),
    tasteIdentity: TASTE_IDENTITY,
  }
}

// A profile with nothing in it — the state Apple is in. Every number is zero
// and every list is empty, which is what lets the screens stay dumb: they
// render what they are given, and an empty list is what puts each surface
// into its empty state. No screen asks "is this Apple".
const EMPTY_TASTE_IDENTITY: TasteIdentity = {
  periodLabel: 'Past 30 Days',
  percentile: 0,
  restaurants: 0,
  cuisines: 0,
  posts: 0,
  friendPercentile: 0,
  archetype: '',
  summary: '',
  radar: TASTE_IDENTITY.radar.map((a) => ({ ...a, value: 0 })),
  dna: [],
}

/** Figma 19895:20914 — the brand-new account, before anything has happened. */
export function newProfile(person: ProfilePerson): ProfileData {
  return {
    ...person,
    isNew: true,
    // Never rendered for a new account (isNew hides both labels), but the
    // fields are required — these are the values you start at, not a fiction.
    streak: '0X',
    level: 'lv1',
    joined: 'Joined since April 2024',
    followers: 0,
    following: 0,
    friends: 0,
    visited: 0,
    saved: 0,
    challengePartners: [],
    challengeCardMode: 'start',
    posts: [],
    tasteIdentity: EMPTY_TASTE_IDENTITY,
  }
}

// The demo can be "signed in" as any of three people, so a reviewer can play
// both sides of a flow — Bobby sends a challenge, Happy receives it — and see
// what the product looks like before it has anything to show, which is what
// Apple is for. The tweaker on the review site switches between them; more
// roles can be added here as flows need them.
export type DemoUserId = 'bobby' | 'happy' | 'apple'

export type DemoUser = ProfilePerson & {
  id: DemoUserId
  /** Their part in the demo — shown as the tweaker hint. */
  role: string
  /** Which challenge card THEY see on their own profile. */
  challengeCardMode: 'start' | 'invited'
  /** Only set when challengeCardMode is 'invited'. */
  challengeInviter?: ProfilePerson
  /**
   * Brand new: no balance, no history, no friends. Read through
   * useDemoUser() by the surfaces that hold no profile of their own (the
   * map, the community feed, the search sheet), so all of them empty out
   * together the moment you switch identity.
   */
  isNew?: boolean
  /** The two top-bar balances. A new account has neither. */
  cash: number
  coin: number
}

// What an established account is carrying. Both existing users share it —
// the number was previously duplicated as a constant in HomeScreen and
// ProfileScreen, which left no way for a user to have a different one.
const FUNDED = { cash: 2916.12, coin: 140.88 }

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'bobby',
    name: BOBBY.name,
    avatar: BOBBY.avatar,
    role: 'Challenge inviter.',
    challengeCardMode: 'start',
    ...FUNDED,
  },
  {
    id: 'happy',
    name: HAPPY.name,
    avatar: HAPPY.avatar,
    role: 'Challenge receiver.',
    challengeCardMode: 'invited',
    challengeInviter: { name: BOBBY.name, avatar: BOBBY.avatar },
    ...FUNDED,
  },
  {
    id: 'apple',
    name: APPLE.name,
    avatar: APPLE.avatar,
    role: 'Brand new — every page in its empty state.',
    challengeCardMode: 'start',
    isNew: true,
    cash: 0,
    coin: 0,
  },
]

/** The signed-in user's own profile, for whichever demo user is active. */
export function meProfile(user: DemoUser): ProfileData {
  if (user.isNew) return newProfile(user)
  return {
    ...publicProfile(user),
    challengeCardMode: user.challengeCardMode,
    challengeInviter: user.challengeInviter,
  }
}

// Default signed-in user — Bobby, the inviter.
export const ME_PROFILE: ProfileData = meProfile(DEMO_USERS[0])
