// Home — implements Figma node 19237:3737 (Home-Default)
// Map-first discovery screen with balance pills, filter chips,
// AI prompt dock, and bottom nav.
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ScanLine, Bell } from 'lucide-react'
import BalancePill from '../components/BalancePill'
import SpendableSheet, { formatMoney, type SpendableTab } from '../components/SpendableSheet'
import CircleIconButton from '../components/CircleIconButton'
import FilterChip from '../components/FilterChip'
import SuggestionChip from '../components/SuggestionChip'
import PromoChip from '../components/PromoChip'
import OffersSheet, { type Promotion } from '../components/OffersSheet'
import { type Offer } from '../components/OfferCard'
import PromptBox from '../components/PromptBox'
import useSearchLauncher from '../components/SearchLauncher'
import BottomNav, { type NavId } from '../components/BottomNav'
import Coin from '../components/Coin'
import MapView, { type MapPlace } from '../components/MapView'
import MapVenueCard from '../components/MapVenueCard'
import MapFriendComment from '../components/MapFriendComment'
import { useDemoUser } from '../components/DemoIdentity'
import VenueDetailScreen from './VenueDetailScreen'
import { ELLIPSIS_FRIEND_COMMENT, FRIEND_POST_ID } from '../data/venueDetailDemo'
import { pickPeople } from '../data/people'
import ellipsisInterior from '../assets/venue/ellipsis-interior.png'
import ellipsisDrinks from '../assets/venue/ellipsis-drinks.png'
import ellipsisLogo from '../assets/venue/ellipsis-logo.png'
import thumbDimsum from '../assets/thumb-dimsum.jpg'
import thumbRestaurants from '../assets/thumb-restaurants.png'
import offerVeras from '../assets/offer-veras.png'
import offerDawn from '../assets/offer-dawn.png'

// Figma 19564:172074 — the bonus the top-up CTA advertises
const TOP_UP_BONUS = '$80'
// Figma annotation (node 19453:11110): other than Cuisine and Price
// (defaults), the remaining 2–3 tags are LLM-generated from user preferences.
const FILTERS = [
  { label: 'Cuisine', hasDropdown: true },
  { label: 'Featured', hasDropdown: false },
  { label: 'Price', hasDropdown: true },
  { label: 'Micheline', hasDropdown: false },
]
const SUGGESTIONS = [
  { image: thumbDimsum, label: 'Best dim sum in Richmond' },
  { image: thumbRestaurants, label: 'New onboarded restaurants' },
]

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

export default function HomeScreen({
  active,
  onNavigate,
  hasPromotion = false,
  intro = false,
  avatar,
}: {
  active: NavId
  onNavigate: (id: NavId) => void
  /** Demo state: is there a live promotion? Drives the "My offers?" chip. */
  hasPromotion?: boolean
  /** Play the entrance animation. False on tab switches — see BravoApp. */
  intro?: boolean
  /** The signed-in demo user's own face — the nav's last item. */
  avatar?: string
}) {
  const [spendableOpen, setSpendableOpen] = useState(false)
  const [spendableTab, setSpendableTab] = useState<SpendableTab>('balance')
  const [promoOpen, setPromoOpen] = useState(false)
  const { searchOpen, ask, promptProps, overlays } = useSearchLauncher('map')
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
  const openVenue = (anchor?: string) => {
    setVenueAnchor(anchor)
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
        places={MAP_PLACES}
        onSelectPlace={setPlace}
        onDeselect={() => setPlace(null)}
      />

      {/* top bar */}
      <motion.div
        className="bv-topbar"
        initial={intro ? { opacity: 0, y: -10 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
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
        className={`bv-bottom-stack${searchOpen ? ' search-hidden' : ''}`}
        initial={intro ? { y: 40, opacity: 0 } : false}
        // The venue card takes the bottom of the screen, so the chips and the
        // dock give it up and drop out of frame rather than stacking above it.
        animate={{ y: place ? 260 : 0, opacity: place ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32, delay: place ? 0 : 0.1 }}
      >
        <div className="bv-filter-row">
          {FILTERS.map((f) => (
            <FilterChip key={f.label} label={f.label} hasDropdown={f.hasDropdown} />
          ))}
        </div>
        <div className="bv-suggestion-row">
          {hasPromotion && <PromoChip onClick={() => setPromoOpen(true)} />}
          {/* Each chip is a canned prompt — tapping it sends its own copy to
              the AI thread, no typing. */}
          {SUGGESTIONS.map((s) => (
            <SuggestionChip
              key={s.label}
              image={s.image}
              label={s.label}
              onClick={() => ask(s.label)}
            />
          ))}
        </div>
        <div className="bv-dock">
          {/* Mic and voice act in place; tapping the placeholder opens the
              search sheet, where the real keyboard belongs. */}
          <div className="bv-dock-search-trigger">
            <PromptBox {...promptProps} />
          </div>
          <BottomNav active={active} onSelect={onNavigate} avatar={avatar} />
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
            transition={{ type: 'spring', stiffness: 300, damping: 32, mass: 0.8 }}
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
                  transition={{ type: 'spring', stiffness: 380, damping: 26, mass: 0.6 }}
                >
                  <MapFriendComment
                    avatar={place.venue.friendComment.avatar}
                    text={place.venue.friendComment.text}
                    onOpen={() => openVenue(FRIEND_POST_ID)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <MapVenueCard venue={place.venue} onOpen={() => openVenue()} />
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
            transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.7 }}
          >
            <VenueDetailScreen
              anchorPostId={venueAnchor}
              onBack={() => setVenueOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* search sheet + AI thread — the prompt dock's own layers */}
      {overlays}

      {/* Combined Spendable sheet — opens from either balance pill */}
      <AnimatePresence>
        {spendableOpen && (
          <>
            <motion.button
              type="button"
              className="bv-scrim"
              aria-label="Close balance details"
              onClick={() => setSpendableOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            />
            <motion.div
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
          </>
        )}
      </AnimatePresence>

      {/* Offers for you — slides up from the bottom edge, over the dock.
          `over-topbar` because nothing up there anchors this sheet, so the
          pills dim with the rest of the screen. */}
      <AnimatePresence>
        {promoOpen && hasPromotion && (
          <>
            <motion.button
              type="button"
              className="bv-scrim over-topbar"
              aria-label="Close offers"
              onClick={() => setPromoOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            />
            <OffersSheet
              offers={OFFERS}
              promotions={PROMOTIONS}
              onClose={() => setPromoOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  )
}
