import type { FormEvent } from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">
        <div className="bg-blue-600 text-white p-8 hidden md:flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Tender App</h1>
            <p className="text-sm text-blue-100">
              Manage and monitor your tender process in one place.
            </p>
          </div>
          <div className="text-xs text-blue-100">
            Secure access for authorized users only.
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Sign in to your account
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter your credentials to continue to the dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
