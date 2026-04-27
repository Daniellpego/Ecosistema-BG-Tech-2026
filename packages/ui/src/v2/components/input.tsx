import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const inputVariants = cva(
  [
    'w-full rounded-md border bg-base text-fg-primary',
    'placeholder:text-fg-tertiary',
    'transition-[border-color,box-shadow] duration-fast ease-standard',
    'focus-visible:outline-none focus-visible:border-focus focus-visible:shadow-focus',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-subtle',
    'data-[invalid=true]:border-danger',
    'data-[invalid=true]:focus-visible:shadow-[0_0_0_4px_rgba(239,68,68,0.15)]',
  ].join(' '),
  {
    variants: {
      inputSize: {
        sm: 'h-9 px-3 text-callout',
        md: 'h-11 px-4 text-body',
        lg: 'h-12 px-4 text-body-lg',
      },
      hasLeftAddon: { true: 'pl-10', false: '' },
      hasRightAddon: { true: 'pr-10', false: '' },
    },
    defaultVariants: {
      inputSize: 'md',
      hasLeftAddon: false,
      hasRightAddon: false,
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  invalid?: boolean;
  loading?: boolean;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      inputSize,
      invalid,
      loading,
      leftAddon,
      rightAddon,
      disabled,
      ...props
    },
    ref,
  ) => {
    const hasLeftAddon = Boolean(leftAddon);
    const hasRightAddon = Boolean(rightAddon) || Boolean(loading);

    const inputEl = (
      <input
        ref={ref}
        data-invalid={invalid || undefined}
        aria-invalid={invalid || undefined}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
        className={cn(
          inputVariants({ inputSize, hasLeftAddon, hasRightAddon }),
          className,
        )}
        {...props}
      />
    );

    if (!leftAddon && !rightAddon && !loading) {
      return inputEl;
    }

    return (
      <div className="relative w-full">
        {leftAddon && (
          <span
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center text-fg-tertiary"
            aria-hidden="true"
          >
            {leftAddon}
          </span>
        )}
        {inputEl}
        {(rightAddon || loading) && (
          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center text-fg-tertiary"
            aria-hidden="true"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : rightAddon}
          </span>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input, inputVariants };
