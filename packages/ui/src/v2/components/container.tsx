import * as React from 'react';
import { cn } from '../../lib/utils';

type ContainerWidth = 'narrow' | 'default' | 'hero';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** narrow=768px | default=1200px | hero=1440px */
  width?: ContainerWidth;
  /** Render as a different element (e.g. main, article). */
  as?: keyof React.JSX.IntrinsicElements;
}

const widthMap: Record<ContainerWidth, string> = {
  narrow: 'max-w-container-narrow',
  default: 'max-w-container-default',
  hero: 'max-w-container-hero',
};

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ width = 'default', as = 'div', className, ...props }, ref) => {
    const Tag = as as React.ElementType;
    return (
      <Tag
        ref={ref}
        className={cn(
          'mx-auto w-full px-gutter-mobile sm:px-gutter-tablet lg:px-gutter-desktop',
          widthMap[width],
          className,
        )}
        {...props}
      />
    );
  },
);
Container.displayName = 'Container';

export { Container };
