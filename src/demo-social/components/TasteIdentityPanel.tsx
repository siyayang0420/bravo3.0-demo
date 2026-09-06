// Component — the "Taste Identity" profile tab (Figma 19677:16435).
//
// Three stacked cards:
//   19668:16136  a dark "Top N% Diner" summary, with the period, three
//                counts, and the friends ranking
//   19677:16426  the AI read — "bravo AI says:" — over the Taste DNA radar
//   19635:14218  the cuisine breakdown
//
// Everything is driven by ProfileData.tasteIdentity (profileDemo.ts), so any
// profile flowing through the shared template gets one.
import { Share2, Store, UtensilsCrossed, MessageSquare } from 'lucide-react'
import TasteRadar from './TasteRadar'
import { type ProfileData, type TasteDnaItem } from '../data/profileDemo'
import bravoWordmark from '../assets/taste/bravo-wordmark.svg'
import iconJapanese from '../assets/taste/cuisine-japanese.png'
import iconCafe from '../assets/taste/cuisine-cafe.png'
import iconChinese from '../assets/taste/cuisine-chinese.png'
import iconBubbleTea from '../assets/taste/cuisine-bubbletea.png'
import iconMichelin from '../assets/taste/cuisine-michelin.png'

// The illustrated category markers, exported from the design — these are
// artwork, not glyphs, so they are images rather than Lucide icons (which is
// what the small UI icons above still are).
const DNA_ICONS: Record<TasteDnaItem['icon'], string> = {
  japanese: iconJapanese,
  cafe: iconCafe,
  chinese: iconChinese,
  bubbleTea: iconBubbleTea,
  michelin: iconMichelin,
}

export default function TasteIdentityPanel({ profile }: { profile: ProfileData }) {
  const taste = profile.tasteIdentity
  // Headroom above the strongest axis, so the polygon never touches the outer
  // ring — the proportion Figma's own drawing sits at.
  const radarMax = Math.max(...taste.radar.map((a) => a.value)) * 1.25

  return (
    <div className="sv-taste">
      {/* ---- Top N% Diner (19668:16136) ---- */}
      <section className="sv-taste-stat">
        <div className="sv-taste-stat-head">
          <div className="sv-taste-stat-identity">
            <span
              className="sv-taste-stat-avatar"
              style={{ backgroundImage: `url(${profile.avatar})` }}
            />
            <div className="sv-taste-stat-title">
              <span className="sv-taste-stat-period">{taste.periodLabel}</span>
              <span className="sv-taste-stat-headline">Top {taste.percentile}% Diner</span>
            </div>
          </div>
          <button type="button" className="sv-taste-stat-share" aria-label="Share">
            <Share2 size={14} strokeWidth={1.9} />
          </button>
        </div>

        <div className="sv-taste-stat-metrics">
          <div className="sv-taste-stat-metric">
            <b>{taste.restaurants}</b>
            <span>
              <Store size={14} strokeWidth={1.9} />
              restaurants
            </span>
          </div>
          <div className="sv-taste-stat-metric">
            <b>{taste.cuisines}</b>
            <span>
              <UtensilsCrossed size={14} strokeWidth={1.9} />
              cuisines
            </span>
          </div>
          <div className="sv-taste-stat-metric">
            <b>{taste.posts}</b>
            <span>
              <MessageSquare size={14} strokeWidth={1.9} />
              Posts
            </span>
          </div>
        </div>

        <div className="sv-taste-stat-foot">
          <span>Ranked in the top {taste.friendPercentile}% among your friends</span>
          <img className="sv-taste-stat-brand" src={bravoWordmark} alt="bravo" />
        </div>
      </section>

      {/* ---- the AI read + radar (19677:16426) ---- */}
      <section className="sv-taste-ai">
        <div className="sv-taste-ai-copy">
          <p className="sv-taste-ai-says">
            <span className="sv-search-ask-brand" role="img" aria-label="bravo AI" />
            {/* Figma fakes the italic with a -10° skew rather than an italic
                cut, so this matches it in CSS instead of using font-style. */}
            <span className="sv-taste-ai-says-word">says:</span>
          </p>
          <p className="sv-taste-ai-summary">
            {profile.name} is an {taste.archetype}. {taste.summary}
          </p>
        </div>
        <TasteRadar axes={taste.radar} max={radarMax} />
      </section>

      {/* ---- cuisine breakdown (19635:14218) ---- */}
      <section className="sv-taste-dna">
        <div className="sv-taste-dna-head">
          <span className="sv-taste-dna-title">Taste DNA</span>
          <span className="sv-taste-dna-since">
            {profile.joined.replace('Joined since', 'Since')}
          </span>
        </div>
        {taste.dna.map((item) => (
          <div className="sv-taste-dna-row" key={item.label}>
            <img className="sv-taste-dna-icon" src={DNA_ICONS[item.icon]} alt="" />
            <div className="sv-taste-dna-meter">
              <span className="sv-taste-dna-label">{item.label}</span>
              {/* Literal artboard px, not a percentage of the flexed column:
                  the artboard is a fixed 402 and scales as a whole, so the
                  design's own number is already the right one. */}
              <span className="sv-taste-dna-bar" style={{ width: item.bar }} />
            </div>
            <span className="sv-taste-dna-pct">
              {item.pct}%({item.count})
            </span>
          </div>
        ))}
      </section>
    </div>
  )
}
