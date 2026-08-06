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
    <div className="bv-keyboard" aria-hidden="true">
      <div className="bv-keyboard-autocorrect">
        {suggestions.map((s, i) => (
          <div key={s} className="bv-keyboard-suggestion">
            {i > 0 && <span className="bv-keyboard-separator" />}
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="bv-keyboard-keys">
        <div className="bv-keyboard-row">
          {ROW_1.map((k) => (
            <span key={k} className="bv-key">
              {k}
            </span>
          ))}
        </div>
        <div className="bv-keyboard-row inset-1">
          {ROW_2.map((k) => (
            <span key={k} className="bv-key">
              {k}
            </span>
          ))}
        </div>
        <div className="bv-keyboard-row wide-gap">
          <span className="bv-key bv-key-mod">
            <ArrowBigUp size={22} strokeWidth={1.6} />
          </span>
          <div className="bv-keyboard-row-inner">
            {ROW_3.map((k) => (
              <span key={k} className="bv-key">
                {k}
              </span>
            ))}
          </div>
          <span className="bv-key bv-key-mod">
            <Delete size={22} strokeWidth={1.6} />
          </span>
        </div>
        <div className="bv-keyboard-row">
          <span className="bv-key bv-key-abc">ABC</span>
          <span className="bv-key bv-key-space" />
          <span className="bv-key bv-key-return">
            <CornerDownLeft size={20} strokeWidth={1.9} />
          </span>
        </div>
      </div>

      <div className="bv-keyboard-foot">
        <Smile size={24} strokeWidth={1.6} />
        <Globe size={22} strokeWidth={1.6} className="bv-keyboard-globe" />
        <Mic size={22} strokeWidth={1.6} />
      </div>
    </div>
  )
}
