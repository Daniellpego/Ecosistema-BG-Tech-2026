'use client'

import { FileBarChart, Download, Clock, FileText, TrendingUp, DollarSign } from 'lucide-react'
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { usePresentations } from '@/hooks/use-relatorios'
import { formatDate } from '@/lib/format'

const TIPO_ICON: Record<string, React.ElementType> = {
  status_report: FileText,
  roadmap: TrendingUp,
  financeiro: DollarSign,
  custom: FileBarChart,
}

const TIPO_LABEL: Record<string, string> = {
  status_report: 'Status Report',
  roadmap: 'Roadmap',
  financeiro: 'Financeiro',
  custom: 'Custom',
}

export default function RelatoriosPage() {
  const { data: presentations, isLoading } = usePresentations()

  if (isLoading) {
    return (
      <PageTransition>
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48" />)}
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-text-primary">Relatorios</h1>
        </div>

        {/* Quick Generate */}
        <div className="card-glass">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Gerar Relatorio</h3>
          <p className="text-xs text-text-muted mb-4">
            Use o Claude Code com as skills de PPTX para gerar apresentacoes automaticamente.
            Diga: "gere um relatorio de status" ou "apresentacao financeira".
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(TIPO_LABEL).map(([key, label]) => {
              const Icon = TIPO_ICON[key] ?? FileBarChart
              return (
                <div key={key} className="card-glass-hover !p-3 flex flex-col items-center gap-2 text-center cursor-pointer">
                  <div className="h-10 w-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-brand-cyan" />
                  </div>
                  <span className="text-xs font-medium text-text-primary">{label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Library */}
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-3">Biblioteca</h3>

          {(!presentations || presentations.length === 0) && (
            <EmptyState
              icon={FileBarChart}
              title="Nenhuma apresentacao gerada"
              description="Use o comando de geracao para criar seu primeiro relatorio PPTX"
            />
          )}

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {presentations?.map((p) => {
              const Icon = TIPO_ICON[p.tipo] ?? FileBarChart
              return (
                <StaggerItem key={p.id}>
                  <div className="card-glass-hover">
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-10 w-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-brand-cyan" />
                      </div>
                      <Badge variant="cyan">{TIPO_LABEL[p.tipo] ?? p.tipo}</Badge>
                    </div>
                    <h4 className="text-sm font-semibold text-text-primary mb-1 line-clamp-2">{p.titulo}</h4>
                    <div className="flex items-center gap-2 text-xs text-text-muted mb-4">
                      <Clock className="h-3 w-3" />
                      {formatDate(p.created_at)}
                      <span>&middot;</span>
                      <span>{p.generated_by}</span>
                    </div>
                    <Button size="sm" variant="secondary" className="w-full" asChild>
                      <a href={p.storage_url} download>
                        <Download className="h-3 w-3" /> Download .pptx
                      </a>
                    </Button>
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </div>
      </div>
    </PageTransition>
  )
}
