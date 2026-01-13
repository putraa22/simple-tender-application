import type { TextareaHTMLAttributes } from 'react'

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export function TextAreaField({
  label,
  error,
  className = '',
  ...props
}: TextAreaFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-800">
        {label}
      </label>
      <textarea
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none ${
          error ? 'border-red-500' : ''
        } ${className}`}
        rows={4}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
