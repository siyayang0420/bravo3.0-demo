// Who the demo is signed in as, readable from anywhere.
//
// Screens that own a profile get it as a prop. The ones that don't — the map,
// the community feed, the search sheet, the AI chat — still need to know
// whether this account has any history, and they sit several layers below
// BravoApp behind overlays that are mounted by hooks. Threading a `user` prop
// through all of that would put the same argument in a dozen signatures for
// one boolean, so it goes through context, exactly like useOpenProfile.
//
// The default is Bobby (the funded account), so anything rendered OUTSIDE the
// provider — the Design System previews, mainly — still has a real user to
// draw and looks the way it always did.
import { createContext, useContext, type ReactNode } from 'react'
import { DEMO_USERS, type DemoUser } from '../data/profileDemo'

const DemoUserContext = createContext<DemoUser>(DEMO_USERS[0])

/** The active demo user. `isNew` is the flag every empty state hangs off. */
export const useDemoUser = () => useContext(DemoUserContext)

export default function DemoUserProvider({
  user,
  children,
}: {
  user: DemoUser
  children: ReactNode
}) {
  return <DemoUserContext.Provider value={user}>{children}</DemoUserContext.Provider>
}
