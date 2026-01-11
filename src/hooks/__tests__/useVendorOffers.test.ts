import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useVendorOffers } from '../useVendorOffers'
import type { Product, Vendor } from '../../store/createTenderStore'

describe('useVendorOffers', () => {
  const createMockProduct = (overrides?: Partial<Product>): Product => ({
    id: '1',
    name: 'Keyboard',
    lastPrice: '25000000',
    unitOfMeasurement: 'Box',
    quantity: 200,
    paymentTerms: 'D30',
    leadTimeDays: 7,
    ...overrides,
  })

  const createMockVendor = (overrides?: Partial<Vendor>): Vendor => ({
    id: 'v1',
    name: 'Vendor 1',
    email: 'vendor1@test.com',
    ...overrides,
  })

  describe('vendor offers generation', () => {
    it('should generate offers for all product-vendor combinations', () => {
      const products = [
        createMockProduct({ id: '1' }),
        createMockProduct({ id: '2' }),
      ]
      const vendors = [
        createMockVendor({ id: 'v1' }),
        createMockVendor({ id: 'v2' }),
        createMockVendor({ id: 'v3' }),
      ]

      const { result } = renderHook(() => useVendorOffers(products, vendors))

      expect(result.current.vendorOffers).toHaveLength(6) // 2 products × 3 vendors
    })

    it('should create offers with correct structure', () => {
      const products = [createMockProduct()]
      const vendors = [createMockVendor()]

      const { result } = renderHook(() => useVendorOffers(products, vendors))

      const offer = result.current.vendorOffers[0]

      expect(offer).toMatchObject({
        vendorId: 'v1',
        productId: '1',
        productName: 'Keyboard',
        unitOfMeasurement: 'Box',
        quantity: 200,
        paymentTerms: 'D30',
      })
      expect(typeof offer.price).toBe('number')
      expect(offer.price).toBeGreaterThanOrEqual(0)
    })

    it('should create offers with price variations', () => {
      const products = [createMockProduct({ lastPrice: '10000000' })]
      const vendors = [
        createMockVendor({ id: 'v1' }),
        createMockVendor({ id: 'v2' }),
        createMockVendor({ id: 'v3' }),
      ]

      const { result } = renderHook(() => useVendorOffers(products, vendors))

      const prices = result.current.vendorOffers.map((offer) => offer.price)
      const uniquePrices = new Set(prices)

      // Should have price variations (at least 2 different prices)
      expect(uniquePrices.size).toBeGreaterThanOrEqual(2)
    })
  })

  describe('vendor totals calculation', () => {
    it('should calculate totals for each vendor', () => {
      const products = [createMockProduct()]
      const vendors = [
        createMockVendor({ id: 'v1' }),
        createMockVendor({ id: 'v2' }),
      ]

      const { result } = renderHook(() => useVendorOffers(products, vendors))

      expect(result.current.vendorTotals).toHaveProperty('v1')
      expect(result.current.vendorTotals).toHaveProperty('v2')
      expect(typeof result.current.vendorTotals.v1).toBe('number')
      expect(typeof result.current.vendorTotals.v2).toBe('number')
    })

    it('should calculate correct total (price × quantity)', () => {
      const products = [
        createMockProduct({ id: '1', quantity: 10 }),
        createMockProduct({ id: '2', quantity: 5 }),
      ]
      const vendors = [createMockVendor({ id: 'v1' })]

      const { result } = renderHook(() => useVendorOffers(products, vendors))

      const vendorOffers = result.current.vendorOffers.filter(
        (offer) => offer.vendorId === 'v1'
      )
      const expectedTotal = vendorOffers.reduce(
        (sum, offer) => sum + offer.price * offer.quantity,
        0
      )

      expect(result.current.vendorTotals.v1).toBe(expectedTotal)
    })

    it('should return zero total for vendors with no offers', () => {
      const products: Product[] = []
      const vendors = [createMockVendor({ id: 'v1' })]

      const { result } = renderHook(() => useVendorOffers(products, vendors))

      expect(result.current.vendorTotals.v1).toBe(0)
    })
  })

  describe('cheapest vendor detection', () => {
    it('should identify cheapest vendor for each product', () => {
      const products = [
        createMockProduct({ id: '1' }),
        createMockProduct({ id: '2' }),
      ]
      const vendors = [
        createMockVendor({ id: 'v1' }),
        createMockVendor({ id: 'v2' }),
        createMockVendor({ id: 'v3' }),
      ]

      const { result } = renderHook(() => useVendorOffers(products, vendors))

      expect(result.current.cheapestVendorPerProduct).toHaveProperty('1')
      expect(result.current.cheapestVendorPerProduct).toHaveProperty('2')

      const cheapest1 = result.current.cheapestVendorPerProduct['1']
      expect(['v1', 'v2', 'v3']).toContain(cheapest1)
    })

    it('should correctly identify the vendor with lowest price', () => {
      const products = [createMockProduct({ id: '1' })]
      const vendors = [
        createMockVendor({ id: 'v1' }),
        createMockVendor({ id: 'v2' }),
        createMockVendor({ id: 'v3' }),
      ]

      const { result } = renderHook(() => useVendorOffers(products, vendors))

      const productOffers = result.current.vendorOffers.filter(
        (offer) => offer.productId === '1'
      )
      const cheapestOffer = productOffers.reduce((min, offer) =>
        offer.price < min.price ? offer : min
      )
      const cheapestVendorId = result.current.cheapestVendorPerProduct['1']

      expect(cheapestVendorId).toBe(cheapestOffer.vendorId)
    })
  })

  describe('edge cases', () => {
    it('should handle empty products array', () => {
      const vendors = [createMockVendor()]

      const { result } = renderHook(() => useVendorOffers([], vendors))

      expect(result.current.vendorOffers).toHaveLength(0)
      expect(Object.keys(result.current.vendorTotals)).toHaveLength(1)
      expect(Object.keys(result.current.cheapestVendorPerProduct)).toHaveLength(
        0
      )
    })

    it('should handle empty vendors array', () => {
      const products = [createMockProduct()]

      const { result } = renderHook(() => useVendorOffers(products, []))

      expect(result.current.vendorOffers).toHaveLength(0)
      expect(Object.keys(result.current.vendorTotals)).toHaveLength(0)
      expect(Object.keys(result.current.cheapestVendorPerProduct)).toHaveLength(
        0
      )
    })

    it('should handle both empty arrays', () => {
      const { result } = renderHook(() => useVendorOffers([], []))

      expect(result.current.vendorOffers).toHaveLength(0)
      expect(Object.keys(result.current.vendorTotals)).toHaveLength(0)
      expect(Object.keys(result.current.cheapestVendorPerProduct)).toHaveLength(
        0
      )
    })

    it('should handle products with zero price', () => {
      const products = [createMockProduct({ lastPrice: '0' })]
      const vendors = [createMockVendor()]

      const { result } = renderHook(() => useVendorOffers(products, vendors))

      expect(result.current.vendorOffers[0].price).toBeGreaterThanOrEqual(0)
    })
  })

  describe('memoization', () => {
    it('should not regenerate offers when inputs are unchanged', () => {
      const products = [createMockProduct()]
      const vendors = [createMockVendor()]

      const { result, rerender } = renderHook(() =>
        useVendorOffers(products, vendors)
      )

      const firstOffers = result.current.vendorOffers

      rerender()

      expect(result.current.vendorOffers).toBe(firstOffers)
    })

    it('should regenerate offers when products change', () => {
      const vendors = [createMockVendor()]
      const { result, rerender } = renderHook(
        ({ products }) => useVendorOffers(products, vendors),
        {
          initialProps: { products: [createMockProduct({ id: '1' })] },
        }
      )

      const firstOffers = result.current.vendorOffers

      rerender({ products: [createMockProduct({ id: '2' })] })

      expect(result.current.vendorOffers).not.toBe(firstOffers)
    })
  })
})
