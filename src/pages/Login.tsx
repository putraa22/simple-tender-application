import type { FormEvent } from 'react'
import { useState, useEffect } from 'react'
import { AuthLayout } from '../components/layout/AuthLayout'
import { TextField } from '../components/form/TextField'
import { useLogin } from '../hooks/useLogin'

export default function Login() {
  const { isLoading, error, login, clearError } = useLogin()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (error) {
      clearError()
    }
  }, [username, password, error, clearError])

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    login(username, password)
  }

  return (
    <AuthLayout
      title="Sign in to your account"
      description="Enter your credentials to continue to the dashboard."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          disabled={isLoading}
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          error={error}
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </AuthLayout>
  )
}
