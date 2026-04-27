import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const textVariants = cva('', {
  variants: {
    size: {
      'body-lg': 'text-body-lg',
      body: 'text-body',
      callout: 'text-callout',
      footnote: 'text-footnote',
      caption: 'text-caption',
    },
    tone: {
      primary: 'text-fg-primary',
      secondary: 'text-fg-secondary',
      tertiary: 'text-fg-tertiary',
      'on-inverse': 'text-fg-on-inverse',
      brand: 'text-fg-brand',
      danger: 'text-fg-danger',
    },
    weight: {
      regular: 'font-normal',
      semibold: 'font-semibold',
    },
  },
  defaultVariants: {
    size: 'body',
    tone: 'primary',
    weight: 'regular',
  },
});

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof textVariants> {
  /** Renderiza como p (default), span, div, em, strong. */
  as?: 'p' | 'span' | 'div' | 'em' | 'strong' | 'small';
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ as = 'p', size, tone, weight, className, ...props }, ref) => {
    const Tag = as as React.ElementType;
    return (
      <Tag
        ref={ref}
        className={cn(textVariants({ size, tone, weight }), className)}
        {...props}
      />
    );
  },
);
Text.displayName = 'Text';

export { Text, textVariants };
