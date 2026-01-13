import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { Product, Vendor } from '../../../../store/createTenderStore'
import type { VendorOffer } from '../../../../types/tender'
import { ComparisonTable } from '../ComparisonTable'

describe('ComparisonTable', () => {
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

  const createMockOffer = (overrides?: Partial<VendorOffer>): VendorOffer => ({
    vendorId: 'v1',
    productId: '1',
    productName: 'Logitech MX Keys',
    price: 25000000,
    unitOfMeasurement: 'Box',
    quantity: 200,
    paymentTerms: 'D30',
    ...overrides,
  })

  describe('table structure', () => {
    it('should render table with correct structure', () => {
      const products = [createMockProduct()]
      const vendors = [createMockVendor()]
      const vendorOffers: VendorOffer[] = []
      const vendorTotals = { v1: 0 }
      const cheapestVendorPerProduct = {}

      render(
        <ComparisonTable
          products={products}
          vendors={vendors}
          vendorOffers={vendorOffers}
          vendorTotals={vendorTotals}
          cheapestVendorPerProduct={cheapestVendorPerProduct}
          showDetails={false}
        />
      )

      expect(screen.getByText('Products')).toBeInTheDocument()
    })

    it('should render vendor headers', () => {
      const products = [createMockProduct()]
      const vendors = [
        createMockVendor({ id: 'v1', name: 'Vendor 1' }),
        createMockVendor({ id: 'v2', name: 'Vendor 2' }),
      ]
      const vendorOffers: VendorOffer[] = []
      const vendorTotals = { v1: 1000000, v2: 2000000 }
      const cheapestVendorPerProduct = {}

      render(
        <ComparisonTable
          products={products}
          vendors={vendors}
          vendorOffers={vendorOffers}
          vendorTotals={vendorTotals}
          cheapestVendorPerProduct={cheapestVendorPerProduct}
          showDetails={false}
        />
      )

      expect(screen.getByText('Vendor 1')).toBeInTheDocument()
      expect(screen.getByText('Vendor 2')).toBeInTheDocument()
    })

    it('should display vendor totals in headers', () => {
      const products = [createMockProduct()]
      const vendors = [createMockVendor({ id: 'v1' })]
      const vendorOffers: VendorOffer[] = []
      const vendorTotals = { v1: 50000000 }
      const cheapestVendorPerProduct = {}

      render(
        <ComparisonTable
          products={products}
          vendors={vendors}
          vendorOffers={vendorOffers}
          vendorTotals={vendorTotals}
          cheapestVendorPerProduct={cheapestVendorPerProduct}
          showDetails={false}
        />
      )

      expect(screen.getByText('Total Biaya')).toBeInTheDocument()
      expect(screen.getByText('50.000.000')).toBeInTheDocument()
    })
  })

  describe('product rows', () => {
    it('should render product rows', () => {
      const products = [
        createMockProduct({ id: '1', name: 'Keyboard' }),
        createMockProduct({ id: '2', name: 'Mouse' }),
      ]
      const vendors = [createMockVendor()]
      const vendorOffers: VendorOffer[] = []
      const vendorTotals = { v1: 0 }
      const cheapestVendorPerProduct = {}

      render(
        <ComparisonTable
          products={products}
          vendors={vendors}
          vendorOffers={vendorOffers}
          vendorTotals={vendorTotals}
          cheapestVendorPerProduct={cheapestVendorPerProduct}
          showDetails={false}
        />
      )

      expect(screen.getByText('1. Keyboard')).toBeInTheDocument()
      expect(screen.getByText('2. Mouse')).toBeInTheDocument()
    })

    it('should render vendor columns for each product', () => {
      const products = [createMockProduct()]
      const vendors = [
        createMockVendor({ id: 'v1' }),
        createMockVendor({ id: 'v2' }),
      ]
      const vendorOffers = [
        createMockOffer({ vendorId: 'v1', productId: '1' }),
        createMockOffer({ vendorId: 'v2', productId: '1' }),
      ]
      const vendorTotals = { v1: 25000000, v2: 25000000 }
      const cheapestVendorPerProduct = { '1': 'v1' }

      render(
        <ComparisonTable
          products={products}
          vendors={vendors}
          vendorOffers={vendorOffers}
          vendorTotals={vendorTotals}
          cheapestVendorPerProduct={cheapestVendorPerProduct}
          showDetails={false}
        />
      )

      // Should render product name for each vendor offer
      const productNames = screen.getAllByText('Logitech MX Keys')
      expect(productNames.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('cheapest vendor indicator', () => {
    it('should mark cheapest vendor correctly', () => {
      const products = [createMockProduct({ id: '1' })]
      const vendors = [
        createMockVendor({ id: 'v1' }),
        createMockVendor({ id: 'v2' }),
      ]
      const vendorOffers = [
        createMockOffer({ vendorId: 'v1', productId: '1', price: 20000000 }),
        createMockOffer({ vendorId: 'v2', productId: '1', price: 25000000 }),
      ]
      const vendorTotals = { v1: 20000000, v2: 25000000 }
      const cheapestVendorPerProduct = { '1': 'v1' }

      render(
        <ComparisonTable
          products={products}
          vendors={vendors}
          vendorOffers={vendorOffers}
          vendorTotals={vendorTotals}
          cheapestVendorPerProduct={cheapestVendorPerProduct}
          showDetails={false}
        />
      )

      expect(screen.getByText('Termurah')).toBeInTheDocument()
    })
  })

  describe('empty states', () => {
    it('should handle empty products array', () => {
      const vendors = [createMockVendor()]
      const vendorOffers: VendorOffer[] = []
      const vendorTotals = { v1: 0 }
      const cheapestVendorPerProduct = {}

      render(
        <ComparisonTable
          products={[]}
          vendors={vendors}
          vendorOffers={vendorOffers}
          vendorTotals={vendorTotals}
          cheapestVendorPerProduct={cheapestVendorPerProduct}
          showDetails={false}
        />
      )

      expect(screen.getByText('Products')).toBeInTheDocument()
    })

    it('should handle empty vendors array', () => {
      const products = [createMockProduct()]
      const vendorOffers: VendorOffer[] = []
      const vendorTotals = {}
      const cheapestVendorPerProduct = {}

      render(
        <ComparisonTable
          products={products}
          vendors={[]}
          vendorOffers={vendorOffers}
          vendorTotals={vendorTotals}
          cheapestVendorPerProduct={cheapestVendorPerProduct}
          showDetails={false}
        />
      )

      expect(screen.getByText('Products')).toBeInTheDocument()
    })

    it('should show "No offer" when vendor has no offer for product', () => {
      const products = [createMockProduct()]
      const vendors = [createMockVendor()]
      const vendorOffers: VendorOffer[] = []
      const vendorTotals = { v1: 0 }
      const cheapestVendorPerProduct = {}

      render(
        <ComparisonTable
          products={products}
          vendors={vendors}
          vendorOffers={vendorOffers}
          vendorTotals={vendorTotals}
          cheapestVendorPerProduct={cheapestVendorPerProduct}
          showDetails={false}
        />
      )

      expect(screen.getByText('No offer')).toBeInTheDocument()
    })
  })

  describe('showDetails prop', () => {
    it('should pass showDetails to child components', () => {
      const products = [createMockProduct()]
      const vendors = [createMockVendor()]
      const vendorOffers = [createMockOffer()]
      const vendorTotals = { v1: 25000000 }
      const cheapestVendorPerProduct = {}

      const { rerender } = render(
        <ComparisonTable
          products={products}
          vendors={vendors}
          vendorOffers={vendorOffers}
          vendorTotals={vendorTotals}
          cheapestVendorPerProduct={cheapestVendorPerProduct}
          showDetails={false}
        />
      )

      expect(screen.queryByText('Last Price')).not.toBeInTheDocument()

      rerender(
        <ComparisonTable
          products={products}
          vendors={vendors}
          vendorOffers={vendorOffers}
          vendorTotals={vendorTotals}
          cheapestVendorPerProduct={cheapestVendorPerProduct}
          showDetails={true}
        />
      )

      expect(screen.getByText('Last Price')).toBeInTheDocument()
    })
  })
})
