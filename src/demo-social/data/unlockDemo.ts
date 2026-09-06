// EDIT ME — the three "you just unlocked something" sheets.
//
// Figma 20016:12777 (Streak unlocked), 20016:12891 (Achievement unlocked),
// 20017:13218 (Badge unlocked). All three are the SAME sheet: a dimmed app, a
// blurred translucent card carrying a title, a 75px piece of art, a name and
// a detail line, then a Claim button. Only the middle changes, so they are
// three datasets for one component rather than three components — see
// UnlockSheet.
//
// Which one shows is a demo-state toggle on the review site (the tweaker's
// "Achievement" row), not something the app decides for itself yet.
// Both arrive from Figma far larger than the 75px slot they sit in — the
// flame at 2880px / 2.4MB — so they are committed at 225px (3x), the same
// downscale the badge renders in this folder got. PNG rather than the WebP
// those use: this machine's `sips` has no WebP encoder, and 37/43KB at 3x
// is small enough not to be worth a build step.
import streakArt from '../assets/achievements/streak-flame.png'
import starArt from '../assets/achievements/unlock-star.png'
import linkCard from '../assets/achievements/link-card-chrome.webp'

/** Which unlock is on screen. 'none' is the default — nothing to claim. */
export type UnlockKind = 'none' | 'streak' | 'achievement' | 'badge'

/** One month in the streak calendar. Lit months are the ones you kept. */
export type StreakMonth = { label: string; lit: boolean }

export type UnlockData = {
  /** The line above the card — "Streak unlocked" and friends. */
  title: string
  art: string
  /** The bold line under the art. */
  name: string
  /**
   * The quieter line(s) under the name. Two entries on the achievement
   * sheet, one everywhere else; `bold` marks a run Figma sets in bold
   * mid-sentence (the "67%").
   */
  detail: { text: string; bold?: boolean }[][]
  /** Streak sheet only — the twelve-month calendar under the copy. */
  months?: StreakMonth[]
}

// Jan–Aug lit, Sept–Dec not: the eight months the sheet is celebrating.
const MONTHS: StreakMonth[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
].map((label, i) => ({ label, lit: i < 8 }))

export const UNLOCKS: Record<Exclude<UnlockKind, 'none'>, UnlockData> = {
  streak: {
    title: 'Streak unlocked',
    art: streakArt,
    name: '8 Month Streak!',
    detail: [[{ text: 'Highest monthly streak achieved' }]],
    months: MONTHS,
  },
  achievement: {
    title: 'Achievement unlocked',
    art: starArt,
    name: 'You are The Master',
    detail: [
      [{ text: "You don't just eat, you eat with style." }],
      [{ text: 'You are at top ' }, { text: '67%', bold: true }, { text: ' of all diners' }],
    ],
  },
  badge: {
    title: 'Badge unlocked',
    // The same badge art the Rewards rail already ships — this sheet is the
    // moment that rail's "Link a card" card was earned.
    art: linkCard,
    name: 'Linked Card',
    detail: [[{ text: '2026/04/10' }]],
  },
}

// Kept out of the component so the tweaker can label its own options without
// importing the sheet.
export const UNLOCK_LABELS: Record<UnlockKind, string> = {
  none: 'None',
  streak: 'Streak',
  achievement: 'Achievement',
  badge: 'Badge',
}
