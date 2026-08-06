import { useState } from 'react'
import { motion } from 'framer-motion'
import { ImageIcon } from 'lucide-react'
import { RATIONALE } from '../content/rationale'

function CompetitorShot({
  name,
  image,
  note,
}: {
  name: string
  image: string
  note: string
}) {
  const [missing, setMissing] = useState(false)

  return (
    <div style={{ width: 200, flexShrink: 0 }}>
      <div
        style={{
          width: 200,
          height: 240,
          borderRadius: 'var(--radius-card-sm)',
          border: missing
            ? '1.5px dashed var(--color-border-default)'
            : '1px solid var(--color-border-subtle)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-bg-elevated)',
          marginBottom: 8,
        }}
      >
        {missing ? (
          <div style={{ textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: 12, padding: 12 }}>
            <ImageIcon size={20} style={{ marginBottom: 6 }} />
            <div style={{ fontWeight: 600, marginBottom: 2 }}>{name}</div>
            <div style={{ fontFamily: 'var(--font-code)', fontSize: 10 }}>
              drop into public{image}
            </div>
          </div>
        ) : (
          <img
            src={image}
            alt={`${name} screenshot`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setMissing(true)}
          />
        )}
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{name}</div>
      <div style={{ fontSize: 12, lineHeight: 1.45, color: 'var(--color-text-secondary)' }}>{note}</div>
    </div>
  )
}

export default function Rationale() {
  return (
    <div className="section-page">
      <p className="eyebrow">Why it&apos;s designed this way</p>
      <h1 className="page-title">Design rationale</h1>
      <p className="page-lede">
        Every major decision, the reasoning in one breath, and what the best-in-class
        apps do. Screenshots are the proof, not decoration.
      </p>

      {RATIONALE.length === 0 && (
        <div className="card" style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
          Add entries to <span style={{ fontFamily: 'var(--font-code)', fontSize: 12 }}>src/content/rationale.ts</span>{' '}
          and drop competitor screenshots into{' '}
          <span style={{ fontFamily: 'var(--font-code)', fontSize: 12 }}>public/competitors/</span> to populate this
          section.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {RATIONALE.map((r, i) => (
          <motion.div
            key={r.decision}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
          >
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{r.decision}</div>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--color-text-secondary)', maxWidth: 560, marginBottom: 16 }}>
              {r.why}
            </p>
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 4 }}>
              {r.competitors.map((comp) => (
                <CompetitorShot key={comp.name} {...comp} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
