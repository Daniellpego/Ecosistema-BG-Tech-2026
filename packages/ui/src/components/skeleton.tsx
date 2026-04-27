'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';

const skeletonVariants = cva('animate-pulse bg-surface-hover', {
  variants: {
    variant: {
      text: 'rounded-md h-4',
      heading: 'rounded-md h-6',
      circular: 'rounded-full',
      rectangular: 'rounded-md',
      card: 'rounded-card',
    },
    tone: {
      light: 'bg-surface-hover',
      dark: 'bg-surface-dark-card',
    },
  },
  defaultVariants: {
    variant: 'rectangular',
    tone: 'light',
  },
});

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  /** Number of lines to render (only meaningful for variant="text"). */
  lines?: number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, tone, lines, style, ...props }, ref) => {
    if (variant === 'text' && lines && lines > 1) {
      return (
        <div ref={ref} className="space-y-2" aria-busy="true" aria-live="polite">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                skeletonVariants({ variant, tone }),
                i === lines - 1 && 'w-4/5',
                className,
              )}
              style={style}
              {...(i === 0 ? props : {})}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        aria-busy="true"
        aria-live="polite"
        className={cn(skeletonVariants({ variant, tone }), className)}
        style={style}
        {...props}
      />
    );
  },
);
Skeleton.displayName = 'Skeleton';

export { Skeleton, skeletonVariants };
