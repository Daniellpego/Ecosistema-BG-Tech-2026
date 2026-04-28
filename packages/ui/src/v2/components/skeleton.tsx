import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** circle = avatar/icon. text = single line. rect = default block. */
  shape?: 'rect' | 'circle' | 'text';
}

const shapeMap = {
  rect: 'rounded-md',
  circle: 'rounded-full aspect-square',
  text: 'rounded-sm h-4',
} as const;

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, shape = 'rect', ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      aria-label="Carregando"
      aria-live="polite"
      className={cn(
        'bg-muted animate-shimmer-slow',
        shapeMap[shape],
        className,
      )}
      {...props}
    />
  ),
);
Skeleton.displayName = 'Skeleton';

export { Skeleton };
