// Component — the assistant's reply (Figma 20030:21014).
//
// The card the loading state grows into. Per place: a photo, the name and
// where it is, who saved it, why it came back, and — the part that makes this
// bravo's answer rather than a search engine's — what somebody you actually
// follow said about it, in their own bubble.
import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { StreakLabel, LevelLabel } from './AchievementLabel'
import LikeButton from './LikeButton'
import SaveGlyph from './SaveGlyph'
import { type AiAnswer, type AiPlace } from '../data/aiChatDemo'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

export default function AiAnswerCard({ answer }: { answer: AiAnswer }) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className="bv-ai-card"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE_OUT }}
    >
      <p className="bv-ai-answer-lead">{answer.lead}</p>
      {answer.places.map((place, i) => (
        <AiPlaceBlock key={place.id} place={place} index={i} reduce={!!reduce} />
      ))}
    </motion.div>
  )
}

function AiPlaceBlock({
  place,
  index,
  reduce,
}: {
  place: AiPlace
  index: number
  reduce: boolean
}) {
  // Saving is the one thing this block does, so it holds the flag rather than
  // asking the screen to carry one it has no other use for.
  const [saved, setSaved] = useState(false)

  return (
    <motion.section
      className="bv-ai-place"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      // Staggered, so the places arrive as a list being written rather than
      // a block appearing all at once.
      transition={{ duration: 0.32, ease: EASE_OUT, delay: 0.08 + index * 0.12 }}
    >
      <div className="bv-ai-place-head">
        <img className="bv-ai-place-photo" src={place.photo} alt="" />
        <div className="bv-ai-place-facts">
          <div className="bv-ai-place-titles">
            <span className="bv-ai-place-name">{place.name}</span>
            <span className="bv-ai-place-meta">{place.meta}</span>
          </div>
          <div className="bv-ai-place-saved">
            <span className="bv-ai-place-savers">
              <span className="bv-ai-saver-stack">
                {place.savers.map((face, i) => (
                  <span key={i} style={{ backgroundImage: `url(${face})` }} />
                ))}
              </span>
              <span className="bv-ai-saved-count">{place.savedLabel}</span>
            </span>
            <button
              type="button"
              className="bv-ai-place-save"
              aria-label={saved ? `Saved ${place.name}` : `Save ${place.name}`}
              aria-pressed={saved}
              onClick={() => setSaved((s) => !s)}
            >
              <SaveGlyph saved={saved} size={20} />
            </button>
          </div>
        </div>
      </div>

      <p className="bv-ai-place-blurb">{place.blurb}</p>

      {/* A friend's note. The bubble squares its BOTTOM-LEFT corner, pointing
          back at the face beside it — the same tail rule the venue detail's
          post bubbles use. */}
      <div className="bv-ai-note">
        <div className="bv-ai-note-row">
          <span
            className="bv-ai-note-face"
            style={{ backgroundImage: `url(${place.note.avatar})` }}
          />
          <div className="bv-ai-note-bubble">
            <div className="bv-ai-note-head">
              <span className="bv-ai-note-who">
                <b>{place.note.author}</b>
                <StreakLabel value={place.note.streak} />
                <LevelLabel level={place.note.level} />
              </span>
              <span className="bv-ai-note-when">{place.note.when}</span>
            </div>
            <p className="bv-ai-note-text">{place.note.text}</p>
          </div>
        </div>
        <div className="bv-ai-note-foot">
          <button type="button" className="bv-ai-note-detail">View post detail</button>
          <div className="bv-ai-note-engage">
            <motion.button
              type="button"
              className="bv-post-action"
              aria-label="Comment"
              whileTap={{ scale: 0.92 }}
            >
              <MessageSquare size={16} strokeWidth={1.9} />
            </motion.button>
            <LikeButton likes={place.note.likes ?? 0} />
          </div>
        </div>
      </div>
    </motion.section>
  )
}
