import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { spacing, layout } from '@gradios/design-tokens';
import { Section, Mono, Row } from '../lib/preview-helpers';

const meta: Meta = {
  title: 'Tokens/Spacing',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Tokens semânticos seguem rhythm 8 (múltiplos de 8). Tokens de section/block para layouts de página; scale numérica padrão Tailwind para componentes finos.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

const Bar: React.FC<{ width: string; label?: string }> = ({ width, label }) => (
  <div className="flex items-center gap-3">
    <div
      className="bg-primary-500 rounded h-6"
      style={{ width }}
      aria-hidden
    />
    {label && <Mono>{label}</Mono>}
  </div>
);

export const SectionTokens: Story = {
  name: 'Section spacing',
  render: () => (
    <Section
      title="Vertical de seção"
      description="Use em sections inteiras (py-section-*). Hero usa o maior, conteúdo padrão usa regular."
    >
      {(
        [
          ['section-compact', '4rem (64px)'],
          ['section-regular', '6rem (96px) — padrão'],
          ['section-hero', '8rem (128px)'],
        ] as const
      ).map(([key, label]) => (
        <Row key={key} label={key} meta={label}>
          <Bar width={spacing[key]} label={spacing[key]} />
        </Row>
      ))}
    </Section>
  ),
};

export const BlockTokens: Story = {
  name: 'Block spacing',
  render: () => (
    <Section
      title="Entre blocos de conteúdo"
      description="Espaço entre títulos e parágrafos, entre cards de uma grid, etc. Use em gap, mb, mt."
    >
      {(
        [
          ['block-tight', '1.5rem (24px)'],
          ['block-normal', '2.5rem (40px) — padrão'],
          ['block-loose', '4rem (64px)'],
        ] as const
      ).map(([key, label]) => (
        <Row key={key} label={key} meta={label}>
          <Bar width={spacing[key]} label={spacing[key]} />
        </Row>
      ))}
    </Section>
  ),
};

export const Gutters: Story = {
  render: () => (
    <Section title="Container gutters" description="Padding horizontal do container responsivo.">
      {(
        [
          ['gutter-mobile', 'mobile'],
          ['gutter-tablet', 'tablet'],
          ['gutter-desktop', 'desktop'],
        ] as const
      ).map(([key, label]) => (
        <Row key={key} label={key} meta={label}>
          <Bar width={spacing[key]} label={spacing[key]} />
        </Row>
      ))}
    </Section>
  ),
};

export const ContainerWidths: Story = {
  name: 'Container widths',
  render: () => (
    <Section
      title="Larguras máximas"
      description="Containers semânticos para conteúdo. Default = 1200px. Hero pode estender até 1440px."
    >
      <div className="space-y-3">
        {(
          [
            ['narrow', layout.container.narrow, 'leitura, formulários longos'],
            ['default', layout.container.default, 'padrão de páginas'],
            ['hero', layout.container.hero, 'hero, showcases full-width'],
          ] as const
        ).map(([k, w, desc]) => (
          <div key={k} className="border rounded-md p-3">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-callout font-semibold text-fg-primary">{k}</span>
              <Mono>
                {w} — {desc}
              </Mono>
            </div>
            <div
              className="bg-subtle border border-subtle rounded h-2"
              style={{ maxWidth: w, width: '100%' }}
              aria-hidden
            />
          </div>
        ))}
      </div>
    </Section>
  ),
};

export const NumericScale: Story = {
  name: 'Numeric scale (Tailwind defaults)',
  render: () => (
    <Section
      title="Scale numérica padrão"
      description="Mantida do Tailwind para uso dentro de componentes. Convenção: dentro de section/block use múltiplos de 2 (= 8px e acima)."
    >
      <div className="space-y-2">
        {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32].map((n) => (
          <div key={n} className="flex items-center gap-3">
            <div className="w-12 shrink-0 text-footnote text-fg-tertiary text-right font-mono">
              {n}
            </div>
            <div
              className="bg-primary-200 rounded h-3"
              style={{ width: `${n * 0.25}rem` }}
              aria-hidden
            />
            <Mono>{n * 4}px</Mono>
          </div>
        ))}
      </div>
    </Section>
  ),
};
