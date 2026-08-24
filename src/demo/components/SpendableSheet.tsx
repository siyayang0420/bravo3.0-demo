// Component — the Combined Spendable pop-up, two tabs
// (Figma 19854:10237 Balance / 19854:10385 Bonus).
//
// Opens from either balance pill in the Home top bar, on the tab that
// matches the pill you tapped. The two are the same layout — hero, recent
// activity, a total footer — over two different pots of money, so they are
// one component switched by `tab` rather than two sheets.
//
// The tabs are swipeable as well as tappable: with only two of them the
// direction is fixed (moving to Bonus always travels left, back to Balance
// always travels right), so no previous-tab bookkeeping is needed.
import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Wallet } from 'lucide-react'
import Coin from './Coin'
import Button, { ButtonAccent } from './Button'
import {
  BALANCE_ACTIVITY,
  BONUS_ACTIVITY,
  type SpendableActivity,
} from '../data/spendableDemo'

export type SpendableTab = 'balance' | 'bonus'

/** `$3057` when whole, `$140.88` otherwise — the top bar's pills. */
export function formatMoney(value: number) {
  const rounded = Math.round(value * 100) / 100
  return `$${rounded % 1 === 0 ? rounded : rounded.toFixed(2)}`
}

/**
 * `$2,916.12` — grouped, always two decimals. The sheet writes money out in
 * full where the pills abbreviate it, which is what the two designs specify.
 */
export function formatAmount(value: number) {
  return `$${Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

const EASE_OUT = [0.23, 1, 0.32, 1] as const

// A pane enters from the side it is travelling toward and the outgoing one
// leaves the opposite way, so the two move together — same carousel the
// Community tabs use.
const PANE_VARIANTS = {
  enter: (d: number) => ({ x: d >= 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: '0%', opacity: 1 },
  exit: (d: number) => ({ x: d >= 0 ? '-100%' : '100%', opacity: 0 }),
}

/** Past this much travel (px, plus a fling allowance) the swipe commits. */
const SWIPE_COMMIT = 55

export default function SpendableSheet({
  balance,
  bonus,
  topUpBonus,
  tab = 'balance',
  onTabChange,
  onTopUp,
  onViewAll,
  onHowToEarn,
}: {
  balance: number
  bonus: number
  topUpBonus: string
  /** Which pot is showing. The pill you tapped picks the opening one. */
  tab?: SpendableTab
  onTabChange?: (tab: SpendableTab) => void
  onTopUp?: () => void
  onViewAll?: () => void
  onHowToEarn?: () => void
}) {
  // Uncontrolled fallback, so the component still works on its own — the
  // Design System preview has no screen state to lend it.
  const [ownTab, setOwnTab] = useState<SpendableTab>(tab)
  const active = onTabChange ? tab : ownTab
  const select = (next: SpendableTab) => {
    if (next === active) return
    onTabChange ? onTabChange(next) : setOwnTab(next)
  }

  // Two tabs, so the direction never needs remembering: Bonus is always to
  // the right of Balance.
  const direction = active === 'bonus' ? 1 : -1
  const isBonus = active === 'bonus'

  return (
    // `layout` because the two panes are different heights — Balance carries
    // the top-up CTA — and the card should settle between them rather than
    // snapping.
    <motion.div className="bv-spendable-sheet" layout transition={{ duration: 0.26, ease: EASE_OUT }}>
      <div className="bv-spendable-tabs">
        {(['balance', 'bonus'] as const).map((id) => (
          <button
            key={id}
            type="button"
            className={`bv-spendable-tab${active === id ? ' active' : ''}`}
            onClick={() => select(id)}
          >
            <span className="bv-spendable-tab-label">{id === 'balance' ? 'Balance' : 'Bonus'}</span>
            {/* One rule that slides between the two, rather than two that
                fade — the same layoutId trick as the search tabs. */}
            {active === id && (
              <motion.span
                className="bv-spendable-tab-rule"
                layoutId="bv-spendable-tab-rule"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence initial={false} mode="popLayout" custom={direction}>
        <motion.div
          key={active}
          className="bv-spendable-pane"
          custom={direction}
          variants={PANE_VARIANTS}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.7 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={(_, info) => {
            // Distance plus a slice of velocity, so a quick flick counts as
            // much as a slow drag across.
            const power = info.offset.x + info.velocity.x * 0.2
            if (power < -SWIPE_COMMIT) select('bonus')
            else if (power > SWIPE_COMMIT) select('balance')
          }}
        >
          {isBonus ? (
            <Hero
              icon={<Coin size={24} />}
              title="Bonus"
              amount={formatAmount(bonus)}
              caption="Rewards you earned"
              aside={
                <button type="button" className="bv-spendable-link" onClick={onHowToEarn}>
                  How to earn Bonus
                </button>
              }
            />
          ) : (
            <>
              <Hero
                icon={<Wallet size={24} strokeWidth={1.8} />}
                title="Balance"
                amount={formatAmount(balance)}
                caption="Your topped-up funds"
              />
              <Button onClick={onTopUp}>
                Top up now • <ButtonAccent>Bonus + {topUpBonus}</ButtonAccent>
              </Button>
            </>
          )}

          <div className="bv-spendable-activity">
            <div className="bv-spendable-activity-head">
              <span className="bv-spendable-activity-title">Recent activity</span>
              <button type="button" className="bv-spendable-viewall" onClick={onViewAll}>
                View all
                <ChevronRight size={16} strokeWidth={1.9} />
              </button>
            </div>
            {(isBonus ? BONUS_ACTIVITY : BALANCE_ACTIVITY).map((item) => (
              <ActivityRow key={item.id} item={item} />
            ))}
          </div>

          <div className="bv-spendable-total">
            <div className="bv-spendable-total-row">
              <span className="bv-spendable-total-label">Total available to spend</span>
              <span className="bv-spendable-total-aside">Including</span>
            </div>
            <div className="bv-spendable-total-row">
              <span className="bv-spendable-total-value">{formatAmount(balance + bonus)}</span>
              {/* The footer names the OTHER pot — what the tab you are on is
                  not showing. Figma labels both "bonus"; on the Bonus tab
                  that figure is the balance, so the word is corrected here. */}
              <span className="bv-spendable-total-other">
                {isBonus ? `${formatAmount(balance)} balance` : `${formatAmount(bonus)} bonus`}
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

function Hero({
  icon,
  title,
  amount,
  caption,
  aside,
}: {
  icon: ReactNode
  title: string
  amount: string
  caption: string
  /** Right-aligned link beside the title — the Bonus tab's only extra. */
  aside?: ReactNode
}) {
  return (
    <div className="bv-spendable-hero">
      <span className="bv-spendable-hero-icon">{icon}</span>
      <div className="bv-spendable-hero-copy">
        <div className="bv-spendable-hero-top">
          <span className="bv-spendable-hero-title">{title}</span>
          {aside}
        </div>
        <span className="bv-spendable-hero-amount">{amount}</span>
        <span className="bv-spendable-hero-caption">{caption}</span>
      </div>
    </div>
  )
}

function ActivityRow({ item }: { item: SpendableActivity }) {
  const credit = item.amount > 0
  return (
    <div className="bv-spendable-row">
      <span className="bv-spendable-row-copy">
        <span className="bv-spendable-row-label">{item.label}</span>
        <span className="bv-spendable-row-when">{item.when}</span>
      </span>
      <span className={`bv-spendable-row-amount${credit ? ' credit' : ''}`}>
        {credit ? '+' : '-'}
        {formatAmount(item.amount)}
      </span>
    </div>
  )
}
