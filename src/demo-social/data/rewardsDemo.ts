// EDIT ME — demo content for the Rewards tab (Figma 19457:11305).
// Badge art, Figma 20012:12716 — the chrome set. The dark medallions these
// replaced are still in the same folder under their plain names
// (link-card.webp and friends), unused but kept.
//
// Delivered at 1024px for an 88px slot; committed at 264px (3x) WebP, the
// same treatment the medallions had.
import linkCard from '../assets/achievements/link-card-chrome.webp'
import inviteFriend from '../assets/achievements/invite-friend-chrome.webp'
import earnBonus from '../assets/achievements/earn-bonus-chrome.webp'
import visitRestaurant from '../assets/achievements/visit-restaurant-chrome.webp'
import makePost from '../assets/achievements/make-post-chrome.webp'
import sendMoney from '../assets/achievements/send-money-chrome.webp'

/**
 * One square of the check-in week.
 *   collected — already claimed, filled in info-300
 *   today     — claimable now, a dashed outline waiting to be filled
 *   upcoming  — not yet, greyed out
 */
export type CheckInDay = {
  /** The weekday initial. Repeats (T, T / S, S) — it is a strip, not a key. */
  label: string
  state: 'collected' | 'today' | 'upcoming'
  amount: string
}

/**
 * The two meters behind the header chips (Figma 19982:31109) — what the
 * streak and the level actually mean, shown when you tap them.
 *
 * The counts and the level come off the signed-in profile, so the popover can
 * never contradict the chips that opened it. Only the things the profile does
 * not know live here: how far along each bar sits, and what is left to spend.
 * The bar fractions are the designer's, not derived — Figma draws 93.53% for
 * "Current 25 · Next 26", which no ratio of those two numbers produces.
 */
export const ACHIEVEMENT_STATS = {
  diningProgress: 0.9353,
  levelProgress: 0.5245,
  toNextLevel: '$534.12',
}

export type CheckIn = {
  endsLabel: string
  /** The count beside the title, in the display face. */
  streakLabel: string
  /**
   * Your longest run, under the current one. Optional: an account that has
   * never held a streak has no best to beat, and showing "Best: 0 days"
   * would be a goalpost rather than an achievement.
   */
  bestLabel?: string
  collectLabel: string
  /**
   * What the button says once you have tapped it. The bonus is banked and
   * there is nothing left to do today, so the label stops asking and starts
   * telling — see DailyCheckIn.
   */
  collectedLabel: string
  /**
   * The count after that tap. Carried rather than computed for the same
   * reason `streakLabel` is: the file's "0 day" already disagrees with the
   * three days its week shows as collected, so incrementing it in code would
   * be inventing a rule the design has not settled.
   */
  collectedStreakLabel: string
  week: CheckInDay[]
}

export const CHECK_IN: CheckIn = {
  endsLabel: 'Ends Aug 26 • 12am',
  // Figma writes "0 day" here while three days of the week read as collected.
  // Carried as the design has it rather than derived from `week`: the two
  // disagree in the file, and quietly computing one from the other would be
  // inventing a rule the designer has not settled yet.
  streakLabel: '0 day',
  bestLabel: 'Best: 23 days',
  collectLabel: 'Collect $0.1 daily bonus',
  collectedLabel: '$0.1 in Bonus, come back tomorrow',
  collectedStreakLabel: '1 day',
  week: [
    { label: 'M', state: 'collected', amount: '+$0.1' },
    { label: 'T', state: 'collected', amount: '+$0.1' },
    { label: 'W', state: 'collected', amount: '+$0.1' },
    { label: 'T', state: 'today', amount: '+$0.1' },
    { label: 'F', state: 'upcoming', amount: '+$0.1' },
    { label: 'S', state: 'upcoming', amount: '+$0.1' },
    { label: 'S', state: 'upcoming', amount: '+$0.1' },
  ],
}

/**
 * A badge on the achievements rail. Exactly one of `earnedOn` / `cta` is set:
 * a badge you have earned shows the date you earned it, and one you have not
 * shows the single action that would earn it. That is the whole state model.
 */
export type Achievement = {
  id: string
  title: string
  image: string
  /** Set once earned — displayed in place of the CTA. */
  earnedOn?: string
  /** Set while unearned — the one thing to do about it. */
  cta?: string
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'link-card', title: 'Link a card', image: linkCard, earnedOn: '2025/04/10' },
  { id: 'invite-friend', title: 'Invite a friend', image: inviteFriend, cta: 'Invite now' },
  { id: 'earn-bonus', title: 'Earn a Bonus', image: earnBonus, cta: 'Top up now' },
  { id: 'visit-restaurant', title: 'Visit a restaurant', image: visitRestaurant, cta: 'Explore now' },
  { id: 'make-post', title: 'Make a post', image: makePost, cta: 'Post now' },
  // Figma gives this one the SAME art as "Visit a restaurant" (both point at
  // Rectangle3753 in 20012:12716) — reproduced rather than substituted, but
  // it looks like an oversight and probably wants its own badge.
  { id: 'daily-checkin', title: 'Daily checked In', image: visitRestaurant, cta: 'Check in now' },
  { id: 'send-money', title: 'Send Bravo Money', image: sendMoney, cta: 'Send now' },
]

/**
 * A brand-new account: nothing collected, nothing earned. Same shapes, so the
 * screen renders it without knowing who it belongs to — see [Apple] in
 * profileDemo.ts.
 */
export const NEW_CHECK_IN: CheckIn = {
  ...CHECK_IN,
  streakLabel: '0 day',
  // Nothing to have been best at yet.
  bestLabel: undefined,
  week: CHECK_IN.week.map((d, i) => ({ ...d, state: i === 0 ? 'today' : 'upcoming' })),
}

export const NEW_ACHIEVEMENTS: Achievement[] = ACHIEVEMENTS.map(({ earnedOn: _earnedOn, ...a }) => ({
  ...a,
  // The one you have earned becomes one you could — every badge is ahead of
  // you on day one.
  cta: a.cta ?? 'Link now',
}))
