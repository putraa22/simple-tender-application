import type { ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

/**
 * Custom render function with providers
 * Useful for components that need Router context
 */
export function renderWithRouter(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { initialEntries?: string[] }
) {
  const { initialEntries = ['/'], ...renderOptions } = options || {}

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

/**
 * Re-export everything from @testing-library/react
 */
export * from '@testing-library/react'
