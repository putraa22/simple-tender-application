import type { Tender } from '../../store/tenderStore'
import { Calendar, DollarSign, SquareChartGantt, Users } from 'lucide-react'

interface TenderCardProps {
  tender: Tender
}

const statusConfig = {
  draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-700',
  },
  ongoing: {
    label: 'On Going',
    className: 'bg-blue-100 text-blue-700',
  },
  completed: {
    label: 'Completed',
    className: 'bg-green-100 text-green-700',
  },
}

export function TenderCard({ tender }: TenderCardProps) {
  const status = statusConfig[tender.status]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing hover:border-gray-300">
      <h3 className="font-semibold text-gray-800 mb-2">{tender.title}</h3>

      {tender.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {tender.description}
        </p>
      )}

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <SquareChartGantt className="w-3.5 h-3.5" />
            <span>{tender.productsCount} products</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5" />
            <span>{tender.participantsCount} Participants</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Calendar className="w-3.5 h-3.5" />
          <span>{tender.date}</span>
        </div>

        {tender.amount && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <DollarSign className="w-3.5 h-3.5" />
            <span>{tender.amount}</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-gray-100">
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}
        >
          {status.label}
        </span>
      </div>
    </div>
  )
}
