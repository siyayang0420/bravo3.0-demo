// EDIT ME — what the prompt dock offers to ask, per screen.
//
// The assistant sits on every tab, but what it is useful for changes with
// what you are looking at: the map is about finding places, the community
// feed is about what your friends are doing, your own profile is about your
// own history. So both the rotating placeholder and the sheet's starter
// chips are keyed to the screen rather than being one global list.
//
// `placeholders` are what the dock's box cycles through (see PromptBox's
// `placeholders` prop); `starters` are the chips in the search sheet's empty
// state. The placeholders lead the starters on purpose — what the box
// advertises is something you can actually tap.
//
// TEN starters per screen, because the sheet lays them out as a two-row rail
// you scroll sideways — five to a row. Fewer than ten leaves the second row
// short, so keep these lists at ten if you edit them.
//
// Each carries an emoji for the KIND of thing it asks about. They are chosen
// to stay distinct WITHIN a screen — ten glyphs in one rail, so a repeat
// reads as a mistake — and to be legible at a glance rather than clever.
import { pickPeople } from './people'

export type PromptContext = 'map' | 'social' | 'me'

/** One starter chip: a glyph and the question it stands for. */
export type PromptStarterItem = { emoji: string; label: string }

export type PromptSet = {
  placeholders: string[]
  starters: PromptStarterItem[]
}

// A friend to name in the community prompts. Drawn from the shared cast so
// the name belongs to someone who actually appears in the feed — offset 4,
// clear of the other draws.
const friend = pickPeople(1, 4)[0].name

export const PROMPTS: Record<PromptContext, PromptSet> = {
  map: {
    placeholders: ['New onboarded restaurants', 'Best cafe near me'],
    starters: [
      { emoji: '✨', label: 'New onboarded restaurants' },
      { emoji: '☕️', label: 'Best cafe near me' },
      { emoji: '🥟', label: 'Best dim sum in Richmond' },
      { emoji: '🥪', label: 'Quick lunch near me' },
      { emoji: '💻', label: 'Somewhere quiet to work' },
      { emoji: '🌙', label: 'Open late tonight' },
      { emoji: '💸', label: 'Highest cashback nearby' },
      { emoji: '👥', label: 'Good for a group of six' },
      { emoji: '🪙', label: 'Cheap eats under $15' },
      { emoji: '🚗', label: 'Worth the drive out' },
    ],
  },
  social: {
    placeholders: [`Where ${friend} dined last night`, 'Challenge restaurants I can go'],
    starters: [
      { emoji: '🍽️', label: `Where ${friend} dined last night` },
      { emoji: '🏆', label: 'Challenge restaurants I can go' },
      { emoji: '🔖', label: 'What my friends saved this week' },
      { emoji: '⭐️', label: 'Places my friends rate highest' },
      { emoji: '🔥', label: 'Who has the longest streak' },
      { emoji: '📍', label: 'Friends eating near me today' },
      { emoji: '🆕', label: 'Posts I have not seen yet' },
      { emoji: '🧭', label: 'Where my collective is going' },
      { emoji: '➕', label: 'Who to invite to a challenge' },
      { emoji: '🧾', label: 'Restaurants we all still owe' },
    ],
  },
  me: {
    placeholders: ['Total spend last week', "Who's my best friend"],
    starters: [
      { emoji: '💳', label: 'Total spend last week' },
      { emoji: '💛', label: "Who's my best friend" },
      { emoji: '🔁', label: 'My most visited restaurants' },
      { emoji: '🔥', label: 'How my streak is going' },
      { emoji: '📊', label: 'What I spend most on' },
      { emoji: '💸', label: 'Cashback I earned this month' },
      { emoji: '🔖', label: 'Places I saved but never went' },
      { emoji: '🌗', label: 'My quietest month this year' },
      { emoji: '🪜', label: 'How far to my next level' },
      { emoji: '🌏', label: 'Cuisines I have never tried' },
    ],
  },
}
