import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Container, Section, Heading, Text } from '@gradios/ui/v2';

const meta: Meta<typeof Container> = {
  title: 'Components/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Container max-w + mx-auto + padding lateral responsivo. Substitui o pattern repetido "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" do site legado.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

const Demo: React.FC<{ width?: 'narrow' | 'default' | 'hero' }> = ({ width = 'default' }) => (
  <Section size="compact" background="subtle">
    <Container width={width}>
      <div className="bg-base border rounded-lg p-6">
        <Heading level={3} size="headline">
          width={width}
        </Heading>
        <Text tone="secondary" className="mt-1">
          {width === 'narrow' && 'max-w 768px — leitura, formulários longos.'}
          {width === 'default' && 'max-w 1200px — padrão de páginas.'}
          {width === 'hero' && 'max-w 1440px — hero, showcases full-width.'}
        </Text>
      </div>
    </Container>
  </Section>
);

export const Widths: Story = {
  render: () => (
    <>
      <Demo width="narrow" />
      <Demo width="default" />
      <Demo width="hero" />
    </>
  ),
};

export const ResponsivePadding: Story = {
  name: 'Padding lateral responsivo',
  render: () => (
    <Section size="compact">
      <Container>
        <div className="bg-subtle border rounded-lg p-6">
          <Heading level={3} size="headline">
            Padding lateral responsivo
          </Heading>
          <Text tone="secondary" className="mt-1">
            Mobile: 16px (gutter-mobile) · Tablet: 24px (gutter-tablet) · Desktop: 48px
            (gutter-desktop). Redimensione a janela para ver.
          </Text>
        </div>
      </Container>
    </Section>
  ),
};

export const GridDebug: Story = {
  name: 'Debug grid 12-col',
  render: () => (
    <Section size="compact" background="subtle">
      <Container>
        {/* Overlay 12-col por trás do conteúdo. Útil para validar alinhamento. */}
        <div className="relative">
          <div
            className="pointer-events-none absolute inset-0 grid grid-cols-12 gap-6"
            aria-hidden
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-primary-100/40 border border-primary-200 rounded-sm" />
            ))}
          </div>
          <div className="relative grid grid-cols-12 gap-6">
            <div className="col-span-7 bg-base border rounded-lg p-6">
              <Heading level={3} size="headline">col-span-7</Heading>
              <Text tone="secondary" className="mt-1">
                Coluna principal (conteúdo).
              </Text>
            </div>
            <div className="col-span-5 bg-base border rounded-lg p-6">
              <Heading level={3} size="headline">col-span-5</Heading>
              <Text tone="secondary" className="mt-1">
                Coluna secundária (formulário, sidebar).
              </Text>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  ),
};
