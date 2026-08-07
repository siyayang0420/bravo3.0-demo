// EDIT ME — demo data for the Home search flow (Figma 19380:5446 …
// 19559:167807).
//
// The people are real cast members under their own names, so a face and the
// name beside it always agree. The merchants all contain "Happy", and one
// cast member IS named Happy, so the canned "Happy" query still lights up
// both sections — but it now matches ONE person rather than five, so the
// "View more people" affordance (which needs five) stays hidden on that
// query. Widen the cast slice below if that rail needs to be demoed.
import { PERSON, pickPeople } from './people'
import type { FollowState } from '../components/PersonRow'

// Happy leads so the canned "Happy" query still returns a person; the rest
// come from offset 6 — clear of the other pool draws (profileDemo.ts uses
// offset 2), so this list doesn't mirror faces already on screen — with
// Happy excluded there so she can't appear twice.
const SEARCH_FACES = [PERSON.happy, ...pickPeople(4, 6, ['happy'])]

export type SearchPerson = {
  id: string
  name: string
  avatar: string
  visited: number
  posts: number
  follow: FollowState
}

export type SearchMerchant = {
  id: string
  name: string
  distance: string
}

// The five follow states Figma shows across 19380:5756 and 19559:167807.
// One row per follow state, in the order Figma lists them — the people are
// real cast members, so the name under a face is that face's actual name.
const FOLLOW_STATES: FollowState[] = ['following', 'mutual', 'follow-back', 'follow-back', 'follow']

export const SEARCH_PEOPLE: SearchPerson[] = SEARCH_FACES.map((p, i) => ({
  id: p.id,
  name: p.name,
  avatar: p.avatar,
  visited: 73,
  posts: 15,
  follow: FOLLOW_STATES[i],
}))

export const SEARCH_MERCHANTS: SearchMerchant[] = [
  { id: 'm1', name: 'Happy Day Cafe Richmond', distance: '3.7 km' },
  { id: 'm2', name: 'Happy Day Cafe Vancouver', distance: '3.7 km' },
  { id: 'm3', name: 'Happy Lamb Hot Pot Richmond', distance: '3.7 km' },
  { id: 'm4', name: 'Happy Lamb Hot Pot Vancouver', distance: '4.2 km' },
  { id: 'm5', name: 'Happy Lamb Hot Pot Coquitlam', distance: '11.8 km' },
]

// The starter chips moved to promptDemo.ts — Figma's annotation on
// 19380:5453 ("tight to users behavior: 1. time 2. location 3. budget
// 4. friend visits 5. trending campaign") says they are LLM-generated per
// user, and the first thing that varies in a demo is the screen you are on.
