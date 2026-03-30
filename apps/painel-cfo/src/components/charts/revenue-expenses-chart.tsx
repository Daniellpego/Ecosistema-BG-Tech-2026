'use client'

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '@/lib/format'

function ChartTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload) return null
  return (
    <div className="tooltip-brand shadow-lg">
      <p className="text-xs text-text-secondary mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  )
}

interface RevenueExpensesChartProps {
  data: Array<{ month: string; receita: number; custos: number; resultado: number }>
}

export default function RevenueExpensesChart({ data }: RevenueExpensesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis
          dataKey="month"
          tick={{ fill: '#94A3B8', fontSize: 12 }}
          axisLine={{ stroke: '#F1F5F9' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#94A3B8', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) =>
            v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
          }
        />
        <RechartsTooltip content={<ChartTooltipContent />} />
        <Legend wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
        <Bar
          dataKey="receita"
          name="Receita"
          fill="#10B981"
          radius={[4, 4, 0, 0]}
          barSize={24}
        />
        <Bar
          dataKey="custos"
          name="Custos"
          fill="#EF4444"
          radius={[4, 4, 0, 0]}
          barSize={24}
        />
        <Line
          type="monotone"
          dataKey="resultado"
          name="Resultado"
          stroke="#00C8F0"
          strokeWidth={2}
          dot={{ fill: '#00C8F0', r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
