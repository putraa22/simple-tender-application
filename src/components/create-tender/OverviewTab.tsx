import { useState } from 'react'
import { useCreateTenderStore } from '../../store/createTenderStore'
import { useVendorOffers } from '../../hooks/useVendorOffers'
import { ComparisonTable, DetailToggle, TenderUnstarted } from './overview'

interface OverviewTabProps {
  onStartTender: () => Promise<void>
  isLoading?: boolean
}

export function OverviewTab({
  onStartTender,
  isLoading = false,
}: OverviewTabProps) {
  const { isStarted, products, vendors } = useCreateTenderStore()
  const [showDetails, setShowDetails] = useState(true)

  const { vendorOffers, vendorTotals, cheapestVendorPerProduct } =
    useVendorOffers(products, vendors)

  if (!isStarted) {
    return (
      <TenderUnstarted onStartTender={onStartTender} isLoading={isLoading} />
    )
  }

  return (
    <div className="animate-fadeIn">
      <DetailToggle showDetails={showDetails} onToggle={setShowDetails} />
      <ComparisonTable
        products={products}
        vendors={vendors}
        vendorOffers={vendorOffers}
        vendorTotals={vendorTotals}
        cheapestVendorPerProduct={cheapestVendorPerProduct}
        showDetails={showDetails}
      />
    </div>
  )
}
