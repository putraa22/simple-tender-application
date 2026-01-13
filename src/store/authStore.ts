import { create } from 'zustand'
import type { User } from '../types/auth'
import { STORAGE_KEYS } from '../constants/storage'

interface AuthState {
  token: string | null
  refreshToken: string | null
  user: User | null
  isAuthenticated: boolean
  login: (accessToken: string, refreshToken: string, user: User) => void
  logout: () => void
  updateTokens: (accessToken: string, refreshToken: string) => void
}

const isBrowser = typeof window !== 'undefined'

const getStorageItem = (key: string): string | null => {
  if (!isBrowser) return null
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

const setStorageItem = (key: string, value: string): void => {
  if (!isBrowser) return
  try {
    localStorage.setItem(key, value)
  } catch (err) {
    console.warn(`Failed to write ${key} to localStorage`, err)
  }
}

const removeStorageItem = (key: string): void => {
  if (!isBrowser) return
  try {
    localStorage.removeItem(key)
  } catch (err) {
    console.warn(`Failed to remove ${key} from localStorage`, err)
  }
}

const getInitialToken = (): string | null => {
  return getStorageItem(STORAGE_KEYS.TOKEN)
}

const getInitialRefreshToken = (): string | null => {
  return getStorageItem(STORAGE_KEYS.REFRESH_TOKEN)
}

const getInitialUser = (): User | null => {
  const stored = getStorageItem(STORAGE_KEYS.USER)
  if (!stored) return null
  try {
    return JSON.parse(stored) as User
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>((set) => {
  const initialToken = getInitialToken()
  const initialRefreshToken = getInitialRefreshToken()
  const initialUser = getInitialUser()

  return {
    token: initialToken,
    refreshToken: initialRefreshToken,
    user: initialUser,
    isAuthenticated: !!initialToken,

    login: (accessToken, refreshToken, user) => {
      setStorageItem(STORAGE_KEYS.TOKEN, accessToken)
      setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
      setStorageItem(STORAGE_KEYS.USER, JSON.stringify(user))
      set({ token: accessToken, refreshToken, user, isAuthenticated: true })
    },

    logout: () => {
      removeStorageItem(STORAGE_KEYS.TOKEN)
      removeStorageItem(STORAGE_KEYS.REFRESH_TOKEN)
      removeStorageItem(STORAGE_KEYS.USER)
      set({
        token: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
      })
    },

    updateTokens: (accessToken, refreshToken) => {
      setStorageItem(STORAGE_KEYS.TOKEN, accessToken)
      setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
      set({ token: accessToken, refreshToken })
    },
  }
})
