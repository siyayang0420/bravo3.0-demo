// Component — Figma "Prompt Starter" (1363:3722), the suggested queries
// stacked above the prompt box when the search sheet is empty.
//
// Unlike SuggestionChip these carry no thumbnail — just the label on a
// neutral-100 pill with the `bubble` inset.
export default function PromptStarter({
  label,
  onSelect,
}: {
  label: string
  onSelect?: () => void
}) {
  return (
    <button type="button" className="bv-prompt-starter" onClick={onSelect}>
      {label}
    </button>
  )
}
