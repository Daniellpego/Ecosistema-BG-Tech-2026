'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { cn } from '@/lib/utils'
import { KanbanCard } from './kanban-card'
import type { Projeto, ProjetoStatus } from '@/types/database'

interface KanbanColumnProps {
  id: ProjetoStatus
  label: string
  color: string
  bgColor: string
  projetos: Projeto[]
}

export function KanbanColumn({ id, label, color, bgColor, projetos }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={cn('kanban-column flex-1 transition-colors', isOver && 'ring-2 ring-brand-cyan/30')}
      style={{ background: isOver ? 'rgba(0, 200, 240, 0.04)' : undefined }}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
          <h3 className="text-sm font-semibold text-text-primary">{label}</h3>
        </div>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-md"
          style={{ color, background: bgColor }}
        >
          {projetos.length}
        </span>
      </div>

      <SortableContext items={projetos.map((p) => p.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 min-h-[100px]">
          {projetos.map((projeto) => (
            <KanbanCard key={projeto.id} projeto={projeto} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}
