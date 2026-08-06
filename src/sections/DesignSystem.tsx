import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react'
import {
  COMPONENT_SPECS,
  COLOR_GROUPS,
  RADIUS_TOKENS,
  SPACING_TOKENS,
  TYPE_SCALE,
  EFFECT_TOKENS,
  type ComponentSpec,
} from '../content/designSystem'
import mapBg from '../demo/assets/map-home.jpg'

const mono = { fontFamily: 'var(--font-code)', fontSize: 12 }
const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--color-text-tertiary)',
  marginBottom: 6,
}

function ComponentCard({ spec }: { spec: ComponentSpec }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3 }}
      style={{ padding: 0, overflow: 'hidden' }}
    >
      {/* header */}
      <div style={{ padding: 'var(--space-12) var(--space-12) var(--space-8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
          <span style={{ fontSize: 16, fontWeight: 600 }}>{spec.name}</span>
          {spec.figmaNodes.map((n) => (
            <span key={n} className="tag neutral" style={mono}>
              {n}
            </span>
          ))}
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--color-text-secondary)', maxWidth: 620 }}>
          {spec.summary}
        </p>
      </div>

      {/* live preview */}
      <div
        className="bravo-scope"
        style={{
          padding: 'var(--space-12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 110,
          borderTop: '1px solid var(--color-border-subtle)',
          borderBottom: '1px solid var(--color-border-subtle)',
          ...(spec.previewBg === 'map'
            ? {
                backgroundImage: `url(${mapBg})`,
                backgroundSize: '420px',
                backgroundPosition: 'center 30%',
              }
            : { background: '#ffffff' }),
        }}
      >
        {spec.preview}
      </div>

      {/* meta row */}
      <div
        style={{
          display: 'flex',
          gap: 24,
          flexWrap: 'wrap',
          padding: 'var(--space-8) var(--space-12)',
          fontSize: 12,
          color: 'var(--color-text-secondary)',
        }}
      >
        <span>
          <b style={{ color: 'var(--color-text-primary)' }}>File</b>{' '}
          <span style={mono}>{spec.file}</span>
        </span>
        <span>
          <b style={{ color: 'var(--color-text-primary)' }}>Used on</b> {spec.usedOn.join(', ')}
        </span>
        {spec.icons.length > 0 && (
          <span>
            <b style={{ color: 'var(--color-text-primary)' }}>Icons</b> {spec.icons.join(', ')}
          </span>
        )}
      </div>

      {/* expandable spec */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: 'var(--space-6) var(--space-12)',
          borderTop: '1px solid var(--color-border-subtle)',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--color-text-secondary)',
          textAlign: 'left',
        }}
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        {open ? 'Hide' : 'Show'} props &amp; tokens
      </button>

      {open && (
        <div style={{ padding: 'var(--space-8) var(--space-12) var(--space-12)', borderTop: '1px solid var(--color-border-subtle)' }}>
          <div style={labelStyle}>Props</div>
          <div style={{ overflowX: 'auto', marginBottom: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--color-text-tertiary)' }}>
                  <th style={{ padding: '4px 12px 4px 0', fontWeight: 500 }}>Name</th>
                  <th style={{ padding: '4px 12px 4px 0', fontWeight: 500 }}>Type</th>
                  <th style={{ padding: '4px 12px 4px 0', fontWeight: 500 }}>Req.</th>
                  <th style={{ padding: '4px 0', fontWeight: 500 }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {spec.props.map((p) => (
                  <tr key={p.name} style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: '6px 12px 6px 0', ...mono, whiteSpace: 'nowrap' }}>{p.name}</td>
                    <td style={{ padding: '6px 12px 6px 0', ...mono, color: 'var(--color-text-secondary)' }}>{p.type}</td>
                    <td style={{ padding: '6px 12px 6px 0', color: 'var(--color-text-tertiary)' }}>
                      {p.required ? 'yes' : '—'}
                    </td>
                    <td style={{ padding: '6px 0', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                      {p.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={labelStyle}>Tokens consumed</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: spec.flutterNote ? 16 : 0 }}>
            {spec.tokens.map((t) => (
              <span key={t} className="tag neutral" style={mono}>
                {t}
              </span>
            ))}
          </div>

          {spec.flutterNote && (
            <div
              style={{
                display: 'flex',
                gap: 8,
                padding: 12,
                borderRadius: 'var(--radius-card-sm)',
                background: 'var(--color-status-warning-subtle)',
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              <AlertTriangle size={16} style={{ color: 'var(--color-status-warning)', flexShrink: 0, marginTop: 1 }} />
              <span>
                <b style={{ color: 'var(--color-status-warning)' }}>Implementation note — </b>
                {spec.flutterNote}
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

function Swatch({ token }: { token: string }) {
  return (
    <div style={{ width: 96 }}>
      <div
        style={{
          height: 44,
          borderRadius: 'var(--radius-control)',
          background: `var(${token})`,
          border: '1px solid var(--color-border-subtle)',
          marginBottom: 4,
        }}
      />
      <div style={{ ...mono, fontSize: 10, color: 'var(--color-text-secondary)', wordBreak: 'break-all' }}>
        {token.replace('--bv-', '')}
      </div>
    </div>
  )
}

export default function DesignSystem() {
  return (
    <div className="section-page">
      <p className="eyebrow">Mobile · DM Sans · Lucide</p>
      <h1 className="page-title">Bravo App Design System</h1>
      <p className="page-lede">
        Every component built from Figma so far, rendered live with its spec. Tokens
        are generated from the Figma variable exports — colors, spacing, radius, and
        type all trace back to a named variable.
      </p>

      {/* ---------- components ---------- */}
      <h2 className="section-heading" style={{ marginTop: 0 }}>
        Components <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 400 }}>({COMPONENT_SPECS.length})</span>
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {COMPONENT_SPECS.map((spec) => (
          <ComponentCard key={spec.id} spec={spec} />
        ))}
      </div>

      {/* ---------- color ---------- */}
      <h2 className="section-heading">Color</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {COLOR_GROUPS.map((g) => (
          <div key={g.title}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{g.title}</span>
              <span style={{ ...mono, color: 'var(--color-text-tertiary)' }}>{g.source}</span>
            </div>
            <div className="bravo-scope" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {g.tokens.map((t) => (
                <Swatch key={t} token={t} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ---------- typography ---------- */}
      <h2 className="section-heading">Typography</h2>
      <div className="card bravo-scope" style={{ background: '#fff', color: '#202020' }}>
        {TYPE_SCALE.map((t) => (
          <div
            key={t.label}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 16,
              padding: '8px 0',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <span
              style={{
                ...mono,
                width: 170,
                flexShrink: 0,
                color: '#737373',
                fontSize: 11,
              }}
            >
              {t.label}
            </span>
            <span style={{ fontFamily: 'var(--bv-font)', fontSize: t.size, fontWeight: t.weight, lineHeight: 1.2 }}>
              Bravo Rewards
            </span>
          </div>
        ))}
      </div>

      {/* ---------- radius + spacing ---------- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginTop: 24 }}>
        <div>
          <h2 className="section-heading" style={{ marginTop: 0 }}>Radius</h2>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {RADIUS_TOKENS.map((r) => (
              <div key={r.token} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    flexShrink: 0,
                    background: 'var(--color-bg-subtle)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: Math.min(r.value, 20),
                  }}
                />
                <span style={{ ...mono, flex: 1 }}>{r.token.replace('--bv-', '')}</span>
                <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                  {/* radius-full is a 9999 sentinel, not a real measurement */}
                  {r.value === 9999 ? 'full' : `${r.value}px`} · {r.figma}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="section-heading" style={{ marginTop: 0 }}>Spacing</h2>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SPACING_TOKENS.map((s) => (
              <div key={s.token} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 72, flexShrink: 0 }}>
                  <div
                    style={{
                      width: Math.min(s.value, 64),
                      height: 12,
                      background: 'var(--color-status-warning)',
                      borderRadius: 2,
                    }}
                  />
                </div>
                <span style={{ ...mono, flex: 1 }}>{s.token.replace('--bv-', '')}</span>
                <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                  {s.value}px · {s.figma}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- effects ---------- */}
      <h2 className="section-heading">Effect styles</h2>
      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
        Each effect is both a token and a class, so it can be dropped onto any element
        the same way it is applied on the canvas. Reach for the token only when the
        effect has to be composed with another shadow on the same element —{' '}
        <code style={mono}>box-shadow</code> does not cascade-merge.
      </p>
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: 12,
          borderRadius: 'var(--radius-card-sm)',
          background: 'var(--color-status-warning-subtle)',
          fontSize: 13,
          lineHeight: 1.5,
          marginBottom: 16,
        }}
      >
        <AlertTriangle size={16} style={{ color: 'var(--color-status-warning)', flexShrink: 0, marginTop: 1 }} />
        <span>
          <b style={{ color: 'var(--color-status-warning)' }}>Flutter — </b>
          there is no inset <code style={mono}>BoxShadow</code>. The Dart below assumes{' '}
          <code style={mono}>flutter_inset_box_shadow</code>, which re-exports{' '}
          <code style={mono}>BoxShadow</code> with an <code style={mono}>inset</code> flag;
          without it, use a <code style={mono}>CustomPainter</code> with{' '}
          <code style={mono}>MaskFilter.blur(BlurStyle.inner, sigma)</code>. Two things
          that are easy to get wrong: <b>paint order is reversed</b> — CSS paints the
          first shadow on top, <code style={mono}>BoxDecoration</code> paints the list in
          order, so every list below is the CSS list reversed — and{' '}
          <code style={mono}>blurRadius</code> maps <b>1:1</b> to the CSS blur radius, so
          do not pre-convert it to a sigma.
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {EFFECT_TOKENS.map((e) => (
          <div key={e.token} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <span className="tag neutral" style={mono}>
                {e.token}
              </span>
              {e.className && (
                <span className="tag neutral" style={mono}>
                  {e.className}
                </span>
              )}
              <span style={{ ...mono, color: 'var(--color-text-tertiary)' }}>{e.figma}</span>
              {e.needsPackage && (
                <span style={{ ...mono, color: 'var(--color-status-warning)' }}>
                  needs flutter_inset_box_shadow
                </span>
              )}
            </div>

            <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              {e.description}
            </span>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 12,
              }}
            >
              <div>
                <div style={labelStyle}>CSS</div>
                <CodeBlock code={e.css} />
              </div>
              <div>
                <div style={labelStyle}>Flutter</div>
                <CodeBlock code={e.flutter} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre
      style={{
        ...mono,
        margin: 0,
        padding: 12,
        borderRadius: 'var(--radius-card-sm)',
        background: 'var(--color-bg-subtle)',
        border: '1px solid var(--color-border-subtle)',
        color: 'var(--color-text-secondary)',
        lineHeight: 1.55,
        overflowX: 'auto',
        whiteSpace: 'pre',
      }}
    >
      <code>{code}</code>
    </pre>
  )
}
