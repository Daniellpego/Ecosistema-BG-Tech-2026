import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Badge } from '@gradios/ui/v2';
import { CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { Section } from '../lib/preview-helpers';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Badge minimalista. Variants espelham status colors + brand. Uso mínimo no produto — só quando o estado é informação relevante para o usuário.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Variants: Story = {
  render: () => (
    <Section title="Variants">
      <div className="flex flex-wrap gap-3">
        <Badge variant="neutral">Neutral</Badge>
        <Badge variant="brand">Brand</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="danger">Danger</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    </Section>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Section title="Sizes">
      <div className="flex flex-wrap items-center gap-3">
        <Badge size="sm">Small</Badge>
        <Badge size="md">Medium (default)</Badge>
      </div>
    </Section>
  ),
};

export const WithLeading: Story = {
  render: () => (
    <Section title="With leading icon">
      <div className="flex flex-wrap gap-3">
        <Badge variant="success" leading={<CheckCircle className="h-3 w-3" />}>
          Pago
        </Badge>
        <Badge variant="warning" leading={<AlertTriangle className="h-3 w-3" />}>
          Atrasado
        </Badge>
        <Badge variant="danger" leading={<AlertCircle className="h-3 w-3" />}>
          Inadimplente
        </Badge>
        <Badge variant="brand" leading={<span className="h-1.5 w-1.5 rounded-full bg-primary-500" />}>
          Beta
        </Badge>
      </div>
    </Section>
  ),
};
