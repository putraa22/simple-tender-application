import { useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { apiClient } from '../utils/apiClient'
import type { LoginRequest, LoginResponse } from '../types/api'
import type { LocationState } from '../types/auth'

interface UseLoginReturn {
  isLoading: boolean
  error: string
  login: (username: string, password: string) => Promise<void>
  clearError: () => void
}

export function useLogin(): UseLoginReturn {
  const navigate = useNavigate()
  const location = useLocation()
  const loginStore = useAuthStore((s) => s.login)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const clearError = useCallback((): void => {
    setError('')
  }, [])

  const login = async (username: string, password: string): Promise<void> => {
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Please enter your username and password')
      return
    }

    setIsLoading(true)

    try {
      const requestBody: LoginRequest = { username: username.trim(), password }
      const response = await apiClient.post<LoginResponse>(
        '/auth/login',
        requestBody
      )

      if (response.code === 200 && response.data) {
        const { accessToken, refreshToken, user } = response.data
        loginStore(accessToken, refreshToken, user)

        const state = location.state as LocationState | null
        const redirectTo = state?.from?.pathname || '/'
        navigate(redirectTo, { replace: true })
      } else {
        setError(response.message || 'Login failed. Please try again.')
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Login failed. Please check your credentials and try again.'
      setError(errorMessage)
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, error, login, clearError }
}
