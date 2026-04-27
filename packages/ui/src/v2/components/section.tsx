import * as React from 'react';
import { cn } from '../../lib/utils';

type SectionSize = 'compact' | 'regular' | 'hero' | 'flagship';
type SectionBackground = 'base' | 'subtle' | 'inverse';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Vertical padding via spacing tokens. compact=64 | regular=96 | hero=128 | flagship=160 */
  size?: SectionSize;
  /** Semantic background. inverse usa fg.onInverse automaticamente. */
  background?: SectionBackground;
}

const sizeMap: Record<SectionSize, string> = {
  compact: 'py-section-compact',
  regular: 'py-section-regular',
  hero: 'py-section-hero',
  flagship: 'py-section-flagship',
};

const backgroundMap: Record<SectionBackground, string> = {
  base: 'bg-base text-fg-primary',
  subtle: 'bg-subtle text-fg-primary',
  inverse: 'bg-inverse text-fg-on-inverse',
};

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ size = 'regular', background = 'base', className, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(sizeMap[size], backgroundMap[background], className)}
      {...props}
    />
  ),
);
Section.displayName = 'Section';

export { Section };
