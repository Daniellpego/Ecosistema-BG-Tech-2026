'use client'

import Link from 'next/link'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Calendar, CheckCircle2, ListTodo } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PrioridadeBadge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatDate, daysUntil } from '@/lib/format'
import { getProjetoTitulo, getProjetoEntrega, type Projeto } from '@/types/database'

interface KanbanCardProps {
  projeto: Projeto
  overlay?: boolean
}

export function KanbanCard({ projeto, overlay }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: projeto.id,
    data: { type: 'projeto', projeto },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const entrega = getProjetoEntrega(projeto)
  const days = entrega ? daysUntil(entrega) : null
  const isLate = days !== null && days < 0

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn('kanban-card relative', isDragging && 'dragging', overlay && 'shadow-2xl rotate-2 scale-105')}
    >
      {/* Priority bar */}
      <div
        className="priority-bar"
        style={{ background: projeto.cor ?? '#00C8F0' }}
      />

      <div className="pl-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/projetos/${projeto.id}`} className="text-sm font-semibold text-text-primary hover:text-brand-cyan transition-colors line-clamp-2" onClick={(e) => e.stopPropagation()}>
            {getProjetoTitulo(projeto)}
          </Link>
          <PrioridadeBadge prioridade={projeto.prioridade} />
        </div>

        {projeto.cliente && (
          <p className="text-xs text-text-muted mb-2">{projeto.cliente}</p>
        )}

        <Progress value={projeto.progresso} showLabel className="mb-2" />

        <div className="flex items-center justify-between text-xs">
          {entrega && (
            <div className={cn('flex items-center gap-1', isLate ? 'text-status-negative' : 'text-text-muted')}>
              <Calendar className="h-3 w-3" />
              {formatDate(entrega)}
            </div>
          )}
          <div className="flex items-center gap-1 text-text-muted">
            <ListTodo className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  )
}
