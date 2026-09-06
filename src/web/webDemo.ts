// EDIT ME — what the web build shows.
//
// Deliberately thin: almost everything the web renders is re-exported from
// the phone demo's data, so the two builds are the same product and cannot
// drift. Only the things a wide layout needs MORE of live here — the phone
// shows a couple of pins because that is all a map card can introduce; with
// a results column beside the map there is room for a real list.
//
// ONE source per venue. The map wants a `MapPlace`, the results list wants a
// `Merchant` (the real eligible-merchant row from the phone build), and those
// two shapes disagree about field names — so the venue is authored once here
// and projected into each. A venue can never be on the map with one rate and
// in the list with another.
import { type MapPlace } from '../demo/components/MapView'
import { type Merchant } from '../demo/components/MerchantRow'
import { pickPeople } from '../demo/data/people'
import ellipsisInterior from '../demo/assets/venue/ellipsis-interior.png'
import ellipsisDrinks from '../demo/assets/venue/ellipsis-drinks.png'
import ellipsisLogo from '../demo/assets/venue/ellipsis-logo.png'
import railtown from '../demo/assets/ai/railtown-cafe.webp'
import venueThumb from '../demo/assets/social/venue-amcafe.jpg'
import postPhoto from '../demo/assets/social/post-photo.jpg'
import thumbDimsum from '../demo/assets/thumb-dimsum.jpg'
import thumbRestaurants from '../demo/assets/thumb-restaurants.png'
import offerVeras from '../demo/assets/offer-veras.png'

export const MAP_CENTER: [number, number] = [-123.1255, 49.1928]
export const MAP_ZOOM = 12.4

// Same four the phone's map wears, plus "Open now" — the extra chip is the
// one the phone drops for want of a fifth slot in a 402px row.
export const FILTERS = [
  { label: 'Cuisine', hasDropdown: true },
  { label: 'Featured', hasDropdown: false },
  { label: 'Price', hasDropdown: true },
  { label: 'Open now', hasDropdown: false },
  { label: 'Micheline', hasDropdown: false },
]

// Faces from the shared cast, so the people who saved a place here are people
// you meet elsewhere in the demo.
const savers = pickPeople(3, 6).map((p) => p.avatar)

type WebVenue = {
  id: string
  name: string
  /** Short line for the map pin — the pin has no room for the city. */
  pinMeta: string
  /** Full line for the list row, which does. */
  listMeta: string
  distance: string
  cashback: string
  savedCount: number
  logo: string
  photos: [string, string]
}

const VENUES: WebVenue[] = [
  {
    id: 'ellipsis',
    name: 'Ellipsis',
    pinMeta: 'Cafe • $$',
    listMeta: 'Cafe • Vancouver • $$',
    distance: '13.5km',
    cashback: '3%',
    savedCount: 65,
    logo: ellipsisLogo,
    photos: [ellipsisInterior, ellipsisDrinks],
  },
  {
    id: 'railtown',
    name: 'Railtown Cafe',
    pinMeta: 'Cafe • $$',
    listMeta: 'Cafe • Downtown Vancouver • $$',
    distance: '20.1km',
    cashback: '5%',
    savedCount: 12,
    logo: railtown,
    photos: [railtown, ellipsisDrinks],
  },
  {
    id: 'amcafe',
    name: 'AM Cafe',
    pinMeta: 'Cafe • $$',
    listMeta: 'Cafe • Vancouver • $$',
    distance: '15.1km',
    cashback: '3%',
    savedCount: 41,
    logo: venueThumb,
    photos: [venueThumb, postPhoto],
  },
  {
    id: 't3',
    name: 'T3 Boardgames',
    pinMeta: 'Entertainment • $$',
    listMeta: 'Entertainment • Richmond • $$',
    distance: '9.2km',
    cashback: '5%',
    savedCount: 8,
    logo: thumbRestaurants,
    photos: [thumbRestaurants, ellipsisInterior],
  },
  {
    id: 'typhoon',
    name: 'Typhoon Bubble Tea',
    pinMeta: 'Taiwanese & HK Café • $$',
    listMeta: 'Taiwanese & HK Café • Richmond • $$',
    distance: '11.8km',
    cashback: '4%',
    savedCount: 23,
    logo: thumbDimsum,
    photos: [thumbDimsum, postPhoto],
  },
  {
    id: 'veras',
    name: "Vera's Burger Shack",
    pinMeta: 'Burgers • $$',
    listMeta: 'Burgers • Davie St • $$',
    distance: '18.4km',
    cashback: '10%',
    savedCount: 30,
    logo: offerVeras,
    photos: [offerVeras, postPhoto],
  },
]

// Pin coordinates, kept apart from the venue copy: they are the only field
// that is about the map rather than about the place.
const COORDS: Record<string, [number, number]> = {
  ellipsis: [-123.1128, 49.1908],
  railtown: [-123.0905, 49.2131],
  amcafe: [-123.1402, 49.1961],
  t3: [-123.1365, 49.1952],
  typhoon: [-123.1188, 49.1745],
  veras: [-123.1301, 49.2205],
}

export const WEB_PLACES: MapPlace[] = VENUES.map((v) => ({
  id: v.id,
  name: v.name,
  meta: v.pinMeta,
  lng: COORDS[v.id][0],
  lat: COORDS[v.id][1],
  photo: v.logo,
  venue: {
    title: v.name,
    logo: v.logo,
    photos: v.photos,
    cashback: v.cashback,
    savers,
    savedLabel: String(v.savedCount),
    meta: v.listMeta,
    distance: v.distance,
  },
}))

// The list rows are the phone's eligible-merchant row, unchanged — same
// component, same 79x89 photo with the rate burned in, same savers footer.
export const WEB_MERCHANTS: Merchant[] = VENUES.map((v) => ({
  id: v.id,
  name: v.name,
  meta: `${v.listMeta} • ${v.distance}`,
  photo: v.photos[0],
  cashback: v.cashback,
  savers,
  savedCount: v.savedCount,
}))
