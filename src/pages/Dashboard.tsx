import {
  Undo2,
  Redo2,
  Menu,
  Plus,
  Search,
  FileText,
  Clock,
  CheckCircle,
  X,
} from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { KanbanBoard } from '../components/tender/KanbanBoard'
import { useTenderStore, type SortType } from '../store/tenderStore'
import { SortModal } from '../components/dashboard/SortModal'
import { SummaryCard } from '../components/dashboard/SummaryCard'
import { UserDropdown } from '../components/dashboard/UserDropdown'
import { useTenders } from '../hooks/useTenders'

export default function Dashboard() {
  const { tenders, sortType, setSortType, undo, redo, canUndo, canRedo } =
    useTenderStore()
  const { isLoading, error } = useTenders()
  const navigate = useNavigate()
  const [showSortModal, setShowSortModal] = useState(false)
  const [selectedSort, setSelectedSort] = useState<SortType>(sortType)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setSelectedSort(sortType)
  }, [sortType])

  // Filter tenders based on search query
  const filteredTenders = useMemo(() => {
    if (!searchQuery.trim()) {
      return tenders
    }

    const query = searchQuery.toLowerCase().trim()
    return tenders.filter((tender) => {
      const titleMatch = tender.title.toLowerCase().includes(query)
      const descriptionMatch =
        tender.description?.toLowerCase().includes(query) ?? false
      return titleMatch || descriptionMatch
    })
  }, [tenders, searchQuery])

  const totalTenders = filteredTenders.length
  const draftCount = filteredTenders.filter((t) => t.status === 'draft').length
  const ongoingCount = filteredTenders.filter(
    (t) => t.status === 'ongoing'
  ).length
  const completedCount = filteredTenders.filter(
    (t) => t.status === 'completed'
  ).length

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
  }

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

  const handleUndo = () => {
    undo()
  }

  const handleRedo = () => {
    redo()
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search tenders..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleUndo}
                disabled={!canUndo()}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                aria-label="Undo"
                title="Undo last action"
              >
                <Undo2
                  className={`w-5 h-5 ${
                    canUndo() ? 'text-gray-600' : 'text-gray-300'
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={handleRedo}
                disabled={!canRedo()}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                aria-label="Redo"
                title="Redo last action"
              >
                <Redo2
                  className={`w-5 h-5 ${
                    canRedo() ? 'text-gray-600' : 'text-gray-300'
                  }`}
                />
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
          <KanbanBoard filteredTenders={filteredTenders} />
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
