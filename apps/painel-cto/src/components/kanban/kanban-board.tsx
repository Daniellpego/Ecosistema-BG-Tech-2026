'use client'

import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { KANBAN_COLUMNS } from '@/lib/kanban-config'
import { KanbanColumn } from './kanban-column'
import { KanbanCard } from './kanban-card'
import { useUpdateProjeto } from '@/hooks/use-projetos'
import type { Projeto, ProjetoStatus } from '@/types/database'

interface KanbanBoardProps {
  projetos: Projeto[]
}

export function KanbanBoard({ projetos }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const updateProjeto = useUpdateProjeto()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const activeProjeto = activeId ? projetos.find((p) => p.id === activeId) : null

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event
    if (!over) return

    const projetoId = active.id as string
    const targetColumn = over.id as ProjetoStatus

    const validStatuses: ProjetoStatus[] = ['backlog', 'em_andamento', 'revisao', 'entregue']
    if (!validStatuses.includes(targetColumn)) return

    const projeto = projetos.find((p) => p.id === projetoId)
    if (!projeto || projeto.status === targetColumn) return

    updateProjeto.mutate({ id: projetoId, status: targetColumn })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            {...col}
            projetos={projetos.filter((p) => col.id === 'revisao' ? (p.status === 'revisao' || p.status === 'em_revisao') : p.status === col.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeProjeto && <KanbanCard projeto={activeProjeto} overlay />}
      </DragOverlay>
    </DndContext>
  )
}
