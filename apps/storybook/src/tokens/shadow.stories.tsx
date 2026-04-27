import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { shadow } from '@gradios/design-tokens';
import { Section, Mono } from '../lib/preview-helpers';

const meta: Meta = {
  title: 'Tokens/Shadow',
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'subtle' },
    docs: {
      description: {
        component:
          'Sombras Apple-sutil. Quase imperceptíveis em comparação ao padrão Tailwind. Use xs/sm para hover states, md para cards default, lg/xl para elementos elevados (modal, popover).',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

const ShadowCard: React.FC<{ name: string; value: string }> = ({ name, value }) => (
  <div className="flex flex-col items-center gap-3">
    <div
      className="h-32 w-full max-w-xs bg-surface rounded-lg flex items-center justify-center"
      style={{ boxShadow: value }}
    >
      <span className="text-headline text-fg-primary">{name}</span>
    </div>
    <Mono>{value === 'none' ? 'none' : 'shadow-' + name}</Mono>
  </div>
);

export const Default: Story = {
  render: () => (
    <Section title="Escala">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const).map((k) => (
          <ShadowCard key={k} name={k} value={shadow[k]} />
        ))}
      </div>
    </Section>
  ),
};

export const Focus: Story = {
  name: 'Focus rings',
  render: () => (
    <Section
      title="Focus rings"
      description="Rings de foco visível para inputs, botões e elementos interativos. Sempre 4px de espessura, baseados nas cores brand."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center gap-3">
          <input
            type="text"
            className="px-4 py-3 border rounded-md bg-surface text-callout w-full max-w-xs"
            style={{ boxShadow: shadow.focus }}
            defaultValue="Input com focus ring"
            readOnly
          />
          <Mono>shadow.focus — primary 15%</Mono>
        </div>
        <div className="flex flex-col items-center gap-3">
          <input
            type="text"
            className="px-4 py-3 border rounded-md bg-surface text-callout w-full max-w-xs"
            style={{ boxShadow: shadow.focusAccent }}
            defaultValue="Input com focus accent"
            readOnly
          />
          <Mono>shadow.focusAccent — secondary 20%</Mono>
        </div>
      </div>
    </Section>
  ),
};

export const Comparison: Story = {
  name: 'Comparison: Apple-sutil vs Tailwind default',
  render: () => (
    <Section
      title="Comparativo"
      description="Sombras do design system são intencionalmente mais sutis que os defaults do Tailwind. Use o padrão do design system."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="text-callout font-semibold text-fg-secondary mb-3">
            Design system (Apple-sutil)
          </div>
          <div className="space-y-4">
            {(['sm', 'md', 'lg'] as const).map((k) => (
              <div
                key={k}
                className="bg-surface rounded-lg p-4 text-callout"
                style={{ boxShadow: shadow[k] }}
              >
                shadow.{k} — {shadow[k]}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-callout font-semibold text-fg-secondary mb-3">
            Tailwind default (referência)
          </div>
          <div className="space-y-4">
            <div className="bg-surface rounded-lg p-4 text-callout shadow-sm">tailwind shadow-sm</div>
            <div className="bg-surface rounded-lg p-4 text-callout shadow-md">tailwind shadow-md</div>
            <div className="bg-surface rounded-lg p-4 text-callout shadow-lg">tailwind shadow-lg</div>
          </div>
        </div>
      </div>
    </Section>
  ),
};
