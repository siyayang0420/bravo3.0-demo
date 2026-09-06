// Component — a merchant hit in the search results (Figma 19542:163507).
// Name on the left, distance and a chevron on the right, hairline under.
import { ChevronRight } from 'lucide-react'

export default function SearchResultRow({
  name,
  distance,
  onOpen,
}: {
  name: string
  distance: string
  onOpen?: () => void
}) {
  return (
    <button type="button" className="sv-search-result" onClick={onOpen}>
      <span className="sv-search-result-name">{name}</span>
      <span className="sv-search-result-end">
        <span className="sv-search-result-distance">{distance}</span>
        <ChevronRight size={20} strokeWidth={1.9} />
      </span>
    </button>
  )
}
