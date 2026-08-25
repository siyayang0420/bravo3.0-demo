// Venue detail — the screen a map card opens (Figma 19867:16050).
//
// One venue's worth of demo content: the header facts, the offer, who saved
// it, the posts people wrote about it, and three places with the same vibe.
// Faces come from the shared cast (people.ts) so the same friends show up
// here as on the map card that got you in.
import { type AchievementLevel } from '../components/AchievementLabel'
import { PERSON, pickPeople } from './people'
import postPhoto from '../assets/social/post-photo.jpg'
// Same-vibe cards want PHOTOGRAPHS. The merchant-1..4 files are brand logos —
// circular marks on their own backgrounds — so three of them side by side
// never sit together no matter how they are cropped.
import venueThumb from '../assets/social/venue-amcafe.jpg'
import offerVeras from '../assets/offer-veras.png'
import offerDawn from '../assets/offer-dawn.png'
import ellipsisInterior from '../assets/venue/ellipsis-interior.png'
import ellipsisDrinks from '../assets/venue/ellipsis-drinks.png'
import ellipsisLogo from '../assets/venue/ellipsis-logo.png'

export type VenuePost = {
  id: string
  author: string
  avatar: string
  streak: string
  level: AchievementLevel
  when: string
  text: string
  /** Shown as a leaning stack with an "n/N" counter. */
  photos: string[]
  likes: number
}

export type VenueDetail = {
  title: string
  logo: string
  /** "Cafe • $$ • 13.5km" */
  meta: string
  address: string
  description: string
  /** Open / Closed, and which day the hours below belong to. */
  openLabel: string
  dayLabel: string
  hours: string
  photos: string[]
  offer: { rate: string; title: string; detail: string }
  savedCount: number
  savedBy: { name: string; avatar: string }[]
  posts: VenuePost[]
  sameVibe: { id: string; name: string; category: string; photo: string }[]
  distance: string
}

const savers = ['bobby', 'emma', 'ken', 'yvon', 'joshua', 'tom'] as const

/**
 * The note that floats over the venue card on the map is the same note that
 * sits at the top of this venue's posts — one comment, shown in two places.
 * Defined once here so the face and the words can never drift apart, and
 * given a stable id so tapping it on the map can scroll straight to it.
 */
export const FRIEND_POST_ID = 'vp-friend'

export const ELLIPSIS_DETAIL: VenueDetail = {
  title: 'Ellipsis',
  logo: ellipsisLogo,
  meta: 'Cafe • $$ • 13.5km',
  address: '1540 W 2nd Ave #205, Vancouver',
  description:
    'Set inside the iconic Waterfall Building, the space features striking concrete architecture, floor-to-ceiling glass, and warm contemporary interiors. The atmosphere evolves from a relaxed café during the day to a sophisticated cocktail bar and restaurant in the evening.',
  openLabel: 'Open',
  dayLabel: 'Mon.',
  hours: '08:30 - 15:00',
  photos: [ellipsisInterior, ellipsisDrinks],
  offer: { rate: '5%', title: 'First purchase', detail: 'Up to $10 back' },
  savedCount: 15,
  savedBy: savers.map((id) => ({ name: PERSON[id].name, avatar: PERSON[id].avatar })),
  posts: [
    {
      id: FRIEND_POST_ID,
      author: PERSON.joshua.name,
      avatar: PERSON.joshua.avatar,
      streak: '4X',
      level: 'lv4',
      when: 'Just now',
      // Written out in full here. The map bubble shows the same string clipped
      // to a single line — see .bv-venue-comment-bubble — so the copy lives in
      // one place and the map's constraint stays a layout rule.
      text: 'ngl, great vibe here, check out their matcha and the egg tarts, genuinely the best I have had this side of the bridge.',
      // No photos — it is an offhand note, not a write-up, which is exactly
      // why it is the one that floats over the map card.
      photos: [],
      likes: 3,
    },
    {
      id: 'vp1',
      author: PERSON.ken.name,
      avatar: PERSON.ken.avatar,
      streak: '2X',
      level: 'lv3',
      when: '1 min ago',
      text: 'Best place in town — the matcha is genuinely the reason I keep coming back.',
      // Three different shots, so swiping the stack visibly moves.
      photos: [postPhoto, ellipsisDrinks, ellipsisInterior],
      likes: 5,
    },
    {
      id: 'vp2',
      author: PERSON.emma.name,
      avatar: PERSON.emma.avatar,
      streak: '8X',
      level: 'lv6',
      when: '2 hr ago',
      text: 'Went for the coffee, stayed three hours. Great light in the afternoon.',
      photos: [ellipsisInterior, venueThumb, postPhoto],
      likes: 12,
    },
  ],
  sameVibe: [
    { id: 'sv1', name: 'Bar Bravo', category: 'Brewery & Pub', photo: offerVeras },
    { id: 'sv2', name: 'Chupito', category: 'Brewery & Pub', photo: offerDawn },
    { id: 'sv3', name: 'Awesome Bagel', category: 'Cafe', photo: venueThumb },
  ],
  distance: '13.5km',
}

/** The person writing — their face sits beside the "write a post" prompt. */
export const POST_PROMPT_AUTHOR = pickPeople(1, 0)[0]

/** What the map's floating bubble shows — read straight off the post above,
 *  so editing the post edits both. */
const friendPost = ELLIPSIS_DETAIL.posts.find((p) => p.id === FRIEND_POST_ID)!
export const ELLIPSIS_FRIEND_COMMENT = {
  avatar: friendPost.avatar,
  text: friendPost.text,
}
