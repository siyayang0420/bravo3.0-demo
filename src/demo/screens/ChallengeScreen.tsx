// Challenge detail — implements Figma node 19608:9122 ("Home-Default").
//
// Opened from the ChallengeCard in the Friends feed. Participants float in
// the upper half and can be dragged around; the sheet below carries the
// coin, the blurb, the progress bar and the merchant link.
import { useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import BravoCoin from '../coin/BravoCoin.jsx'
import { coinConfig } from '../coin/coinConfig.js'
import FloatingAvatar, { type Participant } from '../components/FloatingAvatar'
import ScreenNav from '../components/ScreenNav'
import { daysLeftLabel } from '../components/ChallengeCard'
import MerchantsScreen from './MerchantsScreen'
import SelectFriendsScreen from './SelectFriendsScreen'
import { type Merchant } from '../components/MerchantRow'
import challengeBg from '../assets/social/challenge-bg.svg'
import challengeBlob from '../assets/social/challenge-blob.svg'
import merchant1 from '../assets/social/merchant-1.png'
import merchant2 from '../assets/social/merchant-2.png'
import merchant3 from '../assets/social/merchant-3.png'
import merchant4 from '../assets/social/merchant-4.png'

const MERCHANTS = [merchant1, merchant2, merchant3, merchant4]

export type ChallengeDetail = {
  name: string
  blurb: string
  reward: number
  spent: number
  goal: number
  expires: string
  merchantCount: number
  /** Denominator of the nav's "Invited: n/N". */
  inviteLimit: number
  participants: Participant[]
  /** The list behind "View N eligible merchants" (Figma 19612:9472). */
  merchants: Merchant[]
}

const money = (n: number) => `$${n % 1 ? n.toFixed(2) : n}`

// The coin flips 40% quicker here than the package default, without changing
// the shape of the motion: the same physics stepped at 1/0.6 the rate. The
// impulse and the settle threshold are velocities, so they scale with the
// rate; the spring is an acceleration, so it scales with the square; friction
// is a per-frame decay, so it scales as a power.
const FLIP_RATE = 1 / 0.6
const FASTER_FLIP = {
  tapImpulse: coinConfig.tapImpulse * FLIP_RATE,
  spring: coinConfig.spring * FLIP_RATE ** 2,
  friction: coinConfig.friction ** FLIP_RATE,
  restEps: coinConfig.restEps * FLIP_RATE,
}

export default function ChallengeScreen({
  challenge,
  onBack,
  onAccept,
}: {
  challenge: ChallengeDetail
  onBack: () => void
  /** Tapping Accept on your own bubble, when you have a 'pending-you' seat. */
  onAccept?: () => void
}) {
  const playArea = useRef<HTMLDivElement>(null)
  const [merchantsOpen, setMerchantsOpen] = useState(false)
  const [invitesOpen, setInvitesOpen] = useState(false)

  // Measured here, not in the bubbles: a child's layout effect runs before
  // this ref is attached, so the children would read null and pin themselves.
  const [area, setArea] = useState({ w: 0, h: 0 })
  useLayoutEffect(() => {
    const box = playArea.current
    if (!box) return
    const measure = () =>
      setArea((prev) =>
        prev.w === box.clientWidth && prev.h === box.clientHeight
          ? prev
          : { w: box.clientWidth, h: box.clientHeight },
      )
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    return () => ro.disconnect()
  }, [])

  const pct = Math.max(0, Math.min(1, challenge.spent / challenge.goal))
  // Biggest spender wears the crown — but only once someone has actually
  // spent something. Before that everyone is tied at 0%, and `reduce` would
  // just crown whoever happens to be first in the array.
  const maxShare = Math.max(...challenge.participants.map((p) => p.share))
  const leaderId =
    maxShare > 0
      ? challenge.participants.reduce((a, b) => (b.share > a.share ? b : a)).id
      : null

  // Invites accepted, counted from the avatars actually on screen so the
  // two can never disagree. You are in the challenge, not invited to it, so
  // your own bubble does not count — and neither does the host's: whoever
  // created the challenge is always "in", not one of the invites being
  // tracked here. A pending or empty seat hasn't accepted yet, so it
  // doesn't count until it does.
  const invited = challenge.participants.filter(
    (p) => !p.isYou && !p.isHost && (p.status ?? 'accepted') === 'accepted',
  ).length

  return (
    <div className="bv-challenge-screen">
      {/* Background blobs. Two layers in Figma: the clipped "blur gb" group
          and a separate rotated ellipse that is NOT inside that clip. The
          odd inset percentages are Figma's blur bleed — the artwork extends
          well past its own box, so the box is not the visible size. */}
      <div className="bv-challenge-blobs">
        <div className="bv-blob-gb">
          <img src={challengeBg} alt="" />
        </div>
      </div>
      <div className="bv-blob-ellipse">
        <div className="bv-blob-ellipse-rot">
          <div className="bv-blob-ellipse-box">
            <img src={challengeBlob} alt="" />
          </div>
        </div>
      </div>

      {/* Invites sent, counted from the avatars actually on screen so the
          two can never disagree. You are in the challenge, not invited to
          it, so your own bubble does not count. */}
      <ScreenNav
        title="Challenge"
        trailing={`Invited: ${invited}/${challenge.inviteLimit}`}
        onBack={onBack}
      />

      {/* everything above the sheet is the drag playground */}
      <div className="bv-challenge-play" ref={playArea}>
        {challenge.participants.map((p, i) => (
          <FloatingAvatar
            key={p.id}
            participant={p}
            isLeader={p.id === leaderId}
            areaW={area.w}
            areaH={area.h}
            index={i}
            onAccept={p.status === 'pending-you' ? onAccept : undefined}
            onInvite={p.status === 'empty' ? () => setInvitesOpen(true) : undefined}
          />
        ))}
      </div>

      <section className="bv-challenge-sheet">
        <div className="bv-challenge-sheet-top">
          <div className="bv-challenge-coin">
            {/* Same coin as the feed — drag to spin, tap to flip. Here it
                rests value-side up and, two seconds in, turns away and back
                so the reward introduces itself. */}
            <BravoCoin
              value={challenge.reward}
              size={91}
              thickness={8}
              restAngle={180}
              introDelay={2000}
              {...FASTER_FLIP}
            />
          </div>

          <div className="bv-challenge-copy">
            <h2 className="bv-challenge-heading">{challenge.name}</h2>
            <p className="bv-challenge-blurb">{challenge.blurb}</p>
          </div>

          <div className="bv-challenge-progress">
            <div className="bv-challenge-numbers detail">
              <span className="bv-challenge-amount">
                {money(challenge.spent)}/{money(challenge.goal)}
              </span>
              {/* Countdown, not a date — same wording and the same shared
                  helper as the ChallengeCard in the feed. */}
              <span>{daysLeftLabel(challenge.expires)}</span>
            </div>
            <div className="bv-challenge-track">
              {/* Refills from empty on every mount — the screen unmounts on
                  back, so re-opening always replays the fill. */}
              <motion.div
                className="bv-challenge-fill"
                initial={{ width: '0%' }}
                animate={{ width: `${pct * 100}%` }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          className="bv-challenge-merchants"
          onClick={() => setMerchantsOpen(true)}
        >
          <span className="bv-challenge-merchant-stack">
            {MERCHANTS.map((m, i) => (
              <img key={i} src={m} alt="" />
            ))}
          </span>
          View {challenge.merchantCount} eligible merchants
          <ChevronRight size={16} strokeWidth={1.9} />
        </button>
      </section>

      {/* Merchants list pushes in over this screen, same as this screen
          pushes in over the feed. */}
      <AnimatePresence>
        {merchantsOpen && (
          <motion.div
            className="bv-merchants-wrap"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.7 }}
          >
            <MerchantsScreen
              merchants={challenge.merchants}
              onBack={() => setMerchantsOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite picker — pushed in from an empty seat, the same way the
          merchants list is pushed in from the merchant chip. The open seats
          are the denominator: you can fill exactly as many as are free. */}
      <AnimatePresence>
        {invitesOpen && (
          <motion.div
            className="bv-friends-wrap"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.7 }}
          >
            <SelectFriendsScreen
              limit={Math.max(1, challenge.participants.filter((p) => p.status === 'empty').length)}
              onBack={() => setInvitesOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
