# Bravo Rewards 3.0 — Component Inventory

Every time a Figma link is implemented, the elements on that screen are first
triaged: **is this a reusable component, or one-off layout?** Anything reused
across screens — or explicitly built as a component in Figma — becomes a React
component under `src/demo/components/`. Everything else stays inline in the
screen file.

This file is the running index. Keep it updated as screens land.

> The **Design System** section of the review site renders every component here
> live, with its props table, tokens, and implementation notes. That page is
> driven by `src/content/designSystem.tsx` — add an entry there whenever you add
> a component, or it won't appear in the library.

## Rules

1. **Component** if: it appears on more than one screen, has variants, or is a
   named component in Figma.
2. **Inline** if: it is screen-specific composition (a particular row, a
   particular header arrangement).
3. **Register it**: every component gets an entry in
   `src/content/designSystem.tsx` (summary, props, tokens, Figma node ids,
   Flutter caveats) so it shows up in the live library.
3. **Icons**: Lucide only, across the whole project. Icon names in the Figma
   layer names (`scan-line`, `bell`, `map`, `users-round`, `scan-qr-code`,
   `audio-lines`, `mic`, `plus`) are already Lucide names — use them directly.
4. **Tokens**: never hardcode a color, radius, or spacing value. Use the
   `--bv-*` variables in `src/demo/bravo-app.css`, which are generated from the
   Figma variable exports in `Figma Variables/`.

---

## Home (Figma `19237:3737`)

| Figma node | Component | File | Notes |
|---|---|---|---|
| `19548:163732` | **BalancePill** (cash variant) | `components/BalancePill.tsx` | Neutral-100 pill, inner white glow, drop shadow |
| `19548:163734` | **BalancePill** (coin variant) | `components/BalancePill.tsx` | Same component + `leading` coin icon slot |
| `19548:163745` | **CircleIconButton** (scan) | `components/CircleIconButton.tsx` | 35px white circle, Lucide `ScanLine` |
| `19548:163747` | **CircleIconButton** (bell) | `components/CircleIconButton.tsx` | Same component, Lucide `Bell` |
| `19453:11111` | **FilterChip** | `components/FilterChip.tsx` | "bubble" inner-shadow style, optional `ChevronDown` |
| `19453:11120` | **SuggestionChip** | `components/SuggestionChip.tsx` | 30px thumbnail + label. Each is a canned prompt: `onClick` calls `useSearchLauncher().ask(label)`, which sends the chip's own copy straight to the AI thread — no sheet, no typing |
| `19453:11129` | **PromptBox** | `components/PromptBox.tsx` | `variant`: `ai` (turning gradient ring, plus / mic / voice) or `search` (hairline, search icon only) |
| `19453:11130` | **BottomNav** | `components/BottomNav.tsx` | map · users-round · scan-qr-code · circle-star · avatar |
| `19564:169322` | *inline* | `screens/HomeScreen.tsx` (`.bv-dock`) | Dock container — see below |
| `19548:163729` | *inline* | `BravoApp.tsx` | Apple status bar — chrome, not product UI |
| `19237:3738` | *inline* | `screens/HomeScreen.tsx` | Map background image, cropped per Figma |

### Bottom nav — cube-face hide

On the Social screen the nav collapses as you scroll down and returns on the
way up. The motion is a **cube face hinged along its top edge**, not a slide:
the slot carries a short `perspective: 320px` and the nav rotates
`rotateX(-90deg)` about `transform-origin: 50% 0%`, so its lower edge swings
away from the viewer (−Z) and foreshortens as it goes. Opacity fades slightly
ahead of the turn (0.22s vs 0.34s) so it is gone before the face is edge-on.

The slot's height and margin collapse on the same curve, so the dock closes
up behind it. `backface-visibility: hidden` stops the reverse side flashing
through at the end of the turn.

For Flutter: this is a `Transform` with a perspective entry in the matrix
(`Matrix4..setEntry(3, 2, 1/320)..rotateX(-pi/2)`) plus an alignment of
`Alignment.topCenter` — not an `Offset` slide.

### PromptBox — the ring turns

The `ai` variant's gradient ring rotates continuously: **same four colours at
the same four stops, only the gradient's angle moves.** It sweeps 90° → 450°
over 6s, `linear` and infinite, so a paused ring is Figma's 90° exactly and
the wrap is seamless.

The angle is a registered custom property:

```css
@property --bv-ring-angle { syntax: '<angle>'; inherits: false; initial-value: 90deg; }
```

Registration is the whole trick — an unregistered custom property is a
string, so it would **jump** between keyframes instead of sweeping.
Browsers without `@property` fall back to the initial value and hold the
ring still, which is the old design, so there is nothing to guard.

The `search` variant paints over the gradient with a hairline border, so it
sets `animation: none` rather than animating a property nothing reads.
Killed under `prefers-reduced-motion`.

For Flutter: a `SweepGradient`/`LinearGradient` whose `transform` is driven
by an `AnimationController` on a 6s `repeat()`, not a shader swap.

### PromptBox — recording state (`19377:5090`)

A third end-state beside idle and typed. Tapping the mic swaps the field for
the **Voice Input** pill (`VoiceInput.tsx`, Figma `I19377:5111;1355:26180`):
ten metering bars in `info-100/50%`, then a **Stop** button in `info-400`,
with the black submit arrow to its right. The field is hidden at opacity 0
(Figma's own treatment), not unmounted, so its caret survives the take.

- **The bar keyframes are Figma's, not invented.** Pulled from
  `get_motion_context`: ten independent 2s `easeInOut` loops whose peaks are
  offset (bar 1 crests at ~17% of the cycle, bar 10 at ~34%), so the row
  ripples rather than pulsing as one block. The exact height tracks live in
  `VoiceInput.tsx`.
- **The mic only arms when a `voiceTranscript` is supplied.** Without one it
  stays the decorative glyph it was — so the dock's non-interactive trigger
  box never records; only the search sheet's live box does. Its transcript
  is `"Happy"`.
- **Stop → the pill, Send (↑) → submit.** Recording submits what it *heard*,
  not the empty field, and hands off through the same `onAsk` a typed query
  uses — so the arrow lands on the bravo AI thread (this is the `19377:5090`
  → AI-page flow the design implies).
- Killed under `prefers-reduced-motion` — the bars hold at their rest
  heights.

For Flutter: one `AnimationController` per bar (or one controller with ten
`Interval`s) driving `SizedBox` heights; do not rebuild the row per frame.

### Dock redesign (`19564:169322`)

The dock was a frosted white card with rounded top corners and a drag
handle. It is now a **vertical fade** — transparent at the top, solid white
from 34.4% down — with no card, no blur, and no handle. `PromptBox` and
`BottomNav` are unchanged between the old and new nodes and are reused
as-is; only the container changed.

For Flutter: this is a `DecoratedBox` with a `LinearGradient`, not a sheet.
There is nothing to drag — if the handle implied a expandable sheet, that
affordance is gone.

### Design annotations captured

- **`19453:11110`** — "Other than Cuisine and Price (default), the other 2–3 tags
  are LLM generated based on user preferences." Recorded in
  `components/FilterChip.tsx` and `screens/HomeScreen.tsx`.

### Figma effect styles used

Each effect is both a **token** and a **class**, so it can be dropped onto
any element the same way it is applied on the canvas. Use the class by
default; reach for the token only when the effect has to be composed with
another shadow on the same element, since `box-shadow` does not
cascade-merge.

| Figma style | CSS token | Class |
|---|---|---|
| `bubble` | `--bv-inset-bubble` | `.bv-bubble` |
| `accent-default` | `--bv-inset-accent` | `.bv-accent` |
| (balance pill glow) | `--bv-inset-glow` | — |
| (top bar drop shadow) | `--bv-shadow-float` | — |

**`accent` is the dark-surface treatment** — a hard black lip along the
bottom and a soft white catch-light along the top:

```css
box-shadow: 0 -4px 4px 0 #000 inset,
            0 1px 5px 0 rgba(255, 255, 255, 0.6) inset;
```

It is what makes the black pills read as raised rather than flat, so it
belongs on **every solid dark control**, not just the one it was first
built for. Currently: the prompt box's voice button, the challenge progress
fill, and every solid `Button` at both sizes. A flat `#202020` is wrong.

**`bubble` is the light-surface counterpart**, carried by every avatar and
the neutral chips.

#### Porting the effects to Flutter

**Flutter has no inset `BoxShadow`.** Use `flutter_inset_box_shadow`, which
re-exports `BoxShadow` with an `inset` flag; without it, the equivalent is a
`CustomPainter` using `MaskFilter.blur(BlurStyle.inner, sigma)`. Only
`--bv-shadow-float` is a real outer shadow and needs no package.

Two things that are easy to get wrong:

1. **Paint order is reversed.** CSS paints the *first* shadow on top;
   `BoxDecoration` paints the list in order, so the *last* entry lands on
   top. Every Dart list must be the CSS list reversed.
2. **`blurRadius` maps 1:1 to the CSS blur radius.** Do not pre-convert it to
   a sigma — the framework does that internally.

```dart
// accent-default — the dark-surface treatment
const bvInsetAccent = <BoxShadow>[
  // white catch-light first — CSS lists it last
  BoxShadow(color: Color(0x99FFFFFF), offset: Offset(0, 1),  blurRadius: 5, inset: true),
  BoxShadow(color: Color(0xFF000000), offset: Offset(0, -4), blurRadius: 4, inset: true),
];

// bubble — the light-surface treatment
const bvInsetBubble = <BoxShadow>[
  BoxShadow(color: Color(0x1A000000), offset: Offset(0, -2), blurRadius: 5, inset: true),
  BoxShadow(color: Color(0xFFFFFFFF), offset: Offset(0, 1),  blurRadius: 4, inset: true),
];

const bvInsetGlow  = <BoxShadow>[BoxShadow(color: Color(0xFFFFFFFF), blurRadius: 6.4, inset: true)];
const bvShadowFloat = <BoxShadow>[BoxShadow(color: Color(0x26000000), offset: Offset(0, 5), blurRadius: 4)];
```

One more caveat on `float`: where the web uses `filter: drop-shadow()` rather
than `box-shadow` — the VenueCard and merchant save buttons — the shadow
follows the *painted alpha*, not the box. That is `DropShadow`/`Shadow` on the
child in Flutter, not `BoxDecoration.boxShadow`.

The Design System page renders all of this per effect, CSS beside Dart.

---

## Combined Spendable sheet (Figma `19564:172054`)

Opens from either **BalancePill** in the Home top bar. Tapping the scrim closes it.

| Figma node | Component | File | Notes |
|---|---|---|---|
| `19564:172054` | **SpendableSheet** | `components/SpendableSheet.tsx` | White card: total, the two balances, top-up CTA |
| `19564:172059` / `19564:172067` | **BalanceRow** | `components/BalanceRow.tsx` | Label + sublabel / amount + Lucide `ChevronRight`; drills into balance detail |
| `1344:21875` | **Button** | `components/Button.tsx` | DS button component. `lg` is 48px at radius 16, `sm` hugs its label at radius 8. `ButtonAccent` is the primary-500 run inside the label |
| `19564:172066` | *inline* | `bravo-app.css` (`.bv-sheet-divider`) | 1px `--bv-border-subtle` rule between the two rows |
| — | *inline* | `screens/HomeScreen.tsx` | Scrim + placement (`.bv-spendable-anchor`) — screen-level, not part of the card |

### Notes for the Flutter build

- **`$3057` is derived, not authored** — the sheet sums the two balances
  (`2916.12 + 140.88`) and drops the decimals when the total is whole. Don't
  hardcode it.
- **Top bar stays above the scrim.** The balance pills keep full brightness
  while the sheet is open (they are its anchor); the map and the dock dim.
  This matches the design mock — confirm it is intentional. It is the only
  pop-up that behaves this way: see **Pop-up overlay** below.
- **Sheet corner radius is 36, not the 16 Figma specifies** — an explicit
  direction from Siya (16 → 24 → 36). Off-token: the radius scale stops at
  24 (`radius-3xl`), so it is a literal. The Promotions sheet is **26**, not
  the same value — the two were briefly equal at 24 and are now deliberately
  different.
- **The CTA radius is 16, not the 12 Figma specifies** — set at the same
  time. This is the shared DS `Button` at `size="lg"`, so it applies wherever
  a large button appears; `sm` is untouched at 8. On token (`radius-2xl`).
- **Off-token spacing:** the card's 20px vertical gap has no matching
  `spacing-*` variable in `Figma Variables/Spacing.json` (the scale jumps
  16 → 24). Implemented as a literal. Worth adding `spacing-5` in Figma or
  snapping the design to 24.
- Figma puts a 7.5px backdrop blur behind the card's **opaque** white fill, so
  it has no visible effect. Not implemented.

---

## Promotions (Figma `19453:10434`, `19243:4646`, `19650:15043`)

A **conditional Home state**. When a promotion is live, an orange "My offers?"
chip leads the suggestion row; tapping it slides up the **Offers for you**
sheet. Toggle it from **Home state** on the Live UI Demo page — that control
is demo chrome, not product UI.

| Figma node | Component | File | Notes |
|---|---|---|---|
| `19453:10434` | **PromoChip** | `components/PromoChip.tsx` | Orange chip, `bubble` inset, white rosette on a 30% white tile |
| `19243:4646` / `19650:15069` | **OffersSheet** | `components/OffersSheet.tsx` | Bottom sheet — handle, offers, then promotions |
| `19243:4657` / `19650:15243` | **OfferCard** | `components/OfferCard.tsx` | Merchant offer with the Activate → Activated CTA |
| `19299:7837` / `19344:8461` | **ExpiryPill** | `components/ExpiryPill.tsx` | The neutral "Expired on …" pill, shared by both cards |
| `19564:172570` / `19564:172586` | **PromoCard** | `components/PromoCard.tsx` | `expiryStyle: 'text' \| 'badge'` — the only difference between the two instances |
| `19564:172572` | **Coin** | `components/Coin.tsx` | Extracted from the inline `bv-coin` markup; now serves 19px (pill) and 42px (card) |
| `1344:21875` | **Button** `size="sm"` | `components/Button.tsx` | Same DS button, radius-8 and hugging its label. `variant` picks the fill |

### The sheet replaced the modal (`19243:4646`)

The old **PromoSheet** — a centred "Featured promotions" card over a dimmed
app — is gone, superseded by a bottom sheet that carries both sections. The
file was deleted; `PromoCard` survives unchanged inside the new sheet.

What the new node specifies that the modal did not:

- **The surface is `rgba(255,255,255,0.9)` over a 7.5px backdrop blur.** The
  map has to read through it — a plain white fill is wrong.
- **The node draws no scrim** — the map stays undimmed behind it. This is the
  one place the build departs from the node: every pop-up in the app now dims
  behind it (see **Pop-up overlay** below), and consistency won over the
  single node. The sheet's own translucency still lets the map read through.
- **Fixed 636px tall**, pinned to the bottom edge, covering the dock. The two
  sections scroll inside it; the sheet itself does not resize.
- **The handle is a real affordance** — drag down past 120px, or flick at
  500px/s, to dismiss. Figma draws the handle; the behaviour is implied by it.
- Top corners are **24** (`radius-3xl`), matching the node — not the 26/36 the
  two older sheets were moved to.

### OfferCard and the activated state (`19650:15243`)

The 97×108 photo carries the boosted rate on a bottom gradient with **the rate
it replaces struck through beside it** — that contrast is the whole pitch of
the card, so it is not decoration to drop. The right column is
`space-between` against the photo's full height, which keeps the expiry pill
and the CTA aligned across rows however long the merchant name runs.

Activation is a **fill change on the shared DS Button**, not a new control:

| State | Button |
|---|---|
| default | `size="sm" variant="outline"` — white, 0.5px `--bv-border-strong`, "Activate it" |
| activated | `size="sm" variant="success"` — `--bv-success-400`, white text, "Activated" + Lucide `Check` |

Which is why `Button` gained a `variant` prop (`solid` \| `outline` \|
`success`) rather than a second component. Activated state is held by the
sheet and is per offer; in the product it should come back from the
activation call.

### Notes for the Flutter build

- **The promo chip is in Inter Bold in Figma** while the whole app is DM Sans.
  Implemented in DM Sans so it matches the chips beside it — the node looks
  like it predates the font switch. Confirm.
- **Sheet corner radius is 26, not the 16 Figma specifies**, and the inner
  promo cards are 24 — both explicit directions from Siya. The two sheets
  were briefly equal at 24; they are now deliberately different: this one is
  **26**, Combined Spendable is **36**. 26 is off-token (the radius scale
  jumps 24 → full); 24 is `radius-3xl`. Worth updating the Figma nodes.
- The close control is a flat image export in Figma; rebuilt as a Lucide `X`
  on a neutral circle per the Lucide-only rule, so its greys are an
  approximation.
- This sheet dims the **whole** app including the top bar, unlike the
  Combined Spendable sheet whose anchor pills stay lit.

### Pop-up overlay

Every pop-up in the app sits on one overlay, `.bv-scrim`: a full-bleed
`rgba(0,0,0,0.35)` button that dims what is behind it and closes the pop-up
when tapped, fading in and out over 0.18s with the surface it belongs to.

It has **two depths**, because one pop-up hangs off the chrome and the rest
cover it:

| | z | dims |
|---|---|---|
| bottom stack (filters, dock, nav) | 6 | |
| `.bv-scrim` | 7 | map + dock |
| top bar (balance pills) | 8 | |
| Combined Spendable sheet | 9 | |
| `.bv-scrim.over-topbar` | 10 | map + dock + **top bar** |
| Offers / Search sheet | 11 | |

The Combined Spendable sheet uses the shallow one so its anchor pills stay
lit; Offers and Search use `over-topbar`, since nothing up there anchors
them. The status bar sits at z-30, above both, as it does on iOS. The fake
keyboard is a child of the search sheet, so it rides above the scrim with it
rather than needing a z-index of its own.

For Flutter: one `ModalBarrier` widget parameterised by the two depths, not
a scrim re-declared per sheet — the depths are the only thing that varies.

---

## Social (Figma `19564:170684`)

The **Friends** tab — "Home-Scroll Up Discovery-With bar". Section tabs, a
leaderboard rail, then a scrolling post feed over the shared dock.

| Figma node | Component | File | Notes |
|---|---|---|---|
| `19564:171669` | **SectionTabs** | `components/SectionTabs.tsx` | "For you" / "Friends" in **Boldonse**, 2px rule under the active tab |
| `306:8847` (DS file) | **AchievementLabel** | `components/AchievementLabel.tsx` | `StreakLabel` + `LevelLabel`; the full set — streak and Lv.1–Lv.7 |
| `19564:171678` | **LeaderboardRail** | `components/LeaderboardRail.tsx` | 61×82 rounded-portrait avatars, name under each |
| `19564:171797` / `19577:173585` | **PostCard** | `components/PostCard.tsx` | Both feed items, one component — see below |
| `19577:173665` | **VenueCard** | `components/VenueCard.tsx` | Tagged place: thumb + cashback badge, name/meta, bookmark — see below |
| — | **SaveGlyph** | `components/SaveGlyph.tsx` | The bookmark's saved/unsaved states; shared by VenueCard and MerchantRow |
| `19564:171724` | *inline* | `screens/SocialScreen.tsx` (`.bv-compose-btn`) | primary-500 FAB, Lucide `SquarePen`, glows in its own colour |
| `19564:170703` / `170705` | *reused* | **CircleIconButton** | Same component as Home's scan/bell — only the Lucide icon differs (`ArrowRightLeft`, `Bell`) |
| `19564:171622` | *reused* | `.bv-dock` + **PromptBox** + **BottomNav** | Same dock as Home; only the compose button is added |

### The two tabs (`19582:175875`)

`For you` and `Friends` are different feeds, not a filter over one list:

| | For you | Friends |
|---|---|---|
| header block | Leaderboard rail | **ChallengeCard** — In Progress Challenge |
| feed | the six `PostCard` variants | four posts, same component |

Switching **shifts like a carousel**, not a cross-fade. The pane you are
heading toward enters from that side while the outgoing one leaves the
opposite way; `AnimatePresence mode="popLayout"` takes the exiting pane out
of flow so the two travel across each other rather than stacking. Direction
comes from the tabs' index order, so it stays correct in both directions.
`.bv-social-scroll` gets `overflow-x: hidden` to clip the off-screen pane,
and the feed scrolls back to the top on switch.

For Flutter: a `PageView` over the two feeds gives this for free — the
direction bookkeeping here exists only because the web version swaps
children rather than paging.

### ChallengeCard revision (`19582:176379`)

Three changes from the first build of this node:

1. **Avatars gain a 2px white ring** and the overlap tightens from 20px to
   15px, so each face is separated from the one behind. `box-sizing:
   border-box` keeps the frame 48×64 with the ring inside it, as in Figma;
   `background-clip: padding-box` stops the photo bleeding under the ring.
2. **The stack is `pointer-events: none`** — the whole card is the tap
   target, and the faces are decoration.
3. **`Exp: 2026/12/15` → `67 days left`.**

**The countdown is derived, not authored** — the same rule as the bar width.
Figma's two numbers disagree: "67 days left" against an expiry of
`2026/12/15`, which is 131 days out from today. If 67 is the intended
number, the expiry in the demo data is the thing to move (≈`2026/10/10`),
not the label. Clamped at 0 so a passed challenge reads "0 days left", and
it singularises at 1.

`daysLeftLabel(expires)` is exported from `ChallengeCard.tsx` and used by
the **detail** screen too, which no longer prints a date — one countdown,
one implementation, so the card and the screen can never disagree.

### Challenge detail (`19608:9122`)

Opened by tapping the ChallengeCard. Slides in from the right over the feed.

**Participant bubbles scale with spend.** Everything on a bubble is a fixed
ratio of the avatar width — height `w x 4/3`, share text `w / 3`, pill
padding `w x 0.192 / 0.096`, pill overlap `w x 0.24`, crown `w x 0.321` —
all read off the four Figma nodes, which agree exactly. **The name is the
one exception: 14px at every size.** The width itself is computed,
`w = 40 + 2.07 x share`, which reproduces Figma's four widths to ~1%, so a
fifth participant sizes itself instead of needing a new hardcoded value.
The largest share gets the crown, picked at runtime rather than flagged in
the data.

**They float and can be dragged.** Each bubble drags within the play area
(`dragConstraints` on the region between the nav and the sheet) and lifts
6% while held. The idle float lives on an inner layer so it never fights
the drag transform — putting both on one element makes them overwrite each
other. Durations are staggered per index so they do not bob in unison.

**The coin is the same `BravoCoin`** as the feed — drag to spin, tap to
flip, `$5` engraved on the back.

**It rests value-side up and introduces itself.** `restAngle={180}` puts the
`$5` face toward the viewer at rest instead of the emblem, and
`introDelay={2000}` makes it spend `introFlips: 2` half-turns two seconds
after mount — forward through the emblem and forward again onto the value —
so the reward reads, turns away, and comes back. Both are *forward* turns
rather than a there-and-back, so the spin never reverses mid-flight. Each
flip is fired from the physics loop's settle branch, not a timer, so the
second starts only once the first has landed; touching the coin cancels
whatever the intro had left.

**The flip itself runs 40% shorter here.** Rather than retune four numbers
by eye, `FASTER_FLIP` steps the same physics at `1 / 0.6` the rate, which
preserves the shape of the motion exactly: `tapImpulse` and `restEps` are
velocities so they scale with the rate, `spring` is an acceleration so it
scales with the square, and `friction` is a per-frame decay so it scales as
a power. Replaying the loop numerically, a half-turn settles in 112 frames
against the default's 186 — 0.602 of the duration.

All of it is **props on this instance**, not package defaults — `coinConfig`
ships `restAngle: 0, introDelay: 0` and its original feel, so the
AchievementPanel's coin in the feed keeps its emblem-up rest, its tap-flip
timing and its scroll-in hint untouched.

**The nav carries a right-hand count**, `Invited: 3/3` — `ScreenNav`'s
`trailing` slot, in the same Boldonse 14 as the title. The numerator counts
the avatars actually on screen, minus your own: you are *in* the challenge,
not invited to it, so `Participant.isYou` marks that one bubble and it is
filtered out. The denominator is `inviteLimit` in the demo data. It is set
to 3, so this challenge reads as full — note the blurb still says "Invite up
to 4 friends", which is one more seat than the count admits.

**The progress bar refills from zero on every open.** It is a plain
`initial → animate` on mount; the screen unmounts on back, so re-entering
replays it. No state flag or timer is involved, which keeps it reliable
when frames are throttled.

### Challenge restyle (`19612:9387`)

Same screen, same interactions — two visual changes:

1. **The sheet has no fill.** The `bg-white` on `19612:9428` is gone, so the
   background blobs run all the way to the bottom of the screen and the coin,
   copy and progress bar sit directly on them. `.bv-challenge-sheet` keeps its
   `32px 32px 0 0` radius from the node, but it now has nothing to clip.
2. **Three blurred blobs**, in two layers, because Figma nests them that way:

| Blob | Figma node | Fill | Layer |
|---|---|---|---|
| Ellipse 3730 | inside `19612:9389` | `#FEE160` (primary-500) | clipped `blur gb` group, 629×456 at (−62, −117) |
| Ellipse 3732 | inside `19612:9389` | — | same group |
| Ellipse 3731 | `19612:9392` | `#C63659` (base-500) | **outside** the clip, rotated 43.33°, 292.689×196.258 box at (−140, 189) |

The odd nested `img` insets (`-87.72% / -63.59%`, `-178.34% / -119.58%`) are
Figma's blur bleed: each SVG's `feGaussianBlur` (`stdDeviation` 200 and 175)
spills the artwork far outside its own frame, so the frame is the anchor, not
the visible size. Reproducing the insets is what puts the blobs in the right
place — dropping them and letting the SVG fill its box shifts everything.

For Flutter: two `ImageFiltered(ImageFilter.blur(...))` ellipses inside a
`ClipRect`, plus a third `Transform.rotate` outside it. The group carries
`opacity: 0.7`.

### Eligible merchants (`19612:9472`)

Pushed from **View 24 eligible merchants** on the challenge detail, sliding in
from the right exactly as the challenge screen does over the feed.

| Figma node | Component | File | Notes |
|---|---|---|---|
| `19612:9480` | **ScreenNav** | `components/ScreenNav.tsx` | Back button + Boldonse 14 title — extracted here and adopted by the challenge screen too. Optional `trailing` label sits right, same type as the title (`Invited: 4/4`) |
| `19612:9555` (×7) | **MerchantRow** | `components/MerchantRow.tsx` | 79×89 photo, rate on a gradient, savers stack, save button |
| `19612:9735` | **PromptBox** `variant="search"` | `components/PromptBox.tsx` | Same DS Prompt Box, search icon in Start Actions and nothing in End |
| `19612:9734` | *reused* | `.bv-merchants-dock` | The same transparent → white 34.4% fade as the Home/Social dock |

- **The save button here keeps its `0 5px 4px rgba(0,0,0,0.15)` shadow** — the
  opposite of the VenueCard one, which Siya had flattened. Different context:
  this one sits on plain white with nothing to lift it off, so the shadow is
  what separates it from the row.
- **It is a real toggle** — see **SaveGlyph** below. Tapping also bumps the
  count, `Saved 65 times` → `Saved 66 times`. State is per row.
  - The count remounts on its value (`key={count}`) so `initial` replays and
    the number rises into place. There is no `AnimatePresence` exit on
    purpose — an exiting inline element leaves the flow and shifts the
    sentence. It is also suppressed until the first tap, or all seven numbers
    would fade in when the list opens.

### SaveGlyph — one definition of "saved"

Both save controls in the app animate identically because they render the
same glyph: MerchantRow's own 30px button, and the 35px **CircleIconButton**
on **VenueCard**.

| | Unsaved | Saved |
|---|---|---|
| fill | transparent | `--bv-black` (`#202020`), 0.22s ease-out |
| glyph | — | pops `1 → 1.28 → 1` over 0.32s |

- **The fill is set in CSS, not through Lucide's `fill` prop.** Lucide writes
  `fill="none"` as a *presentation attribute*, and a CSS rule outranks it —
  that is what makes the fill transition instead of snapping.
- **The pop lives on its own span** so it never fights the press transform on
  the button — the same one-transform-per-element rule as the floating
  avatars. The press itself differs by host: MerchantRow uses framer's
  `whileTap` (0.86), VenueCard inherits `.bv-circle-btn:active` (0.94), which
  is that component's existing house style and was left alone.
- `CircleIconButton` gained an optional `pressed` prop for `aria-pressed`.
  It is set only on the VenueCard bookmark; Home's scan and bell are plain
  buttons and are unaffected.
- **The demo holds saved state locally.** In the product this should come
  from the save API, with the fill and the +1 applied optimistically.
- The savers are **avatars**, so they carry the same `bubble` inset and are
  painted as backgrounds rather than `<img>` — 30px circles overlapping by 10.
- The rate overlay is a `backdrop-filter: blur(0.9px)` over a
  transparent → `rgba(0,0,0,0.9)` gradient on the bottom 31px of the photo.

**Figma repeats one row seven times** — same name, same photo, same "Saved 65
times". The names are varied in the demo data so the list reads as content;
everything else is left as authored. The header says 24 merchants while the
list shows 7, which is a mock-length choice, not a bug.

### Fonts

- **Boldonse** is a second family, used *only* for the section tabs. Added to
  the Google Fonts link in `index.html` and exposed as `--bv-font-display`.
  It ships a **single weight (400)** — never synthesise bold. Bundle the TTF
  for the Flutter build.
- Everything else on this screen is DM Sans, as elsewhere.

### All six feed variants are ONE component (`19582:176666`)

`PostCard` renders every variant. The shell never changes — 30×40 avatar,
8px gap, then a 332px column at gap 12 holding identity+date → caption →
venue → photos → panel → actions. Only the *content fields present* differ:

| # | Variant | caption | venue | photos | panel | actions |
|---|---|---|---|---|---|---|
| 1 | comment, images + text | ✓ | ✓ | ✓ | — | comment · like |
| 2 | comment, text only | ✓ | ✓ | — | — | comment · like |
| 3 | comment, images only | — | ✓ | ✓ | — | comment · like |
| 4 | spend badge earned | ✓ | — | — | spend | like |
| 5 | streak badge earned | ✓ | — | — | streak | like |
| 6 | bonus earned | ✓ | — | — | bonus | like |

The three comment variants are **not code paths** — they fall out of which
fields the data carries. The only two rules the component applies are:
achievement posts set the caption to 12px (vs 14) and drop the comment
action, keeping the heart.

**The heart is its own component (`LikeButton.tsx`) with a like burst and
count.** Comment and Like both render at 20px in **neutral-500** (`#737373`,
not black), matching the venue save bookmark. On tap:

- the glyph fills **red (`#c51f1f`)** and pops `1 → 1.2 → 1` (a quick,
  non-bouncy ease-out over ~0.26s); the colour is one `--bv-like-color`
  custom property on `.bv-like`, shared by the fill and every particle;
- a **count** appears to its right (Figma 19577:173449), 8px gap, 14px
  medium — and stays gray even while the heart is red. It is `likes + 1`
  (default `likes` 0, so it reads "1");
- two small red hearts drift up out of the heart's centre.

The burst is **not one computed arc** — it picks one of **five hand-tuned
shapes** (`BURSTS`) at random each like, so the pair never traces the same
path twice; the shapes differ in spread, height, curvature, lean and stagger.
Every track eases **in and out** (not ease-out) so the hearts lift and settle
softly rather than snapping. Like state is per-post (each card owns its
button) and the burst is skipped under `prefers-reduced-motion`. Particles are
centred by a fixed `-6px` offset, **not** a transform, because framer-motion
overwrites the inline transform as they fly (same trap as the voice orb).

Captions accept either a plain string or `{ text, bold }[]`, because
variants 5 and 6 bold a run mid-sentence ("**5-month**", "**$5**").

**Byline** (`19577:173431`): the date sits inline after the name, separated
by a bullet — `Noooodle123 • Jun 3, 2026` — not right-aligned in its own
column. The name is **bold 14** (it was regular while the date lived
top-right). Figma authors the bullet as a `<li>`; it is a `::before`
separator here, since one byline is not a list.

Photos are 280×302 at radius 16 with a 15px gutter. The place chip is gone —
it became `VenueCard`.

### AchievementPanel + the Bravo coin

The 230px panel inside an achievement post. Three kinds, each a one-off tint:

| Kind | Background | Radius | Art |
|---|---|---|---|
| spend | `#f8f5ff` | 16 | badge sticker, 125.977×79.436 |
| streak | `#fff9ea` | 12 | flame, 45×59.054 |
| bonus | `#fffae3` | 12 | **the live Bravo coin** |

**The coin is a real 3D object, not an image.** Drag to spin, tap to flip;
the bonus amount is engraved on the back face. It is copied **verbatim** from
`~/bravo-coin/src/coin` into `src/demo/coin/` so it stays byte-identical to
its Flutter twin in that repo (`flutter/bravo_coin.dart`) — the physics loop,
`coinConfig.js` numbers and the two SVG faces all have 1:1 Dart counterparts.

> Do not edit `src/demo/coin/*` here. Change it in the bravo-coin repo,
> re-copy, and mirror the numbers in the Dart file.
>
> **Outstanding:** the resting-angle and intro-flip support added for the
> challenge screen (`restAngle` / `introDelay` / `introFlips` in
> `coinConfig.js`, the settle-branch trigger and the pointer-down cancel in
> `useCoinInteraction.js`) was written **here first**. Port it upstream and
> mirror it in `flutter/bravo_coin.dart` before the two drift further.

Because it ships as JS, `allowJs` is on in `tsconfig.json` (with `checkJs`
off, so that source is not held to this project's strictness). The panel
renders it at `size={150} thickness={13}` to fit the 230px panel.

**Scroll-in hint.** When the bonus card scrolls into view the coin turns ~30°
and settles back, so it reads as grabbable rather than as a picture
(`hooks/useCoinFlipHint.ts`). It fires on each false → true visibility edge,
so scrolling away and back re-hints, and is skipped under
`prefers-reduced-motion`.

The hint drives the coin through its **public pointer handlers** — a short
synthetic drag — rather than reaching into its state, precisely so the coin
source stays untouched and in sync with Dart. Two consequences worth knowing:

- The gesture is stepped on a **timer, not rAF**. rAF is frozen while a tab
  is hidden, which would strand the coin mid-drag if the card scrolled in and
  the user switched away.
- Synthetic pointer ids are not real active pointers, so the coin's
  `setPointerCapture` call would throw; it is stubbed for the duration and
  restored after.

If this affordance should ship in the product rather than just the demo, it
belongs **inside** `BravoCoin` (and mirrored in the Dart twin), not in the
panel.

### VenueCard (`19577:173665`)

A hairline `--bv-neutral-150` border at radius 8, `4px / 12px` padding, with a
79×58 thumbnail at radius 6.

- **The cashback badge is body/lg — 16px on 2px/8px padding**, deliberately
  larger than the 12px meta line under the venue name. It reads as the
  headline number on the card, not a footnote.
- **The bookmark has no shadow.** It is the same `CircleIconButton` used in
  the top bars, with `flat` set: the drop shadow exists to lift the button off
  the map, and inside a bordered card Figma drops it. Same 35×35 circle.
- **It saves.** The icon is a **SaveGlyph**, so it fills with `#202020` and
  pops exactly like the merchants list — see that section for the mechanism.
  State is per card, and `onSave` now reports the new value: `(saved: boolean)`.

### The small labels — the full set (DS `306:8847`)

Every variant shares one box — DM Sans **Bold 12** / 1.2, padding 2px 6px,
radius-full, gap 2px — and differs only in tint pair and glyph. The tints are
one-off DS values, deliberately *not* palette tokens:

| Variant | Background | Text |
|---|---|---|
| Streak | `#fff2de` | `#cc7700` |
| Lv.1 | `#ffe5d9` | `#c56d40` |
| Lv.2 | `#f3f5f8` | `#81848a` |
| Lv.3 | `#ffefc6` | `#93783a` |
| Lv.4 | `#fbe5ff` | `#9e53c0` |
| Lv.5 | `#d4dff7` | `#4a66a1` |
| Lv.6 | gradient `#757678` → `#2c2c2e` | `white` |
| Lv.7 | gradient `#8489f5` 11.111% → `#cdf1ff` 108.17% | `#262955` |

- **Lv.6 and Lv.7 are gradients, not flat fills.**
- Streak's `#fff2de` is `rgba(254,167,36,0.15)` flattened over white — the
  mobile file uses the transparent form, the DS the opaque one. Same colour.
- **Each level ships its own laurel artwork** (`laurel-lv1…7.svg`) — the glyph
  is not recolourable, it is 7 separate exports. Together with `flame.svg`
  these are Figma exports, not Lucide: two-tone gradients, drop-shadow filters
  and a masked highlight sweep that no icon set can reproduce.
- The raw exports arrive with Figma's canvas background, a dashed annotation
  border and the chip's own pill fill baked in; each was reduced to just its
  `SpendBadgeStickerLaurel` group so the CSS can own the pill.

### Inconsistencies found in the design (not reproduced)

- The 5th leaderboard avatar is **79px** tall where the other four are 82px.
- The 5th name is **10px** where the other four are 12px.

Both look like slips rather than intent, so the implementation uses 82px / 12px
throughout. Say the word if they were deliberate.

### Assets

`src/demo/assets/social/` — avatars and the post photo were exported at
1024×1536 (~2.2 MB each) and downscaled to the sizes actually rendered;
the folder is 860 KB total instead of 11 MB. The leaderboard, post feed and
in-progress-challenge avatar stack all draw from the shared cast (see
**Shared cast** below) rather than one photo per slot.

---

## bravo AI thread (Figma `19559:168018`, `19559:168156`, `19560:168548`)

Opened by submitting a query from the search sheet — either the ⌤ / arrow-up,
or the **Ask bravo AI about "…"** CTA when nothing matched.

**The three nodes are one screen at three moments**, not three screens, so
they are steps in a sequence rather than separate implementations:

| Node | Step |
|---|---|
| `19559:168018` | "Let me think what do you need …" |
| `19559:168156` | "Looking for restaurants with "Happy" …" + "Found 5 places …" |
| `19560:168548` | "Let me take a closer look …" + "Found 5 places …" |

| Figma node | Component | File | Notes |
|---|---|---|---|
| — | **AiChatScreen** | `screens/AiChatScreen.tsx` | Glow, header, disclaimer, thread |
| `19559:168175` | **AiThinking** | `components/AiThinking.tsx` | Orb + step, with the detail line under it |
| `19559:168177` | **OrbSphere** | `components/OrbSphere.tsx` | The live orb — see below |
| `19650:15977` | *reused* | the `bravo AI` wordmark | Same SVG as the no-match CTA, here at its native 89.663×15 |
| `19691:50951` | **AiVoiceScreen** | `screens/AiVoiceScreen.tsx` | Voice mode — see below |
| — | *reused* | **PromptBox**, **IosKeyboard** | Including the standalone rule that drops the mock keyboard |

Each step carries its **own hold time** (`aiChatDemo.ts`) rather than a fixed
tick — "Looking for restaurants…" earns longer on screen than "Let me think".
Steps crossfade in place so the row never jumps as the text length changes,
and the detail line expands under it rather than appearing fully formed.

The user bubble is 12px on three corners and **2px on the bottom-right** —
that corner is the tail, pointing back at the sender, which is why only one
is tight.

### The orb is real, not the exported PNG

Figma exports the orb as a flat image (`image 2`). It is the one thing on a
"thinking" screen that has to look like it is working, so the actual WebGL
orb is used: `orb-sphere.js` copied **verbatim** from Siya's orb3 package
into `src/demo/orb/`, checksum-identical to the source.

> Do not edit `src/demo/orb/*` here. Change it in the orb3 package, re-copy,
> and mirror the constants in the Flutter shader — the package README says to
> keep the two in sync. Same rule as `BravoCoin` and `flutter/bravo_coin.dart`.

`OrbSphere.tsx` is a thin wrapper: construct once on mount, `destroy()` on
unmount. **It must not be rebuilt per render** — each instance owns a WebGL
context and browsers cap those at ~16 before dropping the oldest, which would
blank orbs elsewhere on the page. Speed changes go through the live instance.

The orb already handles the things that matter for a demo: transparent
premultiplied canvas so it composites over anything, pauses when scrolled out
of view, caps DPR at 2, and slows to 25% under `prefers-reduced-motion`.

### Voice mode (`19691:50951`)

Reached from the **voice-mode** (audio-lines) button in the chat's prompt box
— `PromptBox` gained an `onVoiceMode` callback for it — and fades in over the
thread. It keeps the chat's chrome (glow, header, disclaimer) and replaces
the thread with:

- **One large centred orb.** Figma pins a flat 120px PNG here; this uses the
  live `OrbSphere` instead, at **150px** — bigger than the node, per the ask —
  and a touch faster (`speed={4}`) so it reads as actively listening. It is a
  second orb instance beside the thinking one; both `destroy()` on unmount, so
  opening and closing voice mode never accumulates WebGL contexts.
  - **Centred by a flex box, not a transform.** The wrapper is `inset:0` with
    `place items center`; the scale animation lives on an inner layer. This
    matters because framer-motion writes `transform` inline while it
    animates, which would clobber a `translate(-50%,-50%)` centring and drift
    the orb by half its size once it settled.
  - **It breathes as if speaking.** The inner layer loops an uneven run of
    scales (~0.93 to ~1.07, alternating below/above 1), built once per mount
    so each entry differs, `mirror`-repeated so it eases back through itself.
    Held at 1 under `prefers-reduced-motion`.
- **A collapsed prompt box** — no plus, no mic, just the placeholder and a
  single black **X** (the `accent` button) that ends voice mode and fades back
  to the thread.

The screen is presentation-only: the box does not take focus, so no keyboard
is raised and the `standalone` split does not apply here.

---

## Installed as an app (PWA)

The site ships a web app manifest, so "Add to Home Screen" runs it with no
browser chrome. That is not cosmetic: in a Safari tab the URL bar and toolbar
eat ~190px of height, forcing the 402×874 artboard down to ~75%. Installed it
gets the whole screen and lands at ~97%.

`useStandalone()` detects it — via `display-mode: standalone` **and** iOS's own
`navigator.standalone`, because the platforms disagree on which one works. Four
things change when it is true:

| | In a browser tab | Installed |
|---|---|---|
| mock status bar | drawn | removed — the phone draws its own |
| `--bv-statusbar-h` | `59px` | `0px` |
| mock keyboard | drawn | removed — the phone raises its own |
| scale measured against | `visualViewport` | `innerHeight` |

**`--bv-statusbar-h` is the important one.** A dozen offsets were measured from
the artboard's 59px status bar — the top bar, the social header and its fade,
the pushed-screen nav, the spendable anchor, the search sheet, the challenge
play area, the merchants list. Installed, the phone draws the status bar
*outside* our box, so all of them have to collapse in step or the whole app
sits a status bar too low. They are now expressed as
`calc(var(--bv-statusbar-h) + …)`, which is also what makes the app adapt to a
device other than the one it was tuned on.

**Scale must not follow `visualViewport` when installed.** iOS shrinks the
visual viewport when the keyboard opens, so tracking it rescaled the entire app
down the moment the search field took focus. `innerHeight` ignores the
keyboard, which is the correct model: the keyboard *covers* the app, it does
not resize it. In a tab `visualViewport` is still right, because there the
shrink really is browser chrome.

**The search sheet dodges the real keyboard** via `--bv-kb-inset`
(`innerHeight − visualViewport.height − offsetTop`). It has to move up **and
get shorter** by that amount — raising it alone kept the full height and pushed
the top clean off the screen.

---

## Home search (Figma `19380:5446`, `19542:163494`, `19380:5586`, `19380:5756`, `19559:167807`)

Five nodes, **one component**. They are states of the same sheet, not five
screens, and which one you see falls out of the query and the active tab
exactly as it would in the product:

| Node | State |
|---|---|
| `19380:5446` | empty — prompt starters |
| `19542:163494` | All — people rail + merchant hits |
| `19380:5586` | Restaurant — merchant hits only |
| `19380:5756` | People — person rows |
| `19559:167807` | People — the same rows in their other follow states |

| Figma node | Component | File | Notes |
|---|---|---|---|
| — | **SearchSheet** | `components/SearchSheet.tsx` | Owns query, tab and follow state; all five states |
| `1363:3722` | **PromptStarter** | `components/PromptStarter.tsx` | Text-only neutral chip — no thumbnail, unlike SuggestionChip |
| `19542:163501` | **SearchTabs** | `components/SearchTabs.tsx` | All / Restaurant / People |
| `19542:163507` | **SearchResultRow** | `components/SearchResultRow.tsx` | Name, distance, chevron, 0.5px rule |
| `19380:5763` / `19559:167807` | **PersonRow** | `components/PersonRow.tsx` | `follow`: `follow` \| `follow-back` \| `following` \| `mutual` |
| `19380:5466` | **IosKeyboard** | `components/IosKeyboard.tsx` | Chrome, not product UI — inert by design |
| `19558:167654` | *reused* | **LeaderboardRail** | The people rail is the same 61×82 rail as Social's leaderboard. It shows four, so **"View more people" only appears when five or more matched** — otherwise it is offering to reveal nobody |
| `19542:163538` | *extended* | **PromptBox** | Gains a controlled `value` and a submit end-state |
| `1344:21875` | *extended* | **Button** | `primary` (yellow) and `quiet` (grey) for the follow states |

### The dock adapts to the screen it sits on (`promptDemo.ts`)

The assistant is on every tab, but what it is *for* changes with what you
are looking at. So both the dock's placeholder and the sheet's starter chips
are keyed to the screen rather than being one global list:

| Screen | `PromptContext` | Placeholders |
|---|---|---|
| Map / Home | `'map'` | "New onboarded restaurants" · "Best cafe near me" |
| Community | `'social'` | "Where {friend} dined last night" · "Challenge restaurants I can go" |
| Your own profile | `'me'` | "Total spend last week" · "Who's my best friend" |

`useSearchLauncher(context)` takes it, puts `placeholders` into the props it
spreads onto the dock's box, and hands `starters` to the sheet. The screens
no longer author a placeholder string of their own.

- **{friend} is a real cast member**, drawn from `people.ts` — naming
  someone who doesn't appear anywhere in the feed would read as filler.
- **Each screen's starters lead with its two placeholders**, so what the box
  advertises is something you can actually tap, then add two more.

**The placeholder rotates, and the rotation is painted, not native.** A
`placeholder` attribute cannot be animated and swapping its text just snaps,
so with more than one hint `PromptBox` drops the attribute and draws the
line itself over the field: the outgoing hint **flips up and fades** (`y`
+ `rotateX` against a `perspective` on the track), the next **rises from
below**. `AnimatePresence mode="wait"` keeps them from overlapping mid-turn,
and `overflow: hidden` on the track is what makes them enter and leave
rather than drift past the field. It cycles every 3.6s and **pauses
whenever there is something else to read** — text in the field, or a
recording in progress. Under `prefers-reduced-motion` it crossfades.

**Tapping a starter sends it.** A starter is a question for the assistant,
not a search term, so it goes straight to the AI thread and the thinking
line reads back the chip you chose. It previously only filled the search
field, which left the chip's own copy going nowhere.

That last part is why the thinking copy widened: Figma's "Looking for
restaurants with “Happy” …" / "Found 5 places …" was written when every
prompt was a restaurant search. "Found 5 places" under "Who's my best
friend" reads as a bug, so the two lines are now "Looking for “{query}” …"
and "Found 5 results …". Deliberate deviation from `19559:168156` /
`19560:168548`; the shape and the per-step pacing are unchanged.

### The two prompt-box end states (`19542:163538`)

Not a new variant — a **state**. With text in the field the mic and voice CTA
give way to a single dark submit button, because sending is now the obvious
next action. `PromptBox` also became optionally controlled (`value` +
`onChange`) so the sheet can own the query; omit them and it still holds its
own, which is what the Home dock does.

### Follow states

Colour carries the meaning, so it should survive translation: **yellow means
an action is available to you** (`Follow`, `Follow back`), **grey means you
are already connected** (`Unfollow`, `Mutual`). Hence `Button`'s
`primary`/`quiet` rather than a bespoke control.

**The followed state reads `Unfollow`, not `Following`** — Siya's call, and a
deliberate deviation from `19559:167807`. Once you are following, the useful
thing to show is the way out; the state itself is already visible from the
grey fill. Worth updating the Figma node. `Mutual` keeps its status wording
because there is no single undo for it.

### No-match state

Rather than dead-ending on "no results", the sheet offers the query to the
assistant: **Ask _bravo AI_ about "…"** — 16px, centred.

**The filter chips are hidden and the sheet collapses to content.** With
nothing matched there is nothing to filter, so All / Restaurant / People
would be three dead controls; and the fixed results height would leave a
large void above the prompt box. The fixed height therefore applies only
when there *are* results — which is where the consistency actually matters,
since that is the only time you can switch tabs.

The product name is the **wordmark** (`19650:15977`), not type — held at 13px
tall (from its 89.664 × 15 export) so it sits on the 14px line without
towering over it. It carries the same cyan → orange gradient as the prompt
box's ring, which is what marks an AI surface across the app.

**The SVG is used as a `mask`, not an `<img>`.** It is a single union path,
so the gradient sits behind it and the glyphs cut it out. Painting the fill
into the file instead would freeze the colour, and the gradient has to stay
tied to the one the ring uses. The span carries `role="img"` and
`aria-label="bravo AI"` since it has no text content.

For Flutter: `ShaderMask` with a `LinearGradient` over the wordmark asset.

### Close button — every sheet (`19661:16109`)

All bottom sheets park the close control in the **same corner**: 36px,
**12px in from the top and right** edges of the sheet, absolutely positioned
rather than sitting in a header row.

This moved the **OffersSheet** close out of its header — a deliberate
deviation from `19243:4646`, made at Siya's direction so the gesture is in
one place across every sheet. Its title block gains 48px of right padding to
keep clear. Worth updating that Figma node.

The **Combined Spendable** sheet is deliberately *not* included: it is a
popover anchored to the balance pills with a dimming scrim, not a bottom
sheet, and it closes by tapping the scrim. Flag if it should match.

### The sheet's TOP is fixed; only its bottom follows the keyboard

This is the rule the whole search sheet hangs on, and two earlier attempts
got it wrong in opposite directions, so it is worth stating as arithmetic:

```
bottom = kb
height = 100% − statusbar − 16 − kb
top    = 100% − height − bottom = statusbar + 16     ← no kb term
```

The sheet **ends on the keyboard** and its **top never moves**. Since the
content is top-anchored, opening and closing the keyboard leaves everything
you are reading exactly where it was — only the bottom edge and the bar
travel.

The two failures this replaces, both of which read as "the sheet flies away":

- **`bottom: kb` with full height** — the sheet kept its whole height and
  was pushed up, so its top ran off the screen.
- **`bottom: 0` with `height: 100% − 16`** — the sheet stopped moving, but it
  extended *behind* the keyboard (the list ran away under it) and snapped
  from short to near-full-height the instant results appeared.

Consequences worth keeping straight:

- **The dock does not add `--bv-kb-inset`.** The sheet already ends at the
  keyboard, so adding it again would double-count and float the bar in
  mid-air. The dock only carries its resting gap.
- **The scroll's padding has no keyboard term** either, for the same reason.
- `--bv-kb-open` is a **flag (0/1), not a length**, so each surface keeps its
  own resting gap — 32px for the search bar, 36px for the AI thread. Sharing
  a length would have quietly forced them equal.
- **The empty state stays content-sized** (no `height`, only `max-height`),
  so it hugs the starters and sits on the keyboard rather than stretching.

### The search bar floats over the results

The bar is **absolutely positioned, 32px off the bottom of the sheet body**,
and the result list scrolls *behind* it.

It used to sit below the list in flow, which made the last visible row look
like the last row that existed — the bar's own white fill hid everything
under it, so a five-result search read as a two-result one. Floating it means
a partial row is always visible at its edge, which is the signal that there
is more. A gradient fades the rows into the sheet underneath so it reads as
continuing rather than being cut off.

Two things this needs to stay correct:

- The scroll area carries **96px of bottom padding** (bar 48 + its 32 offset
  + breathing room) so the last result can be scrolled clear of the bar
  rather than being permanently trapped under it.
- The **empty state does the opposite** — the prompt starters get the same
  96px as padding so they sit *above* the bar. Suggestions hiding behind it
  would just look broken; only results should run underneath.

### Sheet height

The sheet is pinned so its top never rises past **16px below the status bar**
(59 + 16 = 75), which keeps the grab handle clear of the dynamic island.

In the **results** state it takes that full allowance as a fixed height, so
switching All → Restaurant → People never resizes it under your thumb — the
scroll area flexes into whatever the sheet leaves rather than each tab
sizing to its own content. The **empty** state stays content-sized and sits
lower. Each tab also opens at scroll top; without that the browser keeps the
previous pane's offset and the list opens mid-row.

### Motion

Built against Emil Kowalski's framework — the judgement calls, not just the
values:

| Element | Motion | Why |
|---|---|---|
| Sheet | spring, 0.44s, bounce 0.06 | Occasional, and it is a drawer — the one place a longer duration earns its keep |
| Prompt starters | 40ms stagger, 8px rise, 260ms `ease-out` | Seen once per search open |
| Results, **first appearance only** | same stagger | — |
| Results, subsequent keystrokes | **none** | See below |
| Tab pill | shared `layoutId`, spring 0.36s bounce 0.14 | The fill travels rather than blinking off one pill and on to the next |
| Tab panel | fade + 4px, 160ms `ease-out` | These are filters, not pages — no carousel |
| Follow label | crossfade through `blur(2px)`, 180ms | The label changes width; a hard swap reads as two objects |
| Submit button | scale `0.9 → 1` + opacity, 160ms | Never `scale(0)` — nothing appears out of nothing |
| Pressables | `scale(0.97)` on `:active` | Instant feedback |

**The one that matters: results do not re-animate on every keystroke.** A
stagger there would animate something the user sees dozens of times per
search, which reads as lag rather than polish. It fires on the first
empty → results transition and never again until the field is cleared.

Custom curves throughout — `--bv-ease-out: cubic-bezier(0.23, 1, 0.32, 1)`,
`--bv-ease-in-out`, `--bv-ease-drawer` — because the built-in CSS easings are
too weak to read as intentional at these durations. **`ease-in` is never
used**: it delays the first frame, which is exactly the moment the user is
watching. `prefers-reduced-motion` drops every position animation and keeps
the opacity ones.

### Demo data

`src/demo/data/searchDemo.ts` — five users (`happy1`, `happy000`, `happyman`,
`Happyg`, `happy0`) and the five merchants Siya specified. Both lists match
on "happy" so a single query lights up both sections. The filtering is real
`includes()` against the query, not a hardcoded result set, so typing
"lamb" or "cafe" narrows it correctly.

**The five people are now real cast members under their own names** (see
**Shared cast** below) rather than the old `happy1`/`happy000`/… handles, so
a face and the name beside it agree. One consequence to know: the merchants
still all contain "Happy", and one cast member *is* named Happy (she leads
the list so the canned query still returns a person) — but "Happy" now
matches **one** person instead of five, so the **"View more people"** rail
affordance, which only appears at five or more, stays hidden on that query.
Widen the cast slice in `searchDemo.ts` if that rail needs demoing.

---

## Pending screens

Add a section per screen as Figma links arrive. Before writing code, list the
candidate components and check them against the table above — reuse first.

---

## Profile (Figma `Profile-Public 19612:9840` / `Profile-Private 19703:52774`)

One screen, two modes. `ProfileScreen({ profile, mode, onBack, active, onNavigate })`:

- **`public`** (Profile-Public 19612:9840) — someone else: back arrow, Follow /
  Send money, an active dining challenge, no app chrome. Opened as an overlay.
- **`me`** (Profile-Sender-Private 19682:49464) — the signed-in user, a real
  **tab**: the Home top bar (balance pills + bell + settings, no back) and the
  shared bottom **dock** (`useSearchLauncher`'s prompt box + `BottomNav`) frame
  it. The challenge card depends on **which demo user is signed in** — see
  "Two challenge sides" below. `active`/`onNavigate` drive its bottom nav.

The middle — header, stat cards, tabs, Activity feed — is identical, so it's
one component driven by `mode` + data. me mode borrows the community chrome
top and bottom:

- **Both headers overlay** the feed with the same white → transparent fade as
  `.bv-social-header` (75.492% white stop, pointer-events off except the header
  row) — me mode's balance-pill bar and public mode's back + Follow / Send
  money. The scroll fills the frame and is top-padded to clear the fade so
  content passes up under it (`has-dock` adds the bottom padding for the dock).
- **Bottom dock** reuses `.bv-dock.bv-dock-social` + `.bv-nav-slot` (minus the
  compose button), so the prompt box opens search, the bottom nav navigates,
  and — like the Friends feed — the nav **folds away on scroll down and
  returns on scroll up** (same `navHidden` listener + cube-face collapse).

**Almost all of it reuses existing components** — the reusability pass paid
off:

| Piece on the profile | Reused |
|---|---|
| The Activity feed | **PostCard** as-is (the same variants) |
| 8X / Lv.7 chips | **AchievementLabel** (`StreakLabel` + `LevelLabel`) |
| Follow / Send money | **Button** (`solid` / `outline`) |
| Back arrow, settings gear | plain `.bv-screen-back` buttons |
| Activity / Taste Identity / Collectives | **SectionTabs**, scoped by `.bv-profile-tabs` to a smaller DM-Sans style (the social tabs are Boldonse). The active tab is **700** here — Figma sets the selected label bold, which the social tabs' single-weight Boldonse can't do |
| Bottom "Search a restaurant" | **PromptBox** `variant="search"` |
| Venue in posts | **VenueCard** (via PostCard) |

New parts are only: the header (avatar + identity + counts), the two stat
cards, **ProfileChallengeCard** (`active` / `start` / `invited` modes) —
*not* the feed's ChallengeCard, which carries a reward coin and spent/goal
line this composition drops — and the Taste Identity tab below.

### Taste Identity tab (Figma `19677:16435`)

| Figma node | Component | File | Notes |
|---|---|---|---|
| `19677:16435` | **TasteIdentityPanel** | `components/TasteIdentityPanel.tsx` | The whole tab — three cards, 24px apart |
| `19668:16136` | *inline* | same (`.bv-taste-stat`) | The dark "Top N% Diner" summary |
| `19677:16426` | *inline* | same (`.bv-taste-ai`) | "bravo AI says:" + the radar |
| `19689:50291` | **TasteRadar** | `components/TasteRadar.tsx` | Six-axis hexagonal Taste DNA chart |
| `19635:14218` | *inline* | same (`.bv-taste-dna`) | Cuisine breakdown rows |

Data lives on `ProfileData.tasteIdentity` (`data/profileDemo.ts`), so every
profile through the shared template gets one. Three things are worth knowing
before touching this:

**The dark card is the app's only dark surface**, and every part of its edge
is doing something:

- **Surface** — flat `#747474` under a 40% radial that runs *dark in the
  middle* out to near-white at the rim: an **inverted** vignette, which is
  what gives it the brushed-metal read. The ellipse is measured off the node
  (276.48 × 95 on a 370 × 190 box → 74.72% × 50%), and the layer's 40% is
  baked into the stops because a CSS background layer can't carry its own
  alpha.
- **Border** — a 2px **gradient**, `#707070` at the top down to `#626262`,
  not a flat colour. CSS borders can't take a gradient, so the border is
  `transparent` and the stroke is a third background layer clipped to
  `border-box` while the two surface layers clip to `padding-box`. That is
  also why the flat `#747474` has to be a `linear-gradient(#747474,#747474)`
  layer rather than a `background-color` — a background-color fills the
  border box and would hide the stroke.
- **Rim + shadow** — three inset white rim lights plus one ordinary
  `0 12px 32px` drop shadow. Note the 32: the Figma MCP reports this as
  Tailwind `drop-shadow-[…16px]` because CSS `filter: drop-shadow()` takes
  half the blur a `box-shadow` does. The box-shadow value is **32**.

None of this is a named Figma style, so it stays local rather than becoming a
token — the only shared style on the card is `bubble`, on its avatar.

**The radar is drawn, not imported** — the data polygon's shape *is* the data,
so an exported SVG would freeze one profile's numbers. Two measurements come
off the node rather than being assumed:

- The hexagon is **not regular**. The outer ring exports 196.588 × 217.718,
  where a regular pointy-top hexagon of that height would be 188.55 wide — so
  it's stretched **4.3% horizontally** (`RX_RATIO`). Drop it and the chart
  reads noticeably too narrow.
- Every corner is **rounded**. The top corner runs 29.5px between tangent
  points — ~14.75px cut back along each edge on a 108.86 circumradius — so
  `CORNER_CUT` holds that as a fraction and the rounding scales with the ring.
  Corners are quadratic with the vertex as the control point, visually
  identical to Figma's cubics at this size.

Fill is `#25CDD9` at 30% with **no** stroke; the three rings are a 1px
`--bv-neutral-200` stroke with no fill.

**Two kinds of picture, deliberately.** The four small UI icons are Lucide —
their Figma nodes are literally named `share` / `store` / `utensils-crossed` /
`message-square`. The five cuisine markers are exported **artwork** under
`assets/taste/`, illustrations rather than glyphs, and must not be swapped for
icons. They ship downscaled to 112px (the Michelin export was 1024px / 2 MB).

Two smaller notes: the breakdown's bar widths are **data** (143/109/86/79/69
artboard px), not derived from the percentages — the design's widths fall off
far more gently than the numbers do, so computing them would redraw the chart
the designer drew. And "says:" is slanted with a −10° skew because Figma fakes
the italic that way; DM Sans has no italic cut here, so the skew *is* the
design rather than a fallback.

### Two challenge sides — the demo-user switch

The review site's tweaker (`LiveDemo.tsx`) can sign the demo in as either of
two people, so a reviewer plays both sides of the invite flow without a
backend:

| User | `DemoUserId` | Their own profile shows |
|---|---|---|
| **Bobby** | `'bobby'` | `start` — "Start a challenge with friends…", the invite-out card (19682:49505) |
| **Happy** | `'happy'` | `invited` — "Bobby invited you to a challenge, accept now to join $5 extra Bonus!", Decline / Accept (19696:51781) |

This is carried on `DemoUser.challengeCardMode` (+ `challengeInviter` for the
receiver) in `profileDemo.ts`, folded into `ProfileData` by `meProfile(user)`.
`ProfileScreen` picks the card: `mode="me"` reads `profile.challengeCardMode`;
`mode="public"` (someone else's profile) always shows `active`, regardless of
who is signed in.

**`invited` is a third `ProfileChallengeCard` shape**, not a variant of
`start` — its top row is the inviter's face + a fixed sentence (not the
avatar stack + "and 3+" copy). Its progress row shows **the same running
total as the `active` card** (`$512.56/$1000`, 67 days left, the bar at
50.87%) — joining accepts into the challenge already in progress, not a
fresh $0 count, so it reuses `ACTIVE`'s numbers rather than `START`'s empty
ones. Below that sits a `Decline` / `Accept` button row (`Button`
`outline` / `solid`, `size="sm"`, each stretched to `flex: 1` by
`.bv-profile-challenge-actions`). The outline button's border is overridden
to `--bv-border-default` (Figma's soft 12%-black hairline) rather than
`Button`'s own `--bv-border-strong` — the one place that lighter hairline
appears, so it's a scoped override, not a new `Button` variant.

**`start` shows the profile OWNER's own face**, not a partner's — it's your
own prompt to start a challenge, so `mode="start"` takes an `avatar` prop
(the owner's photo) instead of `partners`.

**`active` shows three faces, and the profile's owner is always one of
them** (they lead the stack). The card reads "{name} and 3+ are in a dining
challenge", so a stack that didn't contain the person whose profile you're
on contradicted its own copy. `publicProfile` over-draws from the shared
cast and filters the owner out before taking the other two, so they can
never appear twice — see **Shared cast**.

Both `start` and `invited` wrap their body (everything but the buttons) in a
tappable `Open` element — a real `<button>` when `onOpen` is given, a plain
`<div>` otherwise (the Design System previews). The add button (`start`) and
Decline/Accept (`invited`) sit **outside** that wrapper as siblings, so they
never trigger it; `start`'s add button also calls `stopPropagation` since
it's *inside* the stack that IS part of the open target. Neither
`Decline`/`Accept` nor `onOpen`-driven accept is wired to a persistent state
change — accepting doesn't flip the card itself to `active`, it just closes
the detail screen back to the profile (see below).

### The pre-accept challenge detail — one screen, two datasets

Tapping either card (`start` or `invited`) opens **the same `ChallengeScreen`**
already used from the Friends feed, but before anyone but the host has
answered:

| Who's viewing | Figma | Dataset (`pendingChallengeDemo.ts`) | Your own seat |
|---|---|---|---|
| Bobby (`start` card) | `19682:49684` | `SENDER_VIEW` | accepted, reads "You" |
| Happy (`invited` card) | `19743:54823` | `RECEIVER_VIEW` | `'pending-you'`, an Accept pill |

Same challenge, same four seats, same positions in both — only whose seat
reads "You" (and therefore which one carries the Accept pill) changes.
`ProfileScreen` picks the dataset from `profile.challengeCardMode`, the same
field that already picked the card.

**Each dataset's `spent` mirrors the card that opens it**, so the detail
never contradicts the strip you tapped: `SENDER_VIEW` is `$0/$1,000` like
the `start` card, `RECEIVER_VIEW` is `$512.56/$1000` like the `invited`
one — joining accepts into a challenge already in progress, so a $0 detail
behind a $512.56 card read as a bug. (The bar itself stays derived from
`spent / goal`, so it lands on 51.26% against the card's authored 50.87% —
the same Figma rounding gap called out for ChallengeCard above.)

**All four bubbles sit in the top half of the play area.** Figma's y values
(327–358 for the lower row) put them under the Bravo coin that crowns the
sheet: a pending bubble is ~128 artboard px tall against a ~418px play
area, so anything past y≈258 overflows. The lower row is pulled up to
245–258 and the upper row to 105–138, keeping the whole group clear of the
coin while preserving the design's four-corner arrangement.

**`FloatingAvatar` gained a `status`.** It defaults to `'accepted'` — every
bubble the component originally drew, unchanged — plus three new ones for
this pre-accept moment:

- `'pending-you'` — your own unanswered invite. The name pill is replaced by
  a real `<button>` ("Accept"), guarded with `stopPropagation` on
  `pointerdown` *and* `click` so it survives inside a `drag`-enabled parent
  without starting a drag.
- `'pending-other'` — someone else's unanswered invite. Same dimmed photo +
  hourglass, but the pill still just names them.
- `'empty'` — a seat nobody has been invited to yet: a flat neutral-400
  circle with a `Plus` glyph instead of a photo, "---" instead of a name.

Pending/empty bubbles are a **fixed 60px**, not the usual
`avatarWidth(share)` formula — nobody has spent anything yet, so the formula
would compute the base 40px, and a shrunk bubble reads as broken rather than
"hasn't answered." `Participant` also gained `isHost?: boolean`, for the one
case `isYou` can't cover: on Happy's screen, Bobby (the host) is accepted but
isn't "you" — he still has to sit outside the "Invited: n/N" count the way
"you" always do.

**Two things ChallengeScreen had to stop assuming once shares can tie at
zero:**

- **The crown.** `reduce((a,b) => b.share > a.share ? b : a)` picks whoever's
  first when every share is 0 (nobody has spent anything, so `b.share >
  a.share` is never true) — it would have crowned an arbitrary bubble.
  Guarded behind `Math.max(...shares) > 0`.
- **The percentage label.** `0.00%` is correct once someone has actually
  spent something (matches every existing bubble); a *fresh* challenge reads
  plain `0%` instead — Figma draws it that way even for the accepted host.
  Special-cased on `share === 0`, not on status, since it's the value that
  changed meaning, not who's wearing it.

`ChallengeScreen` also gained an optional `onAccept`, wired only to whichever
bubble has `status: 'pending-you'` — `ProfileScreen` uses it to close the
detail screen back to the profile (a UI acknowledgment, not a persisted
accept — see the note above).

**One profile template, swapped per person.** `profileDemo.ts` holds one set
of counts / stats / feed; `publicProfile(person)` stamps a `{ name, avatar }`
onto it. So opening any person's profile shows *their* face and name over the
shared demo content — which is all a review build needs. `DEMO_USERS` (and
therefore `BravoApp`'s `user` prop, `me`, and the nav avatar) build on
`BOBBY`/`HAPPY` from the **shared cast** below, not on their own imports.

**Opening profiles is decoupled via context** (`ProfileLauncher.tsx`).
`ProfileProvider` is mounted once in `BravoApp`; `useOpenProfile()(person)`
pushes the public ProfileScreen over everything. **PostCard** (author face +
name) and **LeaderboardRail** (each face) call it, so any person is tappable.
Outside the provider — the Design System previews — the hook is a no-op, so
those components still render standalone. The nav avatar is separate: it's a
tab (`BravoApp` renders `ProfileScreen mode="me"` when `tab === 'profile'`).

Taste Identity and Collectives have no content in the design, so they render a
"Coming soon" panel; Activity carries the feed.

---

## Shared cast (`src/demo/data/people.ts`)

Every avatar in the app — nav, profile, leaderboard, posts, challenges,
search, achievements — is drawn from **one 12-person roster** built from
Siya's real photos (`src/demo/assets/social/*.jpg`), not a grab-bag of
per-screen placeholder images.

- **`PEOPLE`** is the roster; **`PERSON`** indexes it by id. **`BOBBY`** and
  **`HAPPY`** are named exports — they're fixed identities (the tweaker's two
  demo users, and Bobby is the pre-accept flow's hardcoded "You"), not pool
  picks, so every screen that needs "the signed-in user's own face" reads
  these constants directly rather than drawing from the shuffle.
- **The name always belongs to the face.** No screen authors a display name
  of its own any more — leaderboard entries, post authors, challenge
  participants and search rows all read `person.name` beside
  `person.avatar`, so the label under a photo is that photo's actual name.
  The old placeholder handles (`happy1`, `Noooodle123`, `Uuuuzili`, …) are
  gone.
- **Nobody holds two seats in one challenge.** `pickPeople` takes a
  contiguous window, so a single call never repeats a person; where a seat is
  also filled by hand (Bobby is the feed challenge's "You", the profile owner
  is on their own card) that person is passed to `exclude` — or filtered out
  of an over-draw — so the random picks can't duplicate them. The Friends
  challenge card's avatar stack and its detail screen's bubbles are now the
  **same four people**, not two independent draws.
- **`pickPeople(n, offset, exclude)`** returns `n` faces from a **module-load-time**
  Fisher–Yates shuffle (`PEOPLE_SHUFFLED`) — random once per page-load, not
  per render, so faces don't flicker/reshuffle on every re-render, and not
  reseeded on reload's next load either (it *will* differ across reloads,
  which is the point — "make it random" per Siya). Callers pass a distinct
  `offset` per section (leaderboard, posts, friend posts, challenge stacks,
  search results, the design-system previews, …) purely so two lists on the
  same screen don't happen to show identical faces — it carries no other
  meaning and there's no requirement that offsets stay disjoint.
- **Figma's "James"** (the pre-accept challenge detail's third seat) has no
  match in the real 12 — `pendingChallengeDemo.ts` stands Jason in for him
  (`const thirdFriend = PERSON.jason`), named in the data rather than
  hardcoded as "James" anywhere in JSX.
- **`BottomNav` takes an `avatar` prop** (default `BOBBY.avatar`, used only by
  its own Design System preview) rather than importing a fixed image, so it
  reflects whichever demo user is signed in — wired through `BravoApp` →
  `HomeScreen`/`SocialScreen`/`ProfileScreen` from the tweaker's `user` state.

---

## Demo shell (not part of the app)

| Piece | File | Notes |
|---|---|---|
| `PhoneFrame` | `demo/PhoneFrame.tsx` | Inner viewport is exactly 402×874 — the Figma artboard — so implemented screens are 1:1. `scale` shrinks the whole device without changing any internal measurement. |
| `PresentMode` | `demo/PresentMode.tsx` | Full-screen presentation. Click the phone or "Present full screen"; Esc or ✕ exits. Scales to viewport height. |

These exist only to display the app on the web — they are not part of the
Flutter build.
