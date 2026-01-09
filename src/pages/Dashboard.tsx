import { useAuthStore } from '../store/authStore'

export default function Dashboard() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Dashboard</h1>
        <p className="mb-6 text-gray-600">
          Welcome, <span className="font-semibold">{user?.name ?? 'User'}</span>
          !
        </p>
        <button
          type="button"
          onClick={logout}
          className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
