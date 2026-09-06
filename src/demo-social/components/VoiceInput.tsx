// Component — Figma "Voice Input" (node I19377:5111;1355:26180), the pill
// that replaces the field while the mic is recording: ten bars metering the
// input, then a Stop button.
//
// The bar keyframes are Figma's own, read off the node's animation data
// rather than invented — ten independent 2s loops whose peaks are offset
// from each other (bar 1 peaks at 17% of the cycle, bar 10 at 34%), which
// is what makes the row ripple instead of pulsing as one block.
import { motion, useReducedMotion } from 'framer-motion'

type Bar = { h: number; keys: number[]; times: number[] }

const BARS: Bar[] = [
  { h: 8, keys: [8, 10.2, 5.9, 10, 8], times: [0, 0.1695, 0.489, 0.795, 1] },
  { h: 8, keys: [8, 9.6, 5.9, 9.3, 8], times: [0, 0.1855, 0.4815, 0.7875, 1] },
  { h: 12, keys: [12, 15.4, 8.9, 14.8, 12], times: [0, 0.2015, 0.615, 0.921, 1] },
  { h: 12, keys: [12, 14.5, 8.9, 15.6, 12], times: [0, 0.217, 0.608, 0.9135, 1] },
  { h: 8, keys: [8, 10.3, 6, 9.7, 8], times: [0, 0.233, 0.6005, 0.906, 1] },
  { h: 8, keys: [8, 9.7, 6, 10.2, 8], times: [0, 0.2485, 0.5935, 0.8985, 1] },
  { h: 12, keys: [12, 15.5, 9, 14.4, 12], times: [0, 0.2645, 0.586, 0.891, 1] },
  { h: 10, keys: [10, 13, 7.6, 10], times: [0, 0.296, 0.7125, 1] },
  { h: 8, keys: [8, 9.2, 6.1, 8], times: [0, 0.3275, 0.698, 1] },
  { h: 10, keys: [10, 12.3, 7.6, 10], times: [0, 0.3435, 0.6905, 1] },
]

export default function VoiceInput({ onStop }: { onStop: () => void }) {
  const reduce = useReducedMotion()

  return (
    <div className="sv-voice-input">
      <div className="sv-voice-bars" aria-hidden>
        {BARS.map((bar, i) => (
          <motion.span
            key={i}
            className="sv-voice-bar"
            initial={{ height: bar.h }}
            animate={reduce ? { height: bar.h } : { height: bar.keys }}
            transition={
              reduce
                ? { duration: 0 }
                : {
                    duration: 2,
                    times: bar.times,
                    ease: 'easeInOut',
                    repeat: Infinity,
                  }
            }
          />
        ))}
      </div>
      <button type="button" className="sv-voice-stop" onClick={onStop}>
        Stop
      </button>
    </div>
  )
}
