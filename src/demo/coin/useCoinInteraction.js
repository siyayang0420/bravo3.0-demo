import { useEffect, useRef } from "react";

// Drives the coin imperatively via refs, so spinning never re-renders React.
// Returns pointer handlers to spread onto the stage element.
//
// The physics loop is the exact twin of _tick() in flutter/bravo_coin.dart.

const DEG = Math.PI / 180;

export function useCoinInteraction({
  coinRef,
  panelRefs,
  glossRefs,
  shadowRef,
  segAngles,
  config,
}) {
  const st = useRef({
    rotY: config.restAngle, rotX: 0, velY: 0, velX: 0,
    dragging: false, moved: 0, lastX: 0, lastY: 0, downT: 0,
    // Intro, once per mount: sit still for introDelay, then spend the
    // half-turns. Two of them carry the coin forward through the emblem and
    // back onto the value face — forward twice rather than there-and-back,
    // so the spin never reverses mid-flight.
    introAt: performance.now() + config.introDelay,
    introFlips: config.introDelay > 0 ? config.introFlips : 0,
  });

  useEffect(() => {
    let raf;
    const c = config;

    const loop = () => {
      const s = st.current;

      if (!s.dragging) {
        // Y: momentum + spring to nearest face (0 / 180 / 360 ...)
        const target = Math.round(s.rotY / 180) * 180;
        s.velY += (target - s.rotY) * c.spring;
        s.velY *= c.friction;
        s.rotY += s.velY;

        // X: spring back flat
        s.velX += (0 - s.rotX) * (c.spring * 6);
        s.velX *= 0.82;
        s.rotX += s.velX;

        if (Math.abs(s.velY) < c.restEps && Math.abs(s.rotY - target) < 0.2) {
          s.rotY = target;
          s.velY = 0;

          // Spend an intro half-turn. Fired from the settle branch, not a
          // timer, so each flip starts only once the last one has landed.
          if (s.introFlips > 0 && performance.now() >= s.introAt) {
            s.velY += c.tapImpulse;
            s.introFlips--;
          }
        }
      }

      const coin = coinRef.current;
      if (coin) coin.style.transform = `rotateX(${s.rotX}deg) rotateY(${s.rotY}deg)`;

      // rim shading: bright where a segment faces the viewer
      for (let k = 0; k < segAngles.length; k++) {
        const el = panelRefs.current[k];
        if (!el) continue;
        const world = (segAngles[k] + s.rotY) * DEG;
        const b = 0.58 + 0.55 * Math.max(0, Math.cos(world));
        el.style.filter = `brightness(${b.toFixed(3)})`;
      }

      // face gloss sweep
      const g = Math.sin(s.rotY * DEG);
      const op = 0.3 + 0.4 * Math.abs(Math.cos(s.rotY * DEG));
      for (const el of glossRefs.current) {
        if (!el) continue;
        el.style.transform = `translateX(${(g * 55).toFixed(1)}%)`;
        el.style.opacity = op.toFixed(3);
      }

      // ground shadow squash when edge-on
      const flat = Math.abs(Math.cos(s.rotY * DEG));
      const sh = shadowRef.current;
      if (sh) {
        sh.style.transform = `scaleX(${(0.28 + 0.72 * flat).toFixed(3)})`;
        sh.style.opacity = (0.35 + 0.5 * flat).toFixed(3);
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [config, segAngles, coinRef, panelRefs, glossRefs, shadowRef]);

  const onPointerDown = (e) => {
    const s = st.current;
    s.dragging = true;
    s.moved = 0;
    s.downT = performance.now();
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    s.velY = s.velX = 0;
    s.introFlips = 0; // hands on the coin — drop whatever the intro had left
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    const s = st.current;
    if (!s.dragging) return;
    const dx = e.clientX - s.lastX;
    const dy = e.clientY - s.lastY;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    s.moved += Math.abs(dx) + Math.abs(dy);
    s.rotY += dx * config.dragGain;
    s.rotX = clamp(s.rotX - dy * config.tiltGain, -config.tiltMax, config.tiltMax);
    s.velY = dx * config.dragGain;
    s.velX = -dy * config.tiltGain;
  };

  const onPointerUp = () => {
    const s = st.current;
    if (!s.dragging) return;
    s.dragging = false;
    if (s.moved < 6 && performance.now() - s.downT < 220) s.velY += config.tapImpulse;
  };

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp };
}

function clamp(v, a, b) {
  return v < a ? a : v > b ? b : v;
}
