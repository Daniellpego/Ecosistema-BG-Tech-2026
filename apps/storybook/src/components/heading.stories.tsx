import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Heading } from '@gradios/ui/v2';
import { Section } from '../lib/preview-helpers';

const meta: Meta<typeof Heading> = {
  title: 'Components/Heading',
  component: Heading,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Componente de heading que separa nível semântico (h1-h6) do tamanho visual (display-2 a headline). Use level pelo SEO/a11y, size pelo design.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Heading>;

const SAMPLE = 'Software para quem opera.';

export const Sizes: Story = {
  render: () => (
    <Section title="Sizes (sem mudar level)">
      <div className="space-y-6">
        <Heading level={1} size="display-2">{SAMPLE}</Heading>
        <Heading level={1} size="display-1">{SAMPLE}</Heading>
        <Heading level={1} size="title-1">{SAMPLE}</Heading>
        <Heading level={2} size="title-2">{SAMPLE}</Heading>
        <Heading level={3} size="title-3">{SAMPLE}</Heading>
        <Heading level={4} size="headline">{SAMPLE}</Heading>
      </div>
    </Section>
  ),
};

export const Tones: Story = {
  render: () => (
    <Section title="Tones">
      <div className="space-y-4">
        <Heading level={2} size="title-2" tone="primary">primary</Heading>
        <Heading level={2} size="title-2" tone="secondary">secondary</Heading>
        <Heading level={2} size="title-2" tone="tertiary">tertiary</Heading>
        <Heading level={2} size="title-2" tone="brand">brand</Heading>
        <div className="bg-inverse rounded-lg p-6">
          <Heading level={2} size="title-2" tone="on-inverse">on-inverse (sobre bg.inverse)</Heading>
        </div>
      </div>
    </Section>
  ),
};

export const SemanticVsVisual: Story = {
  name: 'Semantic level vs visual size',
  render: () => (
    <Section
      title="Separação SEO/a11y vs visual"
      description="Use level pelo nível hierárquico (SEO, screen readers). Use size pelo impacto visual. Eles não precisam coincidir."
    >
      <div className="space-y-4">
        <Heading level={1} size="display-2">H1 grande no hero</Heading>
        <Heading level={1} size="title-1">H1 menor (página interna)</Heading>
        <Heading level={2} size="title-1">H2 do mesmo tamanho que o H1 acima</Heading>
        <Heading level={3} size="headline">H3 de subseção</Heading>
      </div>
    </Section>
  ),
};
