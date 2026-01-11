import { CheckCircle } from 'lucide-react'

interface TenderUnstartedProps {
  onStartTender: () => Promise<void>
  isLoading: boolean
}

export function TenderUnstarted({
  onStartTender,
  isLoading,
}: TenderUnstartedProps) {
  return (
    <div className="text-center py-16 animate-fadeIn">
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-gray-100 rounded-full">
          <CheckCircle className="w-12 h-12 text-gray-400" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Tender Unstarted
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        This tender has not been started yet. To start the tender, please click
        the button below.
      </p>
      <button
        onClick={onStartTender}
        disabled={isLoading}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Starting...' : 'Start Tender'}
      </button>
    </div>
  )
}
