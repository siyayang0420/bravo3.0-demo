// Component — the Bravo coin glyph (Figma "coin a" / Group 1996)
// Gold disc + white rosette. Used at 19px in BalancePill and 42px in
// PromoCard; the mark is positioned in percentages so one rule scales.
import coinBase from '../assets/coin-base.svg'
import coinMark from '../assets/coin-mark.svg'

export default function Coin({ size = 19 }: { size?: number }) {
  return (
    <span className="bv-coin" style={{ width: size, height: size }}>
      <img src={coinBase} alt="" />
      <img className="bv-coin-mark" src={coinMark} alt="" />
    </span>
  )
}
