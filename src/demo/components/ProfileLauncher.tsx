// Opens a public profile from anywhere a person is shown — a post author, a
// leaderboard face — without threading callbacks through every screen.
//
// A component calls useOpenProfile()(person); the provider (mounted once, in
// BravoApp) pushes the ProfileScreen over everything. Outside the provider —
// e.g. the Design System previews — the hook is a no-op, so those components
// stay renderable on their own.
import { createContext, useContext, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ProfileScreen from '../screens/ProfileScreen'
import { publicProfile, type ProfilePerson } from '../data/profileDemo'

const OpenProfileContext = createContext<(person: ProfilePerson) => void>(() => {})

export const useOpenProfile = () => useContext(OpenProfileContext)

export default function ProfileProvider({ children }: { children: ReactNode }) {
  const [person, setPerson] = useState<ProfilePerson | null>(null)

  return (
    <OpenProfileContext.Provider value={setPerson}>
      {children}
      <AnimatePresence>
        {person && (
          <motion.div
            className="bv-profile-wrap"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.7 }}
          >
            <ProfileScreen
              profile={publicProfile(person)}
              mode="public"
              onBack={() => setPerson(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </OpenProfileContext.Provider>
  )
}
