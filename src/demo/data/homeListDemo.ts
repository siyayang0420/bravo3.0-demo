// EDIT ME — Home's list view: demo restaurants near the user. Each card's
// grey tag is cardTag(transactions, label): "100+ transactions" from 100 up,
// otherwise the label.
//
// Same record as a search result (SearchHit), so the list reuses the result
// card. `savers` is empty on purpose: the bottom line is a reason this place
// was picked for you ("Close to you…"), shown as text with no faces.
import { cardTag, type SearchHit } from './searchDemo'
import offerDawn from '../assets/offer-dawn.png'
import tacos from '../assets/thumb-restaurants.png'
import haidilao from '../assets/search/haidilao.webp'
import ellipsisInterior from '../assets/venue/ellipsis-interior.png'
import dimsum from '../assets/thumb-dimsum.jpg'
import dessert from '../assets/social/post-photo.jpg'
import drinks from '../assets/venue/ellipsis-drinks.png'
import diner from '../assets/social/merchant-photo.png'
import veras from '../assets/offer-veras.png'
import amcafe from '../assets/social/venue-amcafe.jpg'

const place = (
  id: string,
  name: string,
  meta: string,
  photo: string,
  cashback: string,
  tag: string,
  note: string,
  lng: number,
  lat: number,
  pickup = false,
): SearchHit => ({
  id,
  name,
  meta,
  distance: meta.split(' • ')[2] ?? '',
  lng,
  lat,
  photo,
  cashback,
  tag,
  pickup,
  savers: [],
  note,
})

export const HOME_LIST: SearchHit[] = [
  place('dawn', "Dawn's Burger Bar", 'Burger • Richmond • 0.8km', offerDawn, '5%', cardTag(240, 'Burgers & shakes'),
    'Close to you, and avg price is $20', -123.1302, 49.1901, true),
  place('taco-sol', 'Taco Sol', 'Mexican • Richmond • 1.6km', tacos, '4%', cardTag(60, 'Vegan options'),
    "You like tacos, but you haven't tried this yet", -123.1398, 49.1862),
  place('hdl-home', 'Haidilao Richmond', 'Hotpot • Richmond • 3.2km', haidilao, '5%', cardTag(180, 'Open until 2am'),
    'Gloria has been here 3 times', -123.1365, 49.1695),
  place('ellipsis-home', 'Ellipsis', 'Cafe • Richmond • 2.1km', ellipsisInterior, '3%', cardTag(12, 'New on Bravo'),
    'Just joined Bravo', -123.1128, 49.1908),
  place('golden-dimsum', 'Golden Dim Sum House', 'Dim sum • Richmond • 1.1km', dimsum, '6%', cardTag(85, 'Group friendly'),
    'Your friend Ken saved it last week', -123.1335, 49.1838, true),
  place('bloom', 'Bloom Dessert Bar', 'Dessert • Richmond • 2.4km', dessert, '4%', cardTag(40, 'Open until 11pm'),
    'Trending near you this week', -123.1250, 49.1785),
  place('sip-pearl', 'Sip & Pearl Tea', 'Bubble tea • Richmond • 0.6km', drinks, '8%', cardTag(520, 'Order ahead'),
    'You get bubble tea most Fridays', -123.1281, 49.1932, true),
  place('route-66', 'Route 66 Diner', 'Diner • Richmond • 2.8km', diner, '3%', cardTag(70, 'Late night'),
    'Open late, until 2am tonight', -123.1452, 49.1750),
  place('veras', "Vera's Burger Shack", 'Burger • Richmond • 1.9km', veras, '10%', cardTag(410, 'Smash burgers'),
    'Double cashback until Sunday', -123.1410, 49.1680, true),
  place('am-cafe', 'AM Cafe', 'Cafe • Richmond • 1.3km', amcafe, '3%', cardTag(55, 'Free Wi-Fi'),
    'Joshua posted about it yesterday', -123.1322, 49.1870),
  place('pho-saigon', 'Pho Saigon Kitchen', 'Vietnamese • Richmond • 2.0km', haidilao, '5%', cardTag(90, 'Under $15'),
    'Close to you, and avg price is $15', -123.1371, 49.1722),
  place('sakura', 'Sakura Sushi Bar', 'Japanese • Richmond • 2.6km', dimsum, '6%', cardTag(65, 'Reservations'),
    "You like Japanese, but you haven't tried this yet", -123.1188, 49.1801, true),
  place('golden-crust', 'Golden Crust Bakery', 'Bakery • Richmond • 0.5km', dessert, '4%', cardTag(350, 'Egg tarts daily'),
    'Fresh egg tarts at 3pm daily', -123.1276, 49.1915),
  place('cantina', 'Cantina del Sol', 'Mexican • Richmond • 3.1km', tacos, '5%', cardTag(30, 'Patio seating'),
    'Emma has been here 5 times', -123.1489, 49.1702),
  place('night-market', 'Night Market Bites', 'Street food • Richmond • 1.4km', drinks, '7%', cardTag(610, 'Cash-free'),
    'Busy tonight — pickup skips the line', -123.1356, 49.1865, true),
  place('ember', 'Ember Grill House', 'Steakhouse • Richmond • 3.4km', diner, '4%', cardTag(25, 'Free parking'),
    'Just joined Bravo', -123.1102, 49.1758),
]

/** The banner above Home's filters. Every banner is these four fields. */
export type HomeBanner = {
  title: string
  subtitle: string
  /** The button's label. */
  cta: string
  image: string
}

// EDIT ME — Home's banner carousel, in swipe order. The referral bonus is
// second on purpose.
export const HOME_BANNERS: HomeBanner[] = [
  {
    title: 'New: Bloom Dessert Bar',
    subtitle: 'Get 10% back on your first visit',
    cta: 'View offer',
    image: dessert,
  },
  {
    title: 'Invite a friend, get $10',
    subtitle: 'They get $10 too after their first meal',
    cta: 'Invite',
    image: offerDawn,
  },
  {
    title: 'Double cashback weekend',
    subtitle: 'Earn 2x at 30+ spots in Richmond',
    cta: 'Explore',
    image: dimsum,
  },
]

// EDIT ME — leads every search's results (the committed sheet), above the
// All / Restaurant / People chips.
export const SEARCH_BANNER: HomeBanner = {
  title: 'Limited time offer',
  subtitle: 'Double cashback on hotpot this week, ends Sunday',
  cta: 'Claim now',
  image: haidilao,
}
