// In-app summary of docs/REACT-TO-FLUTTER-NOTES.md — keep the two in sync.
// Full developer detail lives in the markdown doc; this section is the
// executive/PM view.

export type FlutterNote = {
  risk: 'high' | 'medium' | 'low'
  feature: string
  issue: string
  plan: string
}

export const FLUTTER_NOTES: FlutterNote[] = [
  {
    risk: 'high',
    feature: 'Frosted-glass prompt dock (backdrop blur)',
    issue: 'BackdropFilter over a live map is a known jank source on low-end Android.',
    plan: 'Impeller + smallest possible clip area; near-opaque fallback ready. Perf-test early.',
  },
  {
    risk: 'high',
    feature: 'Gradient ring around the AI prompt box',
    issue: 'CSS gradient border is a padding trick; Flutter has no gradient BoxBorder.',
    plan: 'Container with gradient decoration wrapping an inset white Container, or CustomPainter.',
  },
  {
    risk: 'high',
    feature: 'Exit animations (sheets, overlays)',
    issue: 'React animates unmounting components for free; Flutter removes widgets instantly.',
    plan: 'showModalBottomSheet (built-in dismiss) + explicit controllers for overlays.',
  },
  {
    risk: 'medium',
    feature: 'Layered inner-shadow "bubble" chip style',
    issue: 'Two stacked inset shadows per chip; Flutter BoxShadow has no inset mode.',
    plan: 'Recreate with a gradient overlay or a 9-slice asset; agree on one approach for all chips.',
  },
  {
    risk: 'medium',
    feature: 'Interactive map surface',
    issue: 'Demo uses a static export; production needs a real map SDK with custom pins.',
    plan: 'google_maps_flutter or mapbox_maps_flutter; custom marker widgets for restaurant pins.',
  },
  {
    risk: 'low',
    feature: 'Lucide icon set',
    issue: 'None — the same icon set is available to Flutter.',
    plan: 'lucide_icons package, or export SVGs from the design and use flutter_svg.',
  },
  {
    risk: 'low',
    feature: 'DM Sans typography + design tokens',
    issue: 'None — variable font and tokens port directly.',
    plan: 'google_fonts + a bravo_tokens package generated from the same Figma variables.',
  },
]
