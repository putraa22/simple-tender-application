import type { Product, Vendor } from '../store/createTenderStore'
import type { CreateProductRequest, VendorOption } from '../types/api'

export const formatDateToISO8601 = (dateString: string): string => {
  try {
    if (!dateString) {
      return dateString
    }

    const trimmedDate = dateString.trim()

    if (trimmedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return `${trimmedDate}T00:00:00`
    }

    if (trimmedDate.includes('T')) {
      return trimmedDate
    }

    const date = new Date(trimmedDate)
    if (isNaN(date.getTime())) {
      return dateString
    }

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}T00:00:00`
  } catch {
    return dateString
  }
}

export const transformProductToCreateRequest = (
  product: Product
): CreateProductRequest => {
  return {
    product_name: product.name,
    brand: product.desiredBrand || '',
    specification: product.specifications || '',
    uom: product.unitOfMeasurement,
    quantity: product.quantity,
    term_of_payment: product.paymentTerms,
    last_price: parseFloat(product.lastPrice.replace(/[^\d]/g, '')) || 0,
    id: 0,
  }
}

export const transformVendorOptionToVendor = (
  vendorOption: VendorOption
): Vendor => {
  return {
    id: vendorOption.id.toString(),
    name: vendorOption.name,
    email: vendorOption.email,
    address: vendorOption.address,
    picName: vendorOption.pic_name,
    phoneNumber: vendorOption.phone_number,
    paymentTerms: vendorOption.payment_terms,
    deliveryTimeDays: vendorOption.delivery_time_days,
  }
}
