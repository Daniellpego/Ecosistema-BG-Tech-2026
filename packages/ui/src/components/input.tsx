'use client';

import * as React from 'react';

import { cn } from '../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Visual error state. Sets aria-invalid and red ring. */
  error?: boolean;
  /** Show subtle loading indicator inside the input (right side). */
  loading?: boolean;
  /** Adornment rendered before the input value (e.g. currency symbol). */
  leftAddon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, loading, leftAddon, disabled, ...props }, ref) => {
    const baseInput = (
      <input
        ref={ref}
        type={type ?? 'text'}
        disabled={disabled}
        aria-invalid={error || undefined}
        aria-busy={loading || undefined}
        className={cn(
          'flex w-full rounded-md border bg-surface text-foreground shadow-sm',
          'h-11 min-h-[44px] px-3 py-2 text-base md:text-sm',
          'placeholder:text-muted',
          'transition-colors duration-fast',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-hover',
          'touch-manipulation',
          error
            ? 'border-danger focus-visible:ring-danger'
            : 'border-border-default',
          leftAddon && 'rounded-l-none border-l-0',
          loading && 'pr-10',
          className,
        )}
        {...props}
      />
    );

    if (!leftAddon) return baseInput;

    return (
      <div className="flex w-full">
        <span
          className={cn(
            'inline-flex items-center justify-center px-3 rounded-l-md border border-r-0',
            'bg-surface-hover text-muted-foreground text-sm',
            error ? 'border-danger' : 'border-border-default',
          )}
          aria-hidden="true"
        >
          {leftAddon}
        </span>
        {baseInput}
      </div>
    );
  },
);
Input.displayName = 'Input';

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }
>(({ className, error, ...props }, ref) => (
  <textarea
    ref={ref}
    aria-invalid={error || undefined}
    className={cn(
      'flex w-full min-h-[88px] rounded-md border bg-surface text-foreground shadow-sm',
      'px-3 py-2 text-base md:text-sm placeholder:text-muted',
      'transition-colors duration-fast',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-hover',
      error ? 'border-danger focus-visible:ring-danger' : 'border-border-default',
      className,
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export { Input, Textarea };
