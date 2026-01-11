import type { VendorOffer } from '../../../types/tender'
import { formatCurrency } from '../../../utils/currency'

interface VendorColumnProps {
  offer: VendorOffer | null
  isCheapest: boolean
  showDetails: boolean
}

export function VendorColumn({
  offer,
  isCheapest,
  showDetails,
}: VendorColumnProps) {
  if (!offer) {
    return (
      <td className="px-6 py-5 border-r border-gray-200 last:border-r-0 align-top">
        <p className="text-sm text-gray-400">No offer</p>
      </td>
    )
  }

  return (
    <td className="px-6 py-5 border-r border-gray-200 last:border-r-0 align-top">
      <div className="space-y-3">
        <div>
          <p className="font-medium text-sm text-gray-800 mb-2">
            {offer.productName}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <div>
              <p className="text-xs text-gray-500 mb-1">Terbaru</p>
              <p className="text-sm font-bold text-indigo-600">
                {formatCurrency(offer.price)}
              </p>
            </div>
            {isCheapest && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                Termurah
              </span>
            )}
          </div>
        </div>
        {showDetails && (
          <div className="space-y-1.5">
            {offer.brand && (
              <div>
                <p className="text-xs text-gray-500">Brand</p>
                <p className="text-xs text-gray-800">{offer.brand}</p>
              </div>
            )}
            {offer.specifications && (
              <div>
                <p className="text-xs text-gray-500">Specifications</p>
                <p className="text-xs text-gray-800 line-clamp-2">
                  {offer.specifications}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500">UoM</p>
              <p className="text-xs text-gray-800">{offer.unitOfMeasurement}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Qty</p>
              <p className="text-xs text-gray-800">{offer.quantity}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">TOP</p>
              <p className="text-xs text-gray-800">{offer.paymentTerms}</p>
            </div>
          </div>
        )}
      </div>
    </td>
  )
}
