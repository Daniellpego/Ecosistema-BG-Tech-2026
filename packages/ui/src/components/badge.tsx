'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';

const badgeVariants = cva(
  [
    'inline-flex items-center gap-1 rounded-full border font-medium',
    'transition-colors duration-fast select-none',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'border-transparent bg-brand-primary text-white',
        secondary: 'border-transparent bg-surface-hover text-foreground',
        outline: 'border-border-default bg-transparent text-foreground',
        danger: 'border-transparent bg-danger/10 text-danger',
        warning: 'border-transparent bg-warning/10 text-warning',
        success: 'border-transparent bg-success/10 text-success',
        info: 'border-transparent bg-accent/10 text-accent',
        // Aliases legados (compat com paletas antigas dos apps).
        cyan: 'border-transparent bg-accent/10 text-accent',
        destructive: 'border-transparent bg-danger/10 text-danger',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-[10px]',
        md: 'px-2 py-0.5 text-xs',
        lg: 'px-2.5 py-1 text-sm',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Optional leading icon (e.g. dot, lucide icon). */
  icon?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {icon && (
        <span className="inline-flex shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  ),
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
