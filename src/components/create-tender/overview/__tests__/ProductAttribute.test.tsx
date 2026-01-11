import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Tag, FileText, Scale, Package, Calendar } from 'lucide-react'
import { ProductAttribute } from '../ProductAttribute'

describe('ProductAttribute', () => {
  const defaultProps = {
    icon: Tag,
    label: 'Brand',
    value: 'Logitech',
  }

  describe('rendering', () => {
    it('should render label and value', () => {
      render(<ProductAttribute {...defaultProps} />)

      expect(screen.getByText('Brand')).toBeInTheDocument()
      expect(screen.getByText('Logitech')).toBeInTheDocument()
    })

    it('should render with different icons', () => {
      const icons = [Tag, FileText, Scale, Package, Calendar]

      icons.forEach((Icon) => {
        const { container, unmount } = render(
          <ProductAttribute icon={Icon} label="Test" value="Value" />
        )

        const svg = container.querySelector('svg')
        expect(svg).toBeInTheDocument()
        unmount()
      })
    })

    it('should render with empty value', () => {
      const { container } = render(
        <ProductAttribute icon={Tag} label="Brand" value="" />
      )

      expect(screen.getByText('Brand')).toBeInTheDocument()
      const valueElement = container.querySelector('.text-gray-800')
      expect(valueElement).toBeInTheDocument()
      expect(valueElement).toHaveTextContent('')
    })
  })

  describe('accessibility', () => {
    it('should have proper structure for screen readers', () => {
      const { container } = render(<ProductAttribute {...defaultProps} />)

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('flex', 'items-start', 'gap-2')
    })

    it('should render icon with proper attributes', () => {
      const { container } = render(<ProductAttribute {...defaultProps} />)

      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('w-4', 'h-4', 'text-gray-400')
    })
  })

  describe('styling', () => {
    it('should apply correct CSS classes', () => {
      const { container } = render(<ProductAttribute {...defaultProps} />)

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('flex', 'items-start', 'gap-2')
    })

    it('should render label with correct styling', () => {
      const { container } = render(<ProductAttribute {...defaultProps} />)

      const label = container.querySelector('.text-gray-500')
      expect(label).toBeInTheDocument()
      expect(label).toHaveTextContent('Brand')
    })

    it('should render value with correct styling', () => {
      const { container } = render(<ProductAttribute {...defaultProps} />)

      const value = container.querySelector('.text-gray-800')
      expect(value).toBeInTheDocument()
      expect(value).toHaveTextContent('Logitech')
    })
  })
})
