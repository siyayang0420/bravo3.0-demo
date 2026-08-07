// EDIT ME — the assistant's thinking sequence for the Home search demo.
//
// The three Figma nodes (19559:168018, 19559:168156, 19560:168548) are the
// same screen at three moments, so they are steps here rather than screens.
// `detail` is the second, dimmer line that appears under the main one.
export type ThinkingStep = {
  label: string
  detail?: string
  /** How long this step stays up before the next one, in ms. */
  hold: number
}

// The steps depend on what you asked, so the middle line echoes the query
// (the starter copy you tapped) instead of a fixed "Happy".
//
// Figma's own wording was "Looking for restaurants with “Happy” …" /
// "Found 5 places …", written when every prompt was a restaurant search.
// The dock now offers per-screen prompts that are not — "Who's my best
// friend", "Total spend last week" — and "Found 5 places" under those read
// as a bug, so the two lines are widened to fit any query. Deliberate
// deviation from the node; the shape and pacing are unchanged.
export function thinkingSteps(query: string): ThinkingStep[] {
  return [
    // 19559:168018
    { label: 'Let me think what do you need …', hold: 1600 },
    // 19559:168156
    { label: `Looking for “${query}” …`, detail: 'Found 5 results …', hold: 2000 },
    // 19560:168548
    { label: 'Let me take a closer look …', detail: 'Found 5 results …', hold: 2400 },
  ]
}

export const AI_DISCLAIMER = 'bravo AI may make mistakes, so please double check.'
