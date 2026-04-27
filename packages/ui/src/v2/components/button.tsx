'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-semibold select-none touch-manipulation',
    'transition-[background-color,color,border-color,box-shadow,opacity] duration-fast ease-standard',
    'focus-visible:outline-none focus-visible:shadow-focus',
    'disabled:pointer-events-none disabled:opacity-50',
    'data-[loading=true]:cursor-wait',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'bg-fg-primary text-fg-on-inverse',
          'hover:bg-neutral-800 active:bg-neutral-700',
        ].join(' '),
        secondary: [
          'border-2 border-neutral-200 bg-base text-fg-primary',
          'hover:border-neutral-300 hover:bg-subtle active:bg-muted',
        ].join(' '),
        ghost: [
          'bg-transparent text-fg-primary',
          'hover:bg-subtle active:bg-muted',
        ].join(' '),
        link: [
          'bg-transparent text-fg-brand underline-offset-4',
          'hover:underline focus-visible:shadow-none',
        ].join(' '),
      },
      size: {
        sm: 'h-9 px-4 text-callout rounded-[10px]',
        md: 'h-11 px-5 text-callout rounded-[10px]',
        lg: 'h-12 px-6 text-body rounded-[10px]',
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
