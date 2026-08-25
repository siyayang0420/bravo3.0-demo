// Venue detail — implements Figma node 19867:16050.
//
// Pushed in when the map's venue card is tapped. One long scroll: the header
// facts and photos, the cashback offer, who saved it, what people wrote, and
// three places with the same vibe — then the assistant dock and the action
// row pinned to the bottom.
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Bookmark, Share2, ChevronDown, ChevronRight, MessageSquare, Navigation, Phone, Instagram, Globe } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import PromptBox from '../components/PromptBox'
import LikeButton from '../components/LikeButton'
import SaveGlyph from '../components/SaveGlyph'
import PhotoStack from '../components/PhotoStack'
import PhotoLightbox from '../components/PhotoLightbox'
import useSearchLauncher from '../components/SearchLauncher'
import { useOpenProfile } from '../components/ProfileLauncher'
import { StreakLabel, LevelLabel } from '../components/AchievementLabel'
import { ELLIPSIS_DETAIL, POST_PROMPT_AUTHOR, type VenueDetail, type VenuePost } from '../data/venueDetailDemo'

export default function VenueDetailScreen({
  venue = ELLIPSIS_DETAIL,
  anchorPostId,
  onBack,
}: {
  venue?: VenueDetail
  /**
   * Open scrolled to this post instead of at the top — set when you arrived
   * by tapping the friend's note floating over the map card, so you land on
   * the thing you tapped rather than having to go looking for it.
   */
  anchorPostId?: string
  onBack: () => void
}) {
  const { promptProps, overlays } = useSearchLauncher('map')
  const openProfile = useOpenProfile()

  // Which photo each post's deck is showing, keyed by post. Kept up here so
  // the deck and the full-screen viewer read and write the same number —
  // swipe in the viewer, close it, and the deck is already on that photo.
  const [photoIndex, setPhotoIndex] = useState<Record<string, number>>({})
  const [viewing, setViewing] = useState<string | null>(null)
  const viewingPost = venue.posts.find((p) => p.id === viewing)
  // Have you saved this place. The pinned header's bookmark is a toggle, and
  // SaveGlyph is what draws it — the same glyph the badges on the "Saved by"
  // faces use, so a filled bookmark means one thing everywhere.
  const [saved, setSaved] = useState(false)
  const setIndexFor = (id: string) => (next: number) =>
    setPhotoIndex((m) => ({ ...m, [id]: next }))

  // Land on the anchored post and give it a brief highlight, so it is obvious
  // which of several posts you were sent to.
  const scrollRef = useRef<HTMLDivElement>(null)
  const [flash, setFlash] = useState<string | null>(null)
  useEffect(() => {
    if (!anchorPostId) return
    // Scroll manually rather than with scrollIntoView: this list lives in its
    // own absolutely-positioned scroller, and scrollIntoView would walk up and
    // move the page behind the phone too.
    const settle = window.setTimeout(() => {
      const scroller = scrollRef.current
      const el = scroller?.querySelector<HTMLElement>(`[data-post="${anchorPostId}"]`)
      if (!scroller || !el) return
      const top = el.offsetTop - (scroller.clientHeight - el.offsetHeight) / 2
      scroller.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
      setFlash(anchorPostId)
    }, 380) // after the screen has finished pushing in
    return () => window.clearTimeout(settle)
  }, [anchorPostId])
  useEffect(() => {
    if (!flash) return
    const t = window.setTimeout(() => setFlash(null), 1900)
    return () => window.clearTimeout(t)
  }, [flash])

  // Collapse the pinned header's two rows into one as you scroll: the identity
  // rises the 40px that separated it from the back button and slides right to
  // clear it, so the arrow ends up sitting to the left of the logo.
  //
  // Driven by writing a 0→1 number onto the header as a custom property rather
  // than through React state: this fires on every scroll frame, and a setState
  // per frame would re-render the whole (long) page to move two boxes. The CSS
  // does the rest, so the motion is scroll-linked — it tracks the finger and
  // unwinds exactly when you scroll back up.
  const topbarRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller) return
    const onScroll = () => {
      // Over COLLAPSE_RANGE, which is the same 40px the row travels — so the
      // identity lands in place just as the header finishes shrinking.
      const t = Math.min(1, Math.max(0, scroller.scrollTop / 40))
      topbarRef.current?.style.setProperty('--vd-collapse', String(t))
    }
    onScroll() // in case we opened already scrolled to an anchored post
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="bv-vd-screen">
      <div className="bv-vd-scroll" ref={scrollRef}>
        {/* ---- header facts ----
             The back button and the identity row are NOT here: they live in
             the pinned bar below, which rides over this scroller. What is
             left is the part that scrolls away. */}
        <header className="bv-vd-head">
          <p className="bv-vd-meta">{venue.meta}</p>
          <p className="bv-vd-meta">{venue.address}</p>
          <p className="bv-vd-desc">{venue.description}</p>

          <div className="bv-vd-hours">
            <span className="bv-vd-open">{venue.openLabel}</span>
            <span className="bv-vd-day">{venue.dayLabel}</span>
            <button type="button" className="bv-vd-hours-toggle">
              {venue.hours}
              <ChevronDown size={14} strokeWidth={1.9} />
            </button>
          </div>
        </header>

        {/* ---- photos: a rail, because Figma's two are wider than the phone ---- */}
        <div className="bv-vd-photos">
          {venue.photos.map((p, i) => (
            <img key={i} src={p} alt="" />
          ))}
        </div>

        {/* ---- offer ---- */}
        <section className="bv-vd-offer">
          <div className="bv-vd-offer-top">
            <span className="bv-vd-offer-rate">
              <b>{venue.offer.rate}</b>
              <span>back</span>
            </span>
            <div className="bv-vd-offer-copy">
              <span className="bv-vd-offer-title">{venue.offer.title}</span>
              <span className="bv-vd-offer-detail">{venue.offer.detail}</span>
            </div>
          </div>
          <button type="button" className="bv-vd-offer-more">
            More details
            <ChevronRight size={12} strokeWidth={2} />
          </button>
        </section>

        {/* ---- saved by ---- */}
        <section className="bv-vd-section">
          <div className="bv-vd-section-head">
            <span className="bv-vd-section-title">Saved by</span>
            <span className="bv-vd-saved-count">
              <Bookmark size={14} strokeWidth={1.9} />
              {venue.savedCount}
            </span>
          </div>
          <div className="bv-vd-savers">
            {venue.savedBy.map((p) => (
              // A button, not a div: these are people, and tapping one opens
              // their profile with the same hero flight the feed uses — the
              // face lifts out of the rail and lands in the profile header.
              <button
                type="button"
                className="bv-vd-saver"
                key={p.name}
                aria-label={`View ${p.name}'s profile`}
                onClick={(e) =>
                  openProfile(p, e.currentTarget.querySelector<HTMLElement>('.bv-vd-saver-face'))
                }
              >
                <span
                  className="bv-vd-saver-face"
                  style={{ backgroundImage: `url(${p.avatar})` }}
                >
                  {/* Filled, not outline: everyone in this list HAS saved the
                      place — that is why they are in it. SaveGlyph is the one
                      definition of what "saved" looks like, so this badge and
                      the save buttons elsewhere can never drift apart. The
                      counter above stays outline; it is a tally, not a state. */}
                  <span className="bv-vd-saver-badge">
                    <SaveGlyph saved size={11} />
                  </span>
                </span>
                <span className="bv-vd-saver-name">{p.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ---- write a post ---- */}
        <div className="bv-vd-write">
          <button type="button" className="bv-vd-write-bubble">
            Write a post about this resturant?
          </button>
          <span
            className="bv-vd-write-face"
            style={{ backgroundImage: `url(${POST_PROMPT_AUTHOR.avatar})` }}
          />
        </div>

        {/* ---- posts ---- */}
        {venue.posts.map((post) => (
          <VenuePostBlock
            key={post.id}
            post={post}
            photoIndex={photoIndex[post.id] ?? 0}
            onPhotoIndex={setIndexFor(post.id)}
            onOpenPhotos={() => setViewing(post.id)}
            flash={flash === post.id}
          />
        ))}

        {/* ---- same vibe ---- */}
        <section className="bv-vd-section">
          <span className="bv-vd-section-title">Same vibe</span>
          <div className="bv-vd-vibe">
            {venue.sameVibe.map((v) => (
              <div className="bv-vd-vibe-card" key={v.id}>
                <img src={v.photo} alt="" />
                <span className="bv-vd-vibe-name">{v.name}</span>
                <span className="bv-vd-vibe-cat">{v.category}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ---- pinned header (Figma 19890:18100) ----
           Outside the scroller, so the back button and the venue's name stay
           put while everything else travels under them. Its white-to-clear
           fade is what keeps the collision readable: photos and posts
           dissolve into the bar rather than butting up against it. */}
      <header className="bv-vd-topbar" ref={topbarRef}>
        <button type="button" className="bv-screen-back" aria-label="Back" onClick={onBack}>
          <ArrowLeft size={20} strokeWidth={1.9} />
        </button>

        <div className="bv-vd-title-row">
          <div className="bv-vd-identity">
            <img className="bv-vd-logo" src={venue.logo} alt="" />
            <span className="bv-vd-title">{venue.title}</span>
          </div>
          <div className="bv-vd-actions">
            <button
              type="button"
              className="bv-vd-round"
              aria-label={saved ? 'Saved' : 'Save'}
              aria-pressed={saved}
              onClick={() => setSaved((s) => !s)}
            >
              <SaveGlyph saved={saved} />
            </button>
            <button type="button" className="bv-vd-round" aria-label="Share">
              <Share2 size={20} strokeWidth={1.9} />
            </button>
          </div>
        </div>
      </header>

      {/* ---- dock: assistant + the things you can do here ---- */}
      <div className="bv-vd-dock">
        {/* Spread first, then override: the launcher supplies the map's
            rotating placeholders, and here the prompt is about this venue. */}
        <PromptBox
          {...promptProps}
          placeholders={['What do you recommend here']}
          placeholder="What do you recommend here"
        />
        <div className="bv-vd-chips">
          <button type="button" className="bv-vd-chip pay">Pay</button>
          <button type="button" className="bv-vd-chip">
            <Navigation size={16} strokeWidth={1.9} />
            Direction • {venue.distance}
          </button>
          <button type="button" className="bv-vd-chip">
            <Phone size={16} strokeWidth={1.9} />
            Call
          </button>
          <button type="button" className="bv-vd-chip">
            <Instagram size={16} strokeWidth={1.9} />
            Ins
          </button>
          <button type="button" className="bv-vd-chip">
            <Globe size={16} strokeWidth={1.9} />
            Web
          </button>
        </div>
      </div>

      {/* Sits outside the scroller so it covers the dock as well as the page. */}
      <AnimatePresence>
        {viewingPost && (
          <PhotoLightbox
            photos={viewingPost.photos}
            index={photoIndex[viewingPost.id] ?? 0}
            onIndex={setIndexFor(viewingPost.id)}
            onClose={() => setViewing(null)}
          />
        )}
      </AnimatePresence>

      {overlays}
    </div>
  )
}

/** One post: the leaning photo stack, the comment bubble, then the footer. */
function VenuePostBlock({
  post,
  photoIndex,
  onPhotoIndex,
  onOpenPhotos,
  flash = false,
}: {
  post: VenuePost
  photoIndex: number
  onPhotoIndex: (next: number) => void
  onOpenPhotos: () => void
  /** Briefly highlight this post — it is the one you were sent here to read. */
  flash?: boolean
}) {
  const openProfile = useOpenProfile()
  // Always flies from the face's own rect, whether the face or the name in
  // the bubble was the actual tap target — same rule as PostCard.
  const viewProfile = (e: { currentTarget: HTMLElement }) => {
    const face = e.currentTarget
      .closest('.bv-vd-post')
      ?.querySelector<HTMLElement>('.bv-vd-post-face')
    openProfile({ name: post.author, avatar: post.avatar }, face)
  }

  return (
    <article className={`bv-vd-post${flash ? ' is-flash' : ''}`} data-post={post.id}>
      <div className="bv-vd-post-row">
        <span
          className="bv-vd-post-face bv-vd-person"
          role="button"
          tabIndex={0}
          aria-label={`View ${post.author}'s profile`}
          style={{ backgroundImage: `url(${post.avatar})` }}
          onClick={viewProfile}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              viewProfile(e)
            }
          }}
        />
        <div className="bv-vd-post-body">
          {/* The stack leans: one photo rotated behind the front one, which is
              how the design suggests "there are more" without a carousel.
              Swipe it to deal through the deck, tap it to go full screen.
              Skipped entirely for a note with no photos — the bubble on its
              own is the whole post. */}
          {post.photos.length > 0 && (
            <PhotoStack
              photos={post.photos}
              index={photoIndex}
              onIndex={onPhotoIndex}
              onOpen={onOpenPhotos}
            />
          )}

          <div className="bv-vd-bubble">
            <div className="bv-vd-bubble-head">
              <span className="bv-vd-bubble-who">
                <button type="button" className="bv-vd-bubble-name bv-vd-person" onClick={viewProfile}>
                  {post.author}
                </button>
                <StreakLabel value={post.streak} />
                <LevelLabel level={post.level} />
              </span>
              <span className="bv-vd-bubble-when">{post.when}</span>
            </div>
            <p className="bv-vd-bubble-text">{post.text}</p>
          </div>
        </div>
      </div>

      <div className="bv-vd-post-foot">
        <button type="button" className="bv-vd-post-detail">View post detail</button>
        <div className="bv-vd-post-engage">
          <motion.button type="button" className="bv-vd-post-action" aria-label="Comment" whileTap={{ scale: 0.92 }}>
            <MessageSquare size={16} strokeWidth={1.9} />
          </motion.button>
          <LikeButton likes={post.likes} />
        </div>
      </div>
    </article>
  )
}
