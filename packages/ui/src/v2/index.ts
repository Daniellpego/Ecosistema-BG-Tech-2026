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

// Tier 2 — Overlays
export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './components/dialog';

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  sheetVariants,
  type SheetContentProps,
} from './components/sheet';

// Tier 2 — Navigation & disclosure
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from './components/tabs';

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './components/accordion';

// Tier 2 — Loading
export { Skeleton, type SkeletonProps } from './components/skeleton';
