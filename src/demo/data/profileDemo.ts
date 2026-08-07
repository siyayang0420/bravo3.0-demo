// Profile demo data (Figma Profile-Public 19612:9840 / Profile-Private
// 19703:52774).
//
// One profile template. Opening a different person's profile only swaps the
// name and avatar — everything else (counts, stats, the Activity feed) is
// shared demo content, which is all a review build needs. `publicProfile`
// stamps a person onto that template; ME_PROFILE is the signed-in user.
import { type Post } from '../components/PostCard'
import { type AchievementLevel } from '../components/AchievementLabel'
import navAvatar from '../assets/avatar.png'
import avatarHappy1 from '../assets/social/avatar-happy1.png'
import avatarHappyman from '../assets/social/avatar-happyman.png'
import avatarHappyg from '../assets/social/avatar-happyg.png'
import avatarHappy0 from '../assets/social/avatar-happy0.png'
import postPhoto from '../assets/social/post-photo.jpg'
import venueThumb from '../assets/social/venue-amcafe.jpg'

/** The minimum to open a profile — the rest is filled from the template. */
export type ProfilePerson = { name: string; avatar: string }

export type ProfileData = ProfilePerson & {
  streak: string
  level: AchievementLevel
  joined: string
  followers: number
  following: number
  friends: number
  visited: number
  saved: number
  /** Faces in the dining-challenge avatar stack. */
  challengePartners: string[]
  posts: Post[]
}

const VENUE = {
  name: 'AM Cafe',
  meta: 'Cafe • Vancouver • 15.13km',
  thumbnail: venueThumb,
  cashback: '3%',
}

// The Activity feed — three of the PostCard variants, exactly as the design
// lists them. Author and avatar are the profile's, so the feed reads as
// theirs.
function templatePosts(author: string, avatar: string): Post[] {
  return [
    {
      id: 'pr-1',
      author,
      avatar,
      streak: '2X',
      level: 'lv1',
      date: 'Jun 3, 2026',
      caption: 'Best Cantonese cafe, will come again soon next time when my fam visit',
      venue: VENUE,
      photos: [postPhoto, postPhoto],
    },
    {
      id: 'pr-2',
      author,
      avatar,
      streak: '8X',
      level: 'lv7',
      date: 'Jun 3, 2026',
      caption: 'Earn extra $5 bonus from completing a challenge.',
      achievement: { kind: 'streak', label: '5-month streak!' },
    },
    {
      id: 'pr-3',
      author,
      avatar,
      streak: '8X',
      level: 'lv7',
      date: 'Jun 3, 2026',
      caption: 'Earn extra $5 bonus from completing a challenge.',
      achievement: { kind: 'spend', label: 'Unlocked Master!' },
    },
  ]
}

export function publicProfile(person: ProfilePerson): ProfileData {
  return {
    ...person,
    streak: '8X',
    level: 'lv7',
    joined: 'Joined since April 2024',
    followers: 152,
    following: 54,
    friends: 54,
    visited: 70,
    saved: 46,
    challengePartners: [avatarHappy1, avatarHappyman, avatarHappyg, avatarHappy0],
    posts: templatePosts(person.name, person.avatar),
  }
}

// The signed-in user — the nav avatar. Its name is a placeholder, like the
// Figma's "Bobby".
export const ME_PROFILE: ProfileData = publicProfile({
  name: 'Bobby',
  avatar: navAvatar,
})
