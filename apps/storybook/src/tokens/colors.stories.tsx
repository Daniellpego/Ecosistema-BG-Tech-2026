import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { color, semantic } from '@gradios/design-tokens';
import { Section, Swatch, Grid } from '../lib/preview-helpers';

const meta: Meta = {
  title: 'Tokens/Color',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Paletas primitives (escala numérica 50–900) e semantics (tokens com intenção, mapeados via CSS vars).',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

const PaletteRow: React.FC<{
  title: string;
  palette: Record<string, string>;
  prefix: string;
}> = ({ title, palette, prefix }) => (
  <Section title={title}>
    <Grid cols={5}>
      {Object.entries(palette).map(([key, value]) => (
        <Swatch
          key={key}
          name={`${prefix}.${key}`}
          value={value}
          hint={`bg-${prefix}-${key}`}
        />
      ))}
    </Grid>
  </Section>
);

export const Primitives: Story = {
  render: () => (
    <div>
      <PaletteRow title="Neutral (Apple grays)" palette={color.neutral} prefix="neutral" />
      <PaletteRow title="Primary (#2546BD)" palette={color.primary} prefix="primary" />
      <PaletteRow title="Secondary (#00BFFF)" palette={color.secondary} prefix="secondary" />
      <Section title="Status">
        <Grid cols={3}>
          {(['success', 'warning', 'danger'] as const).map((kind) => {
            const p = color[kind];
            return (
              <div key={kind} className="space-y-2">
                <Swatch name={`${kind}.50`} value={p[50]} hint={`bg-${kind}-50`} />
                <Swatch name={`${kind}.500`} value={p[500]} hint={`bg-${kind}-500`} />
                <Swatch name={`${kind}.700`} value={p[700]} hint={`bg-${kind}-700`} />
              </div>
            );
          })}
        </Grid>
      </Section>
    </div>
  ),
};

export const Semantics: Story = {
  render: () => (
    <div>
      <Section
        title="Background"
        description="Use estes tokens para fundos de página, cards e seções alternadas. Mapeiam para CSS vars."
      >
        <Grid cols={3}>
          {Object.entries(semantic.bg).map(([k, v]) => (
            <Swatch key={k} name={`bg.${k}`} value={`--gd-semantic-bg-${k}`} hint={`bg-${k} → ${v}`} isVar />
          ))}
        </Grid>
      </Section>

      <Section
        title="Foreground"
        description="Texto e ícones. fg.primary é o token principal — use em quase tudo."
      >
        <Grid cols={3}>
          {Object.entries(semantic.fg).map(([k, v]) => (
            <Swatch
              key={k}
              name={`fg.${k}`}
              value={`--gd-semantic-fg-${k}`}
              hint={`text-fg-${k.replace(/([A-Z])/g, '-$1').toLowerCase()} → ${v}`}
              isVar
            />
          ))}
        </Grid>
      </Section>

      <Section title="Border">
        <Grid cols={4}>
          {Object.entries(semantic.border).map(([k, v]) => (
            <Swatch
              key={k}
              name={`border.${k}`}
              value={`--gd-semantic-border-${k}`}
              hint={k === 'default' ? `border → ${v}` : `border-${k} → ${v}`}
              isVar
            />
          ))}
        </Grid>
      </Section>

      <Section title="Accent" description="Cores de interação. primary = azul (CTA, links). secondary = ciano (apenas accent).">
        <Grid cols={3}>
          {Object.entries(semantic.accent).map(([k, v]) => (
            <Swatch
              key={k}
              name={`accent.${k}`}
              value={`--gd-semantic-accent-${k}`}
              hint={v}
              isVar
            />
          ))}
        </Grid>
      </Section>
    </div>
  ),
};

export const ContrastCheck: Story = {
  name: 'Contrast (text on bg)',
  render: () => (
    <Section
      title="Text on backgrounds"
      description="Validação rápida de contraste WCAG AA. Use fg.primary em bg.base/surface/subtle. Use fg.onInverse em bg.inverse."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(semantic.bg).map(([bgKey, bgVal]) => {
          const isDark = bgKey === 'inverse';
          const fgVal = isDark ? semantic.fg.onInverse : semantic.fg.primary;
          return (
            <div
              key={bgKey}
              className="rounded-lg p-6 border"
              style={{ background: bgVal, color: fgVal }}
            >
              <div className="text-headline mb-1">bg.{bgKey}</div>
              <div className="text-callout opacity-80">
                fg.{isDark ? 'onInverse' : 'primary'} sobre bg.{bgKey}
              </div>
              <div className="text-footnote mt-2 opacity-60 font-mono">
                {bgVal} / {fgVal}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  ),
};
