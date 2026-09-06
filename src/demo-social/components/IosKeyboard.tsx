// Component — the iOS keyboard (Figma 19380:5466).
//
// Chrome, not product UI: it exists so the search sheet sits at the right
// height and the demo reads as a real phone. Keys are inert by design —
// typing happens through the real <input> in PromptBox.
//
// Rebuilt rather than exported as an image so it stays crisp at any scale
// and the key glyphs use the system font. It is `aria-hidden` since the
// input beneath it is the real control.
import { ArrowBigUp, Delete, Globe, Mic, Smile, CornerDownLeft } from 'lucide-react'

const ROW_1 = [...'qwertyuiop']
const ROW_2 = [...'asdfghjkl']
const ROW_3 = [...'zxcvbnm']

export default function IosKeyboard({ suggestions }: { suggestions: string[] }) {
  return (
    <div className="sv-keyboard" aria-hidden="true">
      <div className="sv-keyboard-autocorrect">
        {suggestions.map((s, i) => (
          <div key={s} className="sv-keyboard-suggestion">
            {i > 0 && <span className="sv-keyboard-separator" />}
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="sv-keyboard-keys">
        <div className="sv-keyboard-row">
          {ROW_1.map((k) => (
            <span key={k} className="sv-key">
              {k}
            </span>
          ))}
        </div>
        <div className="sv-keyboard-row inset-1">
          {ROW_2.map((k) => (
            <span key={k} className="sv-key">
              {k}
            </span>
          ))}
        </div>
        <div className="sv-keyboard-row wide-gap">
          <span className="sv-key sv-key-mod">
            <ArrowBigUp size={22} strokeWidth={1.6} />
          </span>
          <div className="sv-keyboard-row-inner">
            {ROW_3.map((k) => (
              <span key={k} className="sv-key">
                {k}
              </span>
            ))}
          </div>
          <span className="sv-key sv-key-mod">
            <Delete size={22} strokeWidth={1.6} />
          </span>
        </div>
        <div className="sv-keyboard-row">
          <span className="sv-key sv-key-abc">ABC</span>
          <span className="sv-key sv-key-space" />
          <span className="sv-key sv-key-return">
            <CornerDownLeft size={20} strokeWidth={1.9} />
          </span>
        </div>
      </div>

      <div className="sv-keyboard-foot">
        <Smile size={24} strokeWidth={1.6} />
        <Globe size={22} strokeWidth={1.6} className="sv-keyboard-globe" />
        <Mic size={22} strokeWidth={1.6} />
      </div>
    </div>
  )
}
