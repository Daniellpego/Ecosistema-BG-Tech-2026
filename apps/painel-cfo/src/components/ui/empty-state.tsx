import React from 'react'
import { Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ElementType
  className?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  title = 'Sem dados disponível',
  description = 'Não encontramos registros para o período selecionado.',
  icon: Icon = Inbox,
  className,
  action
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center animate-in fade-in duration-500",
      className
    )}>
      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
        <Icon className="w-6 h-6 text-slate-400/80" />
      </div>
      <h3 className="text-sm font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-xs text-text-muted max-w-[200px] leading-relaxed mb-6">
        {description}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 rounded-lg text-xs font-bold hover:bg-brand-cyan hover:text-white transition-all duration-300"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
