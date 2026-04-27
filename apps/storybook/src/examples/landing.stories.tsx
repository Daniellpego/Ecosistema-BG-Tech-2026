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
  Input,
  Textarea,
  Badge,
} from '@gradios/ui/v2';
import { ArrowRight, Zap, BarChart3, Workflow } from 'lucide-react';

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
// 1) HERO
// ─────────────────────────────────────────────────────────────────────────────

export const Hero: Story = {
  render: () => (
    <Section
      size="hero"
      background="base"
      className="relative min-h-[100dvh] flex items-center overflow-hidden"
    >
      {/* Polimento: radial gradient sutil no canto superior direito */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_-10%,rgba(30,61,138,0.06),transparent_55%)]"
        aria-hidden
      />
      <Container width="hero" className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 max-w-2xl">
            <Badge variant="brand" size="md" className="mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
              Beta privada
            </Badge>
            <Heading level={1} size="display-1" tone="primary">
              Software para quem opera. Não para quem vende software.
            </Heading>
            <Text size="body-lg" tone="secondary" className="mt-6">
              Operações que rodavam em planilhas viraram sistemas. Decisões que dependiam
              de tribal knowledge viraram processo. Sem buzzword, sem promessa, sem
              cerimônia.
            </Text>
            <div className="mt-10 flex flex-wrap gap-3">
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

          {/* Visual placeholder */}
          <div className="lg:col-span-5">
            <Card padding="lg" elevation="sm" className="aspect-[4/5] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <Text size="caption" tone="tertiary" weight="regular">
                  Pipeline · operação
                </Text>
                <Badge variant="success" size="sm">Live</Badge>
              </div>
              <div className="flex-1 grid grid-cols-1 gap-3">
                {[
                  { label: 'Lead capturado', value: '2.847', delta: '+12%' },
                  { label: 'Qualificado', value: '1.123', delta: '+8%' },
                  { label: 'Convertido', value: '341', delta: '+23%' },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="flex items-end justify-between border-t pt-3 first:border-t-0 first:pt-0"
                  >
                    <Text size="callout" tone="secondary">{row.label}</Text>
                    <div className="flex items-baseline gap-2">
                      <span className="text-headline text-fg-primary font-semibold tabular-nums">
                        {row.value}
                      </span>
                      <Text size="footnote" tone="tertiary">{row.delta}</Text>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// 2) CONTENT (3 features)
// ─────────────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Workflow,
    title: 'Automação de fluxo',
    description:
      'Mapeamos seu processo, identificamos onde tem retrabalho e automatizamos.',
  },
  {
    icon: Zap,
    title: 'Software sob medida',
    description:
      'Sistema construído para sua operação, não para o caso geral. Sem feature inútil.',
  },
  {
    icon: BarChart3,
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
          <Heading level={2} size="title-3">
            O que entregamos
          </Heading>
          <Text size="body-lg" tone="secondary" className="mt-4">
            Três frentes, sempre conectadas. Não vendemos serviço — vendemos resultado
            operacional medido.
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <Card key={i} padding="lg" interactive tabIndex={0}>
              <CardHeader>
                <div className="h-10 w-10 rounded-md bg-primary-50 flex items-center justify-center mb-2">
                  <f.icon className="h-5 w-5 text-primary-700" aria-hidden />
                </div>
                <CardTitle as="h3">{f.title}</CardTitle>
                <CardDescription>{f.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Text size="callout" tone="brand" weight="semibold">
                  Saber mais →
                </Text>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// 3) FORM
// ─────────────────────────────────────────────────────────────────────────────

export const Form: Story = {
  render: () => (
    <Section size="regular" background="base">
      <Container width="narrow">
        <div className="text-center mb-10">
          <Heading level={2} size="title-2">
            Conta o que tá travando.
          </Heading>
          <Text size="body-lg" tone="secondary" className="mt-3">
            A gente lê tudo. Resposta em até 24h, com plano de ação ou um "não é pra
            gente" honesto.
          </Text>
        </div>

        <Card padding="lg">
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
              <Input id="ex-email" type="email" placeholder="seu@email.com" />
              <Text size="footnote" tone="tertiary" className="mt-1.5">
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
                placeholder="Conta a operação, o gargalo, o time. Sem ceremônia."
              />
            </div>

            <Button type="submit" block size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Enviar
            </Button>
            <Text size="footnote" tone="tertiary" className="text-center">
              Ao enviar você concorda com nossos termos. Tudo bem direto.
            </Text>
          </form>
        </Card>
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
