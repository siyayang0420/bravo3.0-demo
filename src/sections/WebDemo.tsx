// The Web section — the app itself, in a browser-shaped box, at the three
// widths it has to work at.
//
// The frame is a real resizable box, not a screenshot: the app inside is
// laid out with container queries, so narrowing the frame is genuinely what
// a narrower browser would do. "Fit" hands the app the whole panel, which is
// how you check it at whatever width the reviewer's own screen happens to be.
//
// Set it to Mobile and it is pixel-for-pixel the Live UI demo — the same
// screens, not a web copy of them. See WebApp.tsx.
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Monitor, Tablet, Smartphone, Maximize2 } from 'lucide-react'
import WebApp from '../web/WebApp'
import WebPresentMode from '../web/WebPresentMode'

type Device = 'fit' | 'desktop' | 'tablet' | 'mobile'

// Widths are the devices' own, not the breakpoints — the point is to see the
// app at a real size and watch which layout it chooses.
const DEVICES: { id: Device; label: string; icon: typeof Monitor; width: number | null; note: string }[] = [
  { id: 'fit', label: 'Fit', icon: Maximize2, width: null, note: 'Full panel width.' },
  { id: 'desktop', label: 'Desktop', icon: Monitor, width: 1440, note: '1440 — results panel over the map.' },
  { id: 'tablet', label: 'Tablet', icon: Tablet, width: 834, note: '834 — the phone app, on a wider map.' },
  { id: 'mobile', label: 'Mobile', icon: Smartphone, width: 390, note: '390 — identical to the Live UI demo.' },
]

export default function WebDemo() {
  const [device, setDevice] = useState<Device>('desktop')
  const [presenting, setPresenting] = useState(false)
  const current = DEVICES.find((d) => d.id === device)!

  return (
    <div className="section-page" style={{ maxWidth: 1560 }}>
      <p className="eyebrow">Responsive — this is the real UI</p>
      <h1 className="page-title">Web</h1>
      <p className="page-lede">
        Bravo in a browser — the phone build's actual screens, mounted at browser width
        rather than rebuilt for it. At 390 it is identical to the Live UI demo; widening
        keeps the map as the base layer and floats the results over it. Resize with the
        controls below: each preview is a genuinely different render, not a scaled picture.
      </p>

      <div className="web-toolbar">
        <div className="web-devices">
          {DEVICES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={`web-device${device === id ? ' active' : ''}`}
              onClick={() => setDevice(id)}
            >
              <Icon size={15} strokeWidth={2} />
              {label}
            </button>
          ))}
        </div>
        <span className="web-note">{current.note}</span>
      </div>

      {/* The frame scrolls sideways rather than squashing the app when the
          chosen width is wider than the review panel — a squashed 1440 would
          be reporting the wrong layout. */}
      <div className="web-stage">
        <motion.div
          className="web-frame"
          layout
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          style={{
            width: current.width ?? '100%',
            // Only "Fit" is allowed to clamp. A chosen device width must be
            // honoured exactly — squashing 1440 into the panel would report a
            // layout the app never actually chooses, which is the one thing
            // this preview exists to avoid. The stage scrolls instead.
            maxWidth: current.width ? 'none' : '100%',
            flexShrink: 0,
          }}
        >
          <div className="web-viewport">
            <WebApp />
          </div>
        </motion.div>
      </div>

      {/* Same offer as the Live UI demo, one section over: drop the review
          chrome and give the app the whole screen — at whichever width is
          selected above. */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button className="btn btn-secondary" onClick={() => setPresenting(true)}>
          <Maximize2 size={14} />
          Present full screen
        </button>
      </div>

      <WebPresentMode
        open={presenting}
        onClose={() => setPresenting(false)}
        width={current.width}
      />
    </div>
  )
}
