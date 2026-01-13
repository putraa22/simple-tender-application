import { useState } from 'react'
import { apiClient } from '../utils/apiClient'
import type { CreateTenderRequest, CreateTenderApiResponse } from '../types/api'

interface UseCreateTenderReturn {
  isLoading: boolean
  error: string | null
  createTender: (
    tender: CreateTenderRequest
  ) => Promise<CreateTenderResponse | null>
}

type CreateTenderResponse = {
  created_on: string
  modified_on: string
  id: number
  name: string
  date: string
  requester_name: string
  description: string
  status: number
  created_by: string
  modified_by: string
}

export function useCreateTender(): UseCreateTenderReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createTender = async (
    tender: CreateTenderRequest
  ): Promise<CreateTenderResponse | null> => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await apiClient.post<CreateTenderApiResponse>(
        '/tender/create',
        tender
      )

      if (response.code === 200 && response.data) {
        return response.data
      }

      setError(response.message || 'Failed to create tender')
      return null
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to create tender. Please try again.'
      setError(errorMessage)
      console.error('Create tender error:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, error, createTender }
}
