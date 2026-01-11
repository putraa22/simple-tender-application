import type { LucideIcon } from 'lucide-react'

interface ProductAttributeProps {
  icon: LucideIcon
  label: string
  value: string
}

export function ProductAttribute({
  icon: Icon,
  label,
  value,
}: ProductAttributeProps) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xs text-gray-800">{value}</p>
      </div>
    </div>
  )
}
