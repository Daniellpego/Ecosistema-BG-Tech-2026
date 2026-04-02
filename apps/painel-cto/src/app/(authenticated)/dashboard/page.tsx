'use client'

import { LayoutDashboard, TrendingUp, AlertTriangle, DollarSign, Clock, Milestone } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { PageTransition, StaggerContainer, StaggerItem, AnimatedNumber } from '@/components/motion'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge, PrioridadeBadge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useDashboardCTO } from '@/hooks/use-dashboard-cto'
import { useGlobalUpdates } from '@/hooks/use-updates'
import { formatCurrency, formatDate, formatRelative, daysUntil } from '@/lib/format'
import { cn } from '@/lib/utils'

function KPICard({ icon: Icon, label, value, format, color, alert }: {
  icon: React.ElementType; label: string; value: number
  format: (n: number) => string; color: string; alert?: boolean
}) {
  return (
    <StaggerItem>
      <div className="card-glass relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-6 translate-x-6 opacity-10" style={{ background: color }} />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-text-secondary mb-1">{label}</p>
            <p className="text-2xl font-bold" style={{ color }}>
              <AnimatedNumber value={value} format={format} />
            </p>
          </div>
          <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center', alert && 'animate-pulse-glow')} style={{ background: `${color}15` }}>
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
        </div>
      </div>
    </StaggerItem>
  )
}

export default function DashboardPage() {
  const { isLoading, kpis, statusDistribuicao, proximasEntregas, proximosMilestones } = useDashboardCTO()
  const { data: recentUpdates } = useGlobalUpdates(8)

  if (isLoading) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-72" />)}
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-text-primary">Dashboard</h1>

        {/* KPIs */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard icon={LayoutDashboard} label="Projetos Ativos" value={kpis.projetosAtivos} format={(n) => String(n)} color="#00C8F0" />
          <KPICard icon={TrendingUp} label="Entregas no Mes" value={kpis.entreguesMes} format={(n) => String(n)} color="#10B981" />
          <KPICard icon={AlertTriangle} label="Atrasados" value={kpis.atrasados} format={(n) => String(n)} color="#EF4444" alert={kpis.atrasados > 0} />
          <KPICard icon={DollarSign} label="Valor Pipeline" value={kpis.valorPipeline} format={formatCurrency} color="#F59E0B" />
        </StaggerContainer>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Status Distribution */}
          <div className="card-glass">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Distribuicao por Status</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusDistribuicao} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4} strokeWidth={0}>
                  {statusDistribuicao.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#131F35', border: '1px solid rgba(21,59,95,0.5)', borderRadius: 8, color: '#F0F4F8', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2">
              {statusDistribuicao.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-xs text-text-secondary">{s.name} ({s.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Proximas Entregas */}
          <div className="card-glass">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-brand-cyan" />
              <h3 className="text-sm font-semibold text-text-primary">Proximas Entregas (7d)</h3>
            </div>
            <div className="space-y-3">
              {proximasEntregas.length === 0 && (
                <p className="text-xs text-text-muted py-4 text-center">Nenhuma entrega proxima</p>
              )}
              {proximasEntregas.map((p: Record<string, unknown>) => {
                const days = daysUntil(p.data_entrega as string)
                return (
                  <div key={p.id as string} className="flex items-center justify-between py-2 border-b border-brand-blue-deep/20 last:border-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{p.titulo as string}</p>
                      <p className="text-xs text-text-muted">{p.cliente as string}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Progress value={p.progresso as number} className="w-16" />
                      <span className={cn('text-xs font-semibold', days <= 2 ? 'text-status-negative' : 'text-status-warning')}>
                        {days}d
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Milestones Proximos */}
          <div className="card-glass">
            <div className="flex items-center gap-2 mb-4">
              <Milestone className="h-4 w-4 text-brand-cyan" />
              <h3 className="text-sm font-semibold text-text-primary">Milestones (14d)</h3>
            </div>
            <div className="space-y-3">
              {proximosMilestones.length === 0 && (
                <p className="text-xs text-text-muted py-4 text-center">Nenhum milestone proximo</p>
              )}
              {proximosMilestones.map((m: Record<string, unknown>) => (
                <div key={m.id as string} className="flex items-center justify-between py-2 border-b border-brand-blue-deep/20 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{m.titulo as string}</p>
                    <p className="text-xs text-text-muted">{(m as { projetos?: { titulo: string } }).projetos?.titulo}</p>
                  </div>
                  <span className="text-xs text-text-secondary shrink-0">{formatDate(m.data_prevista as string)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card-glass">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Atividade Recente</h3>
          <div className="space-y-3">
            {recentUpdates?.map((u) => (
              <div key={u.id} className="flex items-start gap-3 py-2 border-b border-brand-blue-deep/20 last:border-0">
                <div className={cn(
                  'h-2 w-2 rounded-full mt-1.5 shrink-0',
                  u.tipo === 'bloqueio' ? 'bg-status-negative' :
                  u.tipo === 'entrega' ? 'bg-status-positive' :
                  u.tipo === 'milestone' ? 'bg-status-warning' : 'bg-brand-cyan'
                )} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-text-primary">{u.conteudo}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-brand-cyan">{u.projeto_titulo}</span>
                    <span className="text-xs text-text-muted">&middot; {formatRelative(u.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
