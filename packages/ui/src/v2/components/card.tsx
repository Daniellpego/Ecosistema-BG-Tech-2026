import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const cardVariants = cva('rounded-xl', {
  variants: {
    background: {
      base: 'bg-base',
      surface: 'bg-surface',
      subtle: 'bg-subtle',
    },
    border: {
      true: 'border',
      false: '',
    },
    elevation: {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
    },
    padding: {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
    interactive: {
      true: 'transition-[box-shadow,border-color,transform] duration-fast ease-standard hover:shadow-md focus-within:shadow-focus focus-within:outline-none',
      false: '',
    },
  },
  defaultVariants: {
    background: 'surface',
    border: true,
    elevation: 'none',
    padding: 'md',
    interactive: false,
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  as?: 'div' | 'article' | 'section' | 'li';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      as = 'div',
      background,
      border,
      elevation,
      padding,
      interactive,
      className,
      ...props
    },
    ref,
  ) => {
    const Tag = as as React.ElementType;
    return (
      <Tag
        ref={ref}
        className={cn(
          cardVariants({ background, border, elevation, padding, interactive }),
          className,
        )}
        {...props}
      />
    );
  },
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col gap-1.5 mb-4', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { as?: 'h2' | 'h3' | 'h4' }
>(({ className, as = 'h3', ...props }, ref) => {
  const Tag = as as React.ElementType;
  return (
    <Tag
      ref={ref}
      className={cn('text-headline text-fg-primary', className)}
      {...props}
    />
  );
});
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-callout text-fg-secondary', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-body text-fg-secondary', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-3 mt-6', className)}
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
