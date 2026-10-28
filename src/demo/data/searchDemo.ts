// EDIT ME — demo data for the Home search flow (Figma 20301:24988 tapped,
// 20301:24443 typing, 20302:25288 results, 20302:25498 Restaurant,
// 20303:28516 People).
//
// The people are real cast members under their own names, so a face and the
// name beside it always agree. Figma's placeholder copy repeats one venue
// ("Haidilao Burnaby" three times); here they are three real-looking
// branches so a demo never shows what reads as a duplicated row.
import { PERSON, pickPeople } from './people'
import type { FollowState } from '../components/PersonRow'
import haidilao from '../assets/search/haidilao.webp'
import cafe from '../assets/social/venue-amcafe.jpg'

// Happy leads so a "happy" query still returns a person by name; the rest
// come from offset 6 — clear of the other pool draws (profileDemo.ts uses
// offset 2), so this list doesn't mirror faces already on screen.
const SEARCH_FACES = [PERSON.happy, ...pickPeople(4, 6, ['happy'])]

export type SearchPerson = {
  id: string
  name: string
  avatar: string
  visited: number
  posts: number
  follow: FollowState
}

/**
 * One venue, two presentations. While you are still typing it is a plain
 * suggestion line (name + distance — SearchResultRow); once you hit Enter it
 * is the full result card (SearchHitRow). One record, so the two can never
 * disagree about which places matched.
 */
export type SearchHit = {
  id: string
  name: string
  /** "Hotpot • Burnaby • 6.7km" under the name on the result card. */
  meta: string
  /** The suggestion line's right-hand distance. */
  distance: string
  /** Where its pin goes when a search puts the results on the map. */
  lng: number
  lat: number
  photo: string
  cashback: string
  /** The grey tag under the meta — "150+ transactions". */
  tag: string
  /** Adds the yellow "Pickup order available" tag beside it. */
  pickup?: boolean
  /** Faces in front of the note. The design shows three, or one for a quote. */
  savers: string[]
  note: string
  /** The note is a diner's own words — shown in quotes beside their face. */
  quote?: boolean
}

// The five follow states Figma shows across 19380:5756 and 19559:167807.
const FOLLOW_STATES: FollowState[] = ['following', 'mutual', 'follow-back', 'follow-back', 'follow']

export const SEARCH_PEOPLE: SearchPerson[] = SEARCH_FACES.map((p, i) => ({
  id: p.id,
  name: p.name,
  avatar: p.avatar,
  visited: 73,
  posts: 15,
  follow: FOLLOW_STATES[i],
}))

const faces = (...ids: (keyof typeof PERSON)[]) => ids.map((id) => PERSON[id].avatar)

export const SEARCH_HITS: SearchHit[] = [
  {
    id: 'hdl-burnaby',
    name: 'Haidilao Burnaby',
    meta: 'Hotpot • Burnaby • 6.7km',
    distance: '6.7 km',
    lng: -123.0035,
    lat: 49.2276,
    photo: haidilao,
    cashback: '5%',
    tag: '150+ transactions',
    pickup: true,
    savers: faces('jason', 'ken', 'cathy'),
    note: 'Jason and 35 others saved it',
  },
  {
    id: 'hdl-richmond',
    name: 'Haidilao Richmond',
    meta: 'Hotpot • Richmond • 3.2km',
    distance: '3.2 km',
    lng: -123.1365,
    lat: 49.1695,
    photo: haidilao,
    cashback: '5%',
    tag: '150+ transactions',
    savers: faces('ken', 'emma', 'tom'),
    note: 'Your friend Ken and 35 others saved it',
  },
  {
    id: 'hdl-vancouver',
    name: 'Haidilao Vancouver',
    meta: 'Hotpot • Vancouver • 9.1km',
    distance: '9.1 km',
    lng: -123.1265,
    lat: 49.284,
    photo: haidilao,
    cashback: '5%',
    tag: '150+ transactions',
    savers: faces('emma'),
    note: 'The customer service is great, like the dance here',
    quote: true,
  },
  {
    id: 'happy-lamb',
    name: 'Happy Lamb Hot Pot Richmond',
    meta: 'Hotpot • Richmond • 3.7km',
    distance: '3.7 km',
    lng: -123.1335,
    lat: 49.1838,
    photo: haidilao,
    cashback: '3%',
    tag: '80+ transactions',
    pickup: true,
    savers: faces('tom', 'yvon', 'cathy'),
    note: 'Tom and 12 others saved it',
  },
  {
    id: 'happy-day',
    name: 'Happy Day Cafe Richmond',
    meta: 'Cafe • Richmond • 3.7km',
    distance: '3.7 km',
    lng: -123.125,
    lat: 49.1785,
    photo: cafe,
    cashback: '4%',
    tag: '60+ transactions',
    savers: faces('yvon', 'jason', 'ken'),
    note: 'Your friend Yvon and 8 others saved it',
  },
]

/** Recent searches, newest first. The first two are Figma's own copy; the
 *  rest sit behind the chevron, which is what makes the chevron do something. */
export const SEARCH_RECENT = ['happy lamb', 'elem', 'Haidilao', 'bubble tea']

/** Sparkle chips — questions for the assistant, not search terms. */
export const SEARCH_OTHER = ['Trending restaurants', 'Michelin restaurants near me', 'Lunch pick near me']
