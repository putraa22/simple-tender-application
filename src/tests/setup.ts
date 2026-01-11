// Global test setup file untuk Vitest + Testing Library
// File ini dirujuk di `vite.config.ts` pada opsi `test.setupFiles`.

import '@testing-library/jest-dom'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup setelah setiap test untuk menghindari memory leaks
// Testing Library sudah otomatis cleanup, tapi lebih baik explicit
afterEach(() => {
  cleanup()
})

// Mock untuk window.matchMedia (diperlukan untuk beberapa UI libraries)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock untuk ResizeObserver (diperlukan untuk beberapa components)
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as typeof ResizeObserver
