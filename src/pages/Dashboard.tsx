import {
  Undo2,
  Redo2,
  Menu,
  Plus,
  Search,
  User,
  FileText,
  Clock,
  CheckCircle,
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { KanbanBoard } from '../components/tender/KanbanBoard'
import { useTenderStore } from '../store/tenderStore'

export default function Dashboard() {
  const user = useAuthStore((s) => s.user)
  const { tenders } = useTenderStore()

  const totalTenders = tenders.length
  const draftCount = tenders.filter((t) => t.status === 'draft').length
  const ongoingCount = tenders.filter((t) => t.status === 'ongoing').length
  const completedCount = tenders.filter((t) => t.status === 'completed').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Tender</h1>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {user?.name ?? 'User'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {totalTenders}
                </p>
                <p className="text-sm text-gray-600">Total Tenders</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{draftCount}</p>
                <p className="text-sm text-gray-600">Draft</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {ongoingCount}
                </p>
                <p className="text-sm text-gray-600">Ongoing</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {completedCount}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            {/* Search Bar */}
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

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Undo/Redo buttons */}
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

              {/* Sort button */}
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
              >
                <Menu className="w-4 h-4" />
                Sort
              </button>

              {/* Create Tender Button */}
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                Create Tender
              </button>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <KanbanBoard />
      </div>
    </div>
  )
}
