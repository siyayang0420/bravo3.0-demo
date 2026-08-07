// Component — Figma "In Progress Challenge" (19582:176379)
// Heads the Friends feed: who else is in it, the prize, and progress.
import Coin from './Coin'

export type Challenge = {
  name: string
  /** e.g. "Bonnie and 2+ are in this challenge with you" */
  participantsLabel: string
  /** Overlapping avatar stack, in draw order. */
  participants: string[]
  reward: string
  spent: number
  goal: number
  expires: string
}

// No thousands separator — Figma reads "$512.56/$1000", not "$1,000".
const money = (n: number) => `$${n % 1 ? n.toFixed(2) : n}`

const DAY = 86_400_000

// Derived from `expires`, not authored — same rule as the bar width. Figma
// shows "67 days left" against an expiry of 2026/12/15, which do not agree;
// computing keeps the card and the detail screen telling the same story.
// Shared with ChallengeScreen so both count down from one implementation.
export function daysLeftLabel(expires: string) {
  const ms = new Date(expires).getTime() - Date.now()
  const left = Math.max(0, Math.ceil(ms / DAY))
  return `${left} day${left === 1 ? '' : 's'} left`
}

export default function ChallengeCard({
  challenge,
  onOpen,
}: {
  challenge: Challenge
  onOpen?: () => void
}) {
  const pct = Math.max(0, Math.min(1, challenge.spent / challenge.goal))

  return (
    <div className="bv-challenge" onClick={onOpen} role={onOpen ? 'button' : undefined}>
      <div className="bv-challenge-people">
        <div className="bv-challenge-stack">
          {challenge.participants.map((src, i) => (
            <span key={i} style={{ backgroundImage: `url(${src})` }} />
          ))}
        </div>
        <p className="bv-challenge-participants">{challenge.participantsLabel}</p>
      </div>

      <div className="bv-challenge-head">
        <span className="bv-challenge-name">{challenge.name}</span>
        <span className="bv-challenge-reward">
          <Coin size={24} />
          {challenge.reward}
        </span>
      </div>

      <div className="bv-challenge-progress">
        <div className="bv-challenge-numbers">
          <span>
            {money(challenge.spent)}/{money(challenge.goal)}
          </span>
          <span>{daysLeftLabel(challenge.expires)}</span>
        </div>
        <div className="bv-challenge-track">
          {/* width is derived, never authored — see money()/pct above */}
          <div className="bv-challenge-fill" style={{ width: `${pct * 100}%` }} />
        </div>
      </div>
    </div>
  )
}
