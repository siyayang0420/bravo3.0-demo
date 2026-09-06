# OrbSphere — Web

Self-contained WebGL. One file: `orb-sphere.js` (ES module, no dependencies).

## Install

Copy `orb-sphere.js` into your project and import it. It's an ES module — serve over
`http(s)` or a bundler (Vite/webpack/Rollup all work; no config needed).

## Usage

### Class API

```js
import { OrbSphere } from "./orb-sphere.js";

const orb = new OrbSphere(containerEl, {
  speed: 1,        // rotation multiplier (default 1)
  dpr: 2,          // devicePixelRatio cap (default 2)
  autoplay: true,  // start immediately (default true)
});

orb.setSpeed(1.5); // change speed live
orb.pause();
orb.play();
orb.destroy();     // stop rAF, free the GL context, remove the canvas
```

The orb fills its **container** (uses `clientWidth`/`clientHeight`), so size it with CSS:

```html
<div id="orb" style="width:320px;height:320px"></div>
```

### Custom element

```html
<script type="module" src="./orb-sphere.js"></script>
<orb-sphere speed="1" style="width:320px;height:320px"></orb-sphere>
```

`speed` is a reactive attribute — change it and the orb updates.

### React / Vue / Svelte

Wrap the class in a component; construct on mount, `destroy()` on unmount. React example
is in the root `README.md`.

## Behavior

- **Transparent** canvas (premultiplied alpha) — composites over any background.
- Caps `devicePixelRatio` at `dpr` (default 2) for fill cost.
- Pauses when the container scrolls out of view (`IntersectionObserver`).
- Slows to 25% under `prefers-reduced-motion`.
- Re-sizes automatically (`ResizeObserver` + window `resize`).

## Changing the look

Edit the `const` block at the top of the `FRAG` string in `orb-sphere.js`
(`INK_FRONT`, `INK_BACK`, `SIGMA`, `BEND_*`, `TWIST*`, …). Keep it in sync with the
Flutter shader if you use both.

## Browser support

Any browser with WebGL 1 (all evergreen browsers, iOS/Android Safari/Chrome). Falls back
to a console error if WebGL is unavailable (renders nothing rather than throwing).
