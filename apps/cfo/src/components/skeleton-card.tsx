import { Skeleton } from '@gradios/ui'

export function SkeletonCard() {
  return (
    <div className="card-glass space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  )
}
