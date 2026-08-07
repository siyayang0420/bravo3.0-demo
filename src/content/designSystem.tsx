// ============================================================
// Bravo App Design System — component registry.
//
// One entry per component in src/demo/components/. This drives
// the Design System page and is the developer-facing spec.
//
// When a new Figma screen is implemented:
//   1. triage which elements are components (docs/COMPONENTS.md)
//   2. build them in src/demo/components/
//   3. add an entry here so they appear in the library
// ============================================================
import { useState } from 'react'
import { ScanLine, Bell, Bookmark, Check } from 'lucide-react'
import BalancePill from '../demo/components/BalancePill'
import CircleIconButton from '../demo/components/CircleIconButton'
import FilterChip from '../demo/components/FilterChip'
import SuggestionChip from '../demo/components/SuggestionChip'
import PromptBox from '../demo/components/PromptBox'
import BottomNav from '../demo/components/BottomNav'
import BalanceRow from '../demo/components/BalanceRow'
import Button, { ButtonAccent } from '../demo/components/Button'
import SpendableSheet from '../demo/components/SpendableSheet'
import Coin from '../demo/components/Coin'
import PromoChip from '../demo/components/PromoChip'
import PromoCard from '../demo/components/PromoCard'
import ExpiryPill from '../demo/components/ExpiryPill'
import PersonRow from '../demo/components/PersonRow'
import PromptStarter from '../demo/components/PromptStarter'
import SearchTabs, { type SearchTabId } from '../demo/components/SearchTabs'
import OfferCard from '../demo/components/OfferCard'
import OffersSheet from '../demo/components/OffersSheet'
import { StreakLabel, LevelLabel, type AchievementLevel } from '../demo/components/AchievementLabel'
import SectionTabs from '../demo/components/SectionTabs'
import LeaderboardRail from '../demo/components/LeaderboardRail'
import PostCard from '../demo/components/PostCard'
import LikeButton from '../demo/components/LikeButton'
import ProfileChallengeCard from '../demo/components/ProfileChallengeCard'
import VenueCard from '../demo/components/VenueCard'
import AchievementPanel from '../demo/components/AchievementPanel'
import ChallengeCard from '../demo/components/ChallengeCard'
import ScreenNav from '../demo/components/ScreenNav'
import SaveGlyph from '../demo/components/SaveGlyph'
import MerchantRow from '../demo/components/MerchantRow'
import thumbDimsum from '../demo/assets/thumb-dimsum.jpg'
import avatarHappy1 from '../demo/assets/social/avatar-happy1.png'
import avatarHappy000 from '../demo/assets/social/avatar-happy000.png'
import avatarHappyman from '../demo/assets/social/avatar-happyman.png'
import socialPhoto from '../demo/assets/social/post-photo.jpg'
import venueThumb from '../demo/assets/social/venue-amcafe.jpg'
import merchantPhoto from '../demo/assets/social/merchant-photo.png'
import offerVeras from '../demo/assets/offer-veras.png'
import saver1 from '../demo/assets/social/saver-1.png'
import saver2 from '../demo/assets/social/saver-2.png'
import saver3 from '../demo/assets/social/saver-3.png'

const ALL_LEVELS: AchievementLevel[] = ['lv1', 'lv2', 'lv3', 'lv4', 'lv5', 'lv6', 'lv7']

// Live so the travelling pill can actually be seen in the library.
function SearchTabsPreview() {
  const [tab, setTab] = useState<SearchTabId>('all')
  return <SearchTabs active={tab} onSelect={setTab} />
}

const DEMO_OFFER = {
  id: 'veras',
  merchant: "Vera's Burger Shack Davie St",
  meta: 'Burger& Fried Chicken • $$',
  photo: offerVeras,
  rate: '10%',
  baseRate: '3%',
  expiry: 'Expired on 2026/10/12',
}

const DEMO_PROMOTIONS = [
  { id: 'a', title: 'Top up $200 and get $13 bonus', expiry: 'Expired on 2026/10/12' },
  { id: 'b', title: 'Top up $100 and get $6 bonus', expiry: 'Expired on 2026/10/12', expiryStyle: 'badge' as const },
]

const DEMO_VENUE = {
  name: 'AM Cafe',
  meta: 'Cafe • Vancouver • 15.13km',
  thumbnail: venueThumb,
  cashback: '3%',
}

export type PropSpec = {
  name: string
  type: string
  required: boolean
  description: string
}

export type ComponentSpec = {
  id: string
  name: string
  figmaNodes: string[]
  file: string
  summary: string
  /** Where it appears today */
  usedOn: string[]
  props: PropSpec[]
  /** Design tokens the component consumes */
  tokens: string[]
  /** Lucide icons used inside */
  icons: string[]
  /** Anything a Flutter dev must know */
  flutterNote?: string
  /** Rendered live, inside a .bravo-scope container */
  preview: React.ReactNode
  /** Background for the preview cell */
  previewBg?: 'light' | 'map'
}

const coin = <Coin />

export const COMPONENT_SPECS: ComponentSpec[] = [
  {
    id: 'balance-pill',
    name: 'BalancePill',
    figmaNodes: ['19548:163732', '19548:163734'],
    file: 'src/demo/components/BalancePill.tsx',
    summary:
      'Displays a wallet balance as a floating pill. Two variants: plain cash, and coin (with a leading coin glyph).',
    usedOn: ['Home'],
    props: [
      { name: 'children', type: 'ReactNode', required: true, description: 'The balance text, pre-formatted.' },
      { name: 'leading', type: 'ReactNode', required: false, description: 'Optional glyph before the text — the coin variant passes the coin SVG here.' },
      { name: 'onClick', type: '() => void', required: false, description: 'Tap handler. When set the pill renders as a button — Home uses it to open the Combined Spendable sheet.' },
    ],
    tokens: ['--bv-neutral-100', '--bv-black', '--bv-radius-full', '--bv-inset-glow'],
    icons: [],
    flutterNote:
      'The inner white glow is an inset shadow — Flutter BoxShadow has no inset mode. Use a subtle white top gradient overlay instead.',
    preview: (
      <div style={{ display: 'flex', gap: 8 }}>
        <BalancePill>$2916.12</BalancePill>
        <BalancePill leading={coin}>$140.88</BalancePill>
      </div>
    ),
    previewBg: 'map',
  },
  {
    id: 'circle-icon-button',
    name: 'CircleIconButton',
    figmaNodes: ['19548:163745', '19548:163747'],
    file: 'src/demo/components/CircleIconButton.tsx',
    summary:
      'Floating circular action button used in the top bar. White surface, drop shadow, presses down 6% on tap.',
    usedOn: ['Home'],
    props: [
      { name: 'icon', type: 'ReactNode', required: true, description: 'A Lucide icon element, size 20.' },
      { name: 'label', type: 'string', required: true, description: 'Accessible label (aria-label).' },
      { name: 'flat', type: 'boolean', required: false, description: 'Drops the drop shadow. Used inside VenueCard, where Figma has none. Default false.' },
      { name: 'onClick', type: '() => void', required: false, description: 'Tap handler.' },
    ],
    tokens: ['--bv-white', '--bv-radius-full', '--bv-shadow-float'],
    icons: ['ScanLine', 'Bell', 'ArrowRightLeft', 'Bookmark'],
    flutterNote:
      'Always a true 35×35 circle — it must not take its height from the row it sits in, or it renders as an ellipse next to the taller balance pills.',
    preview: (
      <div style={{ display: 'flex', gap: 6, height: 35 }}>
        <CircleIconButton icon={<ScanLine size={20} strokeWidth={1.9} />} label="Scan" />
        <CircleIconButton icon={<Bell size={20} strokeWidth={1.9} />} label="Notifications" />
        <CircleIconButton icon={<Bookmark size={20} strokeWidth={1.9} />} label="Save" flat />
      </div>
    ),
    previewBg: 'map',
  },
  {
    id: 'filter-chip',
    name: 'FilterChip',
    figmaNodes: ['19453:11111'],
    file: 'src/demo/components/FilterChip.tsx',
    summary:
      'Pill-shaped filter control with the "bubble" inner-shadow treatment. Optional chevron indicates a dropdown.',
    usedOn: ['Home'],
    props: [
      { name: 'label', type: 'string', required: true, description: 'Filter name.' },
      { name: 'hasDropdown', type: 'boolean', required: false, description: 'Shows a ChevronDown when the filter opens a picker. Default false.' },
      { name: 'onClick', type: '() => void', required: false, description: 'Tap handler.' },
    ],
    tokens: ['--bv-neutral-100', '--bv-radius-full', '--bv-inset-bubble', '--bv-space-1-5', '--bv-space-3', '--bv-line-20'],
    icons: ['ChevronDown'],
    flutterNote:
      'Design note from Figma (19453:11110): beyond Cuisine and Price, the remaining 2–3 chips are LLM-generated from user preferences — the row is dynamic, not a fixed list.',
    preview: (
      <div style={{ display: 'flex', gap: 12 }}>
        <FilterChip label="Cuisine" hasDropdown />
        <FilterChip label="Featured" />
        <FilterChip label="Price" hasDropdown />
      </div>
    ),
    previewBg: 'light',
  },
  {
    id: 'suggestion-chip',
    name: 'SuggestionChip',
    figmaNodes: ['19453:11120'],
    file: 'src/demo/components/SuggestionChip.tsx',
    summary:
      'A prompt suggestion with a 30px thumbnail. Tapping it should populate the prompt box.',
    usedOn: ['Home'],
    props: [
      { name: 'image', type: 'string', required: true, description: 'Thumbnail URL (30×30, rendered at radius 6).' },
      { name: 'label', type: 'string', required: true, description: 'Suggestion text.' },
      { name: 'onClick', type: '() => void', required: false, description: 'Tap handler.' },
    ],
    tokens: ['--bv-neutral-100', '--bv-radius-xl', '--bv-radius-md', '--bv-inset-bubble'],
    icons: [],
    preview: <SuggestionChip image={thumbDimsum} label="Best dim sum in Richmond" />,
    previewBg: 'light',
  },
  {
    id: 'prompt-box',
    name: 'PromptBox',
    figmaNodes: ['19453:11129', '19377:5090'],
    file: 'src/demo/components/PromptBox.tsx',
    summary:
      'The bravo ai input. Two variants of one Figma component: `ai` wears the gradient ring (cyan → orange) that identifies AI surfaces and carries add / mic / voice-mode; `search` is a plain neutral-400 hairline with a search icon and nothing at the end. The pill, padding and 14px input are shared. The ai ring turns — the same colours at the same stops, with only the gradient angle sweeping 90° → 450° over 6s, so a paused ring is the Figma node exactly. The `ai` end has three states: idle (mic + voice-mode), typed (a single dark submit arrow), and recording (19377:5090) — tapping the mic empties the field and drops in a VoiceInput pill of ten metering bars + Stop, with the submit arrow beside it. Tap the mic in the preview below to see it.',
    usedOn: ['Home', 'Social', 'Eligible merchants'],
    props: [
      { name: 'placeholder', type: 'string', required: true, description: 'Placeholder copy — currently mirrors the active suggestion.' },
      { name: 'variant', type: "'ai' | 'search'", required: false, description: "Defaults to 'ai'. 'search' is the merchants-list form (19612:9735)." },
      { name: 'voiceTranscript', type: 'string', required: false, description: 'Arms the mic. Tapping it swaps the field for the recording pill (19377:5090); Stop→send submits this text. Absent → the mic is a decorative glyph.' },
      { name: 'onVoiceMode', type: '() => void', required: false, description: 'Tapping the voice-mode (audio-lines) button. The AI chat uses it to open voice mode (19691:50951).' },
      { name: 'onSubmit', type: '(value: string) => void', required: false, description: 'Fires on Enter, on the submit arrow, and on Stop→send with a non-empty value.' },
    ],
    tokens: ['--bv-white', '--bv-radius-full', '--bv-neutral-200', '--bv-neutral-400', '--bv-black', '--bv-inset-accent', '--bv-info-100', '--bv-info-400'],
    icons: ['Plus', 'Mic', 'AudioLines', 'Search', 'ArrowUp'],
    flutterNote:
      'The gradient ring is a padding trick (gradient background + inset white container). Flutter has no gradient BoxBorder — wrap a Container with a gradient decoration around an inset white Container, or paint it. The `search` variant is a normal 1px Border, so it needs no such trick. The rotation is one AnimationController on a 6s repeat() driving the gradient transform — do NOT rebuild the gradient with new colours per frame; the colours never change, only the angle.',
    preview: (
      <div style={{ width: 340, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* voiceTranscript arms the mic — tap it to see the recording pill */}
        <PromptBox placeholder="New onboarded restaurants..." voiceTranscript="Happy Lambs Hot Pot" />
        <PromptBox variant="search" placeholder="Search a restaurant" />
      </div>
    ),
    previewBg: 'light',
  },
  {
    id: 'bottom-nav',
    name: 'BottomNav',
    figmaNodes: ['19453:11130'],
    file: 'src/demo/components/BottomNav.tsx',
    summary:
      'Five-slot primary navigation inside the frosted dock. Four Lucide icons plus the profile avatar.',
    usedOn: ['Home'],
    props: [
      { name: 'active', type: "'map' | 'friends' | 'scan' | 'rewards' | 'profile'", required: true, description: 'Currently selected destination.' },
      { name: 'onSelect', type: '(id: NavId) => void', required: true, description: 'Fires with the tapped destination id.' },
    ],
    tokens: ['--bv-black', '--bv-radius-full'],
    icons: ['Map', 'UsersRound', 'ScanQrCode', 'CircleStar'],
    flutterNote:
      'Figma shows no explicit active state; the dimming of inactive items is an addition for the demo. Confirm the intended selected treatment before building.',
    preview: (
      <div style={{ width: 340 }}>
        <BottomNav active="map" onSelect={() => {}} />
      </div>
    ),
    previewBg: 'light',
  },
  {
    id: 'button',
    name: 'Button',
    figmaNodes: ['1344:21875'],
    file: 'src/demo/components/Button.tsx',
    summary:
      'Full-width dark CTA. `ButtonAccent` marks the highlighted run inside the label — Figma paints it primary-500 within the same text node. `lg` is 48px tall at radius 16; `sm` hugs its label at radius 8.',
    usedOn: ['Combined Spendable sheet', 'Promotions'],
    props: [
      { name: 'children', type: 'ReactNode', required: true, description: 'Label content. Wrap the highlighted part in <ButtonAccent>.' },
      { name: 'size', type: "'lg' | 'sm'", required: false, description: "Defaults to 'lg' — full width, 48px, radius 16. 'sm' hugs its label at radius 8." },
      { name: 'variant', type: "'solid' | 'outline' | 'success'", required: false, description: "Fill. Defaults to 'solid' (black + the accent effect). 'outline' is white on a 0.5px border-strong hairline; 'success' is success-400 with white text." },
      { name: 'icon', type: 'ReactNode', required: false, description: 'Trailing icon, e.g. the check on "Activated".' },
      { name: 'onClick', type: '() => void', required: false, description: 'Tap handler.' },
    ],
    tokens: ['--bv-black', '--bv-text-on-inverse', '--bv-primary-500', '--bv-success-400', '--bv-border-strong', '--bv-inset-accent', '--bv-radius-2xl', '--bv-radius-lg', '--bv-space-1-5', '--bv-space-3', '--bv-line-20'],
    icons: ['Check'],
    flutterNote:
      'The solid fill carries the "accent" effect (--bv-inset-accent, or the .bv-accent class) — the black lip and white catch-light that make the pill read as raised. It is the same effect as the prompt box voice button and the challenge progress fill; a flat #202020 is wrong. `outline` and `success` carry no inset. The `lg` radius is 16, not the 12 Figma specifies — an explicit direction from Siya, alongside raising the Combined Spendable sheet to 36. Worth updating the Figma component.',
    preview: (
      <div style={{ width: 340, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
        <Button>
          Top up now • <ButtonAccent>Bonus + $80</ButtonAccent>
        </Button>
        <Button size="sm">Top up now</Button>
        <Button size="sm" variant="outline">Activate it</Button>
        <Button size="sm" variant="success" icon={<Check size={16} strokeWidth={2.2} />}>
          Activated
        </Button>
      </div>
    ),
    previewBg: 'light',
  },
  {
    id: 'balance-row',
    name: 'BalanceRow',
    figmaNodes: ['19564:172059', '19564:172067'],
    file: 'src/demo/components/BalanceRow.tsx',
    summary:
      'A single balance line: name and description on the left, amount and chevron on the right. Drills into that balance’s detail screen.',
    usedOn: ['Combined Spendable sheet'],
    props: [
      { name: 'label', type: 'string', required: true, description: 'Balance name, e.g. "Balance".' },
      { name: 'sublabel', type: 'string', required: true, description: 'Where the money comes from, e.g. "Earned from payments".' },
      { name: 'amount', type: 'string', required: true, description: 'Pre-formatted amount — use formatMoney().' },
      { name: 'onClick', type: '() => void', required: false, description: 'Opens the balance detail screen (not yet designed).' },
    ],
    tokens: ['--bv-black', '--bv-neutral-400', '--bv-space-1'],
    icons: ['ChevronRight'],
    preview: (
      <div style={{ width: 340 }}>
        <BalanceRow label="Balance" sublabel="Top-up balance" amount="$2916.12" />
      </div>
    ),
    previewBg: 'light',
  },
  {
    id: 'spendable-sheet',
    name: 'SpendableSheet',
    figmaNodes: ['19564:172054'],
    file: 'src/demo/components/SpendableSheet.tsx',
    summary:
      'The Combined Spendable popup, opened from either balance pill. Shows the total, the two balances behind it, and the top-up CTA. The total is derived from the two amounts, never authored.',
    usedOn: ['Home'],
    props: [
      { name: 'balance', type: 'number', required: true, description: 'Top-up balance.' },
      { name: 'bonus', type: 'number', required: true, description: 'Bonus earned from payments.' },
      { name: 'topUpBonus', type: 'string', required: true, description: 'The bonus the CTA advertises, e.g. "$80".' },
      { name: 'onSelectBalance', type: '() => void', required: false, description: 'Tap on the Balance row.' },
      { name: 'onSelectBonus', type: '() => void', required: false, description: 'Tap on the Bonus row.' },
      { name: 'onTopUp', type: '() => void', required: false, description: 'Tap on the CTA.' },
    ],
    tokens: ['--bv-white', '--bv-space-4', '--bv-space-1-5', '--bv-border-subtle'],
    icons: ['ChevronRight'],
    flutterNote:
      'Two off-scale values here. The corner radius is 36 — Figma says 16, softened to 24 and then to 36 at Siya’s direction — and the radius scale stops at 24 (radius-3xl), so it is a literal. The 20px gap between the card’s three blocks is likewise off-scale (no spacing-5; the scale jumps 16 → 24). Either add both tokens in Figma or snap the design to the scale. The screen owns placement and the scrim, not this component.',
    preview: (
      <div style={{ width: 340 }}>
        <SpendableSheet balance={2916.12} bonus={140.88} topUpBonus="$80" />
      </div>
    ),
    previewBg: 'map',
  },
  {
    id: 'coin',
    name: 'Coin',
    figmaNodes: ['19564:172572'],
    file: 'src/demo/components/Coin.tsx',
    summary:
      'The Bravo coin — gold disc plus white rosette. One component at every size: the rosette is placed in percentages, so 19px in a balance pill and 42px in a promotion card use the same rule.',
    usedOn: ['Home', 'Combined Spendable sheet', 'Featured promotions'],
    props: [
      { name: 'size', type: 'number', required: false, description: 'Edge length in px. Default 19 (balance pill).' },
    ],
    tokens: [],
    icons: [],
    preview: (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
        <Coin />
        <Coin size={30} />
        <Coin size={42} />
      </div>
    ),
    previewBg: 'light',
  },
  {
    id: 'promo-chip',
    name: 'PromoChip',
    figmaNodes: ['19453:10434'],
    file: 'src/demo/components/PromoChip.tsx',
    summary:
      'Orange "My offers?" chip that leads the suggestion row while a promotion is live. Opens the featured promotions sheet.',
    usedOn: ['Home (promotion state)'],
    props: [
      { name: 'label', type: 'string', required: false, description: 'Chip copy. Default "My offers?".' },
      { name: 'onClick', type: '() => void', required: false, description: 'Opens the promotions sheet.' },
    ],
    tokens: ['--bv-orange-bright', '--bv-inset-bubble', '--bv-radius-xl', '--bv-radius-md', '--bv-space-2', '--bv-space-3'],
    icons: [],
    flutterNote:
      'Figma sets this chip in Inter Bold while the rest of the app is DM Sans — implemented in DM Sans so it matches the chips beside it. Confirm which is intended.',
    preview: <PromoChip />,
    previewBg: 'light',
  },
  {
    id: 'promo-card',
    name: 'PromoCard',
    figmaNodes: ['19564:172570', '19564:172586'],
    file: 'src/demo/components/PromoCard.tsx',
    summary:
      'A single offer: coin, headline, expiry, T&C line and a Top up CTA. The two instances in Figma differ only in how the expiry is shown, which is the `expiryStyle` variant.',
    usedOn: ['Featured promotions'],
    props: [
      { name: 'title', type: 'string', required: true, description: 'Offer headline, e.g. "Top up $200 and get $13 bonus".' },
      { name: 'expiry', type: 'string', required: true, description: 'Expiry copy, pre-formatted.' },
      { name: 'expiryStyle', type: "'text' | 'badge'", required: false, description: "'text' puts a grey line under the title; 'badge' puts a neutral pill above it. Default 'text'." },
      { name: 'onTopUp', type: '() => void', required: false, description: 'Tap on the CTA.' },
    ],
    tokens: ['--bv-white', '--bv-radius-3xl', '--bv-radius-full', '--bv-neutral-150', '--bv-neutral-500', '--bv-zinc-500', '--bv-space-1-5', '--bv-space-3'],
    icons: [],
    flutterNote:
      'The card radius is 24 (radius-3xl), not the 16 Figma specifies — an explicit direction from Siya, set alongside raising the sheet around it to 26. Worth updating the Figma node.',
    preview: (
      <div style={{ width: 340, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <PromoCard title="Top up $200 and get $13 bonus" expiry="Expired on 2026/10/12" />
        <PromoCard title="Top up $100 and get $6 bonus" expiry="Expired on 2026/10/12" expiryStyle="badge" />
      </div>
    ),
    previewBg: 'light',
  },
  {
    id: 'person-row',
    name: 'PersonRow',
    figmaNodes: ['19380:5763', '19559:167807'],
    file: 'src/demo/components/PersonRow.tsx',
    summary:
      'A person in the search results: avatar, name, visited/posts line, and a follow control. The four follow states are the only thing that varies between the two Figma nodes.',
    usedOn: ['Home search'],
    props: [
      { name: 'name / avatar / visited / posts', type: 'string | number', required: true, description: 'The person.' },
      { name: 'follow', type: "'follow' | 'follow-back' | 'following' | 'mutual'", required: true, description: 'Drives the button colour and label.' },
      { name: 'onToggleFollow', type: '() => void', required: false, description: 'Tap on the follow control.' },
    ],
    tokens: ['--bv-primary-500', '--bv-neutral-100', '--bv-neutral-500', '--bv-black', '--bv-inset-bubble'],
    icons: [],
    flutterNote:
      'The avatar is a 35×47 rounded portrait at radius 100, not a circle — the same shape as every other avatar in the app (30×40 in a post, 61×82 on the rail, 48×64 in the challenge stack). Colour carries the meaning and must survive translation: yellow = an action available to you (Follow, Follow back); grey = you are already connected (Unfollow, Mutual). These are the shared Button at size="sm" with variant primary/quiet, not a bespoke control. The followed state reads "Unfollow" rather than Figma\'s "Following" — an explicit direction from Siya: once you are following, the useful thing to show is the way out, since the state is already visible from the grey fill. The label changes width between states, so it crossfades through a 2px blur — a hard swap reads as two objects rather than one control changing.',
    preview: (
      <div style={{ width: 340, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(['follow', 'follow-back', 'following', 'mutual'] as const).map((f) => (
          <PersonRow key={f} name="happy1" avatar={avatarHappy1} visited={73} posts={15} follow={f} />
        ))}
      </div>
    ),
    previewBg: 'light',
  },
  {
    id: 'search-tabs',
    name: 'SearchTabs',
    figmaNodes: ['19542:163501'],
    file: 'src/demo/components/SearchTabs.tsx',
    summary:
      'All / Restaurant / People filter pills in the search sheet. Same pill box as FilterChip, but the active one is neutral-800 with the accent-pressed inset instead of bubble.',
    usedOn: ['Home search'],
    props: [
      { name: 'active', type: "'all' | 'restaurant' | 'people'", required: true, description: 'Selected filter.' },
      { name: 'onSelect', type: '(id) => void', required: true, description: 'Fires with the tapped filter.' },
    ],
    tokens: ['--bv-neutral-100', '--bv-neutral-800', '--bv-white', '--bv-radius-full', '--bv-space-1-5', '--bv-space-3'],
    icons: [],
    flutterNote:
      'The dark fill is one shared element that travels between pills (layoutId), not a per-pill colour swap — it should be a Hero/AnimatedPositioned in Flutter, not an AnimatedContainer per pill. The active inset is "accent-pressed" (a single black inset), not the two-part accent the raised controls use.',
    preview: <SearchTabsPreview />,
    previewBg: 'light',
  },
  {
    id: 'prompt-starter',
    name: 'PromptStarter',
    figmaNodes: ['1363:3722'],
    file: 'src/demo/components/PromptStarter.tsx',
    summary:
      'A suggested query above the prompt box when the search sheet is empty. Unlike SuggestionChip it carries no thumbnail — just the label on a neutral-100 pill with the bubble inset.',
    usedOn: ['Home search'],
    props: [
      { name: 'label', type: 'string', required: true, description: 'The suggested query.' },
      { name: 'onSelect', type: '() => void', required: false, description: 'Fills the prompt box with the label.' },
    ],
    tokens: ['--bv-neutral-100', '--bv-radius-xl', '--bv-inset-bubble', '--bv-space-3', '--bv-line-20'],
    icons: [],
    flutterNote:
      'Figma annotation on 19380:5453: these are tied to user behaviour — time, location, budget, friend visits, trending campaign — so they are LLM-generated per user, not a fixed list.',
    preview: (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
        <PromptStarter label="Best dim sum in Richmond" />
        <PromptStarter label="Quiet cafe for work" />
      </div>
    ),
    previewBg: 'light',
  },
  {
    id: 'expiry-pill',
    name: 'ExpiryPill',
    figmaNodes: ['19299:7837', '19344:8461'],
    file: 'src/demo/components/ExpiryPill.tsx',
    summary:
      'The neutral "Expired on …" pill. Extracted because the offer card and the promo card use an identical box, so there is one definition of it.',
    usedOn: ['Offers for you'],
    props: [
      { name: 'children', type: 'string', required: true, description: 'Expiry copy, pre-formatted.' },
    ],
    tokens: ['--bv-neutral-150', '--bv-black', '--bv-radius-full', '--bv-space-1-5', '--bv-space-2'],
    icons: [],
    preview: <ExpiryPill>Expired on 2026/10/12</ExpiryPill>,
    previewBg: 'light',
  },
  {
    id: 'offer-card',
    name: 'OfferCard',
    figmaNodes: ['19243:4657', '19650:15243'],
    file: 'src/demo/components/OfferCard.tsx',
    summary:
      'A merchant offer in the offers sheet: 97×108 photo with the boosted rate burned into a bottom gradient and the rate it replaces struck through beside it, then the expiry pill, name/meta, and an Activate CTA that flips to a green "Activated" state.',
    usedOn: ['Offers for you'],
    props: [
      { name: 'offer', type: 'Offer', required: true, description: 'merchant, meta, photo, rate, baseRate, expiry.' },
      { name: 'activated', type: 'boolean', required: false, description: 'Swaps the outline CTA for the success one. The sheet owns this state.' },
      { name: 'onActivate', type: '() => void', required: false, description: 'Tap on "Activate it".' },
    ],
    tokens: ['--bv-radius-xl', '--bv-neutral-500', '--bv-black', '--bv-white', '--bv-success-400', '--bv-border-strong', '--bv-space-3'],
    icons: ['Check'],
    flutterNote:
      'The struck-through old rate next to the boosted one is the whole pitch of the card — do not drop it. The right column is space-between against the photo’s full height, so rows stay aligned however long the merchant name runs. Both CTA states are the shared Button at size="sm": variant="outline" then variant="success".',
    preview: (
      <div style={{ width: 340, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <OfferCard offer={DEMO_OFFER} />
        <OfferCard offer={DEMO_OFFER} activated />
      </div>
    ),
    previewBg: 'light',
  },
  {
    id: 'offers-sheet',
    name: 'OffersSheet',
    figmaNodes: ['19243:4646', '19650:15069'],
    file: 'src/demo/components/OffersSheet.tsx',
    summary:
      'The "Offers for you" bottom sheet, opened from the PromoChip. Slides up over the dock and carries both sections: the activatable merchant offers, then the top-up promotions. Replaced the old centred PromoSheet modal.',
    usedOn: ['Home (promotion state)'],
    props: [
      { name: 'offers', type: 'Offer[]', required: true, description: 'The merchant offers at the top of the sheet.' },
      { name: 'promotions', type: 'Promotion[]', required: true, description: 'The top-up promotions under them — id, title, expiry, expiryStyle.' },
      { name: 'onClose', type: '() => void', required: false, description: 'Close button, drag-down dismiss, and the tap-catcher.' },
      { name: 'onTopUp', type: '(id: string) => void', required: false, description: 'Fires with the tapped promotion id.' },
    ],
    tokens: ['--bv-radius-3xl', '--bv-radius-full', '--bv-neutral-300', '--bv-neutral-500', '--bv-black', '--bv-space-4', '--bv-space-8'],
    icons: ['X'],
    flutterNote:
      'The surface is rgba(255,255,255,0.9) over a 7.5px backdrop blur — the map must read through it, so a plain white fill is wrong. Fixed 636px tall with the two sections scrolling inside. There is NO scrim in the design: the map stays undimmed, and the full-bleed catcher behind the sheet is transparent, existing only so a tap outside closes it. The handle is a real affordance — drag down past 120px or flick at 500px/s to dismiss.',
    preview: (
      <div style={{ position: 'relative', width: 402, height: 480, overflow: 'hidden' }}>
        <OffersSheet offers={[DEMO_OFFER]} promotions={DEMO_PROMOTIONS} />
      </div>
    ),
    previewBg: 'map',
  },
  {
    id: 'section-tabs',
    name: 'SectionTabs',
    figmaNodes: ['19564:171669'],
    file: 'src/demo/components/SectionTabs.tsx',
    summary:
      'Feed switcher on the social page — "For you" / "Friends", with a 2px rule under the active tab. The only place in the app set in Boldonse.',
    usedOn: ['Social'],
    props: [
      { name: 'tabs', type: '{ id, label }[]', required: true, description: 'Tab definitions in order.' },
      { name: 'active', type: 'string', required: true, description: 'Selected tab id.' },
      { name: 'onSelect', type: '(id) => void', required: true, description: 'Fires with the tapped tab id.' },
    ],
    tokens: ['--bv-font-display', '--bv-black', '--bv-neutral-500', '--bv-space-1'],
    icons: [],
    flutterNote:
      'Boldonse is a second font family, loaded from Google Fonts alongside DM Sans. It has a single weight (400) — do not synthesise bold. Bundle the TTF in the Flutter app.',
    preview: (
      <div style={{ width: 220 }}>
        <SectionTabs
          tabs={[
            { id: 'foryou', label: 'For you' },
            { id: 'friends', label: 'Friends' },
          ]}
          active="foryou"
          onSelect={() => {}}
        />
      </div>
    ),
    previewBg: 'light',
  },
  {
    id: 'achievement-label',
    name: 'AchievementLabel',
    figmaNodes: ['306:8847'],
    file: 'src/demo/components/AchievementLabel.tsx',
    summary:
      'Tiny status pills beside a username. The complete DS set: one streak variant plus levels 1–7. Every variant shares the same box — 12px DM Sans Bold, 2px/6px padding, radius-full — and differs only in tint pair and glyph.',
    usedOn: ['Social'],
    props: [
      { name: 'value', type: 'string', required: true, description: 'StreakLabel only — the multiplier, e.g. "8X".' },
      { name: 'level', type: "'lv1' … 'lv7'", required: true, description: 'LevelLabel only — picks the tint pair and laurel glyph; the caption is derived.' },
    ],
    tokens: ['--bv-radius-full'],
    icons: [],
    flutterNote:
      'Every tint is a one-off from the DS, not a palette token — lv6 and lv7 are gradients, not flat fills. Each level also has its OWN laurel artwork (7 separate exports), so the glyph cannot be recoloured programmatically. Streak reads #fff2de/#cc7700, which is rgba(254,167,36,0.15) flattened over white.',
    preview: (
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <StreakLabel value="10X" />
        {ALL_LEVELS.map((lv) => (
          <LevelLabel key={lv} level={lv} />
        ))}
      </div>
    ),
    previewBg: 'light',
  },
  {
    id: 'venue-card',
    name: 'VenueCard',
    figmaNodes: ['19577:173665'],
    file: 'src/demo/components/VenueCard.tsx',
    summary:
      'The place tagged in a post: 79×58 thumbnail with the cashback badge overlaid, name and meta line, and a bookmark action. Sits in a neutral-150 hairline border, not a filled card. The bookmark is a live toggle — tap it.',
    usedOn: ['Social'],
    props: [
      { name: 'venue', type: 'Venue', required: true, description: 'name, meta, thumbnail, cashback.' },
      { name: 'onSave', type: '(saved: boolean) => void', required: false, description: 'Fires on each tap with the new saved state.' },
    ],
    tokens: ['--bv-neutral-150', '--bv-neutral-500', '--bv-black', '--bv-radius-lg', '--bv-radius-md', '--bv-space-2'],
    icons: ['Bookmark'],
    flutterNote:
      'The cashback badge is body/lg (16px) on 2px/8px padding — deliberately larger than the 12px meta line beneath it. The bookmark uses CircleIconButton with `flat`: no drop shadow inside the bordered card. Its icon is a SaveGlyph, so it fills and pops exactly like the merchants list; the press comes from .bv-circle-btn:active (0.94), that component’s existing house style.',
    preview: (
      <div style={{ width: 332 }}>
        <VenueCard venue={DEMO_VENUE} />
      </div>
    ),
    previewBg: 'light',
  },
  {
    id: 'leaderboard-rail',
    name: 'LeaderboardRail',
    figmaNodes: ['19564:171678'],
    file: 'src/demo/components/LeaderboardRail.tsx',
    summary:
      'Horizontally scrolling row of 61×82 portrait avatars with a name under each, under the Leaderboard heading.',
    usedOn: ['Social'],
    props: [
      { name: 'entries', type: 'LeaderboardEntry[]', required: true, description: 'id, name and avatar per person.' },
      { name: 'onSelect', type: '(id: string) => void', required: false, description: 'Fires with the tapped person id.' },
    ],
    tokens: ['--bv-black'],
    icons: [],
    flutterNote:
      'Avatars are 61×82 with a 100px radius — a rounded portrait, not a circle. Use BoxFit.cover so faces are not distorted.',
    preview: (
      <LeaderboardRail
        entries={[
          { id: '1', name: 'happy1', avatar: avatarHappy1 },
          { id: '2', name: 'happy000', avatar: avatarHappy000 },
          { id: '3', name: 'happyman', avatar: avatarHappyman },
        ]}
      />
    ),
    previewBg: 'light',
  },
  {
    id: 'post-card',
    name: 'PostCard',
    figmaNodes: ['19582:176666'],
    file: 'src/demo/components/PostCard.tsx',
    summary:
      'A social feed post. One component covers all six variants in the design — the shell never changes, only what sits between the caption and the actions. The three comment variants (text+images / text only / images only) are not code paths; they fall out of which content fields are present.',
    usedOn: ['Social'],
    props: [
      { name: 'post', type: 'Post', required: true, description: 'author, avatar, streak, level, date, and then any of caption / venue / photos / achievement.' },
      { name: 'onComment', type: '() => void', required: false, description: 'Comment icon tap. Hidden on achievement posts.' },
      { name: 'onLike', type: '() => void', required: false, description: 'Heart tap — the heart itself is the LikeButton component (see its own entry).' },
      { name: 'onSaveVenue', type: '() => void', required: false, description: 'Bookmark on the venue card.' },
    ],
    tokens: ['--bv-neutral-150', '--bv-neutral-400', '--bv-neutral-500', '--bv-radius-2xl', '--bv-radius-lg', '--bv-space-1', '--bv-space-2', '--bv-space-4'],
    icons: ['MessageSquare', 'Heart', 'Bookmark'],
    flutterNote:
      'Avatar is 30×40 (rounded portrait); the leaderboard uses 61×82 — same shape, two sizes. Photos are 280×302 at radius 16 with a 15px gutter. Body column is 332px (370 − 30 − 8). Achievement posts set the caption to 12px and drop the comment action, keeping only the heart.',
    preview: (
      <div style={{ width: 370, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PostCard
          post={{
            id: 'pv-1',
            author: 'Noooodle123',
            avatar: avatarHappy1,
            streak: '2X',
            level: 'lv1',
            date: 'Jun 3, 2026',
            caption: 'Best Cantonese cafe, will come again soon next time when my fam visit',
            venue: DEMO_VENUE,
            photos: [socialPhoto, socialPhoto],
          }}
        />
        <PostCard
          post={{
            id: 'pv-2',
            author: 'Emma',
            avatar: avatarHappy000,
            streak: '8X',
            level: 'lv6',
            date: 'Jun 3, 2026',
            caption: 'Text only — no photo rail, just the tagged venue.',
            venue: DEMO_VENUE,
          }}
        />
        <PostCard
          post={{
            id: 'pv-3',
            author: 'catTheFood',
            avatar: avatarHappyman,
            streak: '8X',
            level: 'lv6',
            date: 'Jun 3, 2026',
            venue: DEMO_VENUE,
            photos: [socialPhoto, socialPhoto],
          }}
        />
      </div>
    ),
    previewBg: 'light',
  },
  {
    id: 'like-button',
    name: 'LikeButton',
    figmaNodes: ['19577:173449'],
    file: 'src/demo/components/LikeButton.tsx',
    summary:
      'The heart action on a post, with its like burst and count. Comment and Like both sit at 20px in neutral-500 (not black). On tap the glyph fills red (#c51f1f) and pops 1 → 1.2 → 1, a count appears to its right (gray, 8px gap), and two small red hearts drift up out of the heart. The burst is one of five hand-tuned shapes chosen at random each like, so the path is never the same twice; every track eases in and out so the hearts lift and settle softly. Skipped under prefers-reduced-motion.',
    usedOn: ['Social'],
    props: [
      { name: 'likes', type: 'number', required: false, description: 'Existing likes the tap adds to. Defaults to 0, so liking reads "1".' },
      { name: 'onLike', type: '() => void', required: false, description: 'Fires on each tap (like and unlike).' },
    ],
    tokens: ['--bv-neutral-500', '--bv-radius-full', '--bv-space-2'],
    icons: ['Heart'],
    flutterNote:
      'The liked colour is one --bv-like-color (#c51f1f) shared by the glyph fill and every particle; the count stays neutral-500 even while the heart is red. The five burst shapes live in a BURSTS table — pick one at random per like rather than computing a fresh arc, and animate each particle x/y with an ease-in-out curve. Centre the particles with a fixed offset, not a transform, or the animated transform will fight the centring.',
    preview: (
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: 200, gap: 16 }}>
        <LikeButton likes={0} />
      </div>
    ),
    previewBg: 'light',
  },
  {
    id: 'challenge-card',
    name: 'ChallengeCard',
    figmaNodes: ['19582:176379'],
    file: 'src/demo/components/ChallengeCard.tsx',
    summary:
      'Heads the Friends feed: who else is in the challenge (overlapping avatar stack), the name and reward, and progress toward the goal.',
    usedOn: ['Social — Friends tab'],
    props: [
      { name: 'challenge', type: 'Challenge', required: true, description: 'name, participantsLabel, participants[], reward, spent, goal, expires.' },
    ],
    tokens: ['--bv-white', '--bv-radius-2xl', '--bv-font-display', '--bv-inset-bubble', '--bv-inset-accent', '--bv-space-3', '--bv-space-4'],
    icons: [],
    flutterNote:
      'The challenge name and reward are Boldonse, matching the section tabs — everything else on the card is DM Sans. Avatars are 48×64 overlapping by 15px, each with a 2px white ring (border-box, so the ring is inside the 48×64) and the same bubble inset as every other avatar. Two values are derived, never authored: the bar fill from spent/goal (Figma shows 50.87% where the numbers give 51.26%) and the countdown from `expires` (Figma shows "67 days left" against an expiry of 2026/12/15, which is 133 days out — computing keeps this card consistent with the detail screen, which prints the date).',
    preview: (
      <div style={{ width: 370 }}>
        <ChallengeCard
          challenge={{
            name: 'Summer Dining Challenge',
            participantsLabel: 'Bonnie and 2+ are in this challenge with you',
            participants: [avatarHappy000, avatarHappyman, avatarHappy1],
            reward: '$5',
            spent: 512.56,
            goal: 1000,
            expires: '2026/12/15',
          }}
        />
      </div>
    ),
    previewBg: 'light',
  },
  {
    id: 'profile-challenge-card',
    name: 'ProfileChallengeCard',
    figmaNodes: ['19629:11109', '19682:49505'],
    file: 'src/demo/components/ProfileChallengeCard.tsx',
    summary:
      'The challenge strip on a profile. Two modes: `active` (Profile-Public) shows an ongoing dining challenge — partner faces, "{name} and 3+ …", title, days left, progress; `start` (Profile-Sender-Private) is the invite to begin one — one face plus an add button, "You\'re eligible to start this challenge…", and an empty $1,000 goal with the reward coin. Not the feed\'s ChallengeCard, which carries a spent/goal line this drops.',
    usedOn: ['Profile'],
    props: [
      { name: 'mode', type: "'active' | 'start'", required: true, description: 'Ongoing challenge vs the start-one invite.' },
      { name: 'name', type: 'string', required: true, description: 'Whose profile — names the "{name} and 3+" line in active mode.' },
      { name: 'partners', type: 'string[]', required: true, description: 'Avatar URLs for the face stack.' },
    ],
    tokens: ['--bv-white', '--bv-radius-2xl', '--bv-font-display', '--bv-inset-bubble', '--bv-inset-accent', '--bv-neutral-300', '--bv-space-3', '--bv-space-4'],
    icons: ['Plus'],
    flutterNote:
      'Reuses the same 48×64 ringed avatars and accent-fill progress bar as the feed ChallengeCard. The progress and $0/$1,000 in start mode are illustrative (near-empty); active mode hardcodes the Figma 50.87%. The reward coin is the shared Coin component.',
    preview: (
      <div style={{ width: 370, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ProfileChallengeCard
          mode="active"
          name="Bobby"
          partners={[avatarHappy1, avatarHappyman, avatarHappy000, avatarHappy1]}
        />
        <ProfileChallengeCard
          mode="start"
          name="Bobby"
          partners={[avatarHappy1, avatarHappyman]}
        />
      </div>
    ),
    previewBg: 'light',
  },
  {
    id: 'achievement-panel',
    name: 'AchievementPanel',
    figmaNodes: ['19582:177102', '19582:177255', '19582:177401'],
    file: 'src/demo/components/AchievementPanel.tsx',
    summary:
      'The 230px tinted panel inside an achievement post. Three kinds: a spend badge, a streak flame, and a bonus — where the panel carries the live Bravo coin.',
    usedOn: ['Social'],
    props: [
      { name: 'achievement', type: "{ kind: 'spend' | 'streak', label } | { kind: 'bonus', amount }", required: true, description: 'Picks the tint and the artwork. `bonus` engraves its amount on the coin.' },
    ],
    tokens: ['--bv-radius-2xl', '--bv-radius-xl'],
    icons: [],
    flutterNote:
      'Tints are one-off: spend #f8f5ff at radius 16, streak #fff9ea at radius 12, bonus #fffae3 at radius 12. The bonus panel hosts BravoCoin — a real 3D object, not an image: drag to spin, tap to flip, amount engraved on the back. Its physics has a 1:1 Dart twin in the bravo-coin repo (flutter/bravo_coin.dart) — mirror any tuning change there.',
    preview: (
      <div style={{ width: 332, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AchievementPanel achievement={{ kind: 'spend', label: 'Unlocked Master!' }} />
        <AchievementPanel achievement={{ kind: 'streak', label: '5-month streak!' }} />
        <AchievementPanel achievement={{ kind: 'bonus', amount: 5 }} />
      </div>
    ),
    previewBg: 'light',
  },
  {
    id: 'save-glyph',
    name: 'SaveGlyph',
    figmaNodes: [],
    file: 'src/demo/components/SaveGlyph.tsx',
    summary:
      'The bookmark in its saved and unsaved states. Extracted so every save control animates identically — MerchantRow’s own 30px button and the 35px CircleIconButton on VenueCard both render this. Saved fills with #202020 over 0.22s and pops the glyph 1 → 1.28 → 1.',
    usedOn: ['Social', 'Eligible merchants'],
    props: [
      { name: 'saved', type: 'boolean', required: true, description: 'Drives both the fill and the pop. The host owns the state.' },
      { name: 'size', type: 'number', required: false, description: 'Icon size in px. Defaults to 20 — both current hosts use it.' },
    ],
    tokens: ['--bv-black'],
    icons: ['Bookmark'],
    flutterNote:
      'The fill is set in CSS, not through Lucide’s `fill` prop: Lucide writes fill="none" as a presentation attribute and a CSS rule outranks it, which is what makes the fill transition instead of snapping. The pop sits on its own layer so it never fights the press transform on the host button.',
    preview: (
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', color: 'var(--bv-black)' }}>
        <SaveGlyph saved={false} />
        <SaveGlyph saved />
      </div>
    ),
    previewBg: 'light',
  },
  {
    id: 'screen-nav',
    name: 'ScreenNav',
    figmaNodes: ['19608:9127', '19612:9480'],
    file: 'src/demo/components/ScreenNav.tsx',
    summary:
      'The header every pushed screen wears: a borderless 32px back button, 6px gap, and a Boldonse 14px title. Identical on the challenge detail and the merchants list, so it is one component. An optional trailing label sits at the right edge in the same type as the title — the challenge detail uses it for "Invited: 3/3".',
    usedOn: ['Challenge detail', 'Eligible merchants'],
    props: [
      { name: 'title', type: 'string', required: true, description: 'Screen title, in the display face.' },
      { name: 'trailing', type: 'string', required: false, description: 'Right-aligned label, same type as the title. Omitted on screens that have no count to show.' },
      { name: 'onBack', type: '() => void', required: true, description: 'Pops the screen.' },
    ],
    tokens: ['--bv-font-display', '--bv-black', '--bv-radius-full', '--bv-space-1-5', '--bv-space-4'],
    icons: ['ArrowLeft'],
    flutterNote:
      'The 65px top margin is not padding to taste — it is 59 (status bar) + 6 (Figma gap), so the row clears the dynamic island. On a device use the real safe-area inset instead of the literal. The trailing label is pushed by a margin-left:auto, not by spreading the row — the title must keep its 6px gap from the back button, so in Flutter use a Spacer between the title and the trailing Text rather than spaceBetween.',
    preview: (
      <div style={{ width: 370 }}>
        <ScreenNav title="Challenge" trailing="Invited: 3/3" onBack={() => {}} />
      </div>
    ),
    previewBg: 'light',
  },
  {
    id: 'merchant-row',
    name: 'MerchantRow',
    figmaNodes: ['19612:9555'],
    file: 'src/demo/components/MerchantRow.tsx',
    summary:
      'A row in the eligible-merchants list: a 79×89 photo with the cashback rate burned into a bottom gradient, the name and meta line, the faces of people who saved it, and a save button. The bookmark is a live toggle — tap to fill it and bump the count.',
    usedOn: ['Eligible merchants'],
    props: [
      { name: 'merchant', type: 'Merchant', required: true, description: 'name, meta, photo, cashback, savers[], savedCount.' },
    ],
    tokens: ['--bv-radius-xl', '--bv-radius-full', '--bv-neutral-500', '--bv-black', '--bv-white', '--bv-inset-bubble', '--bv-space-3'],
    icons: ['Bookmark'],
    flutterNote:
      'Unlike VenueCard, this save button KEEPS its 0/5/4 rgba(0,0,0,0.15) shadow — on plain white there is no border to separate it from the row. The rate overlay is a 0.9px backdrop blur over a transparent → rgba(0,0,0,0.9) gradient on the bottom 31px of the photo, so it needs a BackdropFilter inside the ClipRRect, not just a gradient. Saving fills the bookmark with #202020 over 0.22s, pops the glyph 1 → 1.28 → 1, and increments the count — the demo holds that state locally; the real app should drive it from the save API and treat the bump as optimistic.',
    preview: (
      <div style={{ width: 370 }}>
        <MerchantRow
          merchant={{
            id: 'demo',
            name: "Vera's Burger Shack Davie St",
            meta: 'Burger& Fried Chicken • $$ • 12km',
            photo: merchantPhoto,
            cashback: '3%',
            savers: [saver1, saver2, saver3],
            savedCount: 65,
          }}
        />
      </div>
    ),
    previewBg: 'light',
  },
]

// ---- Token reference --------------------------------------------------

export const COLOR_GROUPS: { title: string; source: string; tokens: string[] }[] = [
  {
    title: 'Brand',
    source: 'brand/*',
    tokens: [
      '--bv-primary-500', '--bv-primary-400', '--bv-primary-300', '--bv-primary-200', '--bv-primary-100',
      '--bv-base-500', '--bv-base-400', '--bv-base-300', '--bv-base-200', '--bv-base-100', '--bv-base-red',
    ],
  },
  {
    title: 'Theme accents',
    source: 'brand/theme/*',
    tokens: [
      '--bv-orange-bright', '--bv-orange-dark', '--bv-cyan-bright', '--bv-cyan-dark',
      '--bv-purple-bright', '--bv-purple-dark', '--bv-green-bright', '--bv-green-dark', '--bv-green-neo',
    ],
  },
  {
    title: 'Neutrals',
    source: 'grays/neutral/*',
    tokens: [
      '--bv-neutral-50', '--bv-neutral-100', '--bv-neutral-150', '--bv-neutral-200', '--bv-neutral-300',
      '--bv-neutral-400', '--bv-neutral-500', '--bv-neutral-600', '--bv-neutral-700', '--bv-neutral-800', '--bv-neutral-900',
    ],
  },
  {
    title: 'Zinc',
    source: 'grays/zinic/*',
    tokens: [
      '--bv-zinc-50', '--bv-zinc-100', '--bv-zinc-200', '--bv-zinc-300', '--bv-zinc-400',
      '--bv-zinc-500', '--bv-zinc-600', '--bv-zinc-700', '--bv-zinc-800', '--bv-zinc-900',
    ],
  },
  {
    title: 'Semantic',
    source: 'semantic/*',
    tokens: [
      '--bv-success-500', '--bv-success-300', '--bv-success-100',
      '--bv-warning-500', '--bv-warning-300', '--bv-warning-100',
      '--bv-info-500', '--bv-info-300', '--bv-info-100',
      '--bv-error-500', '--bv-error-300', '--bv-error-100',
      '--bv-store-open', '--bv-store-closed', '--bv-pay', '--bv-connected',
    ],
  },
]

export const RADIUS_TOKENS = [
  { token: '--bv-radius-sm', value: 2, figma: 'radius-2-sm' },
  { token: '--bv-radius-base', value: 4, figma: 'radius-4-base' },
  { token: '--bv-radius-md', value: 6, figma: 'radius-6-md' },
  { token: '--bv-radius-lg', value: 8, figma: 'radius-8-lg' },
  { token: '--bv-radius-xl', value: 12, figma: 'radius-12-xl' },
  { token: '--bv-radius-2xl', value: 16, figma: 'radius-16-2xl' },
  { token: '--bv-radius-3xl', value: 24, figma: 'radius-24-3xl' },
  { token: '--bv-radius-full', value: 9999, figma: 'radius-full' },
]

export const SPACING_TOKENS = [
  { token: '--bv-space-1', value: 4, figma: 'spacing-1' },
  { token: '--bv-space-1-5', value: 6, figma: 'spacing-1-5' },
  { token: '--bv-space-2', value: 8, figma: 'spacing-2' },
  { token: '--bv-space-3', value: 12, figma: 'spacing-3' },
  { token: '--bv-space-4', value: 16, figma: 'spacing-4' },
  { token: '--bv-space-6', value: 24, figma: 'spacing-6' },
  { token: '--bv-space-8', value: 32, figma: 'spacing-8' },
  { token: '--bv-space-10', value: 40, figma: 'spacing-10' },
  { token: '--bv-space-12', value: 48, figma: 'spacing-12' },
  { token: '--bv-space-16', value: 64, figma: 'spacing-16' },
]

export const TYPE_SCALE = [
  { size: 10, weight: 400, label: 'font/size/10' },
  { size: 12, weight: 400, label: 'font/size/12' },
  { size: 14, weight: 400, label: 'font/size/14 · body/md' },
  { size: 14, weight: 500, label: 'font/size/14 · medium' },
  { size: 16, weight: 700, label: 'font/size/16 · bold' },
  { size: 20, weight: 700, label: 'font/size/20' },
  { size: 24, weight: 700, label: 'font/size/24' },
  { size: 32, weight: 700, label: 'font/size/32' },
  { size: 40, weight: 700, label: 'font/size/40' },
]

// Flutter has no inset BoxShadow. The Dart below assumes
// `flutter_inset_box_shadow`, which re-exports BoxShadow with an `inset`
// flag; without it, the equivalent is a CustomPainter using
// `MaskFilter.blur(BlurStyle.inner, sigma)`.
//
// TWO GOTCHAS, both easy to miss:
//   1. Paint order is REVERSED. CSS paints the first shadow on top;
//      BoxDecoration paints the list in order, so the last entry lands on
//      top. Every Dart list below is the CSS list reversed.
//   2. `blurRadius` maps 1:1 to the CSS blur radius — do not pre-convert it
//      to a sigma, the framework does that internally.
export const EFFECT_TOKENS: {
  token: string
  figma: string
  className?: string
  description: string
  css: string
  flutter: string
  needsPackage?: boolean
}[] = [
  {
    token: '--bv-inset-bubble',
    figma: 'bubble',
    className: '.bv-bubble',
    description:
      'The light-surface treatment: white inner top light + dark inner bottom shade. Carried by every avatar and the neutral chips.',
    css: `box-shadow: inset 0 1px 4px 0 #fff,
            inset 0 -2px 5px 0 rgba(0, 0, 0, 0.1);`,
    flutter: `const bvInsetBubble = <BoxShadow>[
  // dark shade first — CSS lists it last
  BoxShadow(
    color: Color(0x1A000000),
    offset: Offset(0, -2),
    blurRadius: 5,
    inset: true,
  ),
  BoxShadow(
    color: Color(0xFFFFFFFF),
    offset: Offset(0, 1),
    blurRadius: 4,
    inset: true,
  ),
];`,
    needsPackage: true,
  },
  {
    token: '--bv-inset-accent',
    figma: 'accent-default',
    className: '.bv-accent',
    description:
      'The dark-surface treatment ("accent"): a hard black lip along the bottom and a soft white catch-light along the top, which is what makes the black pills read as raised rather than flat. Belongs on every solid dark control — the prompt box voice button, the challenge progress fill, and every solid Button. A flat #202020 is wrong.',
    css: `box-shadow: 0 -4px 4px 0 #000 inset,
            0 1px 5px 0 rgba(255, 255, 255, 0.6) inset;`,
    flutter: `const bvInsetAccent = <BoxShadow>[
  // white catch-light first — CSS lists it last
  BoxShadow(
    color: Color(0x99FFFFFF),
    offset: Offset(0, 1),
    blurRadius: 5,
    inset: true,
  ),
  BoxShadow(
    color: Color(0xFF000000),
    offset: Offset(0, -4),
    blurRadius: 4,
    inset: true,
  ),
];

// usage — the solid Button
DecoratedBox(
  decoration: BoxDecoration(
    color: const Color(0xFF202020),
    borderRadius: BorderRadius.circular(16),
    boxShadow: bvInsetAccent,
  ),
  child: ...,
);`,
    needsPackage: true,
  },
  {
    token: '--bv-inset-glow',
    figma: '(balance pill)',
    description: 'Soft white inner glow around floating pills. Single shadow, no offset.',
    css: `box-shadow: inset 0 0 6.4px 0 #fff;`,
    flutter: `const bvInsetGlow = <BoxShadow>[
  BoxShadow(
    color: Color(0xFFFFFFFF),
    blurRadius: 6.4,
    inset: true,
  ),
];`,
    needsPackage: true,
  },
  {
    token: '--bv-shadow-float',
    figma: '(top bar)',
    description:
      'Drop shadow lifting elements off the map. The only outer shadow here, so it needs no package.',
    css: `box-shadow: 0 5px 4px rgba(0, 0, 0, 0.15);`,
    flutter: `const bvShadowFloat = <BoxShadow>[
  BoxShadow(
    color: Color(0x26000000),
    offset: Offset(0, 5),
    blurRadius: 4,
  ),
];

// Where the web uses filter: drop-shadow() rather than box-shadow — the
// VenueCard/merchant save buttons — the shadow follows the painted alpha,
// not the box. That is DropShadow/Shadow on the child in Flutter, not
// BoxDecoration.boxShadow.`,
  },
]
