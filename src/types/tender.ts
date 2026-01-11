/**
 * Tender-related types
 */

export interface VendorOffer {
  vendorId: string
  productId: string
  productName: string
  price: number
  brand?: string
  specifications?: string
  unitOfMeasurement: string
  quantity: number
  paymentTerms: string
}
