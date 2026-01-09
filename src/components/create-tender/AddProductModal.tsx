import { useState } from 'react'
import { X, ArrowLeft, ArrowRight } from 'lucide-react'
import { FormField } from '../form/FormField'
import { TextAreaField } from '../form/TextAreaField'
import {
  useCreateTenderStore,
  type Product,
} from '../../store/createTenderStore'

interface AddProductModalProps {
  onClose: () => void
}

type Step = 'general' | 'additional'

export function AddProductModal({ onClose }: AddProductModalProps) {
  const { addProduct } = useCreateTenderStore()
  const [step, setStep] = useState<Step>('general')
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    additionalInfo: '',
    desiredBrand: '',
    specifications: '',
    unitOfMeasurement: '',
    quantity: 0,
    lastPrice: '',
    paymentTerms: '',
    leadTimeDays: 0,
  })

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ): void => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'quantity' || name === 'leadTimeDays' ? Number(value) : value,
    }))
  }

  const handleNext = (): void => {
    if (step === 'general') {
      setStep('additional')
    }
  }

  const handleBack = (): void => {
    if (step === 'additional') {
      setStep('general')
    }
  }

  const handleConfirm = (): void => {
    if (
      formData.name &&
      formData.unitOfMeasurement &&
      formData.quantity &&
      formData.lastPrice
    ) {
      addProduct({
        id: Date.now().toString(),
        name: formData.name,
        additionalInfo: formData.additionalInfo,
        desiredBrand: formData.desiredBrand,
        specifications: formData.specifications,
        unitOfMeasurement: formData.unitOfMeasurement,
        quantity: formData.quantity,
        lastPrice: formData.lastPrice,
        paymentTerms: formData.paymentTerms || '',
        leadTimeDays: formData.leadTimeDays || 0,
      })
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Add product</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="px-6 py-4">
          {/* Step Navigation */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setStep('general')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                step === 'general'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              General Information
            </button>
            <button
              onClick={() => setStep('additional')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                step === 'additional'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Additional Info
            </button>
          </div>

          {/* Step Content */}
          {step === 'general' && (
            <div className="space-y-4">
              <FormField
                label="Product Name"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                placeholder="Enter product name"
              />
              <TextAreaField
                label="Additional Info"
                name="additionalInfo"
                value={formData.additionalInfo || ''}
                onChange={handleInputChange}
                placeholder="Enter additional information"
              />
              <FormField
                label="Desired Brand"
                name="desiredBrand"
                value={formData.desiredBrand || ''}
                onChange={handleInputChange}
                placeholder="Please insert product brand"
              />
              <TextAreaField
                label="Specifications"
                name="specifications"
                value={formData.specifications || ''}
                onChange={handleInputChange}
                placeholder="Please insert specifications"
              />
            </div>
          )}

          {step === 'additional' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Unit of Measurement
                </label>
                <select
                  name="unitOfMeasurement"
                  value={formData.unitOfMeasurement || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select unit</option>
                  <option value="Box">Box</option>
                  <option value="Unit">Unit</option>
                  <option value="Piece">Piece</option>
                  <option value="Set">Set</option>
                </select>
              </div>
              <FormField
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity?.toString() || ''}
                onChange={handleInputChange}
                placeholder="Enter quantity"
              />
              <FormField
                label="Last Price"
                name="lastPrice"
                value={formData.lastPrice || ''}
                onChange={handleInputChange}
                placeholder="Enter last price"
              />
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Payment Terms
                </label>
                <select
                  name="paymentTerms"
                  value={formData.paymentTerms || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select payment terms</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 60">Net 60</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                </select>
              </div>
              <FormField
                label="Lead Time (Days)"
                name="leadTimeDays"
                type="number"
                value={formData.leadTimeDays?.toString() || ''}
                onChange={handleInputChange}
                placeholder="Enter lead time in days"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          {step === 'additional' && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
          {step === 'general' ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
