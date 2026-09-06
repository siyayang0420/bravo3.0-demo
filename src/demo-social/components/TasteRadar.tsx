// Component — the Taste DNA radar (Figma 19689:50291 … 19689:50313).
//
// Six axes on a pointy-top hexagon: three nested grid rings behind one
// filled data polygon, each axis labelled with its name and score just
// outside its vertex. Drawn rather than imported, because the data polygon's
// shape IS the data — an exported SVG would freeze one profile's numbers.
//
// Two details are measured off the Figma nodes rather than assumed:
//
//   * The hexagon is NOT regular. Figma's outer ring exports at 196.588 x
//     217.718, where a regular pointy-top hexagon of that height would be
//     188.55 wide — so it is stretched ~4.3% horizontally. RX_RATIO carries
//     that, otherwise the chart reads a touch too narrow.
//   * Every corner is rounded. The top corner's export runs 29.5px between
//     tangent points, i.e. ~14.75px cut back along each edge from a vertex
//     on a 108.86 circumradius — CORNER_CUT is that as a fraction, so the
//     rounding scales with the ring.
import { type TasteRadarAxis } from '../data/profileDemo'

/** Ring sizes as a fraction of the outer one (Figma: 227 / 166 / 106). */
const RINGS = [106 / 227, 166 / 227, 1]
/** Horizontal stretch — see the note above. */
const RX_RATIO = 1.0427
/** Corner rounding, as a fraction of the ring's circumradius. */
const CORNER_CUT = 14.75 / 108.86

type Point = [number, number]

/** A closed path through `points` with every corner rounded off by `cut`
 *  units along each adjoining edge (quadratic corner, vertex as the control
 *  point — visually identical to Figma's cubics at this size). */
function roundedPath(points: Point[], cut: number): string {
  const n = points.length
  const parts: string[] = []

  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n]
    const curr = points[i]
    const next = points[(i + 1) % n]

    const toward = ([x, y]: Point, [tx, ty]: Point, dist: number): Point => {
      const dx = tx - x
      const dy = ty - y
      const len = Math.hypot(dx, dy) || 1
      // Never eat more than half an edge, or adjacent corners would overlap.
      const d = Math.min(dist, len / 2)
      return [x + (dx / len) * d, y + (dy / len) * d]
    }

    const start = toward(curr, prev, cut)
    const end = toward(curr, next, cut)

    parts.push(`${i === 0 ? 'M' : 'L'}${start[0].toFixed(2)},${start[1].toFixed(2)}`)
    parts.push(`Q${curr[0].toFixed(2)},${curr[1].toFixed(2)} ${end[0].toFixed(2)},${end[1].toFixed(2)}`)
  }

  parts.push('Z')
  return parts.join(' ')
}

export default function TasteRadar({
  axes,
  max,
  /** Circumradius of the outer ring — Figma's 217.718 / 2. */
  radius = 108.86,
}: {
  axes: TasteRadarAxis[]
  /** The value an axis needs to reach the outer ring. */
  max: number
  radius?: number
}) {
  const n = axes.length
  // The canvas is bigger than the hexagon so the labels, which sit outside
  // the vertices, are not clipped — SVG clips to its viewBox.
  const width = 338
  const height = 292
  const cx = width / 2
  const cy = height / 2

  // Pointy-top: first vertex straight up, then clockwise. Matches the axis
  // order in the data (Connoisseur at the top, Connector at the bottom).
  const angleOf = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n
  const pointAt = (fraction: number, i: number): Point => {
    const a = angleOf(i)
    return [
      cx + radius * RX_RATIO * fraction * Math.cos(a),
      cy + radius * fraction * Math.sin(a),
    ]
  }

  return (
    <svg
      className="sv-taste-radar"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Taste DNA: ${axes.map((a) => `${a.label} ${a.value}`).join(', ')}`}
    >
      {RINGS.map((r) => (
        <path
          key={r}
          className="sv-taste-radar-ring"
          d={roundedPath(
            axes.map((_, i) => pointAt(r, i)),
            radius * CORNER_CUT * r,
          )}
        />
      ))}

      <path
        className="sv-taste-radar-fill"
        d={roundedPath(
          axes.map((axis, i) => pointAt(Math.min(1, axis.value / max), i)),
          radius * CORNER_CUT * 0.6,
        )}
      />

      {axes.map((axis, i) => {
        const [vx, vy] = pointAt(1, i)
        const top = i === 0
        const bottom = n % 2 === 0 && i === n / 2
        // Figma sits the side labels ~17px out from their vertex and the
        // top/bottom ones ~8px clear of theirs.
        const x = top || bottom ? vx : vx + (vx < cx ? -17 : 17)
        const anchor = top || bottom ? 'middle' : vx < cx ? 'end' : 'start'
        // Side labels straddle the vertex; top/bottom clear it vertically.
        const nameY = top ? vy - 22 : bottom ? vy + 20 : vy - 2
        return (
          <text key={i} x={x} textAnchor={anchor}>
            <tspan className="sv-taste-radar-name" x={x} y={nameY}>
              {axis.label}
            </tspan>
            <tspan className="sv-taste-radar-value" x={x} y={nameY + 14}>
              {axis.value}
            </tspan>
          </text>
        )
      })}
    </svg>
  )
}
