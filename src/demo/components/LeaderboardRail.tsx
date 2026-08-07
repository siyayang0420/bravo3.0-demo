// Component — Figma leaderboard rail (19564:171678)
// Horizontally scrolling row of 61x82 portrait avatars with a name under
// each. Sits under the "Leaderboard / View all" heading.
import useDragScroll from '../hooks/useDragScroll'
import { useOpenProfile } from './ProfileLauncher'

export type LeaderboardEntry = {
  id: string
  name: string
  avatar: string
}

export default function LeaderboardRail({
  entries,
  onSelect,
}: {
  entries: LeaderboardEntry[]
  onSelect?: (id: string) => void
}) {
  const rail = useDragScroll<HTMLDivElement>()
  const openProfile = useOpenProfile()

  return (
    <div className="bv-leaderboard-rail" ref={rail}>
      {entries.map((entry) => (
        <button
          key={entry.id}
          type="button"
          className="bv-leaderboard-item"
          onClick={(e) => {
            // Tapping a face opens their profile — flying from the avatar's
            // own rect, not the whole button (which also covers the name
            // label). onSelect stays for callers that also want the id (none
            // override the profile jump today).
            const avatarEl = e.currentTarget.querySelector<HTMLElement>('.bv-leaderboard-avatar')
            openProfile({ name: entry.name, avatar: entry.avatar }, avatarEl)
            onSelect?.(entry.id)
          }}
        >
          {/* background, not <img> — see .bv-post-avatar in the CSS */}
          <span
            className="bv-leaderboard-avatar"
            style={{ backgroundImage: `url(${entry.avatar})` }}
          />
          <span className="bv-leaderboard-name">{entry.name}</span>
        </button>
      ))}
    </div>
  )
}
