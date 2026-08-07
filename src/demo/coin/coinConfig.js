// Coin tuning — the single source of truth.
// Every value here has a 1:1 twin in flutter/bravo_coin.dart.
// Change a number, then mirror it there by the same name.

export const coinConfig = {
  // geometry
  size: 260,        // coin face diameter (px)
  thickness: 22,    // rim depth (px)
  panels: 72,       // rim segment count (higher = smoother, heavier)
  perspective: 1100,// scene depth (px)

  // feel
  dragGain: 0.55,   // deg of Y-spin per px dragged
  tiltGain: 0.28,   // deg of X-tilt per px dragged (vertical drag)
  tiltMax: 32,      // clamp X-tilt
  friction: 0.94,   // velocity decay per frame (→1 coasts longer)
  spring: 0.01,     // pull toward nearest face (→up snaps harder)
  tapImpulse: 15,   // flip strength on tap
  restEps: 0.05,    // settle threshold

  // intro (plays once per mount; off by default, opted into per instance)
  restAngle: 0,     // face at rest: 0 = emblem, 180 = value. Multiples of 180 only.
  introDelay: 0,    // ms of stillness before the welcome flip (0 = no intro)
  introFlips: 2,    // half-turns to play: 2 turns away and back to the same face
};
