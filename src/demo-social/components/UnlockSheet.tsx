// Component — the "you just unlocked something" sheet.
//
// Three Figma nodes, one component: Streak unlocked (20016:12777),
// Achievement unlocked (20016:12891) and Badge unlocked (20017:13218) draw
// the identical sheet — a dimmed app behind a blurred translucent card, a
// title, a 75px piece of art, a name, a quiet detail line, and a Claim
// button. Only what sits between the art and the button changes, and only on
// the streak sheet (it adds the twelve-month calendar), so the variants are
// data (see unlockDemo.ts), not code paths.
//
// Reused rather than rebuilt: the dimming layer is the app's own
// `.sv-scrim.over-topbar`, and Claim is the shared Button at size="lg"
// variant="solid" — which is already Figma's 48px / radius-16 black pill.
import { motion } from 'framer-motion'
import Button from './Button'
import flameOn from '../assets/achievements/month-flame-on.svg'
import flameOff from '../assets/achievements/month-flame-off.svg'
import { type UnlockData } from '../data/unlockDemo'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

export default function UnlockSheet({
  unlock,
  scrim = true,
  onClaim,
  onDismiss,
}: {
  unlock: UnlockData
  /**
   * Dim what is behind the sheet. True in the app — this always arrives over
   * something. False in the Design System, where the sheet is the subject
   * and a full-bleed scrim would just black out the library card.
   */
  scrim?: boolean
  /** Tapping Claim. */
  onClaim?: () => void
  /** Tapping the dimmed area behind the sheet. */
  onDismiss?: () => void
}) {
  return (
    <>
      {/* Same scrim every pop-up in the app uses. `over-topbar` because this
          covers the whole phone — there is no anchor up there to keep lit. */}
      {scrim && (
        <motion.button
          type="button"
          className="sv-scrim over-topbar"
          aria-label="Dismiss"
          onClick={onDismiss}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        />
      )}

      <motion.div
        className="sv-unlock"
        role="dialog"
        aria-label={unlock.title}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 360, damping: 30, mass: 0.8 }}
      >
        <div className="sv-unlock-card">
          <p className="sv-unlock-title">{unlock.title}</p>

          <div className="sv-unlock-body">
            {/* The art is a flat render in Figma, so it is an exported asset
                rather than anything drawn here. */}
            <img className="sv-unlock-art" src={unlock.art} alt="" width={75} height={75} />

            <p className="sv-unlock-name">{unlock.name}</p>

            <div className="sv-unlock-detail">
              {unlock.detail.map((line, i) => (
                <p key={i}>
                  {line.map((run, j) =>
                    run.bold ? <b key={j}>{run.text}</b> : <span key={j}>{run.text}</span>,
                  )}
                </p>
              ))}
            </div>

            {/* Streak sheet only — two rows of six. A month you kept burns;
                one you did not is the same flame greyed out, so the run
                reads as a run rather than as twelve separate marks. */}
            {unlock.months && (
              <div className="sv-unlock-months">
                {unlock.months.map((m) => (
                  <span key={m.label} className="sv-unlock-month">
                    <span className="sv-unlock-month-label">{m.label}</span>
                    <img src={m.lit ? flameOn : flameOff} alt="" width={24} height={24} />
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <motion.div
          className="sv-unlock-claim"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT, delay: 0.12 }}
        >
          <Button size="lg" variant="solid" onClick={onClaim}>
            Claim
          </Button>
        </motion.div>
      </motion.div>
    </>
  )
}
