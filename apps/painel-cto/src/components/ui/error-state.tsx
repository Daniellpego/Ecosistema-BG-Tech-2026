import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  message: string
  className?: string
}

export function ErrorState({ message, className }: ErrorStateProps) {
  return (
    <div className={cn('card-glass flex flex-col items-center justify-center py-12 text-center', className)}>
      <div className="h-12 w-12 rounded-xl bg-status-negative/10 flex items-center justify-center mb-4">
        <AlertTriangle className="h-6 w-6 text-status-negative" />
      </div>
      <h3 className="text-sm font-semibold text-text-primary mb-1">Algo deu errado</h3>
      <p className="text-sm text-text-muted max-w-sm">{message}</p>
    </div>
  )
}
