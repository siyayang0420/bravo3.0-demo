import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { CHANGES } from '../content/changes'

export default function WhatChanged() {
  return (
    <div className="section-page">
      <p className="eyebrow">2.x → 3.0</p>
      <h1 className="page-title">What&apos;s changed</h1>
      <p className="page-lede">
        The structural changes from 2.x to 3.0, each with the before, the after, and
        why it matters.
      </p>

      {CHANGES.length === 0 && (
        <div className="card" style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
          Add entries to <span style={{ fontFamily: 'var(--font-code)', fontSize: 12 }}>src/content/changes.ts</span> to
          populate this section.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {CHANGES.map((c, i) => (
          <motion.div
            key={c.title}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span className={`tag ${c.tagColor}`}>{c.tag}</span>
              <span style={{ fontSize: 16, fontWeight: 600 }}>{c.title}</span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                gap: 16,
                alignItems: 'start',
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  background: 'var(--color-bg-subtle)',
                  borderRadius: 'var(--radius-card-sm)',
                  padding: 12,
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: 'var(--color-text-secondary)',
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, color: 'var(--color-text-tertiary)' }}>
                  Before
                </div>
                {c.before}
              </div>
              <ArrowRight size={16} style={{ color: 'var(--color-text-tertiary)', marginTop: 24 }} />
              <div
                style={{
                  background: 'var(--color-status-success-subtle)',
                  borderRadius: 'var(--radius-card-sm)',
                  padding: 12,
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, color: 'var(--color-status-success)' }}>
                  3.0
                </div>
                {c.after}
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>
              → {c.impact}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
