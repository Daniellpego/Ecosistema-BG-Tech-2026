'use client'

import { useState } from 'react'
import { Filter } from 'lucide-react'
import { PageTransition } from '@/components/motion'
import { KanbanBoard } from '@/components/kanban/kanban-board'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/ui/error-state'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProjetoFormDialog } from '@/components/projeto/projeto-form-dialog'
import { useProjetos } from '@/hooks/use-projetos'
import type { Prioridade } from '@/types/database'

export default function KanbanPage() {
  const { data: projetos, isLoading, error } = useProjetos()
  const [filterPrioridade, setFilterPrioridade] = useState<Prioridade | 'all'>('all')

  const filteredProjetos = (projetos ?? []).filter((p) => {
    if (filterPrioridade !== 'all' && p.prioridade !== filterPrioridade) return false
    return true
  })

  if (error) {
    return <PageTransition><ErrorState message="Erro ao carregar projetos. Verifique sua conexao." /></PageTransition>
  }

  if (isLoading) {
    return (
      <PageTransition>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-96 w-72" />)}
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-text-primary">Kanban</h1>
          <div className="flex items-center gap-3">
            <Select value={filterPrioridade} onValueChange={(v) => setFilterPrioridade(v as Prioridade | 'all')}>
              <SelectTrigger className="w-40 h-8 text-xs">
                <Filter className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="urgente">Urgente</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>
            <ProjetoFormDialog />
          </div>
        </div>

        <KanbanBoard projetos={filteredProjetos} />
      </div>
    </PageTransition>
  )
}
