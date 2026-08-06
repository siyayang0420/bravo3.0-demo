// Component — Figma leaderboard rail (19564:171678)
// Horizontally scrolling row of 61x82 portrait avatars with a name under
// each. Sits under the "Leaderboard / View all" heading.
import useDragScroll from '../hooks/useDragScroll'

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

  return (
    <div className="bv-leaderboard-rail" ref={rail}>
      {entries.map((entry) => (
        <button
          key={entry.id}
          type="button"
          className="bv-leaderboard-item"
          onClick={() => onSelect?.(entry.id)}
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
