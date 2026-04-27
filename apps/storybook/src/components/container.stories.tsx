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
            Mobile: 16px (gutter-mobile) · Tablet: 24px (gutter-tablet) · Desktop: 32px
            (gutter-desktop). Redimensione a janela para ver.
          </Text>
        </div>
      </Container>
    </Section>
  ),
};
