import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { FLUTTER_NOTES } from '../content/flutterNotes'

const RISK_META = {
  high: { label: 'Rework needed', cls: 'error' },
  medium: { label: 'Known path', cls: 'warning' },
  low: { label: 'Direct port', cls: 'success' },
} as const

export default function FlutterNotes() {
  return (
    <div className="section-page">
      <p className="eyebrow">For engineering</p>
      <h1 className="page-title">Flutter handoff</h1>
      <p className="page-lede">
        This demo is a React prototype; the product ships in Flutter. Here is every
        place where the web build and the Flutter build diverge — flagged now, so
        nothing surprises us mid-sprint.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {FLUTTER_NOTES.map((n, i) => {
          const meta = RISK_META[n.risk]
          return (
            <motion.div
              key={n.feature}
              className="card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                <span className={`tag ${meta.cls}`}>{meta.label}</span>
                <span style={{ fontSize: 15, fontWeight: 600 }}>{n.feature}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 4 }}>
                    Why it differs
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--color-text-secondary)' }}>{n.issue}</p>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 4 }}>
                    Plan
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--color-text-secondary)' }}>{n.plan}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="card" style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <FileText size={18} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
        <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--color-text-secondary)' }}>
          Full engineering detail — including the suggested Flutter package stack and
          open questions — is in{' '}
          <span style={{ fontFamily: 'var(--font-code)', fontSize: 12, color: 'var(--color-text-primary)' }}>
            docs/REACT-TO-FLUTTER-NOTES.md
          </span>{' '}
          in this repo.
        </div>
      </div>
    </div>
  )
}
