import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import {
  useTenderStore,
  type Tender,
  type TenderStatus,
} from '../../store/tenderStore'
import { KanbanColumn } from './KanbanColumn'
import { SortableTenderCard } from './SortableTenderCard'
import { TenderCard } from './TenderCard'

const columns: Array<{ status: TenderStatus; label: string }> = [
  { status: 'draft', label: 'Draft' },
  { status: 'ongoing', label: 'On Going' },
  { status: 'completed', label: 'Completed' },
]

export function KanbanBoard() {
  const { tenders, sortType, moveTender } = useTenderStore()
  const [activeTender, setActiveTender] = useState<Tender | null>(null)

  // Helper function to sort tenders based on sortType
  const sortTenders = (tenderList: Tender[]): Tender[] => {
    if (!sortType) return tenderList

    const sorted = [...tenderList]

    switch (sortType) {
      case 'most-products':
        return sorted.sort((a, b) => b.productsCount - a.productsCount)
      case 'least-products':
        return sorted.sort((a, b) => a.productsCount - b.productsCount)
      case 'most-vendors':
        return sorted.sort((a, b) => b.participantsCount - a.participantsCount)
      case 'least-vendors':
        return sorted.sort((a, b) => a.participantsCount - b.participantsCount)
      case 'oldest-date':
        return sorted.sort(
          (a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime()
        )
      case 'latest-date':
        return sorted.sort(
          (a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime()
        )
      default:
        return tenderList
    }
  }

  // Helper function to parse date string (e.g., "28 Feb 2025")
  const parseDate = (dateStr: string): Date => {
    const months: Record<string, number> = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11,
    }

    const parts = dateStr.toLowerCase().split(' ')
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10)
      const month = months[parts[1].substring(0, 3)]
      const year = parseInt(parts[2], 10)
      return new Date(year, month, day)
    }
    return new Date(0)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    // Find tender from all tenders (not sorted) to get the correct tender
    const tender = tenders.find((t) => t.id === active.id)
    setActiveTender(tender || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTender(null)

    if (!over) return

    const tenderId = active.id as string
    // Find from all tenders to get the correct tender
    const currentTender = tenders.find((t) => t.id === tenderId)
    if (!currentTender) return

    let newStatus: TenderStatus
    // Check if dropped on another tender or on a column
    const overTender = tenders.find((t) => t.id === over.id)

    if (overTender) {
      newStatus = overTender.status
    } else {
      newStatus = over.id as TenderStatus
    }

    if (currentTender.status !== newStatus) {
      moveTender(tenderId, newStatus)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide ">
        {columns.map((column) => {
          const columnTenders = tenders.filter(
            (t) => t.status === column.status
          )
          const sortedColumnTenders = sortTenders(columnTenders)
          return (
            <KanbanColumn
              key={column.status}
              status={column.status}
              label={column.label}
              tenders={sortedColumnTenders}
            >
              <SortableContext
                items={sortedColumnTenders.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {sortedColumnTenders.map((tender) => (
                  <SortableTenderCard key={tender.id} tender={tender} />
                ))}
              </SortableContext>
            </KanbanColumn>
          )
        })}
      </div>

      <DragOverlay>
        {activeTender ? (
          <div className="opacity-90 rotate-2">
            <TenderCard tender={activeTender} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
