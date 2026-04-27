import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const headingVariants = cva('font-display', {
  variants: {
    size: {
      'display-2': 'text-display-2',
      'display-1': 'text-display-1',
      'title-1': 'text-title-1',
      'title-2': 'text-title-2',
      'title-3': 'text-title-3',
      headline: 'text-headline',
    },
    tone: {
      primary: 'text-fg-primary',
      secondary: 'text-fg-secondary',
      tertiary: 'text-fg-tertiary',
      'on-inverse': 'text-fg-on-inverse',
      brand: 'text-fg-brand',
    },
  },
  defaultVariants: {
    size: 'title-2',
    tone: 'primary',
  },
});

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'>,
    VariantProps<typeof headingVariants> {
  /** Semantic heading level (renderiza h1..h6). Visual é controlado por size. */
  level: HeadingLevel;
  /** Override do elemento renderizado. Por padrão usa h{level}. */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level, as, size, tone, className, ...props }, ref) => {
    const Tag = (as ?? `h${level}`) as React.ElementType;
    return (
      <Tag
        ref={ref}
        className={cn(headingVariants({ size, tone }), className)}
        {...props}
      />
    );
  },
);
Heading.displayName = 'Heading';

export { Heading, headingVariants };
