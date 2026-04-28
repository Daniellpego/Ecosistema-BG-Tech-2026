import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
  Button,
  Text,
} from '@gradios/ui/v2';
import { Section } from '../lib/preview-helpers';
import { Menu, X } from 'lucide-react';

const meta: Meta<typeof Sheet> = {
  title: 'Components/Sheet',
  component: Sheet,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Drawer baseado em Radix UI Dialog com posicionamento (top/right/bottom/left). Padrão para menu mobile (right ou left), filtros (right) e ações rápidas (bottom).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sheet>;

export const FromRight: Story = {
  name: 'Right (default)',
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Abrir filtros</Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription>
            Refine a lista por categoria, status e período.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1">
          <Text tone="tertiary" size="callout">
            (Conteúdo do filtro vai aqui — checkboxes, ranges, etc.)
          </Text>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="secondary">Cancelar</Button>
          </SheetClose>
          <Button>Aplicar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const FromLeft: Story = {
  name: 'Left (mobile menu)',
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" leftIcon={<Menu className="h-4 w-4" />}>
          Menu
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navegação</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1">
          {['Início', 'Soluções', 'Cases', 'Sobre', 'Contato'].map((item) => (
            <a
              key={item}
              href="#"
              className="block py-3 text-callout text-fg-primary hover:text-fg-brand transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  ),
};

export const FromBottom: Story = {
  name: 'Bottom (ações mobile)',
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Compartilhar</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Compartilhar</SheetTitle>
          <SheetDescription>Envie esta página por algum canal.</SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-3 gap-3 mt-2">
          {['WhatsApp', 'Email', 'Copiar link'].map((opt) => (
            <Button key={opt} variant="secondary" size="sm">
              {opt}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const FromTop: Story = {
  name: 'Top (notification)',
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">Mostrar notificação</Button>
      </SheetTrigger>
      <SheetContent side="top" hideClose>
        <div className="flex items-center justify-between gap-4">
          <div>
            <SheetTitle>Sistema atualizado</SheetTitle>
            <SheetDescription>
              Nova versão disponível. Recarregue para aplicar.
            </SheetDescription>
          </div>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Fechar"
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const A11y: Story = {
  name: 'A11y notes',
  render: () => (
    <Section
      title="Acessibilidade"
      description="Sheet herda comportamento de Radix Dialog: trap focus, return focus, Escape, click outside. SheetTitle e SheetDescription se conectam ao Radix automaticamente via aria-labelledby/describedby."
    >
      <Sheet>
        <SheetTrigger asChild>
          <Button>Testar</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Validação a11y</SheetTitle>
            <SheetDescription>
              Tab navega dentro. Esc fecha. Foco volta ao trigger.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </Section>
  ),
};
