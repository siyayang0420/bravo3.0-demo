// EDIT ME — what the assistant says back, for the Home search demo.
//
// Two moments, two Figma nodes:
//   20031:22467  loading — one bordered card, a line and a progress bar
//   20030:21014  answered — the same card filled with places
//
// The answer is the same content whatever you asked: this is a demo, and the
// point is the SHAPE of a bravo AI reply — a place, why it is good, and what
// somebody you follow said about it — not a real search. Only the loading
// line and the follow-up chips read back your query.
import { type AchievementLevel } from '../components/AchievementLabel'
import { PERSON, pickPeople } from './people'
import ellipsisInterior from '../assets/venue/ellipsis-interior.png'
import railtownCafe from '../assets/ai/railtown-cafe.webp'

export const AI_DISCLAIMER = 'bravo AI may make mistakes, so please double check.'

/**
 * The line above the loading bar. Figma reads "Looking for cool cafe for
 * you..." against a "Look for cool cafe for me" question, so the query is
 * folded into the sentence rather than quoted.
 */
export function loadingLine(query: string) {
  return `Looking for ${query.toLowerCase()} for you...`
}

// Figma draws the bar part-way (250 of 344) because a static frame has to
// show it mid-flight. Here it actually runs, empty to full, and the answer
// lands as it completes — so there is no fixed mark to carry.

/** A friend's note about a place, in the yellow bubble under it. */
export type AiNote = {
  author: string
  avatar: string
  streak: string
  level: AchievementLevel
  when: string
  text: string
  /** Omitted where nobody has liked it yet — the heart shows bare. */
  likes?: number
}

export type AiPlace = {
  id: string
  name: string
  /** "Cafe • Vancouver • 15.13km" */
  meta: string
  photo: string
  /** Faces of people who saved it, plus the "Saved 65 times" tally. */
  savers: string[]
  savedLabel: string
  /** Why this one came back — two lines in the design. */
  blurb: string
  note: AiNote
}

export type AiAnswer = {
  /** The sentence above the places. */
  lead: string
  places: AiPlace[]
  /** Chips under the card — where the conversation could go next. */
  followUps: string[]
}

// Three savers, from the shared cast so the faces belong to people who show
// up elsewhere in the demo.
const savers = pickPeople(3, 1).map((p) => p.avatar)

export const AI_ANSWER: AiAnswer = {
  lead: 'Here are cool places around you:',
  places: [
    {
      id: 'ellipsis',
      name: 'Ellipsis',
      meta: 'Cafe • Vancouver • 15.13km',
      photo: ellipsisInterior,
      savers,
      savedLabel: 'Saved 65 times',
      blurb:
        'Concrete, glass and a lot of afternoon light — the matcha is the reason people keep coming back, and it stays calm well past lunch.',
      note: {
        // Figma names Ken and Jennifer; Jennifer is not in the shared cast, so
        // the second note goes to someone whose face actually appears in the
        // app rather than inventing a person for one bubble.
        author: PERSON.ken.name,
        avatar: PERSON.ken.avatar,
        streak: '2X',
        level: 'lv3',
        when: '1 min ago',
        text: 'Best place in town, and the window seats are worth the wait.',
        likes: 5,
      },
    },
    {
      id: 'railtown',
      name: 'Railtown Cafe',
      meta: 'Cafe • Downtown Vancouver • 20.1km',
      photo: railtownCafe,
      savers,
      savedLabel: 'Saved 12 times',
      blurb:
        'Sandwiches worth the queue and a counter that moves fast — the kind of place you get in and out of on a working lunch.',
      note: {
        author: PERSON.yvon.name,
        avatar: PERSON.yvon.avatar,
        streak: '2X',
        level: 'lv3',
        when: '1 min ago',
        text: 'Go early, the good ones sell out by one.',
      },
    },
  ],
  followUps: ['How is Ellipsis', 'outdoor seating'],
}
