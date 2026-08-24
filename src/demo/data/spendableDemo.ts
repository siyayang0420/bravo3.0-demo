// Recent activity behind the two Combined Spendable tabs
// (Figma 19854:10237 Balance / 19854:10385 Bonus).
//
// Two separate ledgers, because the tabs are two different pots of money:
// Balance is what you topped up and spent, Bonus is what you earned and
// redeemed. The same merchant shows up in both — one visit can move both.

export type SpendableActivity = {
  id: string
  label: string
  when: string
  /** Signed dollars. Positive renders green with a leading +. */
  amount: number
}

export const BALANCE_ACTIVITY: SpendableActivity[] = [
  { id: 'b1', label: 'Top up', when: 'Aug 18 2:22 PM', amount: 500 },
  { id: 'b2', label: 'Meetrice Noodle Richmond', when: 'Aug 18 2:22 PM', amount: -22.93 },
  { id: 'b3', label: 'Meetrice Noodle Richmond', when: 'Aug 18 2:22 PM', amount: -22.93 },
]

export const BONUS_ACTIVITY: SpendableActivity[] = [
  { id: 'n1', label: 'Top up bonus', when: 'Aug 18 2:22 PM', amount: 50 },
  { id: 'n2', label: 'Redeemed at Meetrice Noodle Richmond', when: 'Aug 18 2:22 PM', amount: -2.91 },
  { id: 'n3', label: 'Earned at Meetrice Noodle Richmond', when: 'Aug 18 2:22 PM', amount: 0.68 },
]
