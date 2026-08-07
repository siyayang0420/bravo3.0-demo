// The challenge detail before anyone but the host has accepted — both sides
// of the same moment:
//
//   RECEIVER_VIEW (Figma 19743:54823) — Happy's own view. Bobby (the host)
//     is already in; Happy's own seat is pending with an Accept pill; the
//     third friend (Figma's "James", stood in with a real name below) is
//     pending too; the fourth seat is still open.
//   SENDER_VIEW   (Figma 19682:49684) — Bobby's own view of the exact same
//     challenge. His seat reads "You" and is accepted (he created it); Happy
//     and that third friend are the ones now pending; the same seat is
//     still open.
//
// Same challenge, same four seats, same positions — only whose seat reads
// "You" (and therefore which one carries the Accept pill, if any) changes.
// Opened from ProfileChallengeCard: Happy's 'invited' card into
// RECEIVER_VIEW, Bobby's 'start' card into SENDER_VIEW.
import { type ChallengeDetail } from '../screens/ChallengeScreen'
import { type Merchant } from '../components/MerchantRow'
import { DEMO_USERS } from './profileDemo'
import { PERSON } from './people'
import merchantPhoto from '../assets/social/merchant-photo.png'
import saver1 from '../assets/social/saver-1.png'
import saver2 from '../assets/social/saver-2.png'
import saver3 from '../assets/social/saver-3.png'

const bobby = DEMO_USERS.find((u) => u.id === 'bobby')!
const happy = DEMO_USERS.find((u) => u.id === 'happy')!
// Figma names this seat "James" — there's no James in the real 12-person
// cast, so Jason stands in for him here.
const thirdFriend = PERSON.jason

// Same eligible-merchants list shape as the Friends-feed challenge — see
// SocialScreen's own ELIGIBLE_MERCHANTS. Not shared code, since that one is
// private to SocialScreen.tsx (a file being edited alongside this one); the
// row shape is trivial enough that duplicating it here is cheaper than
// threading an export through a file in flux.
const MERCHANT_NAMES = [
  "Vera's Burger Shack Davie St",
  'AM Cafe Robson',
  'Kokoro Tokyo Mazesoba',
  'Sushi Mura Denman',
  'Cafe Medina',
  'Miku Waterfront',
  'The Praguery Gastown',
]

const ELIGIBLE_MERCHANTS: Merchant[] = MERCHANT_NAMES.map((name, i) => ({
  id: `pcm${i + 1}`,
  name,
  meta: 'Burger& Fried Chicken • $$ • 12km',
  photo: merchantPhoto,
  cashback: '3%',
  savers: [saver1, saver2, saver3],
  savedCount: 65,
}))

// Everything but the participants is identical between the two views — the
// challenge itself hasn't changed, only who is looking at it.
const SHARED = {
  name: 'Summer Dining Challenge',
  blurb:
    'Spend $1,000 together. Everyone earns an extra $5. Stackable with merchant bonuses. Invite up to 4 friends.',
  reward: 5,
  goal: 1000,
  // A fresh 67-day window, not the Friends-feed challenge's 2026/12/15 — the
  // sheet's "days left" is computed from this (daysLeftLabel in
  // ChallengeCard.tsx), so the date is picked to read 67 today rather than
  // the string hardcoded, the same computed-not-authored rule every other
  // challenge widget follows.
  expires: '2026/10/13',
  merchantCount: 24,
  inviteLimit: 3,
  merchants: ELIGIBLE_MERCHANTS,
}

// Both views keep all four bubbles in the TOP portion of the play area, clear
// of the Bravo coin that crowns the sheet below. A bubble is roughly 128
// artboard px tall at the 60px pending size (avatar 4/3 + name pill + the
// share line) against a ~418px play area, so the lower row is capped near
// y=258 — past that it runs under the coin. Figma's own y values sat at
// 327–358 and did exactly that; these are pulled up to match the intent
// rather than the literal coordinates.
const OPEN_SEAT = { id: 'open', name: '', avatar: '', share: 0, x: 268, y: 245, status: 'empty' } as const

/** Happy's own profile: her seat is the pending one, with the Accept pill. */
export const RECEIVER_VIEW: ChallengeDetail = {
  ...SHARED,
  // Mirrors the 'invited' card that opens it — joining accepts into a
  // challenge already in progress, so the detail must not read $0.
  spent: 512.56,
  participants: [
    { id: 'host', name: bobby.name, avatar: bobby.avatar, share: 0, x: 64, y: 138, isHost: true },
    { id: 'you', name: 'You', avatar: happy.avatar, share: 0, x: 262, y: 105, isYou: true, status: 'pending-you' },
    { id: 'third', name: thirdFriend.name, avatar: thirdFriend.avatar, share: 0, x: 73, y: 258, status: 'pending-other' },
    OPEN_SEAT,
  ],
}

/** Bobby's own profile: he created it, so his seat reads "You" and is
 *  already in — Happy and the third friend are the ones he's waiting on. */
export const SENDER_VIEW: ChallengeDetail = {
  ...SHARED,
  // Mirrors the 'start' card that opens it: nothing spent yet.
  spent: 0,
  participants: [
    { id: 'you', name: 'You', avatar: bobby.avatar, share: 0, x: 64, y: 138, isYou: true },
    { id: 'happy', name: happy.name, avatar: happy.avatar, share: 0, x: 238, y: 108, status: 'pending-other' },
    { id: 'third', name: thirdFriend.name, avatar: thirdFriend.avatar, share: 0, x: 85, y: 258, status: 'pending-other' },
    { ...OPEN_SEAT, y: 248 },
  ],
}
