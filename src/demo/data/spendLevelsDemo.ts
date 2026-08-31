// EDIT ME — the spend-level ramp behind the Spend Levels screen
// (Figma 19988:31193).
//
// Seven tiers, one per spark in AchievementLabel's ramp — the spark IS the
// level, so this list and that one are the same seven things described from
// two sides: there the glyph, here what it is called and what it took.
//
// The names and taglines are the designer's, all seven of them.
//
// The THRESHOLDS are not: only Lv.3's $1,000 comes from the Figma frame, and
// the other six are placeholders picked to climb plausibly. Replace them when
// the real spend bands are set.
import { type AchievementLevel } from '../components/AchievementLabel'

export type SpendLevel = {
  level: AchievementLevel
  /** The tier's name, e.g. "Trendsetter". */
  name: string
  /** One line on what the tier says about you. */
  tagline: string
  /** What you had to spend to reach it, already formatted. */
  threshold: string
}

export const SPEND_LEVELS: SpendLevel[] = [
  {
    level: 'lv1',
    name: 'Newbie',
    tagline: 'Your delicious journey is just heating up',
    threshold: '$0',
  },
  {
    level: 'lv2',
    name: 'Enthusiast',
    tagline: 'You’ve found the hidden gems of the city',
    threshold: '$250',
  },
  {
    level: 'lv3',
    name: 'Trendsetter',
    tagline: 'You define what’s "in" at the table',
    threshold: '$1,000',
  },
  {
    level: 'lv4',
    name: 'Master',
    tagline: 'You don’t just eat, you eat with style',
    threshold: '$2,500',
  },
  {
    level: 'lv5',
    name: 'Ambassador',
    tagline: 'You’re the one the chefs want to impress',
    threshold: '$5,000',
  },
  {
    level: 'lv6',
    name: 'Icon',
    tagline: 'The city’s food scene wouldn’t be the same without you',
    threshold: '$10,000',
  },
  {
    level: 'lv7',
    name: 'Infinity',
    tagline: 'Even the calories are afraid of your dedication',
    threshold: '$25,000',
  },
]

/** The tier for a level, falling back to the first rather than undefined. */
export const spendLevel = (level: AchievementLevel) =>
  SPEND_LEVELS.find((l) => l.level === level) ?? SPEND_LEVELS[0]
