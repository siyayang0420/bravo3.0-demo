// Home — implements Figma node 19237:3737 (Home-Default)
// Discovery screen with balance pills, filter chips, the search dock and
// bottom nav. Opens on a list of restaurants picked for you; the map is the
// secondary view, behind the List/Map toggle. A search that has run always
// shows the map, since its results are pinned there.
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ScanLine, Bell, LocateFixed, List, Map as MapIcon } from 'lucide-react'
import BalancePill from '../components/BalancePill'
import SpendableSheet, { formatMoney, type SpendableTab } from '../components/SpendableSheet'
import CircleIconButton from '../components/CircleIconButton'
import PromoChip from '../components/PromoChip'
import useDragScroll from '../hooks/useDragScroll'
import OffersSheet, { type Promotion } from '../components/OffersSheet'
import { type Offer } from '../components/OfferCard'
import PromptBox from '../components/PromptBox'
import useSearchLauncher from '../components/SearchLauncher'
import BottomNav, { type NavId } from '../components/BottomNav'
import Coin from '../components/Coin'
import MapView, { type MapPlace } from '../components/MapView'
import MapVenueCard from '../components/MapVenueCard'
import SearchHitRow from '../components/SearchHitRow'
import FilterChip from '../components/FilterChip'
import PromoBanner from '../components/PromoBanner'
import { HOME_BANNERS, HOME_LIST } from '../data/homeListDemo'
import MapFriendComment from '../components/MapFriendComment'
import { useDemoUser } from '../components/DemoIdentity'
import VenueDetailScreen from './VenueDetailScreen'
import {
  ELLIPSIS_FRIEND_COMMENT,
  FRIEND_POST_ID,
  detailForHit,
  type VenueDetail,
} from '../data/venueDetailDemo'
import { TOP_UP_BONUS } from '../data/spendableDemo'
import { pickPeople } from '../data/people'
import ellipsisInterior from '../assets/venue/ellipsis-interior.png'
import ellipsisDrinks from '../assets/venue/ellipsis-drinks.png'
import ellipsisLogo from '../assets/venue/ellipsis-logo.png'
import thumbDimsum from '../assets/thumb-dimsum.jpg'
import thumbRestaurants from '../assets/thumb-restaurants.png'
import offerVeras from '../assets/offer-veras.png'
import offerDawn from '../assets/offer-dawn.png'
import { type SearchHit } from '../data/searchDemo'

// EDIT ME — the real map's opening view and restaurant pins.
// [lng, lat]. This opens on the Bridgeport area of Richmond, BC (the same
// neighbourhood the original mock showed). Replace the pin coordinates with
// the real restaurant locations you want to demo.
const MAP_CENTER: [number, number] = [-123.1255, 49.1928]
const MAP_ZOOM = 12.9
// Savers and the commenting friend come from the shared cast, so the faces
// here are people you actually see elsewhere in the demo.
const venueFaces = pickPeople(4, 6)

const MAP_PLACES: MapPlace[] = [
  {
    id: 't3',
    name: 'T3 Boardgames',
    meta: 'Entertainment · $$',
    lng: -123.1365,
    lat: 49.1952,
    photo: thumbRestaurants,
    // No friendComment — nobody you follow has written about this one, which
    // is the whole difference between the two pins: tapping T3 shows the
    // card and nothing follows it.
    venue: {
      title: 'T3 Boardgames',
      logo: thumbRestaurants,
      photos: [ellipsisInterior, ellipsisDrinks],
      cashback: '5%',
      savers: venueFaces.slice(0, 3).map((p) => p.avatar),
      savedLabel: '8+',
      meta: 'Entertainment • Richmond • $$',
      distance: '9.2km',
    },
  },
  {
    id: 'typhoon',
    name: 'Ellipsis',
    meta: 'Cafe • $$',
    lng: -123.1128,
    lat: 49.1908,
    photo: thumbDimsum,
    venue: {
      title: 'Ellipsis',
      logo: ellipsisLogo,
      photos: [ellipsisInterior, ellipsisDrinks],
      cashback: '3%',
      savers: venueFaces.slice(0, 3).map((p) => p.avatar),
      savedLabel: '14+',
      meta: 'Cafe • Vancouver • $$',
      distance: '13.5km',
      // The same note that heads this venue's posts — see venueDetailDemo.
      friendComment: ELLIPSIS_FRIEND_COMMENT,
    },
  },
]

// Real Bravo partners in Richmond (bravoup.ca/restaurants/all/richmond).
// Photos are each store's cover from its Bravo gallery, loaded from Bravo's
// image bucket. The pins are laid out to fill the opening view without their
// labels colliding — not placed at the real street addresses.
const bravoPhoto = (hash: string) =>
  `https://bravo-auto.s3.ca-central-1.amazonaws.com/thumbnails/300/${hash}.webp`
type BravoPin = {
  id: string
  name: string
  cuisine: string
  price: string
  photo: string
  cashback: string
  distance: string
  lng: number
  lat: number
}
const pin = (
  id: string,
  name: string,
  cuisine: string,
  price: string,
  photo: string,
  cashback: string,
  distance: string,
  lng: number,
  lat: number,
): BravoPin => ({ id, name, cuisine, price, photo, cashback, distance, lng, lat })

const BRAVO_PINS: BravoPin[] = [
  pin('lanxuan', 'Lanxuan Restaurant', 'Cantonese', '$$', bravoPhoto('412dd1890c40c4953c48127950a0e009'), '6%', '2.4km', -123.1429, 49.2076),
  pin('zenbu', 'Zenbu Aburi', 'Japanese', '$$', bravoPhoto('0780334432f7c1e19e2a4cb31af4219b'), '5%', '2.6km', -123.1233, 49.2076),
  pin('kiyo', 'Kiyo Sushi', 'Sushi', '$$', bravoPhoto('c02f9215ba4439b6d450d46b5ce7cb7a'), '4%', '2.0km', -123.121, 49.2043),
  pin('drama', 'Drama Hot Pot', 'Hot pot', '$$', bravoPhoto('4f8ddeb2a8b09c92d0ce91aa86693c81'), '5%', '1.7km', -123.1422, 49.2043),
  pin('yuans', "Yuan's Hot Pot", 'Hot pot', '$$', bravoPhoto('ea020ee74b590307a57c690cab3edcbd'), '6%', '1.2km', -123.132, 49.201),
  pin('wuhan', 'Wu Han Spicy Duck', 'Chinese', '$', bravoPhoto('16b78ea3da6d03f7b98d3dea2f063e98'), '8%', '1.5km', -123.1422, 49.1908),
  pin('typhoon-tea', 'Typhoon Bubble Tea Taiwanese Cuisine', 'Taiwanese & HK Café', '$', bravoPhoto('74e3993f8272c235fbd63fb1a5908269'), '5%', '0.9km', -123.1348, 49.1872),
  pin('egg-lab', 'Egg Lab', 'Brunch', '$', bravoPhoto('b84551a7ac75ff65f88d10638af0fca1'), '4%', '1.9km', -123.1192, 49.195),
  pin('dawn-steak', 'House of Dawn Steakhouse', 'Steakhouse', '$$$', bravoPhoto('81aa69b4ad6dd1fbb2a8f214336afad8'), '8%', '2.2km', -123.1357, 49.18),
  pin('oui', 'Oui Patisserie', 'Dessert', '$$', bravoPhoto('5f599d178c90e807abc6b0d6aafe5e56'), '5%', '2.8km', -123.1431, 49.1836),
  pin('azure', 'Azure Cafe', 'Cafe', '$', bravoPhoto('fae1ad48fdd9cffc8de25e4203f77a80'), '3%', '3.1km', -123.1219, 49.1836),
  // Past the opening view — pan or zoom out to find them.
  // South, toward City Centre.
  pin('curry-express', 'Curry Express Richmond Center', 'Indian', '$', bravoPhoto('6f4681110abdc9f4559c6795b2e1506c'), '4%', '3.4km', -123.14, 49.16),
  pin('three-woks', 'Three Woks', 'Chinese', '$', bravoPhoto('c8d9e904a8c22e18af5acfb5eb5c9afa'), '5%', '3.7km', -123.115, 49.157),
  pin('malaya', 'Malaya Kitchen', 'Malaysian', '$$', bravoPhoto('3b064a0e314ae5f95b6333466552f3bd'), '6%', '4.0km', -123.142, 49.152),
  pin('88-malaysian', '88 Malaysian Crystal BBQ Pork & Food', 'Malaysian BBQ', '$', bravoPhoto('bd73e857e51bc72c61e1fe98f99b51eb'), '5%', '4.3km', -123.117, 49.149),
  pin('hainan', 'Hainan Kitchen', 'Hainanese', '$', bravoPhoto('af8872c329d5e4512eedc47f07edfae1'), '4%', '4.6km', -123.14, 49.144),
  pin('flour-dance', 'Flour Dance', 'Bakery', '$', bravoPhoto('1438fdd14ece5cad732b31ae74f4ef0f'), '3%', '4.9km', -123.118, 49.141),
  pin('bbq-chicken', 'BBQ Chicken', 'Korean fried chicken', '$$', bravoPhoto('6f59e859a95ec230bff2925aaec21961'), '5%', '5.2km', -123.143, 49.136),
  // East, past Bridgeport.
  pin('chuan-ku', 'Chuan Ku BBQ Restaurant', 'Sichuan BBQ', '$$', bravoPhoto('9853592baaa49c9cd982254e7b73a052'), '6%', '2.9km', -123.1, 49.208),
  pin('taos', 'TAOS CAFE', 'Cafe', '$', bravoPhoto('04d9c04cfea63eccbd293daf0b0d0083'), '4%', '4.1km', -123.075, 49.204),
  pin('masa', 'Masa Ishibashi', 'Japanese', '$$$', bravoPhoto('c5bfee61d2c521e4131603c533cde570'), '7%', '2.7km', -123.1, 49.198),
  pin('pho7', 'Pho 7', 'Vietnamese', '$', bravoPhoto('655a5d10f623a9b48617e6e900aa81f8'), '5%', '4.4km', -123.075, 49.192),
  pin('grill-king', 'Grill King', 'Grill', '$$', bravoPhoto('a18716deabd01774ce77ec7b703944af'), '4%', '2.9km', -123.098, 49.182),
  pin('mango-yummy', 'Mango Yummy', 'Dessert', '$', bravoPhoto('5abfdaebfd849b6f9a64cf0d5ebb71fd'), '5%', '4.6km', -123.074, 49.178),
  pin('protein-go', 'Protein Go Smoothie Bar', 'Smoothies', '$', bravoPhoto('8879f1f9f2392d0b5b25d1b1cab0695e'), '3%', '3.3km', -123.097, 49.172),
  // West, toward Terra Nova.
  pin('meraki', 'Meraki Street', 'Greek', '$$', bravoPhoto('8950dc636916a3e2aaf3e4aa558fa626'), '5%', '3.6km', -123.178, 49.188),
  pin('and-drinks', 'And Drinks', 'Bubble tea', '$', bravoPhoto('dbc78f427f28b21edd0c9dda58987d33'), '6%', '3.4km', -123.175, 49.181),
  pin('100e-fruit', '100E FRUIT', 'Fruit tea', '$', bravoPhoto('c10572e2595f790a32129102fde7ce95'), '5%', '3.8km', -123.178, 49.1745),
  pin('fruit-box', 'Fruit Box', 'Fruit', '$', bravoPhoto('e6a86d0d4de791c626fe3f08c903c5d9'), '4%', '4.0km', -123.172, 49.168),
  pin('aw', 'A&W Canada', 'Burgers', '$', bravoPhoto('5a566380ff4e2091872f3ef2ad154ac6'), '3%', '4.4km', -123.176, 49.1615),
]

// The same records as a search hit, so their detail pages come from the
// shared builder (detailForHit), keyed by pin id.
const bravoHit = (p: BravoPin): SearchHit => ({
  id: p.id,
  name: p.name,
  meta: `${p.cuisine} • Richmond • ${p.distance}`,
  distance: p.distance,
  lng: p.lng,
  lat: p.lat,
  photo: p.photo,
  cashback: p.cashback,
  tag: '',
  savers: [],
  note: '',
})
const PIN_DETAILS: Record<string, VenueDetail> = Object.fromEntries(
  BRAVO_PINS.map((p) => [p.id, detailForHit(bravoHit(p))]),
)

MAP_PLACES.push(
  ...BRAVO_PINS.map(
    (p, i): MapPlace => ({
      id: p.id,
      name: p.name,
      meta: `${p.cuisine} · ${p.price}`,
      lng: p.lng,
      lat: p.lat,
      photo: p.photo,
      venue: {
        title: p.name,
        logo: p.photo,
        photos: [p.photo, ellipsisInterior],
        cashback: p.cashback,
        savers: venueFaces.slice(0, 3).map((f) => f.avatar),
        savedLabel: `${4 + i * 3}+`,
        meta: `${p.cuisine} • Richmond • ${p.price}`,
        distance: p.distance,
      },
    }),
  ),
)
// Shown only when the Home "promotion" state is on (Figma 19243:4646).
// The activatable merchant offers at the top of the sheet.
const OFFERS: Offer[] = [
  {
    id: 'veras',
    merchant: "Vera's Burger Shack Davie St",
    meta: 'Burger& Fried Chicken • $$',
    photo: offerVeras,
    rate: '10%',
    baseRate: '3%',
    expiry: 'Expired on 2026/10/12',
  },
  {
    id: 'dawn',
    merchant: 'House of Dawn Steakhouse',
    meta: 'Burger& Fried Chicken • $$',
    photo: offerDawn,
    rate: '8%',
    baseRate: '3%',
    expiry: 'Expired on 2026/11/12',
  },
]

// The top-up promotions under them (Figma 19564:172408).
const PROMOTIONS: Promotion[] = [
  {
    id: 'topup-200',
    title: 'Top up $200 and get $13 bonus',
    expiry: 'Expired on 2026/10/12',
    expiryStyle: 'text',
  },
  {
    id: 'topup-100',
    title: 'Top up $100 and get $6 bonus',
    expiry: 'Expired on 2026/10/12',
    expiryStyle: 'badge',
  },
]

/**
 * How you swap between the list and the map — a demo state the tweaker picks:
 * `icons` is a List | Map icon switch at the end of the filter row;
 * `floating` is one pill above the search bar.
 */
export type ViewToggleStyle = 'icons' | 'floating'

const VIEWS = [
  { id: 'list', label: 'List', Icon: List },
  { id: 'map', label: 'Map', Icon: MapIcon },
] as const

export default function HomeScreen({
  active,
  onNavigate,
  hasPromotion = false,
  intro = false,
  avatar,
  viewToggle = 'icons',
}: {
  active: NavId
  onNavigate: (id: NavId) => void
  /** Demo state: is there a live promotion? Drives the "My offers?" chip. */
  hasPromotion?: boolean
  /** Play the entrance animation. False on tab switches — see BravoApp. */
  intro?: boolean
  /** The signed-in demo user's own face — the nav's last item. */
  avatar?: string
  viewToggle?: ViewToggleStyle
}) {
  const [spendableOpen, setSpendableOpen] = useState(false)
  const [spendableTab, setSpendableTab] = useState<SpendableTab>('balance')
  const [promoOpen, setPromoOpen] = useState(false)
  // Drag and wheel scroll the filter chips on a desktop, where touch isn't there.
  const filterRail = useDragScroll<HTMLDivElement>()
  const mapFilterRail = useDragScroll<HTMLDivElement>()
  const { searchOpen, ask, promptProps, overlays, results } = useSearchLauncher('map')
  const [view, setView] = useState<'list' | 'map'>('list')
  const showMap = view === 'map' || !!results
  const floating = viewToggle === 'floating'
  const switchView = (v: 'list' | 'map') => {
    setPlace(null)
    setView(v)
  }
  // The same filter row heads both views — stuck under the top bar in the
  // list, floating over the tiles on the map — with the List | Map switch at
  // its end, so the switch sits in one place whichever view you are in.
  // ponytail: the filters are decorative — no Cuisine/Price menus exist yet.
  const filterHeader = (rail: RefObject<HTMLDivElement>) => (
    <div className="bv-home-list-filters">
      {/* Scrolls sideways (drag on the review site); the switch stays put. */}
      <div className="bv-filter-row" ref={rail}>
        <FilterChip label="🔥 Big saving" />
        <FilterChip label="Cuisine" hasDropdown />
        <FilterChip label="Featured" />
        <FilterChip label="Price" hasDropdown />
        <FilterChip label="Areas" hasDropdown />
        <FilterChip label="Categories" hasDropdown />
      </div>
      {!floating && (
        <div
          className="bv-view-switch"
          role="group"
          aria-label="View"
        >
          {VIEWS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={view === id}
              aria-label={label}
              onClick={() => switchView(id)}
            >
              <Icon size={16} strokeWidth={2} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
  // Scrolling the list down tips the bottom nav away; scrolling up brings it
  // back — the same behaviour as the Discover feed.
  const [navHidden, setNavHidden] = useState(false)
  const listScroller = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setNavHidden(false)
    const el = listScroller.current
    if (!el) return
    let last = el.scrollTop
    const onScroll = () => {
      const now = el.scrollTop
      const delta = now - last
      // Ignore jitter, and never hide it right at the top of the list.
      if (Math.abs(delta) < 6) return
      last = now
      setNavHidden(delta > 0 && now > 40)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [showMap])
  // The banner carousel: one full-width slide at a time, snapping. The dots
  // follow the swipe and jump to a slide when tapped.
  const bannerRail = useRef<HTMLDivElement>(null)
  const [bannerAt, setBannerAt] = useState(0)
  const slideStep = (el: HTMLDivElement) => el.clientWidth + 12 // slide + gap
  // A search that has run swaps the pins for what it found and frames them in
  // the map left showing above the results sheet (55% of the screen).
  const searchMap = useMemo(() => {
    if (!results) return null
    const places: MapPlace[] = results.map((h) => ({
      id: h.id,
      name: h.name,
      meta: h.meta.split(' • ')[0],
      lng: h.lng,
      lat: h.lat,
      photo: h.photo,
    }))
    return {
      places,
      focus: {
        points: places.map((p): [number, number] => [p.lng, p.lat]),
        // Clear of the top bar, the sheet, and the pin label running right.
        padding: { top: 130, bottom: 520, left: 40, right: 170 },
      },
    }
  }, [results])
  // Your balances, and whether you have any history at all. The map itself is
  // the world's, not yours — the pins and their savers stay — but what the
  // map says about YOU empties out for a brand-new account.
  const { cash, coin, isNew } = useDemoUser()

  // Tapping a pin opens its venue card. The friend's note follows a beat
  // later — it is a second thought, not part of the card — so it lands on
  // its own timer rather than animating in alongside.
  const [place, setPlace] = useState<MapPlace | null>(null)
  const [commentShown, setCommentShown] = useState(false)
  const [venueOpen, setVenueOpen] = useState(false)
  // Set when the detail screen was opened by tapping the friend's note, so it
  // knows to scroll to that note rather than opening at the top.
  const [venueAnchor, setVenueAnchor] = useState<string | undefined>(undefined)
  // Which store the detail page shows. Unset = the map pin's venue (Ellipsis).
  const [venueDetail, setVenueDetail] = useState<VenueDetail | undefined>(undefined)
  const openVenue = (anchor?: string, detail?: VenueDetail) => {
    setVenueAnchor(anchor)
    setVenueDetail(detail)
    setVenueOpen(true)
  }
  useEffect(() => {
    if (!place?.venue?.friendComment) {
      setCommentShown(false)
      return
    }
    setCommentShown(false)
    const t = window.setTimeout(() => setCommentShown(true), 1000)
    return () => window.clearTimeout(t)
  }, [place])

  // Each pill opens the sheet on its own tab. Tapping the pill you are
  // already looking at closes it; tapping the other one switches across
  // rather than shutting the sheet in your face.
  const openSpendable = (tab: SpendableTab) => {
    setSpendableOpen((open) => !(open && spendableTab === tab))
    setSpendableTab(tab)
  }

  return (
    <>
      {/* real interactive map — pan/zoom, restaurant pins */}
      <MapView
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        places={searchMap?.places ?? MAP_PLACES}
        focus={searchMap?.focus}
        onSelectPlace={setPlace}
        onDeselect={() => setPlace(null)}
      />

      {/* List view — the default. Laid over the map rather than replacing
          it, so the map keeps its tiles and position for the toggle; hidden
          rather than unmounted, so it keeps its scroll spot and its rails
          keep their drag handlers. */}
      <div className={`bv-home-list${navHidden ? ' bars-hidden' : ''}`} hidden={showMap}>
        <div className="bv-home-list-scroll" ref={listScroller}>
          <div
            className="bv-banner-rail"
            ref={bannerRail}
            onScroll={(e) => setBannerAt(Math.round(e.currentTarget.scrollLeft / slideStep(e.currentTarget)))}
          >
            {HOME_BANNERS.map((b) => (
              <PromoBanner key={b.title} banner={b} />
            ))}
          </div>
          <div className="bv-banner-dots">
            {HOME_BANNERS.map((b, i) => (
              <button
                key={b.title}
                type="button"
                aria-label={`Show banner ${i + 1}`}
                aria-current={i === bannerAt}
                onClick={() => {
                  const el = bannerRail.current
                  if (el) el.scrollTo({ left: i * slideStep(el), behavior: 'smooth' })
                }}
              />
            ))}
          </div>
          {/* The banner scrolls away; the filters stick under the top bar. */}
          {filterHeader(filterRail)}
          <div className="bv-search-hits">
            {HOME_LIST.map((h) => (
              <SearchHitRow key={h.id} hit={h} onOpen={() => openVenue(undefined, detailForHit(h))} />
            ))}
          </div>
        </div>
      </div>

      {/* Map view's copy of the filter row, at the spot the list's sticks to.
          Hidden, not unmounted, so its rail keeps its drag handlers. A search
          that has run has its own sheet, so the row steps aside for it. */}
      <div className="bv-map-filters" hidden={view !== 'map' || !!results}>
        {filterHeader(mapFilterRail)}
      </div>

      {/* top bar */}
      <motion.div
        className="bv-topbar"
        initial={intro ? { opacity: 0, y: -10 } : false}
        // Scrolling the list down folds it away, the mirror of the nav: it
        // turns back on its bottom edge, which rides up with the filter row
        // taking its place. Scrolling up unfolds both.
        animate={
          navHidden ? { opacity: 0, rotateX: 90, y: -52 } : { opacity: 1, rotateX: 0, y: 0 }
        }
        transition={{
          duration: 0.34,
          ease: [0.4, 0, 0.2, 1],
          opacity: { duration: 0.22, ease: 'easeOut' },
        }}
        style={{
          pointerEvents: navHidden ? 'none' : undefined,
          originY: 1,
          transformPerspective: 320,
        }}
      >
        <div className="bv-topbar-group">
          <BalancePill onClick={() => openSpendable('balance')}>
            {formatMoney(cash)}
          </BalancePill>
          <BalancePill onClick={() => openSpendable('bonus')} leading={<Coin />}>
            {formatMoney(coin)}
          </BalancePill>
        </div>
        <div className="bv-topbar-group">
          <CircleIconButton icon={<ScanLine size={20} strokeWidth={1.9} />} label="Scan" />
          <CircleIconButton icon={<Bell size={20} strokeWidth={1.9} />} label="Notifications" />
        </div>
      </motion.div>

      {/* bottom stack */}
      <motion.div
        className={`bv-bottom-stack${searchOpen ? ' search-hidden' : ''}${showMap ? '' : ' list'}`}
        initial={intro ? { y: 40, opacity: 0 } : false}
        // The venue card takes the bottom of the screen, so the chips and the
        // dock give it up and drop out of frame rather than stacking above it.
        animate={{ y: place ? 260 : 0, opacity: place ? 0 : 1 }}
        transition={{
          type: 'spring',
          stiffness: 320,
          damping: 32,
          delay: place ? 0 : 0.1,
        }}
      >
        {/* Recentre — inside the stack so it rides up and out with the chips
            when a pin takes the bottom of the screen, rather than hanging
            over the venue card. */}
        {/* The floating style's one pill, centred in both views; the
            recentre button joins it on the map. */}
        {(showMap || floating) && (
          <div className={`bv-view-row${floating ? ' floating' : ''}`}>
            {floating && (
              <button
                type="button"
                className="bv-view-toggle"
                onClick={() => switchView(showMap ? 'list' : 'map')}
              >
                {showMap ? <List size={16} strokeWidth={2} /> : <MapIcon size={16} strokeWidth={2} />}
                {showMap ? 'List' : 'Map'}
              </button>
            )}
            {showMap && (
              <button
                className="bv-map-locate"
                aria-label="Recentre map"
                onClick={() => setPlace(null)}
              >
                <LocateFixed size={20} strokeWidth={1.9} />
              </button>
            )}
          </div>
        )}
        {/* The promotion chip outlives the suggestion row it used to share:
            it is how the "Promotion live" demo state shows itself. */}
        {hasPromotion && (
          <div className="bv-suggestion-row">
            <PromoChip onClick={() => setPromoOpen(true)} />
          </div>
        )}
        <div className={`bv-dock${navHidden ? ' nav-hidden' : ''}`}>
          <div className="bv-dock-row">
            {/* Mic and voice act in place; tapping the placeholder opens the
                search sheet, where the real keyboard belongs. */}
            <div className="bv-dock-search-trigger">
              <PromptBox {...promptProps} />
            </div>
          </div>
          <div className="bv-nav-slot">
            <BottomNav active={active} onSelect={onNavigate} avatar={avatar} />
          </div>
        </div>
      </motion.div>

      {/* Venue card — rises from the bottom when a pin is tapped, taking the
          place the dock just vacated. The friend's note is a sibling, not a
          child, so its own delayed entrance never moves the card. */}
      <AnimatePresence>
        {place?.venue && (
          <motion.div
            key={place.id}
            className="bv-venue-layer"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            exit={{ y: '110%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 32,
              mass: 0.8,
            }}
          >
            <AnimatePresence>
              {/* A note from someone you follow — so there is none when you
                  follow nobody. The card below it is unaffected: the venue
                  exists whether or not you have friends. */}
              {commentShown && place.venue.friendComment && !isNew && (
                <motion.div
                  initial={{ opacity: 0, y: 18, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 26,
                    mass: 0.6,
                  }}
                >
                  <MapFriendComment
                    avatar={place.venue.friendComment.avatar}
                    text={place.venue.friendComment.text}
                    onOpen={() => openVenue(FRIEND_POST_ID)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <MapVenueCard
              venue={place.venue}
              onOpen={() => openVenue(undefined, PIN_DETAILS[place.id])}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Venue detail — pushes in over the map, same as every other detail
          screen in the app. */}
      <AnimatePresence>
        {venueOpen && (
          <motion.div
            className="bv-vd-wrap"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 320,
              damping: 34,
              mass: 0.7,
            }}
          >
            <VenueDetailScreen
              venue={venueDetail}
              anchorPostId={venueAnchor}
              onBack={() => setVenueOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* search sheet + AI thread — the prompt dock's own layers */}
      {overlays}

      {/* Combined Spendable sheet — opens from either balance pill */}
      {/* Keyed siblings, not a fragment — see the note in SearchLauncher: a
          fragment hides these two from AnimatePresence's bookkeeping, and a
          fast open/close strands the scrim invisibly over the whole phone. */}
      <AnimatePresence>
        {spendableOpen && (
          <motion.button
            key="spendable-scrim"
            type="button"
            className="bv-scrim"
            aria-label="Close balance details"
            onClick={() => setSpendableOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />
        )}
        {spendableOpen && (
          <motion.div
            key="spendable-sheet"
            className="bv-spendable-anchor"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          >
            <SpendableSheet
              balance={cash}
              bonus={coin}
              topUpBonus={TOP_UP_BONUS}
              tab={spendableTab}
              onTabChange={setSpendableTab}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offers for you — slides up from the bottom edge, over the dock.
          `over-topbar` because nothing up there anchors this sheet, so the
          pills dim with the rest of the screen. */}
      <AnimatePresence>
        {promoOpen && hasPromotion && (
          <motion.button
            key="promo-scrim"
            type="button"
            className="bv-scrim over-topbar"
            aria-label="Close offers"
            onClick={() => setPromoOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />
        )}
        {promoOpen && hasPromotion && (
          <OffersSheet
            key="promo-sheet"
            offers={OFFERS}
            promotions={PROMOTIONS}
            onClose={() => setPromoOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
