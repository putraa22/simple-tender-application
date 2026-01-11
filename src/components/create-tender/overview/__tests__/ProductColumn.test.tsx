import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { Product } from '../../../../store/createTenderStore'
import { ProductColumn } from '../ProductColumn'

// Helper to render table cell in proper table structure
const renderInTable = (component: React.ReactElement) => {
  return render(
    <table>
      <tbody>
        <tr>{component}</tr>
      </tbody>
    </table>
  )
}

describe('ProductColumn', () => {
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

  describe('rendering', () => {
    it('should render product name with index', () => {
      const product = createMockProduct({ name: 'Keyboard' })
      renderInTable(
        <ProductColumn product={product} index={0} showDetails={false} />
      )

      expect(screen.getByText('1. Keyboard')).toBeInTheDocument()
    })

    it('should render correct index number', () => {
      const product = createMockProduct()
      renderInTable(
        <ProductColumn product={product} index={2} showDetails={false} />
      )

      expect(screen.getByText('3. Keyboard')).toBeInTheDocument()
    })
  })

  describe('details visibility', () => {
    it('should not show details when showDetails is false', () => {
      const product = createMockProduct()
      renderInTable(
        <ProductColumn product={product} index={0} showDetails={false} />
      )

      expect(screen.queryByText('Last Price')).not.toBeInTheDocument()
      expect(screen.queryByText('Brand')).not.toBeInTheDocument()
    })

    it('should show details when showDetails is true', () => {
      const product = createMockProduct()
      renderInTable(
        <ProductColumn product={product} index={0} showDetails={true} />
      )

      expect(screen.getByText('Last Price')).toBeInTheDocument()
      expect(screen.getByText('UoM')).toBeInTheDocument()
      expect(screen.getByText('Qty')).toBeInTheDocument()
      expect(screen.getByText('TOP')).toBeInTheDocument()
    })

    it('should display formatted last price', () => {
      const product = createMockProduct({ lastPrice: '25000000' })
      renderInTable(
        <ProductColumn product={product} index={0} showDetails={true} />
      )

      expect(screen.getByText('25.000.000')).toBeInTheDocument()
    })
  })

  describe('product attributes', () => {
    it('should render brand when desiredBrand is provided', () => {
      const product = createMockProduct({ desiredBrand: 'Logitech' })
      renderInTable(
        <ProductColumn product={product} index={0} showDetails={true} />
      )

      expect(screen.getByText('Brand')).toBeInTheDocument()
      expect(screen.getByText('Logitech')).toBeInTheDocument()
    })

    it('should not render brand when desiredBrand is not provided', () => {
      const product = createMockProduct({ desiredBrand: undefined })
      renderInTable(
        <ProductColumn product={product} index={0} showDetails={true} />
      )

      expect(screen.queryByText('Brand')).not.toBeInTheDocument()
    })

    it('should render specifications when provided', () => {
      const product = createMockProduct({
        specifications: 'Wireless keyboard with Bluetooth',
      })
      renderInTable(
        <ProductColumn product={product} index={0} showDetails={true} />
      )

      expect(screen.getByText('Specifications')).toBeInTheDocument()
      expect(
        screen.getByText('Wireless keyboard with Bluetooth')
      ).toBeInTheDocument()
    })

    it('should render all required attributes', () => {
      const product = createMockProduct({
        unitOfMeasurement: 'Box',
        quantity: 200,
        paymentTerms: 'D30',
      })
      renderInTable(
        <ProductColumn product={product} index={0} showDetails={true} />
      )

      expect(screen.getByText('Box')).toBeInTheDocument()
      expect(screen.getByText('200')).toBeInTheDocument()
      expect(screen.getByText('D30')).toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('should apply correct table cell classes', () => {
      const product = createMockProduct()
      const { container } = renderInTable(
        <ProductColumn product={product} index={0} showDetails={false} />
      )

      const td = container.querySelector('td')
      expect(td).toHaveClass(
        'px-6',
        'py-5',
        'border-r',
        'border-gray-200',
        'align-top'
      )
    })
  })
})
