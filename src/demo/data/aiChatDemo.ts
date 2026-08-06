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

export const THINKING_STEPS: ThinkingStep[] = [
  // 19559:168018
  { label: 'Let me think what do you need …', hold: 1600 },
  // 19559:168156
  { label: 'Looking for restaurants with “Happy” …', detail: 'Found 5 places …', hold: 2000 },
  // 19560:168548
  { label: 'Let me take a closer look …', detail: 'Found 5 places …', hold: 2400 },
]

export const AI_DISCLAIMER = 'bravo AI may make mistakes, so please double check.'
