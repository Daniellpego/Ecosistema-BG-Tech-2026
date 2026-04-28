import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button } from '@gradios/ui/v2';
import { ArrowRight, Download, Plus } from 'lucide-react';
import { Section } from '../lib/preview-helpers';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Primário = preto sólido (#1D1D1F). Secundário = outline com border-strong. Ghost = transparente. Link = texto brand sublinhado no hover. Sem gradientes em CTAs.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'link'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    block: { control: 'boolean' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { children: 'Falar com a gente' },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <Section title="Variants">
      <div className="flex flex-wrap gap-3">
        <Button variant="primary">Primário</Button>
        <Button variant="secondary">Secundário</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </Section>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Section title="Sizes">
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm">Small (36px)</Button>
        <Button size="md">Medium (44px, default)</Button>
        <Button size="lg">Large (48px)</Button>
        <Button size="xl">Extra (52px) — hero only</Button>
      </div>
    </Section>
  ),
};

export const States: Story = {
  render: () => (
    <Section title="States">
      <div className="flex flex-wrap gap-3">
        <Button>Default</Button>
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
      </div>
    </Section>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Section title="With icons">
      <div className="flex flex-wrap gap-3">
        <Button leftIcon={<Plus className="h-4 w-4" />}>Adicionar</Button>
        <Button rightIcon={<ArrowRight className="h-4 w-4" />}>Continuar</Button>
        <Button variant="secondary" leftIcon={<Download className="h-4 w-4" />}>
          Baixar PDF
        </Button>
      </div>
    </Section>
  ),
};

export const Block: Story = {
  render: () => (
    <Section title="Block (full-width)">
      <div className="max-w-md flex flex-col gap-3">
        <Button block>Falar com a gente</Button>
        <Button variant="secondary" block>Ver casos reais</Button>
      </div>
    </Section>
  ),
};

export const AsChild: Story = {
  name: 'asChild (link estilizado)',
  render: () => (
    <Section title="asChild">
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <a href="#">Visitar página</a>
        </Button>
        <Button variant="secondary" asChild>
          <a href="#">Saber mais</a>
        </Button>
      </div>
    </Section>
  ),
};
