// The copy and the photos for the brand-new-account empty states.
//
// Kept in one file rather than inline in each screen, because the whole point
// of these cards is that they read as one voice: same rhythm, same "you
// haven't yet — here's the one thing to do" shape. Side by side in a list
// they can be edited as a set, which is how they will be reviewed.
//
// Only the profile's Activity copy is Figma's (19895:20914); the rest follow
// its pattern, and are the ones to redline first.
import postPhoto from '../assets/social/post-photo.jpg'
import venuePhoto from '../assets/social/venue-amcafe.jpg'
import dimsumPhoto from '../assets/thumb-dimsum.jpg'

/**
 * The three photos in the clipped fan. Deliberately food, not people: the fan
 * is a picture of what the space fills up with, and every one of these cards
 * fills up with meals.
 */
export const EMPTY_PHOTOS = [postPhoto, venuePhoto, dimsumPhoto]

export const EMPTY_COPY = {
  /** Figma 19895:20914 — the one the designer wrote. */
  activity: {
    lines: ['Nothing here… yet 👀', 'Share your first restaurant visit to get started'],
    cta: 'Share your first post',
  },
  taste: {
    // Kept under ~48 characters, like Figma's own second line: the card is
    // 254px wide inside its padding, and a third line unbalances it.
    lines: ['No taste identity… yet 👀', 'Visit a few restaurants to build your palate'],
    cta: 'Find a restaurant',
  },
  // No entry for the community feed's "For you" tab on purpose: it is
  // discovery, so it has something to show from the first session.
  friends: {
    lines: ['No friends… yet 👀', 'Add someone and start a dining challenge together'],
    cta: 'Find your friends',
  },
  merchants: {
    lines: ['No eligible merchants… yet 👀', 'Check back when this challenge goes live'],
  },
} as const
