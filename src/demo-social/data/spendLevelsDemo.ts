// EDIT ME — the spend-level ramp behind the Spend Levels screen
// (Figma 19988:31193).
//
// Seven tiers, one per spark in AchievementLabel's ramp — the spark IS the
// level, so this list and that one are the same seven things described from
// two sides: there the glyph, here what it is called and what it took.
//
// The names, taglines and spend bands are all the designer's.
//
// The `achievedOn` dates are not — they are demo history, invented so the
// "$100 spent - 2025/04/10" line has something to show. They are the only
// thing in here still waiting on real data.
import { type AchievementLevel } from '../components/AchievementLabel'

export type SpendLevel = {
  level: AchievementLevel
  /** The tier's name, e.g. "Trendsetter". */
  name: string
  /** One line on what the tier says about you. */
  tagline: string
  /** What you had to spend to reach it, already formatted. */
  threshold: string
  /** When you crossed into it. Only ever shown for tiers you have reached. */
  achievedOn: string
}

export const SPEND_LEVELS: SpendLevel[] = [
  {
    level: 'lv1',
    name: 'Newbie',
    tagline: 'Your delicious journey is just heating up',
    threshold: '$100',
    achievedOn: '2025/04/10',
  },
  {
    level: 'lv2',
    name: 'Enthusiast',
    tagline: 'You’ve found the hidden gems of the city',
    threshold: '$500',
    achievedOn: '2025/06/22',
  },
  {
    level: 'lv3',
    name: 'Trendsetter',
    tagline: 'You define what’s "in" at the table',
    threshold: '$1,000',
    achievedOn: '2025/09/14',
  },
  {
    level: 'lv4',
    name: 'Master',
    tagline: 'You don’t just eat, you eat with style',
    threshold: '$2,000',
    achievedOn: '2025/12/03',
  },
  {
    level: 'lv5',
    name: 'Ambassador',
    tagline: 'You’re the one the chefs want to impress',
    threshold: '$5,000',
    achievedOn: '2026/03/19',
  },
  {
    level: 'lv6',
    name: 'Icon',
    tagline: 'The city’s food scene wouldn’t be the same without you',
    threshold: '$10,000',
    achievedOn: '2026/06/08',
  },
  {
    level: 'lv7',
    name: 'Infinity',
    tagline: 'Even the calories are afraid of your dedication',
    threshold: '$30,000',
    achievedOn: '2026/08/21',
  },
]

/** The tier for a level, falling back to the first rather than undefined. */
export const spendLevel = (level: AchievementLevel) =>
  SPEND_LEVELS.find((l) => l.level === level) ?? SPEND_LEVELS[0]
