import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TenderUnstarted } from '../TenderUnstarted'

describe('TenderUnstarted', () => {
  const defaultProps = {
    onStartTender: vi.fn(),
    isLoading: false,
  }

  describe('rendering', () => {
    it('should render unstarted tender message', () => {
      render(<TenderUnstarted {...defaultProps} />)

      expect(screen.getByText('Tender Unstarted')).toBeInTheDocument()
      expect(
        screen.getByText(
          /This tender has not been started yet. To start the tender/
        )
      ).toBeInTheDocument()
    })

    it('should render icon', () => {
      const { container } = render(<TenderUnstarted {...defaultProps} />)

      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('should render Start Tender button', () => {
      render(<TenderUnstarted {...defaultProps} />)

      expect(
        screen.getByRole('button', { name: /Start Tender/i })
      ).toBeInTheDocument()
    })
  })

  describe('button interaction', () => {
    it('should call onStartTender when button is clicked', async () => {
      const user = userEvent.setup()
      const onStartTender = vi.fn()
      render(
        <TenderUnstarted onStartTender={onStartTender} isLoading={false} />
      )

      const button = screen.getByRole('button', { name: /Start Tender/i })
      await user.click(button)

      expect(onStartTender).toHaveBeenCalledTimes(1)
    })

    it('should not call onStartTender when button is disabled', async () => {
      const user = userEvent.setup()
      const onStartTender = vi.fn()
      render(<TenderUnstarted onStartTender={onStartTender} isLoading={true} />)

      const button = screen.getByRole('button')
      await user.click(button)

      // Button is disabled, so click should not trigger
      expect(onStartTender).not.toHaveBeenCalled()
    })
  })

  describe('loading state', () => {
    it('should disable button when isLoading is true', () => {
      render(<TenderUnstarted onStartTender={vi.fn()} isLoading={true} />)

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('should show loading text when isLoading is true', () => {
      render(<TenderUnstarted onStartTender={vi.fn()} isLoading={true} />)

      expect(screen.getByText('Starting...')).toBeInTheDocument()
      expect(screen.queryByText(/Start Tender/i)).not.toBeInTheDocument()
    })

    it('should show normal text when isLoading is false', () => {
      render(<TenderUnstarted onStartTender={vi.fn()} isLoading={false} />)

      expect(screen.getByText(/Start Tender/i)).toBeInTheDocument()
      expect(screen.queryByText('Starting...')).not.toBeInTheDocument()
    })

    it('should apply disabled styling when loading', () => {
      render(<TenderUnstarted onStartTender={vi.fn()} isLoading={true} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'disabled:opacity-50',
        'disabled:cursor-not-allowed'
      )
    })
  })

  describe('accessibility', () => {
    it('should have proper button role', () => {
      render(<TenderUnstarted {...defaultProps} />)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup()
      const onStartTender = vi.fn()
      render(
        <TenderUnstarted onStartTender={onStartTender} isLoading={false} />
      )

      const button = screen.getByRole('button')
      button.focus()
      await user.keyboard('{Enter}')

      expect(onStartTender).toHaveBeenCalled()
    })
  })
})
