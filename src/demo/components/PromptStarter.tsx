// Component — Figma "Prompt Starter" (1363:3722), the suggested queries laid
// out as a two-row rail above the prompt box when the search sheet is empty.
//
// A "brick": an emoji leading a label that wraps inside a capped width, so
// the questions read as blocks in a wall rather than pills running off the
// edge. The emoji stands for the KIND of thing being asked, the same job it
// does on SuggestionChip.
export default function PromptStarter({
  emoji,
  label,
  onSelect,
}: {
  /** One glyph for the question — see PROMPTS in promptDemo. */
  emoji?: string
  label: string
  onSelect?: () => void
}) {
  return (
    <button type="button" className="bv-prompt-starter" onClick={onSelect}>
      {emoji && (
        <span className="bv-prompt-starter-emoji" aria-hidden>
          {emoji}
        </span>
      )}
      <span className="bv-prompt-starter-label">{label}</span>
    </button>
  )
}
