import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, disabled, ...props }, ref) => (
    <textarea
      ref={ref}
      data-invalid={invalid || undefined}
      aria-invalid={invalid || undefined}
      disabled={disabled}
      className={cn(
        'w-full min-h-[120px] rounded-md border bg-base text-body text-fg-primary px-4 py-3 resize-y',
        'placeholder:text-fg-tertiary',
        'transition-[border-color,box-shadow] duration-fast ease-standard',
        'focus-visible:outline-none focus-visible:border-focus focus-visible:shadow-focus',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-subtle',
        'data-[invalid=true]:border-danger',
        'data-[invalid=true]:focus-visible:shadow-[0_0_0_4px_rgba(239,68,68,0.15)]',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';

export { Textarea };
