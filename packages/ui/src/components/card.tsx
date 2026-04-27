'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';

const cardVariants = cva(
  'rounded-card border bg-surface-card text-foreground transition-shadow duration-fast',
  {
    variants: {
      tone: {
        default: 'border-border-default shadow-card',
        flat: 'border-border-default shadow-none',
        elevated: 'border-border-default shadow-card hover:shadow-card-hover',
        glass: 'border-white/10 bg-white/5 backdrop-blur-xl shadow-none',
        dark: 'border-brand-deep/30 bg-surface-dark-card text-foreground-on-dark shadow-none',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
      },
      interactive: {
        true: 'cursor-pointer hover:shadow-card-hover focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 outline-none',
        false: '',
      },
    },
    defaultVariants: {
      tone: 'default',
      padding: 'none',
      interactive: false,
    },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** Render as a different element (e.g. 'article', 'section'). */
  as?: 'div' | 'article' | 'section' | 'aside';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, tone, padding, interactive, as: Comp = 'div', ...props }, ref) => (
    <Comp
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(cardVariants({ tone, padding, interactive }), className)}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col gap-1.5 p-4 pb-2', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { as?: 'h2' | 'h3' | 'h4' }
>(({ className, as: Tag = 'h3', ...props }, ref) => (
  <Tag
    ref={ref as React.Ref<HTMLHeadingElement>}
    className={cn('text-lg font-semibold leading-tight tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-4 pt-2', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2 p-4 pt-2 border-t border-border-default', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
};
