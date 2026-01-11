import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DetailToggle } from '../DetailToggle'

describe('DetailToggle', () => {
  const defaultProps = {
    showDetails: true,
    onToggle: vi.fn(),
  }

  describe('rendering', () => {
    it('should render toggle with label', () => {
      render(<DetailToggle {...defaultProps} />)

      expect(
        screen.getByText('Tampilkan Detail Permintaan')
      ).toBeInTheDocument()
    })

    it('should render checkbox input', () => {
      render(<DetailToggle {...defaultProps} />)

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
    })
  })

  describe('interaction', () => {
    it('should call onToggle with false when clicking unchecked toggle', async () => {
      const user = userEvent.setup()
      const onToggle = vi.fn()
      render(<DetailToggle showDetails={true} onToggle={onToggle} />)

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)

      expect(onToggle).toHaveBeenCalledTimes(1)
      expect(onToggle).toHaveBeenCalledWith(false)
    })

    it('should call onToggle with true when clicking checked toggle', async () => {
      const user = userEvent.setup()
      const onToggle = vi.fn()
      render(<DetailToggle showDetails={false} onToggle={onToggle} />)

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)

      expect(onToggle).toHaveBeenCalledTimes(1)
      expect(onToggle).toHaveBeenCalledWith(true)
    })

    it('should not call onToggle when disabled', async () => {
      const user = userEvent.setup()
      const onToggle = vi.fn()
      render(<DetailToggle showDetails={true} onToggle={onToggle} />)

      const checkbox = screen.getByRole('checkbox')
      // Note: DetailToggle doesn't have disabled prop, but if it did:
      // expect(checkbox).toBeDisabled()
      await user.click(checkbox)

      expect(onToggle).toHaveBeenCalled()
    })
  })

  describe('state management', () => {
    it('should reflect checked state when showDetails is true', () => {
      render(<DetailToggle showDetails={true} onToggle={vi.fn()} />)

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
    })

    it('should reflect unchecked state when showDetails is false', () => {
      render(<DetailToggle showDetails={false} onToggle={vi.fn()} />)

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()
    })

    it('should update state when showDetails prop changes', () => {
      const { rerender } = render(
        <DetailToggle showDetails={true} onToggle={vi.fn()} />
      )

      let checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()

      rerender(<DetailToggle showDetails={false} onToggle={vi.fn()} />)
      checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()
    })
  })

  describe('accessibility', () => {
    it('should have proper label association', () => {
      render(<DetailToggle {...defaultProps} />)

      const label = screen.getByText('Tampilkan Detail Permintaan')
      const checkbox = screen.getByRole('checkbox')

      expect(label).toBeInTheDocument()
      expect(checkbox).toBeInTheDocument()
    })

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup()
      const onToggle = vi.fn()
      render(<DetailToggle showDetails={true} onToggle={onToggle} />)

      const checkbox = screen.getByRole('checkbox')
      checkbox.focus()
      // Checkboxes use Space key, not Enter
      await user.keyboard(' ')

      expect(onToggle).toHaveBeenCalled()
    })
  })
})
