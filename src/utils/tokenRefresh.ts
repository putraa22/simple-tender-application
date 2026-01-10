import { useAuthStore } from '../store/authStore'
import { apiClient } from './apiClient'
import type { RefreshTokenRequest, RefreshTokenResponse } from '../types/api'

export async function refreshAccessToken(): Promise<boolean> {
  const state = useAuthStore.getState()
  const { user, refreshToken: currentRefreshToken } = state

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
      useAuthStore.getState().updateTokens(accessToken, newRefreshToken)
      return true
    }

    return false
  } catch (err) {
    console.error('Refresh token error:', err)
    return false
  }
}
