// Component — the bravo AI orb.
//
// A thin React wrapper around `orb-sphere.js`, which is copied **verbatim**
// from Siya's orb3 package into `src/demo/orb/` so it stays byte-identical
// to its Flutter twin — the package README says to keep the two shaders in
// sync, exactly like BravoCoin and `flutter/bravo_coin.dart`.
//
// > Do not edit `src/demo/orb/*` here. Change it in the orb3 package,
// > re-copy, and mirror the constants in the Flutter shader.
//
// Figma exports this as a flat PNG (`image 2`, 19559:168177). It is the one
// thing on the thinking screen that has to look like it is working, so the
// real WebGL orb is used instead.
import { useEffect, useRef } from 'react'
// Plain ES module, no types — `allowJs` is on for this and the coin.
import { OrbSphere as Orb } from '../orb/orb-sphere.js'

export default function OrbSphere({
  size = 50,
  speed = 3,
}: {
  size?: number
  /** Rotation multiplier. Nudged up while the assistant is thinking. */
  speed?: number
}) {
  const host = useRef<HTMLDivElement>(null)
  const orb = useRef<{ setSpeed(v: number): void; destroy(): void } | null>(null)

  // Constructed once — it owns a WebGL context, so remounting it per render
  // would leak contexts (browsers cap them at ~16 and then drop the oldest).
  useEffect(() => {
    if (!host.current) return
    orb.current = new Orb(host.current, { speed })
    return () => {
      orb.current?.destroy()
      orb.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Speed changes go through the live instance rather than a rebuild.
  useEffect(() => {
    orb.current?.setSpeed(speed)
  }, [speed])

  return (
    <div
      ref={host}
      className="bv-orb"
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  )
}
