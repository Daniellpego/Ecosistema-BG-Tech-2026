import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Heading,
  Text,
  Card,
} from '@gradios/ui/v2';
import { Section } from '../lib/preview-helpers';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Tabs minimalistas baseadas em Radix UI. Underline animado embaixo do trigger ativo (sem pill, sem background colorido). Padrão para showcases de produto ou switch entre views relacionadas.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <div className="max-w-2xl">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Heading level={3} size="title-3">
            O que entregamos
          </Heading>
          <Text tone="secondary" className="mt-3">
            Software construído para sua operação. Diagnóstico, desenvolvimento e
            automação rodando em produção.
          </Text>
        </TabsContent>
        <TabsContent value="features">
          <Heading level={3} size="title-3">
            Features
          </Heading>
          <Text tone="secondary" className="mt-3">
            Conteúdo da aba Features.
          </Text>
        </TabsContent>
        <TabsContent value="pricing">
          <Heading level={3} size="title-3">
            Pricing
          </Heading>
          <Text tone="secondary" className="mt-3">
            Conteúdo da aba Pricing.
          </Text>
        </TabsContent>
        <TabsContent value="faq">
          <Heading level={3} size="title-3">
            FAQ
          </Heading>
          <Text tone="secondary" className="mt-3">
            Conteúdo da aba FAQ.
          </Text>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

export const InCard: Story = {
  name: 'Dentro de Card',
  render: () => (
    <Card padding="lg" className="max-w-3xl">
      <Tabs defaultValue="dre">
        <TabsList>
          <TabsTrigger value="dre">DRE</TabsTrigger>
          <TabsTrigger value="receitas">Receitas</TabsTrigger>
          <TabsTrigger value="custos">Custos</TabsTrigger>
        </TabsList>
        <TabsContent value="dre">
          <Heading level={4} size="headline">
            Demonstração de Resultado
          </Heading>
          <Text tone="secondary" className="mt-2">
            Cascade: Receita Bruta → Custos Variáveis → Margem Bruta → Custos Fixos
            → Resultado Operacional → Impostos → Resultado Líquido.
          </Text>
        </TabsContent>
        <TabsContent value="receitas">
          <Text tone="secondary">Faturamento detalhado.</Text>
        </TabsContent>
        <TabsContent value="custos">
          <Text tone="secondary">Custos fixos + variáveis.</Text>
        </TabsContent>
      </Tabs>
    </Card>
  ),
};

export const Disabled: Story = {
  name: 'Com tab desabilitada',
  render: () => (
    <div className="max-w-2xl">
      <Tabs defaultValue="ativo">
        <TabsList>
          <TabsTrigger value="ativo">Ativo</TabsTrigger>
          <TabsTrigger value="bloqueado" disabled>
            Bloqueado
          </TabsTrigger>
          <TabsTrigger value="outra">Outra</TabsTrigger>
        </TabsList>
        <TabsContent value="ativo">
          <Text tone="secondary">Conteúdo da aba ativa.</Text>
        </TabsContent>
        <TabsContent value="bloqueado">
          <Text tone="secondary">Você não deveria ver isso.</Text>
        </TabsContent>
        <TabsContent value="outra">
          <Text tone="secondary">Outra aba.</Text>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

export const A11y: Story = {
  name: 'A11y notes',
  render: () => (
    <Section
      title="Acessibilidade"
      description="Radix Tabs cuida de role=tablist/tab/tabpanel, aria-selected, aria-controls. Seta esquerda/direita navega. Home/End para primeiro/último. Espaço/Enter ativa."
    >
      <div className="max-w-md">
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger value="a">A</TabsTrigger>
            <TabsTrigger value="b">B</TabsTrigger>
            <TabsTrigger value="c">C</TabsTrigger>
          </TabsList>
          <TabsContent value="a"><Text>Tab A — use ←/→ para navegar.</Text></TabsContent>
          <TabsContent value="b"><Text>Tab B</Text></TabsContent>
          <TabsContent value="c"><Text>Tab C</Text></TabsContent>
        </Tabs>
      </div>
    </Section>
  ),
};
