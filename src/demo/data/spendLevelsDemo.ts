// EDIT ME — the spend-level ramp behind the Spend Levels screen
// (Figma 19988:31193).
//
// Seven tiers, one per spark in AchievementLabel's ramp — the spark IS the
// level, so this list and that one are the same seven things described from
// two sides: there the glyph, here what it is called and what it took.
//
// Only Lv.3 is the designer's: "Trendsetter", its tagline, and the $1,000
// threshold all come straight from the Figma frame. The other six names,
// taglines and thresholds are PLACEHOLDER COPY written to make the screen
// demoable at any level — replace them with the real ramp when it is set.
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
    name: 'Newcomer',
    tagline: 'You have just pulled up a chair.',
    threshold: '$0',
  },
  {
    level: 'lv2',
    name: 'Regular',
    tagline: 'They start knowing your order.',
    threshold: '$250',
  },
  {
    // Straight from Figma — the frame is drawn at this level.
    level: 'lv3',
    name: 'Trendsetter',
    tagline: 'You define what’s "in" at the table.',
    threshold: '$1,000',
  },
  {
    level: 'lv4',
    name: 'Tastemaker',
    tagline: 'Your recommendations start queues.',
    threshold: '$2,500',
  },
  {
    level: 'lv5',
    name: 'Connoisseur',
    tagline: 'You order for the whole table.',
    threshold: '$5,000',
  },
  {
    level: 'lv6',
    name: 'Luminary',
    tagline: 'Kitchens send things out unasked.',
    threshold: '$10,000',
  },
  {
    level: 'lv7',
    name: 'Legend',
    tagline: 'There is a booth with your name on it.',
    threshold: '$25,000',
  },
]

/** The tier for a level, falling back to the first rather than undefined. */
export const spendLevel = (level: AchievementLevel) =>
  SPEND_LEVELS.find((l) => l.level === level) ?? SPEND_LEVELS[0]
