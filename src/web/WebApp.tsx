// Bravo for the web.
//
// The rule this file follows, and the reason it is so short: THE WEB BUILD IS
// THE APP. Not a web port of it, not a second set of screens that resemble it
// — the actual HomeScreen, SocialScreen, RewardsScreen and ProfileScreen from
// demo/screens, mounted in a box that is the width of the browser instead of
// the width of a phone.
//
// So at a phone width the web build and the Live UI Demo are the same pixels,
// because they are the same components: same top bar, same balance pills, same
// filter and suggestion chips, same AI dock, same bottom nav and the same five
// icons in it. There is nothing here that could drift from the phone, because
// there is nothing here that is a copy of it.
//
// Widening the frame does not change which screen you are on or what it is
// made of. The map stays the base layer at every width — it is the product's
// centre of gravity, not a panel that gets demoted once there is room — and
// the extra width is spent floating MORE of the app over it (see WebDiscover's
// results panel) rather than on stretching the chrome.
//
// The one thing the phone has that the web does not is the device status bar:
// a browser draws its own chrome, so the shell carries `standalone`, which is
// the same class the installed PWA uses to zero out --bv-statusbar-h and drop
// the 9:41 band. Every offset measured from it follows.
//
// Layout responds to CONTAINER width, not the viewport — the app is previewed
// inside a resizable frame on the review site, so viewport media queries would
// report the reviewer's monitor instead of the frame being shown.
import { useState } from 'react'
import DemoUserProvider from '../demo/components/DemoIdentity'
import ProfileProvider from '../demo/components/ProfileLauncher'
import SocialScreen from '../demo/screens/SocialScreen'
import RewardsScreen from '../demo/screens/RewardsScreen'
import ProfileScreen from '../demo/screens/ProfileScreen'
import { type NavId } from '../demo/components/BottomNav'
import { DEMO_USERS, meProfile } from '../demo/data/profileDemo'
import WebDiscover from './WebDiscover'
import { WebFrameContext } from '../hooks/useWebFrame'
import './web.css'

export default function WebApp() {
  // The phone's own nav ids, because the phone's own BottomNav is the nav —
  // there is no second web navigation to keep in step with it.
  const [tab, setTab] = useState<NavId>('map')
  const user = DEMO_USERS[0]
  const me = meProfile(user)

  return (
    // bravo-scope carries the --bv-* tokens; bravo-app is the app shell, and
    // bravo-app.css is loaded globally, so every screen styles itself in here
    // exactly as it does inside the phone frame.
    // The flag every screen below reads to know it is in a browser rather
    // than a phone — see hooks/useWebFrame. It gates device chrome only (the
    // mock keyboard); widths are still answered by the container queries in
    // web.css, not by this.
    <WebFrameContext.Provider value>
      <div className="w-app bravo-scope">
        <DemoUserProvider user={user}>
          <div className="bravo-app standalone w-shell">
            <ProfileProvider>
              {tab === 'profile' ? (
                <ProfileScreen
                  profile={me}
                  mode="me"
                  active={tab}
                  onNavigate={setTab}
                  onBack={() => setTab('map')}
                />
              ) : tab === 'friends' ? (
                <SocialScreen active={tab} onNavigate={setTab} avatar={user.avatar} />
              ) : tab === 'rewards' ? (
                <RewardsScreen profile={me} active={tab} onNavigate={setTab} />
              ) : (
                <WebDiscover active={tab} onNavigate={setTab} avatar={user.avatar} />
              )}
            </ProfileProvider>
          </div>
        </DemoUserProvider>
      </div>
    </WebFrameContext.Provider>
  )
}
