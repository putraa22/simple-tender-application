import { useState } from 'react'
import { Plus, X, FileText } from 'lucide-react'
import {
  useCreateTenderStore,
  type Product,
} from '../../store/createTenderStore'
import { AddProductModal } from './AddProductModal'

export function ProductsTab() {
  const { products, removeProduct } = useCreateTenderStore()
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div className="animate-fadeIn">
      {products.length === 0 ? (
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
          </div>
          <p className="text-gray-500 mb-6">
            No product has been added to the list.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {products.length} {products.length === 1 ? 'item' : 'items'} has
              been added
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>

          <div className="space-y-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onRemove={() => removeProduct(product.id)}
              />
            ))}
          </div>
        </div>
      )}

      {showAddModal && (
        <AddProductModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  )
}

interface ProductCardProps {
  product: Product
  onRemove: () => void
}

function ProductCard({ product, onRemove }: ProductCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative">
      <button
        onClick={onRemove}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="Remove product"
      >
        <X className="w-4 h-4 text-gray-600" />
      </button>

      <div className="pr-8">
        <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
        {product.additionalInfo && (
          <p className="text-sm text-gray-600 mb-3">{product.additionalInfo}</p>
        )}
        <div className="flex items-center gap-4 text-sm">
          <span className="font-semibold text-gray-800">
            {product.lastPrice}
          </span>
          {product.desiredBrand && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
              {product.desiredBrand}
            </span>
          )}
          <span className="text-gray-600">Qty {product.quantity}</span>
          <span className="text-gray-600">UoM {product.unitOfMeasurement}</span>
        </div>
      </div>
    </div>
  )
}
