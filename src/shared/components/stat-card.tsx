'use client'

import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: ReactNode
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple'
  onClick?: () => void
  action?: ReactNode
}

const colorMap = {
  blue: 'bg-blue-50 border-blue-200',
  green: 'bg-green-50 border-green-200',
  amber: 'bg-amber-50 border-amber-200',
  red: 'bg-red-50 border-red-200',
  purple: 'bg-purple-50 border-purple-200',
}

const iconBgMap = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  amber: 'bg-amber-100 text-amber-600',
  red: 'bg-red-100 text-red-600',
  purple: 'bg-purple-100 text-purple-600',
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'blue',
  onClick,
  action,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-lg border ${colorMap[color]} transition-all hover:shadow-md cursor-pointer`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${iconBgMap[color]}`}>
          <div className="text-2xl">{icon}</div>
        </div>
        {action && <div>{action}</div>}
      </div>

      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {trend && (
          <div className={`text-sm font-semibold ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <div className="flex items-center gap-1">
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
