import { X, ArrowLeft } from 'lucide-react'
import type { SortType } from '../../store/tenderStore'

interface SortModalProps {
  isOpen: boolean
  selectedSort: SortType
  onClose: () => void
  onContinue: () => void
  onSortChange: (option: SortType) => void
}

type NonNullSortType = Exclude<SortType, null>

const sortOptions: Array<{ value: NonNullSortType; label: string }> = [
  { value: 'most-products', label: 'Sort by the most amount products' },
  { value: 'least-products', label: 'Sort by the least amount products' },
  { value: 'most-vendors', label: 'Sort by the most amount vendors' },
  { value: 'least-vendors', label: 'Sort by the least amount vendors' },
  { value: 'oldest-date', label: 'Sort by the oldest date created' },
  { value: 'latest-date', label: 'Sort by the latest date created' },
]

export function SortModal({
  isOpen,
  selectedSort,
  onClose,
  onContinue,
  onSortChange,
}: SortModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Sort Tender</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-4">
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="radio"
                  name="sort"
                  value={option.value as string}
                  checked={selectedSort === option.value}
                  onChange={() => onSortChange(option.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-200">
          <button
            onClick={onContinue}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
