// Component — Figma social post (19582:176666)
//
// ONE component, six variants. The shell is always identical — avatar,
// identity with streak + level labels, date, then a 12px-gap column — and
// the variant only decides what sits between the caption and the actions:
//
//   comment  → optional caption, optional venue, optional photo rail
//   spend    → achievement panel, spend badge art
//   streak   → achievement panel, flame art
//   bonus    → achievement panel, the interactive Bravo coin
//
// The three comment variants in the design (text+images / text only /
// images only) are not separate code paths — they fall out of which
// content fields are present.
import { MessageSquare, Heart } from 'lucide-react'
import useDragScroll from '../hooks/useDragScroll'
import { StreakLabel, LevelLabel, type AchievementLevel } from './AchievementLabel'
import VenueCard, { type Venue } from './VenueCard'
import AchievementPanel, { type Achievement } from './AchievementPanel'

export type Post = {
  id: string
  author: string
  avatar: string
  streak: string
  level: AchievementLevel
  date: string
  /** Plain text, or rich segments when part of it is bold. */
  caption?: string | CaptionSegment[]
  venue?: Venue
  photos?: string[]
  achievement?: Achievement
}

export type CaptionSegment = { text: string; bold?: boolean }

function Caption({ value, small }: { value: string | CaptionSegment[]; small: boolean }) {
  return (
    <p className={`bv-post-caption ${small ? 'sm' : ''}`}>
      {typeof value === 'string'
        ? value
        : value.map((seg, i) =>
            seg.bold ? <strong key={i}>{seg.text}</strong> : <span key={i}>{seg.text}</span>,
          )}
    </p>
  )
}

export default function PostCard({
  post,
  onComment,
  onLike,
  onSaveVenue,
}: {
  post: Post
  onComment?: () => void
  onLike?: () => void
  onSaveVenue?: () => void
}) {
  const photos = useDragScroll<HTMLDivElement>()
  const isAchievement = !!post.achievement

  return (
    <article className="bv-post">
      {/* background, not <img> — see .bv-post-avatar in the CSS */}
      <span className="bv-post-avatar" style={{ backgroundImage: `url(${post.avatar})` }} />

      <div className="bv-post-body">
        <header className="bv-post-identity">
          {/* Date sits inline after the name, bulleted — not top-right. */}
          <div className="bv-post-byline">
            <span className="bv-post-name">{post.author}</span>
            <span className="bv-post-date">{post.date}</span>
          </div>
          <div className="bv-post-labels">
            <StreakLabel value={post.streak} />
            <LevelLabel level={post.level} />
          </div>
        </header>

        {/* Achievement captions are set a step smaller (12 vs 14). */}
        {post.caption && <Caption value={post.caption} small={isAchievement} />}

        {post.venue && <VenueCard venue={post.venue} onSave={onSaveVenue} />}

        {post.photos && post.photos.length > 0 && (
          <div className="bv-post-photos" ref={photos}>
            {post.photos.map((photo, i) => (
              <img key={i} className="bv-post-photo" src={photo} alt="" />
            ))}
          </div>
        )}

        {post.achievement && <AchievementPanel achievement={post.achievement} />}

        <div className="bv-post-actions">
          {/* Achievements can be liked but not replied to. */}
          {!isAchievement && (
            <button type="button" className="bv-post-action" aria-label="Comment" onClick={onComment}>
              <MessageSquare size={15.625} strokeWidth={1.9} />
            </button>
          )}
          <button type="button" className="bv-post-action" aria-label="Like" onClick={onLike}>
            <Heart size={15.625} strokeWidth={1.9} />
          </button>
        </div>
      </div>
    </article>
  )
}
