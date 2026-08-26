// "What's new" — the running log of design updates, newest first.
//
// Grouped by date rather than listed flat: the dates are the point. Someone
// who looked last week should be able to find where they stopped, and a
// stretch of work on one day should read as one sitting.
import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { CHANGES, type Change } from '../content/changes'

/** Formatted in UTC — the dates are plain yyyy-mm-dd, and letting the
 *  browser localise them turns Aug 25 into Aug 24 west of Greenwich. */
const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

/** Entries in file order, bucketed by date — file order IS the order. */
function groupByDate(changes: Change[]): { date: string; entries: Change[] }[] {
  const groups: { date: string; entries: Change[] }[] = []
  for (const change of changes) {
    const last = groups[groups.length - 1]
    if (last && last.date === change.date) last.entries.push(change)
    else groups.push({ date: change.date, entries: [change] })
  }
  return groups
}

export default function WhatChanged() {
  const groups = groupByDate(CHANGES)
  // Numbered across the whole page, not per group, so the entrance stagger
  // keeps running down the list instead of restarting at every date.
  let index = -1

  return (
    <div className="section-page">
      <p className="eyebrow">Changelog</p>
      <h1 className="page-title">What&apos;s new</h1>
      <p className="page-lede">
        Every design update to the demo, newest first — what changed, and the day it
        landed.
      </p>

      {CHANGES.length === 0 && (
        <div className="card" style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
          Add entries to <span style={{ fontFamily: 'var(--font-code)', fontSize: 12 }}>src/content/changes.ts</span> to
          populate this section.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {groups.map((group) => (
          <Fragment key={group.date}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h2
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-text-tertiary)',
                  margin: 0,
                }}
              >
                {DATE_FORMAT.format(new Date(`${group.date}T00:00:00Z`))}
              </h2>

              {group.entries.map((c) => {
                index += 1
                return (
                  <motion.div
                    key={c.title}
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.04 }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 8,
                        flexWrap: 'wrap',
                      }}
                    >
                      <span className={`tag ${c.areaColor}`}>{c.area}</span>
                      <span style={{ fontSize: 16, fontWeight: 600 }}>{c.title}</span>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {c.detail}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
