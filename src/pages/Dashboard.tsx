import {
  Undo2,
  Redo2,
  Menu,
  Plus,
  Search,
  FileText,
  Clock,
  CheckCircle,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { KanbanBoard } from '../components/tender/KanbanBoard'
import { useTenderStore, type SortType } from '../store/tenderStore'
import { SortModal } from '../components/dashboard/SortModal'
import { SummaryCard } from '../components/dashboard/SummaryCard'
import { UserDropdown } from '../components/dashboard/UserDropdown'
import { useTenders } from '../hooks/useTenders'

export default function Dashboard() {
  const { tenders, sortType, setSortType } = useTenderStore()
  const { isLoading, error } = useTenders()
  const navigate = useNavigate()
  const [showSortModal, setShowSortModal] = useState(false)
  const [selectedSort, setSelectedSort] = useState<SortType>(sortType)

  useEffect(() => {
    setSelectedSort(sortType)
  }, [sortType])

  const totalTenders = tenders.length
  const draftCount = tenders.filter((t) => t.status === 'draft').length
  const ongoingCount = tenders.filter((t) => t.status === 'ongoing').length
  const completedCount = tenders.filter((t) => t.status === 'completed').length

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showSortModal) {
        setShowSortModal(false)
      }
    }

    if (showSortModal) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [showSortModal])

  const handleSortClick = () => {
    setSelectedSort(sortType)
    setShowSortModal(true)
  }

  const handleSortClose = () => {
    setShowSortModal(false)
  }

  const handleSortContinue = () => {
    setSortType(selectedSort)
    setShowSortModal(false)
  }

  const handleSortChange = (option: SortType) => {
    setSelectedSort(option)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Tender</h1>
          <UserDropdown />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <SummaryCard
            icon={FileText}
            value={totalTenders}
            label="Total Tenders"
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <SummaryCard
            icon={Clock}
            value={draftCount}
            label="Draft"
            iconBgColor="bg-gray-100"
            iconColor="text-gray-600"
          />
          <SummaryCard
            icon={FileText}
            value={ongoingCount}
            label="Ongoing"
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <SummaryCard
            icon={CheckCircle}
            value={completedCount}
            label="Completed"
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tenders..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Undo"
              >
                <Undo2 className="w-5 h-5 text-gray-600" />
              </button>
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Redo"
              >
                <Redo2 className="w-5 h-5 text-gray-600" />
              </button>

              <button
                type="button"
                onClick={handleSortClick}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
              >
                <Menu className="w-4 h-4" />
                Sort
              </button>

              {/* Create Tender Button */}
              <button
                type="button"
                onClick={() => navigate('/create-tender')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                Create Tender
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading tenders...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-red-500">{error}</div>
          </div>
        ) : (
          <KanbanBoard />
        )}
      </div>

      <SortModal
        isOpen={showSortModal}
        selectedSort={selectedSort}
        onClose={handleSortClose}
        onContinue={handleSortContinue}
        onSortChange={handleSortChange}
      />
    </div>
  )
}
