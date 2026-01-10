import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../utils/apiClient'
import type { VendorOptionsResponse, VendorOption } from '../types/api'

interface UseVendorOptionsReturn {
  vendors: VendorOption[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useVendorOptions(): UseVendorOptionsReturn {
  const [vendors, setVendors] = useState<VendorOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVendors = useCallback(async (): Promise<void> => {
    setError(null)
    setIsLoading(true)

    try {
      const response =
        await apiClient.get<VendorOptionsResponse>('/vendor/options')

      if (response.code === 200 && response.data) {
        setVendors(response.data)
      } else {
        setError(response.message || 'Failed to fetch vendors')
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to fetch vendors. Please try again.'
      setError(errorMessage)
      console.error('Fetch vendors error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVendors()
  }, [fetchVendors])

  return {
    vendors,
    isLoading,
    error,
    refetch: fetchVendors,
  }
}
