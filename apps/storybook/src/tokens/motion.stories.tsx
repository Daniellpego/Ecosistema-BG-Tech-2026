import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { motion } from '@gradios/design-tokens';
import { Section, Mono, Row } from '../lib/preview-helpers';

const meta: Meta = {
  title: 'Tokens/Motion',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Durations, easings e whitelist de animações. Filosofia: restraint. Apenas movimento funcional — nada decorativo.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

const PlayBar: React.FC<{ duration: string; easing: string; label: string }> = ({
  duration,
  easing,
  label,
}) => {
  const [n, setN] = useState(0);
  const x = n % 2 === 0 ? '0%' : '100%';
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setN((v) => v + 1)}
        className="px-4 py-2 bg-fg-primary text-fg-on-inverse text-footnote font-semibold rounded-md hover:opacity-90"
        style={{ transition: `opacity ${motion.duration.fast} ${motion.easing.standard}` }}
      >
        Play
      </button>
      <div className="flex-1 h-10 bg-subtle rounded-md relative overflow-hidden">
        <div
          className="absolute top-1/2 -translate-y-1/2 h-6 w-6 bg-primary-500 rounded-full"
          style={{
            left: x,
            marginLeft: x === '0%' ? '0' : '-1.5rem',
            transitionProperty: 'left, margin-left',
            transitionDuration: duration,
            transitionTimingFunction: easing,
          }}
          aria-hidden
        />
      </div>
      <Mono>{label}</Mono>
    </div>
  );
};

export const Durations: Story = {
  render: () => (
    <Section
      title="Durations"
      description="instant para mudanças sem transição. fast para feedbacks imediatos (botão press). normal para transições padrão. slow/deliberate apenas em entradas com peso (modal, hero reveal)."
    >
      {(Object.keys(motion.duration) as Array<keyof typeof motion.duration>).map((k) => (
        <Row key={k} label={k} meta={motion.duration[k]}>
          <PlayBar
            duration={motion.duration[k]}
            easing={motion.easing.standard}
            label={`${motion.duration[k]} · standard`}
          />
        </Row>
      ))}
    </Section>
  ),
};

export const Easings: Story = {
  render: () => (
    <Section
      title="Easings"
      description="standard como default. emphasized para entradas memoráveis (hero, dialog enter). out para saídas. in para itens entrando do off-screen."
    >
      {(Object.keys(motion.easing) as Array<keyof typeof motion.easing>).map((k) => (
        <Row key={k} label={k} meta={motion.easing[k]}>
          <PlayBar
            duration={motion.duration.slow}
            easing={motion.easing[k]}
            label={`slow · ${k}`}
          />
        </Row>
      ))}
    </Section>
  ),
};

export const Whitelist: Story = {
  render: () => (
    <Section
      title="Animações permitidas"
      description="Lista branca em motion.whitelist. Qualquer animação fora dela passa por revisão de design. Tudo o que o Tailwind preset gera (animate-*) está atrelado a esta lista."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {motion.whitelist.map((name) => (
          <div
            key={name}
            className="flex items-center gap-3 p-3 bg-surface border rounded-md"
          >
            <span className="h-2 w-2 rounded-full bg-primary-500" aria-hidden />
            <span className="text-callout font-semibold text-fg-primary flex-1">{name}</span>
            <Mono>animate-{name}</Mono>
          </div>
        ))}
      </div>
    </Section>
  ),
};

export const ReducedMotion: Story = {
  name: 'prefers-reduced-motion',
  render: () => (
    <Section
      title="Respeito a prefers-reduced-motion"
      description="O preset não aplica esta regra automaticamente — cada componente é responsável. Padrão recomendado: anular transition-duration nas classes de motion quando a media query estiver ativa."
    >
      <div
        className="bg-surface border rounded-lg p-6"
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: '13px',
          lineHeight: 1.6,
          color: 'var(--gd-semantic-fg-secondary)',
        }}
      >
        <code>{'@media (prefers-reduced-motion: reduce) {'}</code>
        <br />
        <code>{'  *, *::before, *::after {'}</code>
        <br />
        <code>{'    animation-duration: 0.01ms !important;'}</code>
        <br />
        <code>{'    transition-duration: 0.01ms !important;'}</code>
        <br />
        <code>{'  }'}</code>
        <br />
        <code>{'}'}</code>
      </div>
    </Section>
  ),
};
