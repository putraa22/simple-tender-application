import { useState } from 'react'
import { X, Search, ArrowLeft } from 'lucide-react'
import {
  useCreateTenderStore,
  type Vendor,
} from '../../store/createTenderStore'

interface SelectVendorModalProps {
  availableVendors: Vendor[]
  selectedVendorIds: string[]
  onClose: () => void
}

export function SelectVendorModal({
  availableVendors,
  selectedVendorIds,
  onClose,
}: SelectVendorModalProps) {
  const { addVendor } = useCreateTenderStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)

  const filteredVendors = availableVendors.filter(
    (vendor) =>
      !selectedVendorIds.includes(vendor.id) &&
      (vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleSelectVendor = (vendor: Vendor): void => {
    setSelectedVendor(vendor)
  }

  const handleContinue = (): void => {
    if (selectedVendor) {
      addVendor(selectedVendor)
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Select Vendor</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-2">
            {filteredVendors.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No vendors found</p>
            ) : (
              filteredVendors.map((vendor) => (
                <button
                  key={vendor.id}
                  onClick={() => handleSelectVendor(vendor)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedVendor?.id === vendor.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <p className="font-medium text-gray-800">{vendor.name}</p>
                  <p className="text-sm text-gray-600">{vendor.email}</p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-gray-200">
          <button
            onClick={handleContinue}
            disabled={!selectedVendor}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
