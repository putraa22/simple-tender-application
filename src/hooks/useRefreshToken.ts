import { useAuthStore } from '../store/authStore'
import { apiClient } from '../utils/apiClient'
import type { RefreshTokenRequest, RefreshTokenResponse } from '../types/api'

interface UseRefreshTokenReturn {
  refreshToken: () => Promise<boolean>
}

export function useRefreshToken(): UseRefreshTokenReturn {
  const updateTokens = useAuthStore((s) => s.updateTokens)
  const user = useAuthStore((s) => s.user)
  const currentRefreshToken = useAuthStore((s) => s.refreshToken)

  const refreshToken = async (): Promise<boolean> => {
    if (!user || !currentRefreshToken) {
      return false
    }

    try {
      const requestBody: RefreshTokenRequest = {
        username: user.username,
        refreshToken: currentRefreshToken,
      }

      const response = await apiClient.post<RefreshTokenResponse>(
        '/auth/refresh-token',
        requestBody
      )

      if (response.code === 200 && response.data) {
        const { accessToken, refreshToken: newRefreshToken } = response.data
        updateTokens(accessToken, newRefreshToken)
        return true
      }

      return false
    } catch (err) {
      console.error('Refresh token error:', err)
      return false
    }
  }

  return { refreshToken }
}
