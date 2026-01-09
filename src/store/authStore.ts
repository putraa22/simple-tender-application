import { create } from 'zustand'

type User = { id: string; name: string; email: string }

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

const getInitialToken = (): string | null => {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem('token')
  } catch {
    return null
  }
}

const getInitialUser = (): User | null => {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem('user')
    return stored ? (JSON.parse(stored) as User) : null
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>((set) => {
  const initialToken = getInitialToken()
  const initialUser = getInitialUser()

  return {
    token: initialToken,
    user: initialUser,
    isAuthenticated: !!initialToken,

    login: (token, user) => {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(user))
        } catch (err) {
          console.warn('Failed to write auth data to localStorage', err)
        }
      }
      set({ token, user, isAuthenticated: true })
    },

    logout: () => {
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        } catch (err) {
          console.warn('Failed to logout', err)
          // ignore storage errors
        }
      }
      set({ token: null, user: null, isAuthenticated: false })
    },
  }
})
