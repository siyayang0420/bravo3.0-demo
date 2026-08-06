import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import bravoLogo from '../images/bravo_logo_b&y.png'

export default function NavBar() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <header className="nav-bar">
      <div className="nav-brand">
        <img className="nav-brand-mark" src={bravoLogo} alt="Bravo logo" />
        <span>Bravo Rewards</span>
        <span className="nav-brand-version">3.0 Design Review</span>
      </div>
      <div className="nav-actions">
        <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
          Prepared by Siya Yang · July 2026
        </span>
        <button
          className="icon-button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  )
}
