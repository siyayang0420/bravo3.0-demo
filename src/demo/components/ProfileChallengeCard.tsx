// Component — the challenge strip on a profile.
//
// Three modes, all Figma:
//   'active'  (Profile-Public 19629:11109) — an ongoing challenge: a stack of
//             partner faces, "{name} and 3+ are in a dining challenge", then
//             the title, days left, and a progress bar.
//   'start'   (Profile-Sender-Private 19682:49505) — the invite to begin one:
//             YOUR OWN face plus an add button, a nudge, and an empty
//             $1,000 goal. It's your own prompt to start a challenge, so the
//             one face shown is the profile owner's, never a partner's.
//   'invited' (19696:51781) — someone invited YOU: their face, "{inviter}
//             invited you to a challenge, accept now to join {reward} extra
//             Bonus!", the title + reward, the SAME progress the 'active'
//             card shows (joining doesn't start a fresh count), then
//             Decline / Accept. What Happy (the receiver) sees on her own
//             profile, in place of the 'start' card Bobby sees.
//
// 'start' and 'invited' both open onto the pre-accept ChallengeScreen
// (Figma 19682:49684 / 19743:54823) when tapped anywhere but the action
// buttons — see `onOpen` and RECEIVER_VIEW/SENDER_VIEW in pendingChallengeDemo.
//
// It is NOT the feed's ChallengeCard (19582:176379) — that carries a reward
// coin and a spent/goal line this composition drops, so it is its own thing.
import type { ReactNode } from 'react'
import { Plus } from 'lucide-react'
import Coin from './Coin'
import Button from './Button'
import type { ProfilePerson } from '../data/profileDemo'

export type ProfileChallenge = {
  title: string
  daysLeft: number
  /** 0–1. Drives the bar; also the $spent implied in 'start' mode. */
  progress: number
}

const ACTIVE: ProfileChallenge = {
  title: 'Summer Dining Challenge',
  daysLeft: 67,
  progress: 0.5087,
}

const START: ProfileChallenge = {
  title: 'Taiwanese cuisine Challenge',
  daysLeft: 67,
  progress: 0.009,
}

// The invite is to the same challenge Bobby's own card offers to start, and
// — since Bobby and 3+ are already in it — shows the same running total as
// the 'active' card, not a fresh $0.
const INVITED_TITLE = START.title
const INVITED_SPENT = 512.56
const INVITED_GOAL = 1000
const REWARD = '$5'

// No thousands separator — Figma reads "$512.56/$1000", not "$1,000".
// Mirrors ChallengeCard's own (unexported) helper.
const money = (n: number) => `$${n % 1 ? n.toFixed(2) : n}`

type Props =
  | { mode: 'active'; name: string; partners: string[] }
  | {
      mode: 'start'
      /** The profile owner's own face — the one bubble this mode shows. */
      avatar: string
      /** Tapping the card body (not the add button) — the pre-accept detail. */
      onOpen?: () => void
    }
  | {
      mode: 'invited'
      /** Who sent the invite — their face and name in the copy. */
      inviter: ProfilePerson
      /** Tapping the card body (not Decline/Accept) — the pre-accept detail. */
      onOpen?: () => void
      onAccept?: () => void
      onDecline?: () => void
    }

export default function ProfileChallengeCard(props: Props) {
  if (props.mode === 'invited') {
    const { inviter, onOpen, onAccept, onDecline } = props
    return (
      <section className="bv-profile-challenge invited">
        <Open onOpen={onOpen}>
          <div className="bv-profile-challenge-top">
            <div className="bv-profile-challenge-stack">
              <span style={{ backgroundImage: `url(${inviter.avatar})` }} />
            </div>
            <p className="bv-profile-challenge-blurb">
              {inviter.name} invited you to a challenge, accept now to join {REWARD} extra Bonus!
            </p>
          </div>

          <div className="bv-profile-challenge-headline">
            <span className="bv-profile-challenge-title">{INVITED_TITLE}</span>
            <span className="bv-profile-challenge-reward">
              <Coin size={24} />
              {REWARD}
            </span>
          </div>

          {/* Numbers + track sit closer together than the rows around them
              (Figma's own inner group, 19741:54732) — the same tighter
              spacing 'start' uses below. */}
          <div className="bv-profile-challenge-body">
            <div className="bv-profile-challenge-numbers">
              <span>
                {money(INVITED_SPENT)}/{money(INVITED_GOAL)}
              </span>
              <span>{ACTIVE.daysLeft} days left</span>
            </div>
            <div className="bv-profile-challenge-track">
              {/* Same running total as the 'active' card's bar. */}
              <div
                className="bv-profile-challenge-fill"
                style={{ width: `${ACTIVE.progress * 100}%` }}
              />
            </div>
          </div>
        </Open>

        <div className="bv-profile-challenge-actions">
          <Button size="sm" variant="outline" onClick={onDecline}>
            Decline
          </Button>
          <Button size="sm" variant="solid" onClick={onAccept}>
            Accept
          </Button>
        </div>
      </section>
    )
  }

  if (props.mode === 'start') {
    const { avatar, onOpen } = props
    return (
      <section className="bv-profile-challenge start">
        <Open onOpen={onOpen}>
          <div className="bv-profile-challenge-top">
            <div className="bv-profile-challenge-stack">
              <span style={{ backgroundImage: `url(${avatar})` }} />
              <button
                type="button"
                className="bv-profile-challenge-add"
                aria-label="Start a challenge"
                // The add button is its own affordance, not the "view the
                // pending detail" tap the rest of the card carries.
                onClick={(e) => e.stopPropagation()}
              >
                <Plus size={20} strokeWidth={2.2} />
              </button>
            </div>
            <p className="bv-profile-challenge-blurb">
              Start a challenge with friends and earn extra rewards together
            </p>
          </div>

          {/* headline + numbers + track at the tighter 6px spacing, per the
              original node — only `top` sits at the outer 12px gap. */}
          <div className="bv-profile-challenge-body">
            <div className="bv-profile-challenge-headline">
              <span className="bv-profile-challenge-title">{START.title}</span>
              <span className="bv-profile-challenge-reward">
                <Coin size={24} />
                {REWARD}
              </span>
            </div>

            <div className="bv-profile-challenge-numbers">
              <span>$0/$1,000</span>
              <span>{START.daysLeft} days left</span>
            </div>
            <div className="bv-profile-challenge-track">
              <div
                className="bv-profile-challenge-fill"
                style={{ width: `${START.progress * 100}%` }}
              />
            </div>
          </div>
        </Open>
      </section>
    )
  }

  const { name, partners } = props

  return (
    <section className="bv-profile-challenge active">
      <div className="bv-profile-challenge-top">
        <div className="bv-profile-challenge-stack">
          {partners.map((src, i) => (
            <span key={i} style={{ backgroundImage: `url(${src})` }} />
          ))}
        </div>
        <p className="bv-profile-challenge-blurb">{name} and 3+ are in a dining challenge</p>
      </div>

      <div className="bv-profile-challenge-body">
        <div className="bv-profile-challenge-headline">
          <span className="bv-profile-challenge-title">{ACTIVE.title}</span>
          <span className="bv-profile-challenge-days">{ACTIVE.daysLeft} days left</span>
        </div>

        <div className="bv-profile-challenge-track">
          {/* Same accent fill as the feed's progress bars. */}
          <div
            className="bv-profile-challenge-fill"
            style={{ width: `${Math.max(0, Math.min(1, ACTIVE.progress)) * 100}%` }}
          />
        </div>
      </div>
    </section>
  )
}

/** The card's tappable body — a plain wrapper when there's nowhere to go. */
function Open({ onOpen, children }: { onOpen?: () => void; children: ReactNode }) {
  if (!onOpen) return <div className="bv-profile-challenge-open">{children}</div>
  return (
    <button type="button" className="bv-profile-challenge-open" onClick={onOpen}>
      {children}
    </button>
  )
}
