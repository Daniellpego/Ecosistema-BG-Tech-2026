import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Section as UISection, Container, Heading, Text } from '@gradios/ui/v2';

const meta: Meta<typeof UISection> = {
  title: 'Components/Section',
  component: UISection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Wrapper de seção com vertical padding semântico (compact/regular/hero/flagship) e background semântico (base/subtle/inverse). Sempre compor com Container dentro.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof UISection>;

const Demo: React.FC<{ size?: 'compact' | 'regular' | 'hero' | 'flagship'; background?: 'base' | 'subtle' | 'inverse' }> = ({
  size = 'regular',
  background = 'base',
}) => (
  <UISection size={size} background={background}>
    <Container>
      <Heading level={2} size="title-2" tone={background === 'inverse' ? 'on-inverse' : 'primary'}>
        Section size={size}, bg={background}
      </Heading>
      <Text
        tone={background === 'inverse' ? 'on-inverse' : 'secondary'}
        className="mt-2"
      >
        py-section-{size} aplicado ao section. bg-{background} aplicado ao background.
      </Text>
    </Container>
  </UISection>
);

export const Sizes: Story = {
  render: () => (
    <>
      <Demo size="compact" />
      <Demo size="regular" background="subtle" />
      <Demo size="hero" />
      <Demo size="flagship" background="subtle" />
    </>
  ),
};

export const Backgrounds: Story = {
  render: () => (
    <>
      <Demo background="base" />
      <Demo background="subtle" />
      <Demo background="inverse" />
    </>
  ),
};

export const InContext: Story = {
  name: 'Em contexto (sequência de sections)',
  render: () => (
    <>
      <UISection size="hero" background="base">
        <Container>
          <Heading level={1} size="display-1">
            Software para quem opera.
          </Heading>
          <Text size="body-lg" tone="secondary" className="mt-4 max-w-2xl">
            Operações que rodavam em planilhas viraram sistemas. Decisões que dependiam de tribal
            knowledge viraram processo.
          </Text>
        </Container>
      </UISection>
      <UISection size="regular" background="subtle">
        <Container>
          <Heading level={2} size="title-2">
            Como funciona
          </Heading>
          <Text tone="secondary" className="mt-2">
            Diagnóstico, desenvolvimento, automação rodando.
          </Text>
        </Container>
      </UISection>
      <UISection size="regular" background="inverse">
        <Container>
          <Heading level={2} size="title-2" tone="on-inverse">
            Cases reais
          </Heading>
          <Text tone="on-inverse" className="mt-2 opacity-70">
            Section dark intencional. Uso pontual.
          </Text>
        </Container>
      </UISection>
    </>
  ),
};
