import React from 'react'
import { AlertCircle, RefreshCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@gradios/ui'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'Erro ao carregar dados',
  description = 'Não foi possível carregar as informações. Por favor, tente novamente.',
  onRetry,
  className
}: ErrorStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center animate-in zoom-in-95 duration-500",
      className
    )}>
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4 border border-red-100 shadow-sm">
        <AlertCircle className="w-6 h-6 text-status-negative" />
      </div>
      <h3 className="text-sm font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-xs text-text-muted max-w-[220px] mb-6 leading-relaxed">
        {description}
      </p>
      {onRetry && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry}
          className="gap-2 text-xs font-semibold h-9 px-4 hover:bg-slate-50"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
