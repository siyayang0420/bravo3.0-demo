# Bravo Rewards 3.0 — Web Demo → Flutter Implementation Notes

**Audience:** Flutter developers implementing the 3.0 designs.
**Context:** The demo at this repo is a React web prototype. It exists to communicate design intent — layout, motion, and feel. This document flags everything in the demo that is *cheap in React but risky, expensive, or different in Flutter*, so nothing surprises us mid-sprint.

Risk legend: 🟢 direct equivalent · 🟡 needs rework, known path · 🔴 do not port literally — use the Flutter-native approach

---

## 1. 🔴 Exit animations (`AnimatePresence`)

**In the demo:** The redeem sheet, backdrop, and success overlay animate *out* on dismissal. In React, `AnimatePresence` keeps unmounted components alive automatically until their exit animation finishes.

**In Flutter:** There is no automatic unmount animation. A widget removed from the tree disappears instantly. You must keep the widget mounted and drive a reverse `AnimationController`, or use helpers.

**Do instead:** For the sheet, use `showModalBottomSheet` (dismiss animation is built in). For the success overlay, drive an explicit controller or use `flutter_animate`'s `Animate` with a toggle, or `AnimatedSwitcher` with a custom transition. Budget extra time anywhere a component "animates away."

## 2. 🔴 Shared-layout magic motion (`layoutId` tab indicator)

**In the demo:** The tab-bar indicator glides from tab to tab via framer-motion's `layoutId` — the library measures both positions and animates automatically.

**In Flutter:** No general shared-layout animation between two widgets in the same screen. `Hero` only works across route transitions.

**Do instead:** Position the indicator in a `Stack` and animate its alignment/left offset with `AnimatedAlign` / `AnimatedPositioned` (spring via `SpringSimulation` if we want the same feel). Straightforward for a tab bar, but it's manual code, not free.

## 3. 🔴 Confetti as animated widgets

**In the demo:** 26 absolutely-positioned `<div>`s, each with its own transform animation.

**In Flutter:** One-widget-per-particle rebuilds layout every frame — jank on low-end Android. Particles belong on a canvas.

**Do instead:** `CustomPainter` driven by a single ticker, the `confetti` pub package, or a Rive/Lottie asset (best fidelity, designer-controllable). **Recommended: Rive** — I can supply the file.

## 4. 🟡 Frosted-glass tab bar (`backdrop-filter: blur`)

**In the demo:** The tab bar blurs content scrolling underneath it (16px blur + translucent white).

**In Flutter:** `BackdropFilter` exists but forces an expensive `saveLayer`; historically a top jank source, especially pre-Impeller and on low-end Android.

**Do instead:** Confirm Impeller is enabled on both platforms (default on current stable). Restrict the filter to the smallest possible clip area. Have a fallback ready: ~92% opaque surface with no blur reads almost identically. Performance-test on a low-end Android device *early*.

## 5. 🟡 Stagger orchestration (variants + `staggerChildren`)

**In the demo:** Home-screen cards cascade in with a parent-driven 60 ms stagger; one line of config in framer-motion.

**In Flutter:** Staggering is manual: one `AnimationController` with `Interval` curves per child, or `flutter_animate`'s `.animate(delay:)`. Not hard, but it's real code per screen and easy to implement inconsistently.

**Do instead:** Standardize on `flutter_animate` and define the stagger (60 ms step, 350 ms duration, ease-out) once as an app-wide extension so every screen uses identical values.

## 6. 🟡 Spring physics parity

**In the demo:** Sheet and tab indicator use springs specified as stiffness/damping (e.g. sheet: `stiffness 380, damping 36`).

**In Flutter:** `SpringDescription` takes mass/stiffness/damping — but framer-motion and Flutter integrate springs differently, so identical numbers do NOT produce identical motion.

**Do instead:** Treat the demo as the *reference recording*, not the spec numbers. Tune `SpringDescription` side-by-side against the demo video until they match. I will sign off on feel, not on constants.

## 7. 🟡 Rolling number counter

**In the demo:** Points balance animates between values (900 ms, ease-out expo), re-rendering text every frame.

**In Flutter:** Easy with `TweenAnimationBuilder<int>`. Two gotchas: (a) use **tabular figures** (`FontFeature.tabularFigures()` with Inter) or the layout will jitter as digit widths change; (b) `toLocaleString` → use `intl` `NumberFormat` for the thousands separator.

## 8. 🟡 Emoji as reward artwork

**In the demo:** Rewards use emoji (☕ 🥐 🎬) as placeholder art.

**In Flutter:** Emoji render via each platform's system font — a reward looks different on iOS vs Android, and some glyphs fall back badly.

**Do instead:** These are placeholders. Final build ships real illustration assets (SVG via `flutter_svg` or PNG @2x/@3x). Do not ship emoji.

## 9. 🟢 Gradients, shadows, rounded cards

`LinearGradient`, `BoxShadow`, `BorderRadius` — all direct equivalents. The layered soft shadows in the DS map to multiple `BoxShadow`s. No risk.

## 10. 🟢 Tab screen slide transitions

`AnimatedSwitcher` or `PageTransitionSwitcher` (from `animations` pub package) covers the fade+slide between tabs. Direct path.

## 11. 🟢 Bottom sheet

`showModalBottomSheet` with custom shape gives us the sheet, scrim, drag-to-dismiss, and exit animation for free — *better* than the web demo (which has no drag-to-dismiss).

---

## Web-only behaviors to ignore

- **Hover states** (`whileHover` card lift) — no hover on touch; keep only the press/tap scale (0.96).
- **CSS scroll-behavior smooth**, custom scrollbars — browser-only.
- **`refresh to reset`** — demo convenience, not a feature.

## Suggested Flutter stack

| Concern | Recommendation |
|---|---|
| Micro-animations / stagger | `flutter_animate` |
| Route/tab transitions | `animations` (PageTransitionSwitcher) |
| Celebration moment | Rive (preferred) or `confetti` package |
| Number formatting | `intl` |
| SVG assets | `flutter_svg` |
| Renderer | Impeller (verify enabled on Android) |

## Open questions for the team

1. Minimum Android device tier we performance-test against? (Determines the blur fallback decision.)
2. Rive licensing/tooling OK for the celebration asset?
3. Does 3.0 target existing Flutter 2.x codebase or a fresh module? (Affects how the DS 2.0 tokens land — recommend a `bravo_tokens` package either way.)
