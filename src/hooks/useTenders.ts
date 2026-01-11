import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../utils/apiClient'
import { useTenderStore } from '../store/tenderStore'
import { transformTenderListApiToTenders } from '../utils/tenderTransform'
import { applyPersistedStatuses } from '../utils/tenderStatusPersistence'
import type { TenderListResponse } from '../types/api'

interface UseTendersReturn {
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useTenders(): UseTendersReturn {
  const setTenders = useTenderStore((s) => s.setTenders)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTenders = useCallback(async (): Promise<void> => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await apiClient.get<TenderListResponse>('/tender/all')

      if (response.code === 200 && response.data) {
        const tenders = transformTenderListApiToTenders(response.data)
        const tendersWithPersistedStatuses = applyPersistedStatuses(tenders)
        setTenders(tendersWithPersistedStatuses)
      } else {
        setError(response.message || 'Failed to fetch tenders')
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to fetch tenders. Please try again.'
      setError(errorMessage)
      console.error('Fetch tenders error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [setTenders])

  useEffect(() => {
    fetchTenders()
  }, [fetchTenders])

  return {
    isLoading,
    error,
    refetch: fetchTenders,
  }
}
