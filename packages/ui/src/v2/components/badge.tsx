import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  [
    'inline-flex items-center gap-1 rounded-full font-semibold tracking-wide',
    'whitespace-nowrap',
  ].join(' '),
  {
    variants: {
      variant: {
        neutral: 'bg-subtle text-fg-secondary border border-subtle',
        brand: 'bg-primary-50 text-primary-700 border border-primary-100',
        success: 'bg-success-50 text-success-700',
        warning: 'bg-warning-50 text-warning-700',
        danger: 'bg-danger-50 text-danger-700',
        outline: 'border bg-transparent text-fg-secondary',
      },
      size: {
        sm: 'px-2 py-0.5 text-[12px] leading-[1.35]',
        md: 'px-2.5 py-0.5 text-footnote',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Optional leading element (icon, dot). */
  leading?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, leading, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {leading && (
        <span className="inline-flex shrink-0" aria-hidden="true">
          {leading}
        </span>
      )}
      {children}
    </span>
  ),
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
