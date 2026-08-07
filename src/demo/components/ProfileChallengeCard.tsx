// Component — the challenge strip on a profile.
//
// Two modes, both Figma:
//   'active' (Profile-Public 19629:11109) — an ongoing challenge: a stack of
//            partner faces, "{name} and 3+ are in a dining challenge", then
//            the title, days left, and a progress bar.
//   'start'  (Profile-Sender-Private 19682:49505) — the invite to begin one:
//            one face plus an add button, a nudge, and an empty $1,000 goal.
//
// It is NOT the feed's ChallengeCard (19582:176379) — that carries a reward
// coin and a spent/goal line this composition drops, so it is its own thing.
import { Plus } from 'lucide-react'
import Coin from './Coin'

export type ProfileChallenge = {
  /** Faces in the avatar stack. */
  partners: string[]
  title: string
  daysLeft: number
  /** 0–1. Drives the bar; also the $spent implied in 'start' mode. */
  progress: number
}

const ACTIVE: ProfileChallenge = {
  partners: [],
  title: 'Summer Dining Challenge',
  daysLeft: 67,
  progress: 0.5087,
}

const START: ProfileChallenge = {
  partners: [],
  title: 'Taiwanese cuisine Challenge',
  daysLeft: 67,
  progress: 0.009,
}

export default function ProfileChallengeCard({
  mode,
  name,
  partners,
}: {
  mode: 'active' | 'start'
  /** Whose profile — names the "{name} and 3+" line in active mode. */
  name: string
  partners: string[]
}) {
  const c = mode === 'active' ? ACTIVE : START

  return (
    <section className={`bv-profile-challenge ${mode}`}>
      <div className="bv-profile-challenge-top">
        <div className="bv-profile-challenge-stack">
          {(mode === 'active' ? partners : partners.slice(0, 1)).map((src, i) => (
            <span key={i} style={{ backgroundImage: `url(${src})` }} />
          ))}
          {mode === 'start' && (
            <button type="button" className="bv-profile-challenge-add" aria-label="Start a challenge">
              <Plus size={20} strokeWidth={2.2} />
            </button>
          )}
        </div>
        <p className="bv-profile-challenge-blurb">
          {mode === 'active'
            ? `${name} and 3+ are in a dining challenge`
            : 'You’re eligible to start this challenge. Invite your friends and complete it to earn $$$!'}
        </p>
      </div>

      <div className="bv-profile-challenge-body">
        <div className="bv-profile-challenge-headline">
          <span className="bv-profile-challenge-title">{c.title}</span>
          {mode === 'active' ? (
            <span className="bv-profile-challenge-days">{c.daysLeft} days left</span>
          ) : (
            <span className="bv-profile-challenge-reward">
              <Coin size={24} />
              $5
            </span>
          )}
        </div>

        {mode === 'start' && (
          <div className="bv-profile-challenge-numbers">
            <span>$0/$1,000</span>
            <span>{c.daysLeft} days left</span>
          </div>
        )}

        <div className="bv-profile-challenge-track">
          {/* Same accent fill as the feed's progress bars. */}
          <div
            className="bv-profile-challenge-fill"
            style={{ width: `${Math.max(0, Math.min(1, c.progress)) * 100}%` }}
          />
        </div>
      </div>
    </section>
  )
}
