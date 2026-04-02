'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Milestone, ListTodo, Calendar as CalIcon } from 'lucide-react'
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useAllMilestones } from '@/hooks/use-milestones'

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
const MONTHS = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

interface CalendarEvent {
  id: string
  title: string
  date: string
  type: 'milestone' | 'tarefa' | 'gcal'
  color: string
  project?: string
}

export default function CalendarioPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const start = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const lastDay = new Date(year, month + 1, 0).getDate()
  const end = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

  const { data: milestones, isLoading } = useAllMilestones({ start, end })

  const events: CalendarEvent[] = useMemo(() => {
    return (milestones ?? []).map((m) => ({
      id: m.id,
      title: m.titulo,
      date: m.data_prevista,
      type: 'milestone' as const,
      color: (m as unknown as { projetos?: { cor?: string } }).projetos?.cor ?? '#00C8F0',
      project: (m as unknown as { projetos?: { titulo?: string } }).projetos?.titulo,
    }))
  }, [milestones])

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay()
    const days: { date: number; month: number; isCurrentMonth: boolean }[] = []

    // Previous month padding
    const prevLastDay = new Date(year, month, 0).getDate()
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: prevLastDay - i, month: month - 1, isCurrentMonth: false })
    }

    // Current month
    for (let d = 1; d <= lastDay; d++) {
      days.push({ date: d, month, isCurrentMonth: true })
    }

    // Next month padding
    const remaining = 42 - days.length
    for (let d = 1; d <= remaining; d++) {
      days.push({ date: d, month: month + 1, isCurrentMonth: false })
    }

    return days
  }, [year, month, lastDay])

  const today = new Date()
  const isToday = (date: number, m: number) => date === today.getDate() && m === today.getMonth() && year === today.getFullYear()

  function getEventsForDay(date: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
    return events.filter((e) => e.date === dateStr)
  }

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  if (isLoading) {
    return <PageTransition><Skeleton className="h-8 w-48 mb-4" /><Skeleton className="h-[600px] w-full" /></PageTransition>
  }

  return (
    <PageTransition>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-text-primary">Calendario</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
            <span className="text-sm font-semibold text-text-primary min-w-[140px] text-center">
              {MONTHS[month]} {year}
            </span>
            <Button variant="ghost" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>

        <div className="card-glass !p-0 overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-brand-blue-deep/20">
            {WEEKDAYS.map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-text-muted py-3">
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, i) => {
              const dayEvents = day.isCurrentMonth ? getEventsForDay(day.date) : []
              return (
                <div
                  key={i}
                  className={cn(
                    'min-h-[100px] border-b border-r border-brand-blue-deep/15 p-1.5',
                    !day.isCurrentMonth && 'bg-bg-navy/50',
                    isToday(day.date, day.month) && 'bg-brand-cyan/5'
                  )}
                >
                  <span className={cn(
                    'text-xs font-medium inline-flex h-6 w-6 items-center justify-center rounded-full',
                    !day.isCurrentMonth && 'text-text-muted/40',
                    day.isCurrentMonth && 'text-text-secondary',
                    isToday(day.date, day.month) && 'bg-brand-cyan text-bg-navy font-bold'
                  )}>
                    {day.date}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayEvents.slice(0, 3).map((evt) => (
                      <div
                        key={evt.id}
                        className="text-[10px] px-1.5 py-0.5 rounded truncate font-medium"
                        style={{ background: `${evt.color}20`, color: evt.color }}
                        title={`${evt.title} - ${evt.project ?? ''}`}
                      >
                        {evt.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-[10px] text-text-muted px-1.5">+{dayEvents.length - 3}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Milestone className="h-3.5 w-3.5 text-brand-cyan" />
            <span className="text-xs text-text-muted">Milestones</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ListTodo className="h-3.5 w-3.5 text-status-warning" />
            <span className="text-xs text-text-muted">Tarefas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalIcon className="h-3.5 w-3.5 text-text-muted" />
            <span className="text-xs text-text-muted">Google Calendar</span>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
