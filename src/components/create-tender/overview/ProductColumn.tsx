import { Tag, FileText, Scale, Package, Calendar } from 'lucide-react'
import type { Product } from '../../../store/createTenderStore'
import { formatCurrency } from '../../../utils/currency'
import { ProductAttribute } from './ProductAttribute'

interface ProductColumnProps {
  product: Product
  index: number
  showDetails: boolean
}

export function ProductColumn({
  product,
  index,
  showDetails,
}: ProductColumnProps) {
  return (
    <td className="px-6 py-5 border-r border-gray-200 align-top">
      <div className="space-y-3">
        <div>
          <p className="font-semibold text-gray-800 text-sm">
            {index + 1}. {product.name}
          </p>
          {showDetails && (
            <div className="mt-3 space-y-2">
              <div>
                <p className="text-xs text-gray-500 mb-1">Last Price</p>
                <p className="text-sm font-bold text-indigo-600">
                  {formatCurrency(product.lastPrice)}
                </p>
              </div>
              <div className="space-y-1.5">
                {product.desiredBrand && (
                  <ProductAttribute
                    icon={Tag}
                    label="Brand"
                    value={product.desiredBrand}
                  />
                )}
                {product.specifications && (
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Specifications</p>
                      <p className="text-xs text-gray-800 line-clamp-2">
                        {product.specifications}
                      </p>
                    </div>
                  </div>
                )}
                <ProductAttribute
                  icon={Scale}
                  label="UoM"
                  value={product.unitOfMeasurement}
                />
                <ProductAttribute
                  icon={Package}
                  label="Qty"
                  value={product.quantity.toString()}
                />
                <ProductAttribute
                  icon={Calendar}
                  label="TOP"
                  value={product.paymentTerms}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </td>
  )
}
