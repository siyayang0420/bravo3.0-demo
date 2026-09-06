import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/tokens.css'
import './styles/app.css'
import './demo/bravo-app.css'
// The Social UI demo's own stylesheet. It is a namespaced copy of the one
// above (`bv-` → `sv-`), so the two define no selector in common and editing
// one cannot restyle the other. See src/sections/SocialDemo.tsx.
import './demo-social/bravo-social.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
