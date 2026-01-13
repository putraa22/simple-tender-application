import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { apiClient } from '../utils/apiClient'
import type { LogoutResponse } from '../types/api'

interface UseLogoutReturn {
  isLoading: boolean
  error: string | null
  logout: () => Promise<void>
}

export function useLogout(): UseLogoutReturn {
  const navigate = useNavigate()
  const logoutStore = useAuthStore((s) => s.logout)
  const token = useAuthStore((s) => s.token)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const logout = async (): Promise<void> => {
    setError(null)
    setIsLoading(true)

    try {
      if (token) {
        await apiClient.post<LogoutResponse>('/auth/logout')
      }
    } catch (err) {
      console.error('Logout API error:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to logout from server, but local session cleared'
      )
    } finally {
      logoutStore()
      setIsLoading(false)
      navigate('/login', { replace: true })
    }
  }

  return { isLoading, error, logout }
}
