import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Tender } from '../../store/tenderStore'
import { TenderCard } from './TenderCard'

interface SortableTenderCardProps {
  tender: Tender
}

export function SortableTenderCard({ tender }: SortableTenderCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tender.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TenderCard tender={tender} />
    </div>
  )
}
