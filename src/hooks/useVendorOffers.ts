import { useMemo } from 'react'
import type { Product, Vendor } from '../store/createTenderStore'
import type { VendorOffer } from '../types/tender'
import { parsePrice } from '../utils/currency'

const PRICE_VARIATION_BASE = 1000000 // 1 million

/**
 * Generates mock vendor offers for comparison
 * TODO: Replace with actual API call when vendor response API is available
 */
const generateMockVendorOffers = (
  products: Product[],
  vendors: Vendor[]
): VendorOffer[] => {
  const offers: VendorOffer[] = []

  products.forEach((product) => {
    vendors.forEach((vendor, vendorIndex) => {
      // Create variation in prices for comparison (-1M, 0, +1M)
      const basePrice = parsePrice(product.lastPrice)
      const priceVariation =
        (vendorIndex % 3) * PRICE_VARIATION_BASE - PRICE_VARIATION_BASE
      const offerPrice = Math.max(0, basePrice + priceVariation)

      offers.push({
        vendorId: vendor.id,
        productId: product.id,
        productName: product.name,
        price: offerPrice,
        brand: product.desiredBrand,
        specifications: product.specifications,
        unitOfMeasurement: product.unitOfMeasurement,
        quantity: product.quantity,
        paymentTerms: product.paymentTerms,
      })
    })
  })

  return offers
}

/**
 * Calculates total cost per vendor
 */
const calculateVendorTotals = (
  vendorOffers: VendorOffer[],
  vendors: Vendor[]
): Record<string, number> => {
  const totals: Record<string, number> = {}

  vendors.forEach((vendor) => {
    const vendorOffersForVendor = vendorOffers.filter(
      (offer) => offer.vendorId === vendor.id
    )
    totals[vendor.id] = vendorOffersForVendor.reduce(
      (sum, offer) => sum + offer.price * offer.quantity,
      0
    )
  })

  return totals
}

/**
 * Finds the cheapest vendor for each product
 */
const findCheapestVendorPerProduct = (
  products: Product[],
  vendorOffers: VendorOffer[]
): Record<string, string> => {
  const cheapest: Record<string, string> = {}

  products.forEach((product) => {
    const productOffers = vendorOffers.filter(
      (offer) => offer.productId === product.id
    )

    if (productOffers.length > 0) {
      const cheapestOffer = productOffers.reduce((min, offer) =>
        offer.price < min.price ? offer : min
      )
      cheapest[product.id] = cheapestOffer.vendorId
    }
  })

  return cheapest
}

interface UseVendorOffersReturn {
  vendorOffers: VendorOffer[]
  vendorTotals: Record<string, number>
  cheapestVendorPerProduct: Record<string, string>
}

/**
 * Custom hook for managing vendor offers data
 * Handles generation, totals calculation, and cheapest vendor detection
 */
export function useVendorOffers(
  products: Product[],
  vendors: Vendor[]
): UseVendorOffersReturn {
  const vendorOffers = useMemo(
    () => generateMockVendorOffers(products, vendors),
    [products, vendors]
  )

  const vendorTotals = useMemo(
    () => calculateVendorTotals(vendorOffers, vendors),
    [vendorOffers, vendors]
  )

  const cheapestVendorPerProduct = useMemo(
    () => findCheapestVendorPerProduct(products, vendorOffers),
    [products, vendorOffers]
  )

  return {
    vendorOffers,
    vendorTotals,
    cheapestVendorPerProduct,
  }
}
