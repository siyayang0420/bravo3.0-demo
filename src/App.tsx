import { useState, type ComponentType } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import NavBar from './components/NavBar'
import Sidebar, { type SectionId } from './components/Sidebar'
import WhatChanged from './sections/WhatChanged'
import LiveDemo from './sections/LiveDemo'
import DesignSystem from './sections/DesignSystem'
import Rationale from './sections/Rationale'
import FlutterNotes from './sections/FlutterNotes'

const SECTIONS: Record<SectionId, ComponentType> = {
  changes: WhatChanged,
  demo: LiveDemo,
  system: DesignSystem,
  rationale: Rationale,
  flutter: FlutterNotes,
}

export default function App() {
  // Lands on the demo — it leads the sidebar and is the thing to look at first.
  const [section, setSection] = useState<SectionId>('demo')
  const Active = SECTIONS[section]

  return (
    <div className="app-shell">
      <NavBar />
      <div className="app-body">
        <Sidebar active={section} onSelect={setSection} />
        <main className="main-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Active />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
