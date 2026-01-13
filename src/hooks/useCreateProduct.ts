import { useState } from 'react'
import { apiClient } from '../utils/apiClient'
import type {
  CreateProductRequest,
  CreateProductApiResponse,
  CreateProductResponse,
} from '../types/api'

interface UseCreateProductReturn {
  isLoading: boolean
  error: string | null
  createProduct: (
    tenderId: number,
    product: CreateProductRequest
  ) => Promise<CreateProductResponse | null>
}

export function useCreateProduct(): UseCreateProductReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProduct = async (
    tenderId: number,
    product: CreateProductRequest
  ): Promise<CreateProductResponse | null> => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await apiClient.post<CreateProductApiResponse>(
        `/tender/product/create/${tenderId}`,
        product
      )

      if (response.code === 200 && response.data) {
        return response.data
      }

      setError(response.message || 'Failed to create product')
      return null
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to create product. Please try again.'
      setError(errorMessage)
      console.error('Create product error:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, error, createProduct }
}
