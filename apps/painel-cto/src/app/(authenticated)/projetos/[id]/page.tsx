'use client'

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, DollarSign, User, Tag } from 'lucide-react'
import { PageTransition } from '@/components/motion'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { StatusBadge, PrioridadeBadge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { TaskBoard } from '@/components/projeto/task-board'
import { MilestoneList } from '@/components/projeto/milestone-list'
import { UpdateFeed } from '@/components/projeto/update-feed'
import { useProjeto } from '@/hooks/use-projetos'
import { getProjetoTitulo, getProjetoEntrega } from '@/types/database'
import { formatCurrency, formatDate } from '@/lib/format'

export default function ProjetoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: projeto, isLoading } = useProjeto(id)

  if (isLoading || !projeto) {
    return (
      <PageTransition>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Link href="/kanban" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-brand-cyan transition-colors mb-3">
            <ArrowLeft className="h-4 w-4" /> Voltar ao Kanban
          </Link>

          <div className="card-glass">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-3 w-3 rounded-full shrink-0" style={{ background: projeto.cor ?? '#00C8F0' }} />
                  <h1 className="text-xl font-bold text-text-primary truncate">{getProjetoTitulo(projeto)}</h1>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <StatusBadge status={projeto.status} />
                  <PrioridadeBadge prioridade={projeto.prioridade} />
                  {projeto.categoria && (
                    <span className="badge-muted flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {projeto.categoria.replace('_', ' ')}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
                  {projeto.cliente && (
                    <span className="flex items-center gap-1"><User className="h-3 w-3" />{projeto.cliente}</span>
                  )}
                  {projeto.valor && (
                    <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{formatCurrency(projeto.valor)}</span>
                  )}
                  {getProjetoEntrega(projeto) && (
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(getProjetoEntrega(projeto)!)}</span>
                  )}
                </div>
              </div>

              <div className="w-full sm:w-40">
                <p className="text-xs text-text-muted mb-1">Progresso</p>
                <Progress value={projeto.progresso} showLabel />
              </div>
            </div>

            {projeto.descricao && (
              <p className="text-sm text-text-secondary mt-4 border-t border-brand-blue-deep/20 pt-4">
                {projeto.descricao}
              </p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tarefas">
          <TabsList>
            <TabsTrigger value="tarefas">Tarefas</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="tarefas">
            <TaskBoard projetoId={id} />
          </TabsContent>

          <TabsContent value="milestones">
            <MilestoneList projetoId={id} />
          </TabsContent>

          <TabsContent value="updates">
            <UpdateFeed projetoId={id} />
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
