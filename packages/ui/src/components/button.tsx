'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '../lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-medium select-none touch-manipulation',
    'transition-[background,color,border,box-shadow] duration-fast ease-out-expo',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'data-[loading=true]:cursor-wait',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'bg-accent text-white shadow-sm',
          'hover:bg-accent/90 active:bg-accent/95',
        ].join(' '),
        secondary: [
          'bg-brand-primary text-white shadow-sm',
          'hover:bg-brand-secondary active:bg-brand-deep',
        ].join(' '),
        outline: [
          'border border-border-default bg-transparent text-foreground',
          'hover:bg-surface-hover active:bg-surface-input',
        ].join(' '),
        ghost: [
          'bg-transparent text-foreground',
          'hover:bg-surface-hover active:bg-surface-input',
        ].join(' '),
        danger: [
          'bg-danger text-white shadow-sm',
          'hover:bg-danger/90 active:bg-danger/95',
        ].join(' '),
        link: [
          'bg-transparent text-brand-primary underline-offset-4 shadow-none',
          'hover:underline focus-visible:ring-offset-0',
        ].join(' '),
        // ─── Aliases legados (compat com apps shadcn-style) ──────────────
        default: [
          'bg-accent text-white shadow-sm',
          'hover:bg-accent/90 active:bg-accent/95',
        ].join(' '),
        destructive: [
          'bg-danger text-white shadow-sm',
          'hover:bg-danger/90 active:bg-danger/95',
        ].join(' '),
      },
      size: {
        sm: 'h-9 min-h-[36px] px-3 text-sm rounded-md',
        md: 'h-11 min-h-[44px] px-4 text-sm rounded-md',
        lg: 'h-12 min-h-[48px] px-6 text-base rounded-lg',
        icon: 'h-11 w-11 min-h-[44px] min-w-[44px] rounded-md',
        // Alias para apps shadcn-style (size="default" = md).
        default: 'h-11 min-h-[44px] px-4 text-sm rounded-md',
      },
      block: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      block: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as a child component (Radix Slot pattern). */
  asChild?: boolean;
  /** Show spinner and disable interaction. */
  loading?: boolean;
  /** Icon rendered before children. Hidden when loading. */
  leftIcon?: React.ReactNode;
  /** Icon rendered after children. */
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      block,
      asChild = false,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      type,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || loading;

    // When asChild, Radix Slot requires a single React child. Skip the
    // leading/trailing icon affordances and let the consumer compose them
    // inside the slotted element (e.g. <a><Icon/>Label</a>).
    const content = asChild ? (
      children
    ) : (
      <>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : leftIcon ? (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        ) : null}
        {children}
        {!loading && rightIcon ? (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        ) : null}
      </>
    );

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : (type ?? 'button')}
        data-loading={loading || undefined}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        disabled={asChild ? undefined : isDisabled}
        className={cn(buttonVariants({ variant, size, block }), className)}
        {...props}
      >
        {content}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
