// iPhone-style frame that hosts the Bravo app demo.
// Inner viewport matches the Figma artboard exactly (402x874) so
// implemented screens are 1:1 with the design.
import type { ReactNode } from 'react'

export const FRAME_WIDTH = 402
export const FRAME_HEIGHT = 874

// `scale` shrinks the whole device so the 874px-tall artboard fits on
// screen without changing any internal measurement.
export default function PhoneFrame({
  children,
  scale = 1,
}: {
  children: ReactNode
  scale?: number
}) {
  const outerW = FRAME_WIDTH + 20
  const outerH = FRAME_HEIGHT + 20

  return (
    <div
      style={{
        width: outerW * scale,
        height: outerH * scale,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: outerW,
          height: outerH,
          borderRadius: 58,
          padding: 10,
          background: '#1a1a1a',
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.08), 0 24px 80px rgba(0,0,0,0.45)',
          position: 'relative',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
      {/* Dynamic island */}
      <div
        style={{
          position: 'absolute',
          top: 22,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 125,
          height: 37,
          borderRadius: 100,
          background: '#000',
          zIndex: 50,
        }}
      />
      <div
        style={{
          width: FRAME_WIDTH,
          height: FRAME_HEIGHT,
          borderRadius: 48,
          overflow: 'hidden',
          position: 'relative',
          background: '#ffffff',
        }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
