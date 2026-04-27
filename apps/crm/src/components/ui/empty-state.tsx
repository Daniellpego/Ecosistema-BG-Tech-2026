import React from 'react'
import { Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@gradios/ui' // Assuming this path for Button component

interface EmptyStateProps {
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  icon?: React.ElementType
  className?: string
}

export function EmptyState({
  title,
  description = 'Não encontramos registros para o filtro selecionado.',
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
      <p className="text-sm text-text-secondary max-w-xs mb-6">
        {description}
      </p>

      {action && (
        <Button onClick={action.onClick} variant="outline" className="gap-2">
          {action.label}
        </Button>
      )}
    </div>
  )
}
