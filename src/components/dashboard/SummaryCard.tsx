import type { LucideIcon } from 'lucide-react'

interface SummaryCardProps {
  icon: LucideIcon
  value: number
  label: string
  iconBgColor: string
  iconColor: string
}

export function SummaryCard({
  icon: Icon,
  value,
  label,
  iconBgColor,
  iconColor,
}: SummaryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 ${iconBgColor} rounded-lg`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  )
}
