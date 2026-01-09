import { useState } from 'react'
import { Plus, Building2 } from 'lucide-react'
import {
  useCreateTenderStore,
  type Vendor,
} from '../../store/createTenderStore'
import { SelectVendorModal } from './SelectVendorModal'

const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Teknologi Cepat Indonesia',
    email: 'info@teknologi-cepat.com',
    address: 'Jakarta Barat',
    picName: 'John Doe',
    phoneNumber: '+62 812-3456-7890',
    paymentTerms: 'Net 30',
    deliveryTimeDays: 7,
  },
  {
    id: '2',
    name: 'Dremboox',
    email: 'contact@dremboox.com',
    address: 'Jakarta Selatan',
    picName: 'Jane Smith',
    phoneNumber: '+62 812-3456-7891',
    paymentTerms: 'Net 60',
    deliveryTimeDays: 14,
  },
  {
    id: '3',
    name: 'PT. Indri Jaya Maju',
    email: 'info@indri-jaya.com',
    address: 'Jakarta Timur',
    picName: 'Bob Johnson',
    phoneNumber: '+62 812-3456-7892',
    paymentTerms: 'Cash on Delivery',
    deliveryTimeDays: 5,
  },
]

export function VendorsTab() {
  const { vendors, removeVendor } = useCreateTenderStore()
  const [showSelectModal, setShowSelectModal] = useState(false)

  return (
    <div className="animate-fadeIn">
      {vendors.length === 0 ? (
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <Building2 className="w-12 h-12 text-gray-400" />
            </div>
          </div>
          <p className="text-gray-500 mb-6">
            No vendor has been added to the list.
          </p>
          <button
            onClick={() => setShowSelectModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <Plus className="w-5 h-5" />
            Add Vendor
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {vendors.length} {vendors.length === 1 ? 'vendor' : 'vendors'} has
              been added
            </p>
            <button
              onClick={() => setShowSelectModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Vendor
            </button>
          </div>

          <div className="space-y-4">
            {vendors.map((vendor) => (
              <VendorDetailsCard
                key={vendor.id}
                vendor={vendor}
                onRemove={() => removeVendor(vendor.id)}
              />
            ))}
          </div>
        </div>
      )}

      {showSelectModal && (
        <SelectVendorModal
          availableVendors={mockVendors}
          selectedVendorIds={vendors.map((v) => v.id)}
          onClose={() => setShowSelectModal(false)}
        />
      )}
    </div>
  )
}

interface VendorDetailsCardProps {
  vendor: Vendor
  onRemove: () => void
}

function VendorDetailsCard({ vendor, onRemove }: VendorDetailsCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800 mb-1">{vendor.name}</h3>
          {vendor.address && (
            <p className="text-sm text-gray-600">{vendor.address}</p>
          )}
        </div>
        <button
          onClick={onRemove}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          Remove Vendor
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        {vendor.picName && (
          <div>
            <p className="text-gray-500">PIC Name</p>
            <p className="text-gray-800 font-medium">{vendor.picName}</p>
          </div>
        )}
        {vendor.phoneNumber && (
          <div>
            <p className="text-gray-500">Phone Number</p>
            <p className="text-gray-800 font-medium">{vendor.phoneNumber}</p>
          </div>
        )}
        {vendor.email && (
          <div>
            <p className="text-gray-500">Email</p>
            <p className="text-gray-800 font-medium">{vendor.email}</p>
          </div>
        )}
        {vendor.paymentTerms && (
          <div>
            <p className="text-gray-500">Payment Terms</p>
            <p className="text-gray-800 font-medium">{vendor.paymentTerms}</p>
          </div>
        )}
        {vendor.deliveryTimeDays !== undefined && (
          <div>
            <p className="text-gray-500">Delivery Time (Days)</p>
            <p className="text-gray-800 font-medium">
              {vendor.deliveryTimeDays} days
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
