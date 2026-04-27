/**
 * @gradios/ui/v2 — componentes da identidade visual v2 (Apple-style light).
 *
 * Consumido por apps/site. Painéis CFO/CRM/CTO continuam usando
 * @gradios/ui (legacy) sem mudanças.
 *
 * Pré-requisito do consumidor:
 * - Tailwind config com preset @gradios/design-tokens/preset
 * - CSS vars do design-tokens injetadas em :root (cssVarsLight())
 * - Inter (e Inter Display, opcional) carregadas via next/font
 */

// Layout foundation
export { Container, type ContainerProps } from './components/container';
export { Section, type SectionProps } from './components/section';

// Typography foundation
export { Heading, headingVariants, type HeadingProps } from './components/heading';
export { Text, textVariants, type TextProps } from './components/text';

// Interactive
export { Button, buttonVariants, type ButtonProps } from './components/button';
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
  type CardProps,
} from './components/card';
export { Input, inputVariants, type InputProps } from './components/input';
export { Textarea, type TextareaProps } from './components/textarea';
export { Badge, badgeVariants, type BadgeProps } from './components/badge';
