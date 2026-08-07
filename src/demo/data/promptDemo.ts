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
import { pickPeople } from './people'

export type PromptContext = 'map' | 'social' | 'me'

export type PromptSet = {
  placeholders: string[]
  starters: string[]
}

// A friend to name in the community prompts. Drawn from the shared cast so
// the name belongs to someone who actually appears in the feed — offset 4,
// clear of the other draws.
const friend = pickPeople(1, 4)[0].name

export const PROMPTS: Record<PromptContext, PromptSet> = {
  map: {
    placeholders: ['New onboarded restaurants', 'Best cafe near me'],
    starters: [
      'New onboarded restaurants',
      'Best cafe near me',
      'Best dim sum in Richmond',
      'Quick lunch near me',
    ],
  },
  social: {
    placeholders: [`Where ${friend} dined last night`, 'Challenge restaurants I can go'],
    starters: [
      `Where ${friend} dined last night`,
      'Challenge restaurants I can go',
      'What my friends saved this week',
      'Places my friends rate highest',
    ],
  },
  me: {
    placeholders: ['Total spend last week', "Who's my best friend"],
    starters: [
      'Total spend last week',
      "Who's my best friend",
      'My most visited restaurants',
      'How my streak is going',
    ],
  },
}
