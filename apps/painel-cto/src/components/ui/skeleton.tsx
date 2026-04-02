import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-brand-blue-deep/30', className)}
      {...props}
    />
  )
}

export { Skeleton }
