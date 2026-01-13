import type { Product, Vendor } from '../../../store/createTenderStore'
import type { VendorOffer } from '../../../types/tender'
import { formatCurrency } from '../../../utils/currency'
import { ProductColumn } from './ProductColumn'
import { VendorColumn } from './VendorColumn'

interface ComparisonTableProps {
  products: Product[]
  vendors: Vendor[]
  vendorOffers: VendorOffer[]
  vendorTotals: Record<string, number>
  cheapestVendorPerProduct: Record<string, string>
  showDetails: boolean
}

export function ComparisonTable({
  products,
  vendors,
  vendorOffers,
  vendorTotals,
  cheapestVendorPerProduct,
  showDetails,
}: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 border-r border-gray-200">
                  Products
                </th>
                {vendors.map((vendor) => (
                  <th
                    key={vendor.id}
                    className="px-6 py-4 text-left border-r border-gray-200 last:border-r-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {vendor.name}
                      </p>
                      <div>
                        <p className="text-xs text-gray-500">Total Biaya</p>
                        <p className="text-lg font-bold text-indigo-600">
                          {formatCurrency(vendorTotals[vendor.id] || 0)}
                        </p>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {products.map((product, index) => {
                const isLastProduct = index === products.length - 1
                return (
                  <tr
                    key={product.id}
                    className={!isLastProduct ? 'border-b border-gray-200' : ''}
                  >
                    <ProductColumn
                      product={product}
                      index={index}
                      showDetails={showDetails}
                    />
                    {vendors.map((vendor) => {
                      const offer = vendorOffers.find(
                        (o) =>
                          o.vendorId === vendor.id && o.productId === product.id
                      )
                      const isCheapest =
                        cheapestVendorPerProduct[product.id] === vendor.id

                      return (
                        <VendorColumn
                          key={vendor.id}
                          offer={offer || null}
                          isCheapest={isCheapest}
                          showDetails={showDetails}
                        />
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
