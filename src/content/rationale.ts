// ============================================================
// EDIT ME — "Design Rationale" content.
// Add one entry per decision. Leave empty for the
// "content coming" state.
//
// COMPETITOR SCREENSHOTS:
// Drop images into  public/competitors/  and reference them
// below as '/competitors/<filename>.png'. Cards render a
// labeled drop-slot placeholder until the image exists.
// ============================================================

export type Rationale = {
  decision: string
  why: string // 1–2 sentences max
  competitors: {
    name: string
    image: string // path under /public
    note: string // what to look at in the screenshot
  }[]
}

export const RATIONALE: Rationale[] = [
  // Example shape:
  // {
  //   decision: 'Map as the home surface',
  //   why: 'One or two sentences.',
  //   competitors: [
  //     { name: 'AppName', image: '/competitors/appname-home.png', note: 'What to look at.' },
  //   ],
  // },
]
