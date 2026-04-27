import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Text } from '@gradios/ui/v2';
import { Section } from '../lib/preview-helpers';

const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Componente para texto não-heading. Sizes mapeiam para tokens de tipografia (body-lg a caption). Use as para escolher o elemento HTML.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

const PARAGRAPH =
  'Operações que rodavam em planilhas viraram sistemas. Decisões que dependiam de tribal knowledge viraram processo.';

export const Sizes: Story = {
  render: () => (
    <Section title="Sizes">
      <div className="space-y-3 max-w-2xl">
        <Text size="body-lg">{PARAGRAPH}</Text>
        <Text size="body">{PARAGRAPH}</Text>
        <Text size="callout">{PARAGRAPH}</Text>
        <Text size="footnote">{PARAGRAPH}</Text>
        <Text size="caption">METADATA / TAG / RÓTULO</Text>
      </div>
    </Section>
  ),
};

export const Tones: Story = {
  render: () => (
    <Section title="Tones">
      <div className="space-y-2 max-w-xl">
        <Text tone="primary">primary — texto principal</Text>
        <Text tone="secondary">secondary — labels, subtítulos</Text>
        <Text tone="tertiary">tertiary — muted, helper</Text>
        <Text tone="brand">brand — link/destaque</Text>
        <Text tone="danger">danger — erros, validação</Text>
        <div className="bg-inverse rounded-lg p-4">
          <Text tone="on-inverse">on-inverse — sobre bg.inverse</Text>
        </div>
      </div>
    </Section>
  ),
};

export const Weights: Story = {
  render: () => (
    <Section title="Weights">
      <div className="space-y-2">
        <Text weight="regular">regular (400) — body padrão</Text>
        <Text weight="semibold">semibold (600) — ênfase</Text>
      </div>
    </Section>
  ),
};

export const InlineUsage: Story = {
  name: 'Uso inline (as=span/strong/em)',
  render: () => (
    <Section title="Composição inline">
      <Text>
        Você pode misturar pesos e tons no mesmo parágrafo:{' '}
        <Text as="strong" weight="semibold">
          aqui semibold
        </Text>
        ,{' '}
        <Text as="em" tone="tertiary">
          aqui tertiary itálico
        </Text>
        , e o resto continua tone primary.
      </Text>
    </Section>
  ),
};
