import { CheckCircle } from 'lucide-react'
import { useCreateTenderStore } from '../../store/createTenderStore'

export function OverviewTab() {
  const { isStarted, products, vendors, startTender } = useCreateTenderStore()

  if (!isStarted) {
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
          This tender has not been started yet. To start the tender, please
          click the button below.
        </p>
        <button
          onClick={startTender}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Start Tender
        </button>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-4 font-semibold text-gray-800">
                Product
              </th>
              {vendors.map((vendor) => (
                <th
                  key={vendor.id}
                  className="text-left p-4 font-semibold text-gray-800"
                >
                  {vendor.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} className="border-b border-gray-100">
                <td className="p-4">
                  <div>
                    <p className="font-medium text-gray-800">
                      {index + 1}. {product.name}
                    </p>
                    {product.desiredBrand && (
                      <p className="text-sm text-gray-600">
                        {product.desiredBrand}
                      </p>
                    )}
                  </div>
                </td>
                {vendors.map((vendor) => (
                  <td key={vendor.id} className="p-4">
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-gray-500">Last Price:</span>{' '}
                        <span className="font-medium">{product.lastPrice}</span>
                      </p>
                      {product.desiredBrand && (
                        <p>
                          <span className="text-gray-500">Brand:</span>{' '}
                          {product.desiredBrand}
                        </p>
                      )}
                      {product.specifications && (
                        <p>
                          <span className="text-gray-500">Specs:</span>{' '}
                          {product.specifications}
                        </p>
                      )}
                      <p>
                        <span className="text-gray-500">UOM:</span>{' '}
                        {product.unitOfMeasurement}
                      </p>
                      <p>
                        <span className="text-gray-500">Qty:</span>{' '}
                        {product.quantity}
                      </p>
                      <p>
                        <span className="text-gray-500">Payment:</span>{' '}
                        {product.paymentTerms}
                      </p>
                      <p>
                        <span className="text-gray-500">Lead Time:</span>{' '}
                        {product.leadTimeDays} days
                      </p>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
