import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { typography } from '@gradios/design-tokens';
import { Section, Mono, Row } from '../lib/preview-helpers';

const meta: Meta = {
  title: 'Tokens/Typography',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Escala Apple-style com 12 níveis (display-2 → caption). Body base = 17px. Pesos Inter: 400 (regular) e 600 (semibold). 700 só em exceção.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

const SAMPLE_TEXT = 'Software para quem opera.';
const SAMPLE_BODY =
  'Operações que rodavam em planilhas viraram sistemas. Decisões que dependiam de tribal knowledge viraram processo. Sem buzzword, sem promessa, sem cerimônia.';

const SAMPLES: Record<string, string> = {
  'display-2': SAMPLE_TEXT,
  'display-1': SAMPLE_TEXT,
  'title-1': SAMPLE_TEXT,
  'title-2': SAMPLE_TEXT,
  'title-3': SAMPLE_TEXT,
  headline: 'Quando processo vira sistema, time vira time.',
  subhead: 'Operação confiável, sem retrabalho.',
  'body-lg': SAMPLE_BODY,
  body: SAMPLE_BODY,
  callout: 'Detalhe que acompanha um título.',
  footnote: 'Metadado, label, pequeno destaque.',
  caption: 'TAG / RÓTULO / METADADO',
};

const TypeRow: React.FC<{ name: string }> = ({ name }) => {
  const entry = typography.fontSize[name];
  if (!entry) return null;
  const [size, cfg] = entry;
  const sample = SAMPLES[name] ?? SAMPLE_TEXT;

  return (
    <Row label={name} meta={`${size} · ${cfg.fontWeight} · ls ${cfg.letterSpacing}`}>
      <div
        style={{
          fontSize: size,
          lineHeight: cfg.lineHeight,
          letterSpacing: cfg.letterSpacing,
          fontWeight: cfg.fontWeight,
        }}
        className="text-fg-primary"
      >
        {sample}
      </div>
    </Row>
  );
};

export const Scale: Story = {
  render: () => (
    <div>
      <Section
        title="Display"
        description="Tamanhos de impacto. Use no hero da landing ou em momentos editoriais."
      >
        <TypeRow name="display-2" />
        <TypeRow name="display-1" />
      </Section>

      <Section title="Title">
        <TypeRow name="title-1" />
        <TypeRow name="title-2" />
        <TypeRow name="title-3" />
      </Section>

      <Section
        title="Headline & Subhead"
        description="Cabeçalhos de subseção e legendas que preparam o body."
      >
        <TypeRow name="headline" />
        <TypeRow name="subhead" />
      </Section>

      <Section
        title="Body"
        description="Corpo de texto. body é a base (17px). body-lg para texto introdutório."
      >
        <TypeRow name="body-lg" />
        <TypeRow name="body" />
      </Section>

      <Section title="Callout, Footnote, Caption">
        <TypeRow name="callout" />
        <TypeRow name="footnote" />
        <TypeRow name="caption" />
      </Section>
    </div>
  ),
};

export const Weights: Story = {
  render: () => (
    <Section
      title="Pesos disponíveis"
      description="Inter 400 e 600 são o padrão. 700 só em exceção justificada."
    >
      <div className="space-y-4">
        {(['regular', 'semibold', 'bold'] as const).map((w) => (
          <Row
            key={w}
            label={w}
            meta={`${typography.fontWeight[w]} ${w === 'bold' ? '— exceção' : ''}`}
          >
            <div
              className="text-title-2 text-fg-primary"
              style={{ fontWeight: typography.fontWeight[w] }}
            >
              {SAMPLE_TEXT}
            </div>
          </Row>
        ))}
      </div>
    </Section>
  ),
};

export const FontFamilies: Story = {
  render: () => (
    <Section title="Font families">
      <Row label="sans" meta="default">
        <div className="text-headline" style={{ fontFamily: typography.fontFamily.sans }}>
          {SAMPLE_TEXT} <Mono>fontFamily.sans</Mono>
        </div>
      </Row>
      <Row label="display" meta="headlines grandes">
        <div className="text-headline" style={{ fontFamily: typography.fontFamily.display }}>
          {SAMPLE_TEXT} <Mono>fontFamily.display</Mono>
        </div>
      </Row>
      <Row label="mono" meta="código, valores numéricos técnicos">
        <div className="text-callout" style={{ fontFamily: typography.fontFamily.mono }}>
          const operacao = "automatizada"; <Mono>fontFamily.mono</Mono>
        </div>
      </Row>
    </Section>
  ),
};

export const LetterSpacing: Story = {
  render: () => (
    <Section title="Letter spacing">
      {(['tighter', 'tight', 'normal', 'wide'] as const).map((k) => (
        <Row key={k} label={k} meta={typography.letterSpacing[k]}>
          <div
            className="text-title-3 text-fg-primary"
            style={{ letterSpacing: typography.letterSpacing[k] }}
          >
            {SAMPLE_TEXT}
          </div>
        </Row>
      ))}
    </Section>
  ),
};
