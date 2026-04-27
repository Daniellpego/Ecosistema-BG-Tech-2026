import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
} from '@gradios/ui/v2';
import { Section } from '../lib/preview-helpers';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'subtle' },
    docs: {
      description: {
        component:
          'Card flat. Border 1px + shadow opcional. Sem glass morphism. Sub-componentes assumem que Card tem padding (default md).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

const Sample: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <Card>
    <CardHeader>
      <CardTitle>Operação confiável</CardTitle>
      <CardDescription>Sem retrabalho, sem fila de aprovação manual.</CardDescription>
    </CardHeader>
    <CardContent>
      Processos que rodavam em planilhas viraram sistemas. Decisões que dependiam de
      tribal knowledge viraram processo.
    </CardContent>
    {children}
  </Card>
);

export const Default: Story = {
  render: () => <Sample />,
};

export const Elevations: Story = {
  render: () => (
    <Section title="Elevations">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card elevation="none">
          <CardTitle>none</CardTitle>
          <CardDescription>Border apenas — uso padrão.</CardDescription>
        </Card>
        <Card elevation="sm">
          <CardTitle>sm</CardTitle>
          <CardDescription>Sombra muito sutil.</CardDescription>
        </Card>
        <Card elevation="md">
          <CardTitle>md</CardTitle>
          <CardDescription>Sombra moderada.</CardDescription>
        </Card>
      </div>
    </Section>
  ),
};

export const Backgrounds: Story = {
  render: () => (
    <Section title="Backgrounds">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card background="base">
          <CardTitle>base</CardTitle>
          <CardDescription>bg.base — neutro padrão.</CardDescription>
        </Card>
        <Card background="surface">
          <CardTitle>surface</CardTitle>
          <CardDescription>bg.surface — destacado em backgrounds subtle.</CardDescription>
        </Card>
        <Card background="subtle">
          <CardTitle>subtle</CardTitle>
          <CardDescription>bg.subtle — uso pontual em backgrounds base.</CardDescription>
        </Card>
      </div>
    </Section>
  ),
};

export const Paddings: Story = {
  render: () => (
    <Section title="Paddings">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card padding="sm">
          <CardTitle>sm — 16px</CardTitle>
          <CardDescription>Para listas densas.</CardDescription>
        </Card>
        <Card padding="md">
          <CardTitle>md — 24px (default)</CardTitle>
          <CardDescription>Padrão.</CardDescription>
        </Card>
        <Card padding="lg">
          <CardTitle>lg — 32px</CardTitle>
          <CardDescription>Cards de destaque, hero.</CardDescription>
        </Card>
        <Card padding="none" border={false} elevation="none">
          <CardTitle>none + sem border</CardTitle>
          <CardDescription>Composição custom.</CardDescription>
        </Card>
      </div>
    </Section>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Section title="Interactive (hover/focus)">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
        <Card interactive tabIndex={0}>
          <CardTitle>Hover sobre mim</CardTitle>
          <CardDescription>Sombra md no hover, focus ring no foco do teclado.</CardDescription>
        </Card>
        <Card interactive tabIndex={0}>
          <CardTitle>Outro card</CardTitle>
          <CardDescription>Use tabIndex=0 para keyboard focus.</CardDescription>
        </Card>
      </div>
    </Section>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <div className="max-w-md">
      <Sample>
        <CardFooter>
          <Button size="sm">Falar agora</Button>
          <Button size="sm" variant="ghost">Saber mais</Button>
        </CardFooter>
      </Sample>
    </div>
  ),
};
