import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  Section,
  Container,
  Heading,
  Text,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Textarea,
  Badge,
} from '@gradios/ui/v2';
import {
  ArrowRight,
  ArrowUp,
  Activity,
  Zap,
  BarChart3,
  Workflow,
} from 'lucide-react';

const meta: Meta = {
  title: 'Examples/Landing',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Composições reais usando os componentes v2 — validação do sistema em contexto, não isolado. Hero, Content e Form representam padrões típicos da landing do site.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers de polimento — eyebrow padrão e dot pulsante
// ─────────────────────────────────────────────────────────────────────────────

const Eyebrow: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <Text
    size="caption"
    tone="brand"
    weight="semibold"
    className={`uppercase tracking-wider ${className}`}
  >
    {children}
  </Text>
);

const PulseDot: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span
    className={`relative inline-flex h-1.5 w-1.5 ${className}`}
    aria-hidden
  >
    <span className="absolute inline-flex h-full w-full rounded-full bg-success-500 opacity-60 animate-ping" />
    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success-700" />
  </span>
);

// ─────────────────────────────────────────────────────────────────────────────
// 1) HERO
// ─────────────────────────────────────────────────────────────────────────────

const KPIS = [
  { label: 'Lead capturado', value: '2.847', delta: '12%' },
  { label: 'Qualificado', value: '1.123', delta: '8%' },
  { label: 'Convertido', value: '341', delta: '23%' },
];

export const Hero: Story = {
  render: () => (
    <Section
      size="hero"
      background="base"
      className="relative min-h-[100dvh] flex items-center overflow-hidden"
    >
      {/* Polimento: 2 radial gradients sutis, sensação de luz natural */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_-10%,rgba(30,61,138,0.10),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_110%,rgba(30,61,138,0.04),transparent_50%)]"
        aria-hidden
      />

      <Container width="hero" className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 max-w-2xl">
            <Eyebrow className="mb-5 inline-block">
              Para quem opera · 2026
            </Eyebrow>

            <Heading
              level={1}
              size="display-1"
              tone="primary"
              className="lg:text-display-2"
            >
              Software para quem opera. Não para quem vende software.
            </Heading>

            <Text size="body-lg" tone="secondary" className="mt-8 max-w-xl">
              Operações que rodavam em planilhas viraram sistemas. Decisões que
              dependiam de tribal knowledge viraram processo. Sem buzzword, sem
              promessa, sem cerimônia.
            </Text>

            <div className="mt-12 flex flex-wrap gap-3">
              <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Falar com a gente
              </Button>
              <Button size="lg" variant="secondary">
                Ver casos reais
              </Button>
            </div>

            <Text size="footnote" tone="tertiary" className="mt-6">
              Resposta em até 24h. Sem formulário de 12 campos.
            </Text>
          </div>

          {/* Mockup vivo */}
          <div className="lg:col-span-5">
            <Card
              padding="lg"
              elevation="md"
              className="aspect-[4/5] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Activity
                    className="h-4 w-4 text-fg-tertiary"
                    aria-hidden
                  />
                  <Text size="caption" tone="tertiary" weight="regular">
                    Pipeline operacional
                  </Text>
                </div>
                <Badge
                  variant="success"
                  size="sm"
                  leading={<PulseDot />}
                >
                  Live
                </Badge>
              </div>

              {/* KPIs */}
              <div className="flex-1 flex flex-col gap-4">
                {KPIS.map((row, i) => (
                  <div
                    key={i}
                    className="flex items-end justify-between border-t pt-4 first:border-t-0 first:pt-0"
                  >
                    <Text size="callout" tone="secondary">
                      {row.label}
                    </Text>
                    <div className="flex items-baseline gap-2">
                      <span className="text-headline text-fg-primary font-semibold tabular-nums">
                        {row.value}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-footnote text-success-700 font-semibold tabular-nums">
                        <ArrowUp className="h-3 w-3" aria-hidden />
                        {row.delta}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer micro */}
              <div className="mt-6 pt-4 border-t flex items-center justify-between">
                <Text size="footnote" tone="tertiary">
                  Atualizado há 2 min · 14:38
                </Text>
                <PulseDot />
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// 2) CONTENT (3 features com eyebrows + footer)
// ─────────────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Workflow,
    eyebrow: 'AUTOMAÇÃO',
    title: 'Automação de fluxo',
    description:
      'Mapeamos seu processo, identificamos onde tem retrabalho e automatizamos.',
  },
  {
    icon: Zap,
    eyebrow: 'DESENVOLVIMENTO',
    title: 'Software sob medida',
    description:
      'Sistema construído para sua operação, não para o caso geral. Sem feature inútil.',
  },
  {
    icon: BarChart3,
    eyebrow: 'ANALYTICS',
    title: 'Decisão com dado',
    description:
      'Dashboard que mostra o que importa. Métrica que pauta reunião, não decora slide.',
  },
];

export const Content: Story = {
  render: () => (
    <Section size="regular" background="subtle">
      <Container>
        <div className="max-w-2xl mb-12">
          <Eyebrow className="mb-3 inline-block">SOLUÇÕES</Eyebrow>
          <Heading level={2} size="title-3">
            O que entregamos
          </Heading>
          <Text
            size="body-lg"
            tone="secondary"
            className="mt-4 max-w-xl"
          >
            Três frentes, sempre conectadas. Não vendemos serviço — vendemos
            resultado operacional medido.
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <Card
              key={i}
              padding="lg"
              interactive
              tabIndex={0}
              className="flex flex-col"
            >
              <CardHeader>
                <div className="h-10 w-10 rounded-md bg-primary-50 flex items-center justify-center mb-3">
                  <f.icon
                    className="h-5 w-5 text-primary-700"
                    aria-hidden
                  />
                </div>
                <Eyebrow>{f.eyebrow}</Eyebrow>
                <CardTitle as="h3" className="mt-1">
                  {f.title}
                </CardTitle>
                <CardDescription>{f.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1" />
              <CardFooter className="mt-auto pt-4 border-t">
                <Text size="callout" tone="brand" weight="semibold">
                  Saber mais →
                </Text>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// 3) FORM (subtle background + trust signals)
// ─────────────────────────────────────────────────────────────────────────────

const TRUST = [
  'Resposta em 24h',
  'Sem newsletter',
  'LGPD-ready',
];

export const Form: Story = {
  render: () => (
    <Section size="regular" background="subtle">
      <Container width="narrow">
        <div className="text-center mb-10">
          <Eyebrow className="mb-3 inline-block">COMEÇAR</Eyebrow>
          <Heading level={2} size="title-2">
            Conta o que tá travando.
          </Heading>
          <Text
            size="body-lg"
            tone="secondary"
            className="mt-3 max-w-xl mx-auto"
          >
            A gente lê tudo. Resposta em até 24h, com plano de ação ou um "não é
            pra gente" honesto.
          </Text>
        </div>

        <Card padding="lg" elevation="sm">
          <form className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="ex-name"
                className="block text-callout text-fg-primary font-semibold mb-1.5"
              >
                Nome
              </label>
              <Input id="ex-name" placeholder="Como te chamamos" />
            </div>

            <div>
              <label
                htmlFor="ex-email"
                className="block text-callout text-fg-primary font-semibold mb-1.5"
              >
                Email
              </label>
              <Input
                id="ex-email"
                type="email"
                placeholder="seu@email.com"
              />
              <Text
                size="footnote"
                tone="tertiary"
                className="mt-1.5"
              >
                Não usamos para newsletter. Resposta direta de gente real.
              </Text>
            </div>

            <div>
              <label
                htmlFor="ex-msg"
                className="block text-callout text-fg-primary font-semibold mb-1.5"
              >
                Onde tá travando?
              </label>
              <Textarea
                id="ex-msg"
                placeholder="Conta a operação, o gargalo, o time. Sem cerimônia."
              />
            </div>

            <Button
              type="submit"
              block
              size="lg"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Enviar
            </Button>
          </form>
        </Card>

        {/* Trust signals */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {TRUST.map((t, i) => (
            <div key={i} className="inline-flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full bg-success-700"
                aria-hidden
              />
              <Text size="footnote" tone="tertiary">
                {t}
              </Text>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// 4) FULL PAGE — Hero + Content + Form em sequência
// ─────────────────────────────────────────────────────────────────────────────

export const FullPage: Story = {
  name: 'Página completa (Hero → Content → Form)',
  render: () => (
    <>
      {(Hero as { render: () => React.ReactElement }).render()}
      {(Content as { render: () => React.ReactElement }).render()}
      {(Form as { render: () => React.ReactElement }).render()}
    </>
  ),
};
