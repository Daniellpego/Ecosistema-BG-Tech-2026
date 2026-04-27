'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none',
  {
    variants: {
      tone: {
        default: 'text-foreground',
        muted: 'text-muted-foreground',
        danger: 'text-danger',
      },
    },
    defaultVariants: { tone: 'default' },
  },
);

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  /** Show a red asterisk to indicate required field. */
  required?: boolean;
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, tone, required, children, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ tone }), className)}
    {...props}
  >
    {children}
    {required && (
      <span className="ml-1 text-danger" aria-hidden="true">
        *
      </span>
    )}
  </LabelPrimitive.Root>
));
Label.displayName = 'Label';

const FieldError = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) =>
  children ? (
    <p
      ref={ref}
      role="alert"
      className={cn('text-xs text-danger mt-1', className)}
      {...props}
    >
      {children}
    </p>
  ) : null,
);
FieldError.displayName = 'FieldError';

export { Label, FieldError, labelVariants };
