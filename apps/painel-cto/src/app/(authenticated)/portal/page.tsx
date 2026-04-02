'use client'

import { Users, Download, FileText, Eye, MessageSquare, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/motion'
import { StatusBadge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useProjetos } from '@/hooks/use-projetos'
import { getProjetoTitulo, getProjetoEntrega } from '@/types/database'
import { usePortalUpdates } from '@/hooks/use-updates'
import { usePresentations } from '@/hooks/use-relatorios'
import { formatCurrency, formatDate, formatRelative } from '@/lib/format'
import { cn } from '@/lib/utils'

const UPDATE_ICONS: Record<string, React.ElementType> = {
  nota: MessageSquare,
  status_change: TrendingUp,
  milestone: CheckCircle2,
  bloqueio: AlertTriangle,
  entrega: CheckCircle2,
}

const UPDATE_COLORS: Record<string, string> = {
  nota: '#00C8F0',
  status_change: '#94A3B8',
  milestone: '#F59E0B',
  bloqueio: '#EF4444',
  entrega: '#10B981',
}

export default function PortalPage() {
  const { data: projetos, isLoading: loadingProjetos } = useProjetos()
  const { data: updates, isLoading: loadingUpdates } = usePortalUpdates(15)
  const { data: presentations } = usePresentations()

  const isLoading = loadingProjetos || loadingUpdates

  if (isLoading) {
    return (
      <PageTransition>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </PageTransition>
    )
  }

  const activeProjetos = (projetos ?? []).filter((p) => p.status !== 'cancelado')
    .sort((a, b) => {
      const order: Record<string, number> = { em_andamento: 0, revisao: 1, em_revisao: 1, backlog: 2, entregue: 3, cancelado: 4 }
      return (order[a.status] ?? 9) - (order[b.status] ?? 9)
    })

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-brand-cyan" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">Portal dos Socios</h1>
            <p className="text-xs text-text-muted">Visao macro de projetos e operacoes</p>
          </div>
        </div>

        {/* Projects Table */}
        <div className="card-glass !p-0 overflow-hidden">
          <div className="px-5 py-3 border-b border-brand-blue-deep/20">
            <h3 className="text-sm font-semibold text-text-primary">Projetos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="text-left px-5 py-3">Projeto</th>
                  <th className="text-left px-3 py-3">Cliente</th>
                  <th className="text-left px-3 py-3">Status</th>
                  <th className="text-left px-3 py-3">Progresso</th>
                  <th className="text-left px-3 py-3">Prazo</th>
                  <th className="text-right px-5 py-3">Valor</th>
                </tr>
              </thead>
              <tbody>
                {activeProjetos.map((p) => (
                  <tr key={p.id} className="table-row">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full shrink-0" style={{ background: p.cor ?? '#00C8F0' }} />
                        <span className="text-sm font-medium text-text-primary">{getProjetoTitulo(p)}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-text-secondary">{p.cliente ?? '-'}</td>
                    <td className="px-3 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-3 py-3"><Progress value={p.progresso} showLabel className="w-24" /></td>
                    <td className="px-3 py-3 text-sm text-text-secondary">{getProjetoEntrega(p) ? formatDate(getProjetoEntrega(p)!) : '-'}</td>
                    <td className="px-5 py-3 text-sm text-text-primary text-right font-medium">{p.valor ? formatCurrency(p.valor) : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Updates Feed */}
          <div className="card-glass">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-4 w-4 text-brand-cyan" />
              <h3 className="text-sm font-semibold text-text-primary">Atualizacoes</h3>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {updates?.map((u) => {
                const Icon = UPDATE_ICONS[u.tipo] ?? MessageSquare
                const color = UPDATE_COLORS[u.tipo] ?? '#00C8F0'
                return (
                  <div key={u.id} className="flex items-start gap-3 py-2 border-b border-brand-blue-deep/15 last:border-0">
                    <div className="h-6 w-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}15` }}>
                      <Icon className="h-3.5 w-3.5" style={{ color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-text-primary">{u.conteudo}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-brand-cyan">{u.projeto_titulo}</span>
                        <span className="text-xs text-text-muted">&middot; {formatRelative(u.created_at)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
              {(!updates || updates.length === 0) && (
                <p className="text-xs text-text-muted text-center py-4">Nenhuma atualizacao</p>
              )}
            </div>
          </div>

          {/* Reports */}
          <div className="card-glass">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-4 w-4 text-brand-cyan" />
              <h3 className="text-sm font-semibold text-text-primary">Relatorios</h3>
            </div>
            <div className="space-y-3">
              {presentations?.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-brand-blue-deep/15 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{p.titulo}</p>
                    <p className="text-xs text-text-muted">{formatDate(p.created_at)}</p>
                  </div>
                  <Button size="sm" variant="ghost" asChild>
                    <a href={p.storage_url} download><Download className="h-3 w-3" /></a>
                  </Button>
                </div>
              ))}
              {(!presentations || presentations.length === 0) && (
                <p className="text-xs text-text-muted text-center py-4">Nenhum relatorio disponivel</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
