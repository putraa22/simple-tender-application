import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { VendorOffer } from '../../../../types/tender'
import { VendorColumn } from '../VendorColumn'

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

describe('VendorColumn', () => {
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

  describe('when offer is null', () => {
    it('should render "No offer" message', () => {
      renderInTable(
        <VendorColumn offer={null} isCheapest={false} showDetails={false} />
      )

      expect(screen.getByText('No offer')).toBeInTheDocument()
    })

    it('should not render offer details', () => {
      renderInTable(
        <VendorColumn offer={null} isCheapest={false} showDetails={true} />
      )

      expect(screen.queryByText('Terbaru')).not.toBeInTheDocument()
    })
  })

  describe('when offer exists', () => {
    it('should render product name', () => {
      const offer = createMockOffer({ productName: 'Logitech MX Keys' })
      renderInTable(
        <VendorColumn offer={offer} isCheapest={false} showDetails={false} />
      )

      expect(screen.getByText('Logitech MX Keys')).toBeInTheDocument()
    })

    it('should render formatted price', () => {
      const offer = createMockOffer({ price: 25000000 })
      renderInTable(
        <VendorColumn offer={offer} isCheapest={false} showDetails={false} />
      )

      expect(screen.getByText('Terbaru')).toBeInTheDocument()
      expect(screen.getByText('25.000.000')).toBeInTheDocument()
    })

    it('should render "Termurah" badge when isCheapest is true', () => {
      const offer = createMockOffer()
      renderInTable(
        <VendorColumn offer={offer} isCheapest={true} showDetails={false} />
      )

      expect(screen.getByText('Termurah')).toBeInTheDocument()
    })

    it('should not render "Termurah" badge when isCheapest is false', () => {
      const offer = createMockOffer()
      renderInTable(
        <VendorColumn offer={offer} isCheapest={false} showDetails={false} />
      )

      expect(screen.queryByText('Termurah')).not.toBeInTheDocument()
    })
  })

  describe('details visibility', () => {
    it('should not show details when showDetails is false', () => {
      const offer = createMockOffer()
      renderInTable(
        <VendorColumn offer={offer} isCheapest={false} showDetails={false} />
      )

      expect(screen.queryByText('Brand')).not.toBeInTheDocument()
      expect(screen.queryByText('UoM')).not.toBeInTheDocument()
    })

    it('should show details when showDetails is true', () => {
      const offer = createMockOffer()
      renderInTable(
        <VendorColumn offer={offer} isCheapest={false} showDetails={true} />
      )

      expect(screen.getByText('UoM')).toBeInTheDocument()
      expect(screen.getByText('Qty')).toBeInTheDocument()
      expect(screen.getByText('TOP')).toBeInTheDocument()
    })

    it('should render brand when provided', () => {
      const offer = createMockOffer({ brand: 'Logitech' })
      renderInTable(
        <VendorColumn offer={offer} isCheapest={false} showDetails={true} />
      )

      expect(screen.getByText('Brand')).toBeInTheDocument()
      expect(screen.getByText('Logitech')).toBeInTheDocument()
    })

    it('should not render brand when not provided', () => {
      const offer = createMockOffer({ brand: undefined })
      renderInTable(
        <VendorColumn offer={offer} isCheapest={false} showDetails={true} />
      )

      expect(screen.queryByText('Brand')).not.toBeInTheDocument()
    })

    it('should render specifications when provided', () => {
      const offer = createMockOffer({
        specifications: 'Wireless keyboard with Bluetooth',
      })
      renderInTable(
        <VendorColumn offer={offer} isCheapest={false} showDetails={true} />
      )

      expect(screen.getByText('Specifications')).toBeInTheDocument()
      expect(
        screen.getByText('Wireless keyboard with Bluetooth')
      ).toBeInTheDocument()
    })

    it('should render all offer attributes', () => {
      const offer = createMockOffer({
        unitOfMeasurement: 'Box',
        quantity: 200,
        paymentTerms: 'D30',
      })
      renderInTable(
        <VendorColumn offer={offer} isCheapest={false} showDetails={true} />
      )

      expect(screen.getByText('Box')).toBeInTheDocument()
      expect(screen.getByText('200')).toBeInTheDocument()
      expect(screen.getByText('D30')).toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('should apply correct table cell classes', () => {
      const offer = createMockOffer()
      const { container } = renderInTable(
        <VendorColumn offer={offer} isCheapest={false} showDetails={false} />
      )

      const td = container.querySelector('td')
      expect(td).toHaveClass(
        'px-6',
        'py-5',
        'border-r',
        'border-gray-200',
        'last:border-r-0',
        'align-top'
      )
    })

    it('should apply correct styling to "Termurah" badge', () => {
      const offer = createMockOffer()
      const { container } = renderInTable(
        <VendorColumn offer={offer} isCheapest={true} showDetails={false} />
      )

      const badge = container.querySelector('.bg-green-100')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveTextContent('Termurah')
    })
  })
})
