import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { radius } from '@gradios/design-tokens';
import { Section, Mono } from '../lib/preview-helpers';

const meta: Meta = {
  title: 'Tokens/Radius',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Border radius do sistema. xs/sm para inputs e badges, md/lg para cards e botões, xl/2xl para superfícies grandes, pill para CTAs circulares.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

const RadiusTile: React.FC<{ name: string; value: string }> = ({ name, value }) => (
  <div className="flex flex-col items-center gap-3">
    <div
      className="h-24 w-24 bg-primary-500"
      style={{ borderRadius: value }}
      aria-hidden
    />
    <div className="text-center">
      <div className="text-callout font-semibold text-fg-primary">{name}</div>
      <Mono>{value}</Mono>
    </div>
  </div>
);

export const Default: Story = {
  render: () => (
    <Section title="Escala completa">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-6">
        {(Object.entries(radius) as [keyof typeof radius, string][]).map(([k, v]) => (
          <RadiusTile key={k} name={k} value={v} />
        ))}
      </div>
    </Section>
  ),
};

export const InContext: Story = {
  name: 'Em contexto',
  render: () => (
    <div className="space-y-6">
      <Section title="Inputs e badges (xs / sm)">
        <div className="flex flex-wrap gap-3">
          <input
            className="px-3 py-2 border bg-surface text-callout"
            style={{ borderRadius: radius.xs }}
            placeholder="xs (4px)"
          />
          <input
            className="px-3 py-2 border bg-surface text-callout"
            style={{ borderRadius: radius.sm }}
            placeholder="sm (6px)"
          />
          <span
            className="px-2 py-1 bg-primary-50 text-fg-brand text-footnote font-semibold inline-flex"
            style={{ borderRadius: radius.xs }}
          >
            badge xs
          </span>
        </div>
      </Section>

      <Section title="Botões (md)">
        <div className="flex flex-wrap gap-3">
          <button
            className="px-5 py-2.5 bg-fg-primary text-fg-on-inverse text-callout font-semibold"
            style={{ borderRadius: radius.md }}
          >
            Primário
          </button>
          <button
            className="px-5 py-2.5 border bg-surface text-fg-primary text-callout font-semibold"
            style={{ borderRadius: radius.md }}
          >
            Secundário
          </button>
        </div>
      </Section>

      <Section title="Cards (lg / xl)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-surface border p-6"
            style={{ borderRadius: radius.lg }}
          >
            <div className="text-headline mb-1">Card lg</div>
            <Mono>borderRadius: 12px</Mono>
          </div>
          <div
            className="bg-surface border p-6"
            style={{ borderRadius: radius.xl }}
          >
            <div className="text-headline mb-1">Card xl</div>
            <Mono>borderRadius: 16px</Mono>
          </div>
        </div>
      </Section>

      <Section title="Pill (CTA circular ou tag)">
        <div className="flex flex-wrap gap-3 items-center">
          <button
            className="px-6 py-2.5 bg-fg-primary text-fg-on-inverse text-callout font-semibold"
            style={{ borderRadius: radius.pill }}
          >
            CTA pill
          </button>
          <span
            className="px-3 py-1 bg-subtle text-fg-secondary text-footnote font-semibold inline-flex"
            style={{ borderRadius: radius.pill }}
          >
            tag pill
          </span>
        </div>
      </Section>
    </div>
  ),
};
