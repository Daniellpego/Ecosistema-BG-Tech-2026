import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Textarea } from '@gradios/ui/v2';
import { Section } from '../lib/preview-helpers';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Textarea com borda completa, mesmo focus ring do Input. Min height 120px, resize vertical.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  render: () => (
    <div className="max-w-md">
      <Textarea placeholder="Conta pra gente o que tá travando a operação." />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <Section title="States">
      <div className="max-w-md flex flex-col gap-3">
        <Textarea placeholder="Default" />
        <Textarea placeholder="Disabled" disabled />
        <Textarea
          placeholder="Invalid"
          invalid
          defaultValue="Texto inválido (ex.: input vazio em campo obrigatório)"
        />
      </div>
    </Section>
  ),
};
