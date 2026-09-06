// Is the app running as the WEB build rather than inside the phone frame?
//
// Both builds are the same components (see web/WebApp.tsx), and this flag is
// deliberately not a licence to fork them. It exists for the short list of
// things that differ because a browser is not a phone — the on-screen
// keyboard above all. The mock iOS keyboard is device chrome: on a phone it
// is what makes the sheet sit at the right height and read as a real
// keyboard. In a browser the reviewer already has one, and the field is
// already taking their keystrokes, so drawing ours would be a picture of a
// keyboard underneath a working input.
//
// Same conclusion the installed PWA reaches through `useStandalone`, for the
// opposite reason: there the phone raises its OWN keyboard, so ours would be
// a second one stacked under it.
import { createContext, useContext } from 'react'

export const WebFrameContext = createContext(false)

export default function useWebFrame() {
  return useContext(WebFrameContext)
}
