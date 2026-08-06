import { useMemo, useRef } from "react";
import { coinConfig } from "./coinConfig.js";
import { FrontFace, BackFace } from "./CoinFaces.jsx";
import { useCoinInteraction } from "./useCoinInteraction.js";
import "./BravoCoin.css";

// 3D flippable metal coin. Drag to spin, tap to flip.
//
//   <BravoCoin value={5} />
//   <BravoCoin value={25} size={300} thickness={26} />
//
// Any prop passed overrides the matching value in coinConfig.

export default function BravoCoin(props) {
  const cfg = { ...coinConfig, ...props };
  const { size, thickness, panels, perspective } = cfg;
  const value = props.value ?? 5;

  const R = size / 2;
  const chord = (Math.PI * size) / panels;

  const segAngles = useMemo(
    () => Array.from({ length: panels }, (_, k) => (k * 360) / panels),
    [panels]
  );

  const coinRef = useRef(null);
  const shadowRef = useRef(null);
  const glossRefs = useRef([]);
  const panelRefs = useRef([]);

  const handlers = useCoinInteraction({
    coinRef, panelRefs, glossRefs, shadowRef, segAngles, config: cfg,
  });

  return (
    <div
      className="coin-stage"
      style={{
        perspective: `${perspective}px`,
        perspectiveOrigin: "50% 45%",
        width: size * 1.35,
        height: size * 1.25,
      }}
      {...handlers}
    >
      <div
        ref={shadowRef}
        className="coin-shadow"
        style={{ bottom: size * 0.14, width: size * 0.92, height: size * 0.09 }}
      />

      <div ref={coinRef} className="coin" style={{ width: size, height: size }}>
        {/* front */}
        <div className="coin-face" style={{ transform: `translateZ(${thickness / 2}px)` }}>
          <FrontFace />
          <div className="coin-gloss" ref={(el) => (glossRefs.current[0] = el)} />
        </div>

        {/* back — value is the dynamic bit */}
        <div
          className="coin-face"
          style={{ transform: `rotateY(180deg) translateZ(${thickness / 2}px)` }}
        >
          <BackFace value={value} />
          <div className="coin-gloss" ref={(el) => (glossRefs.current[1] = el)} />
        </div>

        {/* rim */}
        <div className="coin-rim">
          {segAngles.map((phi, k) => (
            <div
              key={k}
              ref={(el) => (panelRefs.current[k] = el)}
              className="coin-panel"
              style={{
                width: thickness,
                height: chord + 1,
                marginLeft: -thickness / 2,
                marginTop: -(chord + 1) / 2,
                transform: `rotateZ(${phi}deg) translateX(${R}px) rotateY(90deg)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
