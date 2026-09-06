// Component — Figma social post (19582:176666)
//
// ONE component. The shell is always identical — avatar, identity with
// streak + level labels, date, then a 12px-gap column — and what sits
// between the caption and the actions falls out of which content fields are
// present: an optional caption, an optional venue, an optional photo rail.
// The three comment variants in the design (text+images / text only /
// images only) are not separate code paths.
//
// The tinted achievement panels — the spend badge, the flame, and the
// interactive Bravo coin — used to sit at the bottom of a post. They were
// removed at Siya's direction; `isAchievement` is what survives of them,
// because those posts are still achievement posts and keep the two rules
// the design gives them (see below).
import { MessageSquare } from 'lucide-react'
import LikeButton from './LikeButton'
import { useOpenProfile } from './ProfileLauncher'
import useDragScroll from '../hooks/useDragScroll'
import { StreakLabel, LevelLabel, type AchievementLevel } from './AchievementLabel'
import VenueCard, { type Venue } from './VenueCard'

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
  /**
   * This post is about something earned. It no longer draws a panel, but it
   * still sets the caption a step smaller and drops the comment action —
   * both of which the design gives achievement posts.
   */
  isAchievement?: boolean
}

export type CaptionSegment = { text: string; bold?: boolean }

function Caption({ value, small }: { value: string | CaptionSegment[]; small: boolean }) {
  return (
    <p className={`sv-post-caption ${small ? 'sm' : ''}`}>
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
  const isAchievement = !!post.isAchievement
  const openProfile = useOpenProfile()
  // Always flies from the avatar's own rect, whether the avatar or the name
  // text was the actual tap target.
  const viewProfile = (e: { currentTarget: HTMLElement }) => {
    const avatarEl = e.currentTarget.closest('.sv-post')?.querySelector<HTMLElement>('.sv-post-avatar')
    openProfile({ name: post.author, avatar: post.avatar }, avatarEl)
  }

  return (
    <article className="sv-post">
      {/* background, not <img> — see .sv-post-avatar in the CSS. Tapping the
          author (face or name) opens their profile. */}
      <span
        className="sv-post-avatar sv-post-person"
        style={{ backgroundImage: `url(${post.avatar})` }}
        onClick={viewProfile}
      />

      <div className="sv-post-body">
        <header className="sv-post-identity">
          {/* Date sits inline after the name, bulleted — not top-right. */}
          <div className="sv-post-byline">
            <button type="button" className="sv-post-name sv-post-person" onClick={viewProfile}>
              {post.author}
            </button>
            <span className="sv-post-date">{post.date}</span>
          </div>
          <div className="sv-post-labels">
            <StreakLabel value={post.streak} />
            <LevelLabel level={post.level} />
          </div>
        </header>

        {/* Achievement captions are set a step smaller (12 vs 14). */}
        {post.caption && <Caption value={post.caption} small={isAchievement} />}

        {post.venue && <VenueCard venue={post.venue} onSave={onSaveVenue} />}

        {post.photos && post.photos.length > 0 && (
          <div className="sv-post-photos" ref={photos}>
            {post.photos.map((photo, i) => (
              <img key={i} className="sv-post-photo" src={photo} alt="" />
            ))}
          </div>
        )}

        <div className="sv-post-actions">
          {/* Achievements can be liked but not replied to. */}
          {!isAchievement && (
            <button type="button" className="sv-post-action" aria-label="Comment" onClick={onComment}>
              <MessageSquare size={20} strokeWidth={1.9} />
            </button>
          )}
          <LikeButton onLike={onLike} />
        </div>
      </div>
    </article>
  )
}
