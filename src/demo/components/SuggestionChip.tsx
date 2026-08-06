// Component — Figma suggestion chip (node 19453:11120)
export default function SuggestionChip({
  image,
  label,
  onClick,
}: {
  image: string
  label: string
  onClick?: () => void
}) {
  return (
    <button className="bv-suggestion-chip" onClick={onClick}>
      <img src={image} alt="" />
      {label}
    </button>
  )
}
