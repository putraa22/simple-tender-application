import type { ReactNode } from 'react'
import { useDroppable } from '@dnd-kit/core'
import type { Tender, TenderStatus } from '../../store/tenderStore'
import { Clock, FileText, CheckCircle } from 'lucide-react'

interface KanbanColumnProps {
  status: TenderStatus
  label: string
  tenders: Tender[]
  children: ReactNode
  emptyMessage?: string
}

const statusConfig = {
  draft: {
    color: 'bg-gray-100 text-gray-700',
    icon: Clock,
    iconColor: 'text-gray-600',
  },
  ongoing: {
    color: 'bg-blue-100 text-blue-700',
    icon: FileText,
    iconColor: 'text-blue-600',
  },
  completed: {
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle,
    iconColor: 'text-green-600',
  },
}

export function KanbanColumn({
  status,
  label,
  tenders,
  children,
  emptyMessage = 'No tender in this state',
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  })

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[280px] bg-white shadow rounded-lg p-4 transition-all duration-200 ${
        isOver ? 'bg-blue-50 ring-2 ring-blue-200' : ''
      }`}
    >
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium mb-4 ${config.color}`}
      >
        <Icon className={`w-4 h-4 ${config.iconColor}`} />
        <span>{label}</span>
        <span
          className={`ml-auto px-2 py-0.5 rounded-full text-xs ${config.color} bg-white/50`}
        >
          {tenders.length}
        </span>
      </div>

      <div className="space-y-3 min-h-[200px] ">
        {tenders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <div className="w-12 h-12 mb-3 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <p className="text-sm">{emptyMessage}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
