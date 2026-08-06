// Home — implements Figma node 19237:3737 (Home-Default)
// Map-first discovery screen with balance pills, filter chips,
// AI prompt dock, and bottom nav.
import { useState } from 'react'
import { flushSync } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ScanLine, Bell } from 'lucide-react'
import BalancePill from '../components/BalancePill'
import SpendableSheet, { formatMoney } from '../components/SpendableSheet'
import CircleIconButton from '../components/CircleIconButton'
import FilterChip from '../components/FilterChip'
import SuggestionChip from '../components/SuggestionChip'
import PromoChip from '../components/PromoChip'
import OffersSheet, { type Promotion } from '../components/OffersSheet'
import { type Offer } from '../components/OfferCard'
import PromptBox from '../components/PromptBox'
import SearchSheet, { SEARCH_INPUT_ID } from '../components/SearchSheet'
import AiChatScreen from './AiChatScreen'
import BottomNav, { type NavId } from '../components/BottomNav'
import Coin from '../components/Coin'
import mapBg from '../assets/map-home.jpg'
import thumbDimsum from '../assets/thumb-dimsum.jpg'
import thumbRestaurants from '../assets/thumb-restaurants.png'
import offerVeras from '../assets/offer-veras.png'
import offerDawn from '../assets/offer-dawn.png'

// EDIT ME — demo values shown on Home
const CASH_BALANCE = 2916.12
const COIN_BALANCE = 140.88
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
}: {
  active: NavId
  onNavigate: (id: NavId) => void
  /** Demo state: is there a live promotion? Drives the "My offers?" chip. */
  hasPromotion?: boolean
  /** Play the entrance animation. False on tab switches — see BravoApp. */
  intro?: boolean
}) {
  const [spendableOpen, setSpendableOpen] = useState(false)
  const [promoOpen, setPromoOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [askQuery, setAskQuery] = useState('')

  const openSearch = () => {
    flushSync(() => setSearchOpen(true))
    document.getElementById(SEARCH_INPUT_ID)?.focus({ preventScroll: true })
  }

  return (
    <>
      {/* map background */}
      <div className="bv-map-bg">
        <img src={mapBg} alt="Map of nearby restaurants" />
      </div>

      {/* top bar */}
      <motion.div
        className="bv-topbar"
        initial={intro ? { opacity: 0, y: -10 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className="bv-topbar-group">
          <BalancePill onClick={() => setSpendableOpen((open) => !open)}>
            {formatMoney(CASH_BALANCE)}
          </BalancePill>
          <BalancePill
            onClick={() => setSpendableOpen((open) => !open)}
            leading={<Coin />}
          >
            {formatMoney(COIN_BALANCE)}
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
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32, delay: 0.1 }}
      >
        <div className="bv-filter-row">
          {FILTERS.map((f) => (
            <FilterChip key={f.label} label={f.label} hasDropdown={f.hasDropdown} />
          ))}
        </div>
        <div className="bv-suggestion-row">
          {hasPromotion && <PromoChip onClick={() => setPromoOpen(true)} />}
          {SUGGESTIONS.map((s) => (
            <SuggestionChip key={s.label} image={s.image} label={s.label} />
          ))}
        </div>
        <div className="bv-dock">
          {/* Tapping anywhere in the dock box opens the search sheet — the
              real keyboard would come up here, so the sheet stands in. */}
          <div
            className="bv-dock-search-trigger"
            role="button"
            tabIndex={0}
            onPointerDown={(e) => {
              e.preventDefault()
              openSearch()
            }}
            onClick={() => {
              if (!searchOpen) openSearch()
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openSearch()
              }
            }}
          >
            <PromptBox placeholder="New onboarded restaurants..." interactive={false} />
          </div>
          <BottomNav active={active} onSelect={onNavigate} />
        </div>
      </motion.div>

      {/* Search — slides up over the dock, keyboard and all */}
      <AnimatePresence>
        {searchOpen && (
          <SearchSheet
            onClose={() => setSearchOpen(false)}
            onAsk={(q) => {
              setAskQuery(q)
              setSearchOpen(false)
            }}
          />
        )}
      </AnimatePresence>

      {/* bravo AI thread — pushes in over everything once you send a query */}
      <AnimatePresence>
        {askQuery && (
          <motion.div
            className="bv-ai-screen-wrap"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
          >
            <AiChatScreen query={askQuery} onBack={() => setAskQuery('')} />
          </motion.div>
        )}
      </AnimatePresence>

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
                balance={CASH_BALANCE}
                bonus={COIN_BALANCE}
                topUpBonus={TOP_UP_BONUS}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Offers for you — slides up from the bottom edge, over the dock.
          No scrim in the design, so the catcher is transparent and exists
          only to make a tap on the map close the sheet. */}
      <AnimatePresence>
        {promoOpen && hasPromotion && (
          <>
            <button
              type="button"
              className="bv-sheet-catcher"
              aria-label="Close offers"
              onClick={() => setPromoOpen(false)}
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
