import type { InputHTMLAttributes, ReactNode } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: ReactNode
}

export function TextField({
  label,
  error,
  className = '',
  ...props
}: TextFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {error && (
        <p className="mt-1 text-red-500 text-xs bg-red-50 border border-red-100 rounded-md px-3 py-1.5">
          {error}
        </p>
      )}
    </div>
  )
}
