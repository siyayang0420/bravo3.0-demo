// ============================================================
// EDIT ME — "What's Changed" content.
// Add one entry per change; each becomes a before/after card.
// Leave the array empty to show the "content coming" state.
// ============================================================

export type Change = {
  tag: string
  tagColor: 'purple' | 'pink' | 'blue' | 'mint' | 'orange'
  title: string
  before: string
  after: string
  impact: string // one line, outcome-oriented
}

export const CHANGES: Change[] = [
  // Example shape:
  // {
  //   tag: 'Home',
  //   tagColor: 'orange',
  //   title: 'Map-first discovery home',
  //   before: 'What 2.x did',
  //   after: 'What 3.0 does',
  //   impact: 'Why it matters, in one line.',
  // },
]
