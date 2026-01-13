import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OverviewTab } from '../OverviewTab'
import { useCreateTenderStore } from '../../../store/createTenderStore'

// Mock the store
vi.mock('../../../store/createTenderStore', () => ({
  useCreateTenderStore: vi.fn(),
}))

// Mock the hook
vi.mock('../../../hooks/useVendorOffers', () => ({
  useVendorOffers: vi.fn(() => ({
    vendorOffers: [],
    vendorTotals: {},
    cheapestVendorPerProduct: {},
  })),
}))

describe('OverviewTab', () => {
  const mockOnStartTender = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when tender is not started', () => {
    it('should render TenderUnstarted component', () => {
      ;(useCreateTenderStore as any).mockReturnValue({
        isStarted: false,
        products: [],
        vendors: [],
      })

      render(
        <OverviewTab onStartTender={mockOnStartTender} isLoading={false} />
      )

      expect(screen.getByText('Tender Unstarted')).toBeInTheDocument()
    })

    it('should pass onStartTender and isLoading to TenderUnstarted', () => {
      ;(useCreateTenderStore as any).mockReturnValue({
        isStarted: false,
        products: [],
        vendors: [],
      })

      render(<OverviewTab onStartTender={mockOnStartTender} isLoading={true} />)

      expect(screen.getByText('Starting...')).toBeInTheDocument()
    })
  })

  describe('when tender is started', () => {
    const mockProducts = [
      {
        id: '1',
        name: 'Keyboard',
        lastPrice: '25000000',
        unitOfMeasurement: 'Box',
        quantity: 200,
        paymentTerms: 'D30',
        leadTimeDays: 7,
      },
    ]

    const mockVendors = [
      { id: 'v1', name: 'Vendor 1', email: 'vendor1@test.com' },
    ]

    beforeEach(() => {
      ;(useCreateTenderStore as any).mockReturnValue({
        isStarted: true,
        products: mockProducts,
        vendors: mockVendors,
      })
    })

    it('should render DetailToggle component', () => {
      render(
        <OverviewTab onStartTender={mockOnStartTender} isLoading={false} />
      )

      expect(
        screen.getByText('Tampilkan Detail Permintaan')
      ).toBeInTheDocument()
    })

    it('should render ComparisonTable component', () => {
      render(
        <OverviewTab onStartTender={mockOnStartTender} isLoading={false} />
      )

      expect(screen.getByText('Products')).toBeInTheDocument()
    })

    it('should pass correct props to ComparisonTable', () => {
      render(
        <OverviewTab onStartTender={mockOnStartTender} isLoading={false} />
      )

      // Verify table is rendered with products
      expect(screen.getByText('1. Keyboard')).toBeInTheDocument()
    })

    it('should toggle showDetails when DetailToggle is clicked', async () => {
      const { userEvent } = await import('@testing-library/user-event')
      const user = userEvent.setup()

      render(
        <OverviewTab onStartTender={mockOnStartTender} isLoading={false} />
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked() // Default is true

      await user.click(checkbox)

      // After toggle, details should be hidden
      expect(checkbox).not.toBeChecked()
    })
  })

  describe('integration', () => {
    it('should integrate all components correctly', () => {
      ;(useCreateTenderStore as any).mockReturnValue({
        isStarted: true,
        products: [
          {
            id: '1',
            name: 'Keyboard',
            lastPrice: '25000000',
            unitOfMeasurement: 'Box',
            quantity: 200,
            paymentTerms: 'D30',
            leadTimeDays: 7,
          },
        ],
        vendors: [{ id: 'v1', name: 'Vendor 1', email: 'vendor1@test.com' }],
      })

      render(
        <OverviewTab onStartTender={mockOnStartTender} isLoading={false} />
      )

      // Verify all main components are rendered
      expect(
        screen.getByText('Tampilkan Detail Permintaan')
      ).toBeInTheDocument()
      expect(screen.getByText('Products')).toBeInTheDocument()
      expect(screen.getByText('1. Keyboard')).toBeInTheDocument()
    })
  })
})
