import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Skeleton, Card } from '@gradios/ui/v2';
import { Section } from '../lib/preview-helpers';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Loading placeholder com shimmer lento (3s ease-standard). Sem distrair o usuário durante o carregamento. Variantes: rect (default), circle (avatar), text (linha única).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Shapes: Story = {
  render: () => (
    <Section title="Shapes">
      <div className="flex items-center gap-6">
        <Skeleton shape="rect" className="h-24 w-32" />
        <Skeleton shape="circle" className="h-12 w-12" />
        <div className="flex-1 max-w-sm flex flex-col gap-2">
          <Skeleton shape="text" className="w-full" />
          <Skeleton shape="text" className="w-3/4" />
          <Skeleton shape="text" className="w-1/2" />
        </div>
      </div>
    </Section>
  ),
};

export const CardLoading: Story = {
  name: 'Card carregando',
  render: () => (
    <Section title="Padrão de Card em loading">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <Card key={i} padding="lg">
            <Skeleton shape="rect" className="h-10 w-10 mb-4" />
            <Skeleton shape="text" className="w-1/3 mb-2" />
            <Skeleton shape="text" className="w-full mb-1.5" />
            <Skeleton shape="text" className="w-5/6 mb-1.5" />
            <Skeleton shape="text" className="w-2/3" />
          </Card>
        ))}
      </div>
    </Section>
  ),
};

export const ListLoading: Story = {
  name: 'Lista carregando',
  render: () => (
    <Section title="Padrão de Lista em loading">
      <div className="max-w-md flex flex-col gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton shape="circle" className="h-10 w-10" />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton shape="text" className="w-1/3" />
              <Skeleton shape="text" className="w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  ),
};

export const A11y: Story = {
  name: 'A11y notes',
  render: () => (
    <Section
      title="Acessibilidade"
      description="Skeleton tem role=status + aria-label='Carregando' + aria-live='polite' por padrão. Screen readers anunciam quando aparece. Para grupos longos de Skeletons, considere envolver em um único container com aria-busy=true e remover role dos Skeletons individuais."
    >
      <Skeleton shape="text" className="w-64" />
    </Section>
  ),
};
