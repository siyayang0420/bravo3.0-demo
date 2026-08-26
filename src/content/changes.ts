// ============================================================
// EDIT ME — "What's new" content.
//
// One entry per design update, newest first. The page groups them by
// `date`, so entries sharing a date sit under one heading in the order
// they appear here — keep the newest of that day at the top.
//
// Written from the commit history, but these are NOT commit messages:
// the audience is everyone, not the person who wrote the code, so each
// `detail` says what CHANGED ON SCREEN rather than which files moved.
// ============================================================

export type Change = {
  /** ISO yyyy-mm-dd. Rendered as the group heading, formatted in UTC. */
  date: string
  /** Which part of the product this touched. */
  area: string
  areaColor: 'purple' | 'pink' | 'blue' | 'mint' | 'orange'
  title: string
  /** One or two sentences, in the language of the design. */
  detail: string
}

export const CHANGES: Change[] = [
  {
    date: '2026-08-25',
    area: 'Empty states',
    areaColor: 'pink',
    title: 'Every page has a first-run state',
    detail:
      'A dashed card with a half-hidden fan of photos now stands in wherever a brand-new account has nothing to show — Activity, Taste Identity, the Friends feed. Balances read $0.00, and the streak, level and dining-challenge card stay away until they are earned.',
  },
  {
    date: '2026-08-25',
    area: 'Demo',
    areaColor: 'orange',
    title: 'Apple, a brand-new account',
    detail:
      'A third identity in the switcher, alongside Bobby and Happy: someone who signed up moments ago and has done nothing yet, so any page can be reviewed in its empty state.',
  },
  {
    date: '2026-08-25',
    area: 'Venue detail',
    areaColor: 'orange',
    title: 'The venue header stays put',
    detail:
      'The back arrow and the merchant name now ride over the page on a white-to-transparent fade, so photos and posts dissolve under them instead of colliding. Scrolling folds the two rows into one, and a long name truncates 16px clear of the save and share buttons.',
  },
  {
    date: '2026-08-25',
    area: 'Map',
    areaColor: 'mint',
    title: 'A friend’s note opens where it was written',
    detail:
      'Tapping the note floating over a map card now lands you on that post inside the venue, briefly highlighted, rather than at the top of the page with the note to go find.',
  },
  {
    date: '2026-08-25',
    area: 'Community',
    areaColor: 'pink',
    title: 'The like button holds still',
    detail:
      'Liking a post used to shove the whole control sideways and snap it back, because the old and new counts were both on screen during the crossfade. One count, one column, no movement.',
  },
  {
    date: '2026-08-25',
    area: 'Venue detail',
    areaColor: 'orange',
    title: 'Venue header type pass',
    detail: 'Sizes reset on the venue title and the saver count so the header reads in one glance.',
  },
  {
    date: '2026-08-24',
    area: 'Venue detail',
    areaColor: 'orange',
    title: 'A full page behind every map pin',
    detail:
      'Tapping a venue card opens the whole place: a photo rail, the cashback offer, the faces who saved it, what people wrote — each post a leaning stack of photos that opens full screen — and three places with the same vibe.',
  },
  {
    date: '2026-08-24',
    area: 'Challenge',
    areaColor: 'purple',
    title: 'Choosing who to invite',
    detail:
      'A screen of its own for picking friends into a dining challenge, with searchable rows and a floating stack of faces that fills as you choose.',
  },
  {
    date: '2026-08-24',
    area: 'Spendable',
    areaColor: 'mint',
    title: 'Balance and Bonus on one card',
    detail:
      'The two pots became swipeable panes of a single sheet that resizes between them, rather than two separate sheets that happened to look alike. Recent activity is held back until the ledger behind it is real.',
  },
  {
    date: '2026-08-24',
    area: 'Profile',
    areaColor: 'blue',
    title: 'Top-bar actions reordered',
    detail: 'Settings and notifications now sit in the same order they do everywhere else.',
  },
  {
    date: '2026-08-24',
    area: 'Design system',
    areaColor: 'purple',
    title: 'Component catalogue brought up to date',
    detail: 'Every component that has landed since the last pass is documented with its states.',
  },
  {
    date: '2026-08-07',
    area: 'Profile',
    areaColor: 'blue',
    title: 'Taste Identity, and both sides of an invite',
    detail:
      'The taste radar and cuisine breakdown that read a profile’s history, plus the pending-challenge screen from both ends — the sender waiting on seats, and the receiver with an Accept pill on their own.',
  },
  {
    date: '2026-08-07',
    area: 'Search & AI',
    areaColor: 'blue',
    title: 'Search that answers instead of shrugging',
    detail:
      'Starter prompts are now written per screen, and a query that matches nothing is handed to the assistant rather than dead-ending on “no results”.',
  },
  {
    date: '2026-08-07',
    area: 'Map',
    areaColor: 'mint',
    title: 'A real map, and a real cast',
    detail:
      'The mocked map became one you can pan and zoom, with restaurant pins on it. Twelve named people became the single source of every face in the demo, so a name and the photo beside it always agree.',
  },
  {
    date: '2026-08-07',
    area: 'Design system',
    areaColor: 'purple',
    title: 'Expanded states documented',
    detail: 'The newly added screens and their states written up alongside the components.',
  },
  {
    date: '2026-08-06',
    area: 'Profile',
    areaColor: 'blue',
    title: 'Profiles, and the flight into them',
    detail:
      'Public and private profiles, and the hero transition that carries a tapped face out of a feed and lands it in the profile header before the rest of the page arrives.',
  },
  {
    date: '2026-08-06',
    area: 'Challenge',
    areaColor: 'purple',
    title: 'Challenge detail and its coin',
    detail:
      'The full challenge screen, the coin you can push around, and the floating avatar stack that shows who is in.',
  },
  {
    date: '2026-08-06',
    area: 'Search & AI',
    areaColor: 'blue',
    title: 'One search, shared by every screen',
    detail:
      'A single search launcher every screen opens, the assistant thread it hands off to, and the voice orb behind the mic.',
  },
  {
    date: '2026-08-06',
    area: 'Foundations',
    areaColor: 'purple',
    title: 'The first working build',
    detail:
      'The review site and the Home screen, built from the Figma file on the Bravo tokens and DM Sans — the real UI rather than screenshots of it.',
  },
]
