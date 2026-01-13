import type { ReactNode } from 'react'
import logoTender from '../../assets/logoTender.png'

interface AuthLayoutProps {
  title: string
  description?: string
  children: ReactNode
}

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-[1.1fr_1fr]">
        <div className="bg-blue-600 text-white p-8 hidden md:flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Tender App</h1>
            <p className="text-sm text-blue-100">
              Manage and monitor your tender process in one place.
            </p>
          </div>
          <div className="flex justify-center items-center my-6">
            <img
              src={logoTender}
              alt="Tender App"
              className="max-w-full h-auto max-h-32 object-contain"
            />
          </div>
          <div className="text-xs text-blue-100">
            Secure access for authorized users only.
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
          {description && (
            <p className="text-sm text-gray-500 mb-6">{description}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
