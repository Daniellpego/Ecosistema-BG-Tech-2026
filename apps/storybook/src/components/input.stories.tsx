import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Input } from '@gradios/ui/v2';
import { Search, Mail, DollarSign } from 'lucide-react';
import { Section } from '../lib/preview-helpers';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Input com borda completa, focus ring 4px de primary 15%. Suporta left/right addons (ícone, prefixo) e estado loading/invalid.',
      },
    },
  },
  argTypes: {
    inputSize: { control: 'select', options: ['sm', 'md', 'lg'] },
    invalid: { control: 'boolean' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { placeholder: 'seu@email.com' },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <Section title="Sizes">
      <div className="max-w-md flex flex-col gap-3">
        <Input inputSize="sm" placeholder="Small (h-9)" />
        <Input inputSize="md" placeholder="Medium (h-11, default)" />
        <Input inputSize="lg" placeholder="Large (h-12)" />
      </div>
    </Section>
  ),
};

export const States: Story = {
  render: () => (
    <Section title="States">
      <div className="max-w-md flex flex-col gap-3">
        <Input placeholder="Default" />
        <Input placeholder="Disabled" disabled />
        <Input placeholder="Loading..." loading />
        <Input placeholder="Invalid" invalid defaultValue="email-errado" />
      </div>
    </Section>
  ),
};

export const WithAddons: Story = {
  render: () => (
    <Section title="Com addons">
      <div className="max-w-md flex flex-col gap-3">
        <Input
          leftAddon={<Search className="h-4 w-4" />}
          placeholder="Buscar..."
        />
        <Input
          leftAddon={<Mail className="h-4 w-4" />}
          placeholder="Email"
          type="email"
        />
        <Input
          leftAddon={<DollarSign className="h-4 w-4" />}
          placeholder="0,00"
          type="number"
        />
      </div>
    </Section>
  ),
};
