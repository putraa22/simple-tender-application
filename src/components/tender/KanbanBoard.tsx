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
  const { tenders, moveTender } = useTenderStore()
  const [activeTender, setActiveTender] = useState<Tender | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const tender = tenders.find((t) => t.id === active.id)
    setActiveTender(tender || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTender(null)

    if (!over) return

    const tenderId = active.id as string
    const currentTender = tenders.find((t) => t.id === tenderId)
    if (!currentTender) return

    let newStatus: TenderStatus
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
          return (
            <KanbanColumn
              key={column.status}
              status={column.status}
              label={column.label}
              tenders={columnTenders}
            >
              <SortableContext
                items={columnTenders.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {columnTenders.map((tender) => (
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
