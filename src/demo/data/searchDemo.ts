// EDIT ME — demo data for the Home search flow (Figma 19380:5446 …
// 19559:167807). Everything matches on "happy" so a single query lights up
// both the people and the merchant sections.
import avatarHappy1 from '../assets/social/avatar-happy1.png'
import avatarHappy000 from '../assets/social/avatar-happy000.png'
import avatarHappyman from '../assets/social/avatar-happyman.png'
import avatarHappyg from '../assets/social/avatar-happyg.png'
import avatarHappy0 from '../assets/social/avatar-happy0.png'
import type { FollowState } from '../components/PersonRow'

export type SearchPerson = {
  id: string
  name: string
  avatar: string
  visited: number
  posts: number
  follow: FollowState
}

export type SearchMerchant = {
  id: string
  name: string
  distance: string
}

// The five follow states Figma shows across 19380:5756 and 19559:167807.
export const SEARCH_PEOPLE: SearchPerson[] = [
  { id: 'happy1', name: 'happy1', avatar: avatarHappy1, visited: 73, posts: 15, follow: 'following' },
  { id: 'happy000', name: 'happy000', avatar: avatarHappy000, visited: 73, posts: 15, follow: 'mutual' },
  { id: 'happyman', name: 'happyman', avatar: avatarHappyman, visited: 73, posts: 15, follow: 'follow-back' },
  { id: 'happyg', name: 'Happyg', avatar: avatarHappyg, visited: 73, posts: 15, follow: 'follow-back' },
  { id: 'happy0', name: 'happy0', avatar: avatarHappy0, visited: 73, posts: 15, follow: 'follow' },
]

export const SEARCH_MERCHANTS: SearchMerchant[] = [
  { id: 'm1', name: 'Happy Day Cafe Richmond', distance: '3.7 km' },
  { id: 'm2', name: 'Happy Day Cafe Vancouver', distance: '3.7 km' },
  { id: 'm3', name: 'Happy Lamb Hot Pot Richmond', distance: '3.7 km' },
  { id: 'm4', name: 'Happy Lamb Hot Pot Vancouver', distance: '4.2 km' },
  { id: 'm5', name: 'Happy Lamb Hot Pot Coquitlam', distance: '11.8 km' },
]

// Figma annotation on 19380:5453: "tight to users behavior: 1. time
// 2. location 3. budget 4. friend visits 5. trending campaign" — these are
// LLM-generated per user, not a fixed list.
export const PROMPT_STARTERS = [
  'Best dim sum in Richmond',
  'New onboarded restaurants',
  'Quick lunch near me',
  'Quiet cafe for work',
]
