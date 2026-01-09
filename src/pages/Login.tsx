import type { FormEvent } from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { AuthLayout } from '../components/layout/AuthLayout'
import { TextField } from '../components/form/TextField'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter your email and password')
      return
    }

    // TODO: Replace with real API call
    const mockToken = 'mock-jwt-token'
    const mockUser = { id: '1', name: 'Admin User', email }
    login(mockToken, mockUser)

    const state = location.state as { from?: Location } | null
    const redirectTo = state?.from?.pathname || '/'
    navigate(redirectTo, { replace: true })
  }

  return (
    <AuthLayout
      title="Sign in to your account"
      description="Enter your credentials to continue to the dashboard."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          error={error}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Login
        </button>
      </form>
    </AuthLayout>
  )
}
