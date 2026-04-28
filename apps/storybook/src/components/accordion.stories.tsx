import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@gradios/ui/v2';
import { Section } from '../lib/preview-helpers';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Accordion baseado em Radix UI. Padrão para FAQ. Border inferior em cada item, chevron rotaciona no estado open. Animação de altura via CSS vars do Radix.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const FAQ_ITEMS = [
  {
    q: 'Quanto tempo leva para entregar uma automação?',
    a: 'O ciclo médio fica entre 2 e 6 semanas. Diagnóstico em 1 semana, desenvolvimento em 2-4 semanas, hand-off em 1 semana. Projetos maiores são quebrados em entregas independentes.',
  },
  {
    q: 'Vocês trabalham com qual stack?',
    a: 'Stack moderno: TypeScript, React/Next.js, Postgres, n8n para automações, Supabase para backend. A escolha é técnica, sempre justificada pelo problema do cliente.',
  },
  {
    q: 'O sistema fica nosso ou de vocês?',
    a: 'Seu. Código entregue em repositório seu desde o primeiro commit. Sem lock-in. Documentação técnica de tudo que foi construído.',
  },
  {
    q: 'Atendem fora de SP/Londrina?',
    a: 'Sim, 100% remoto. Reuniões por Meet ou Zoom. Visitas presenciais em momentos específicos do projeto se necessário.',
  },
  {
    q: 'E se eu não souber exatamente o que precisa?',
    a: 'O diagnóstico é exatamente para isso. 2 horas de conversa para entender a operação, mapear gargalos e propor o que faz sentido. Sem compromisso.',
  },
];

export const Default: Story = {
  name: 'FAQ (single mode)',
  render: () => (
    <div className="max-w-2xl">
      <Accordion type="single" collapsible defaultValue="item-0">
        {FAQ_ITEMS.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionContent>{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
};

export const Multiple: Story = {
  name: 'Múltiplos abertos',
  render: () => (
    <div className="max-w-2xl">
      <Accordion type="multiple" defaultValue={['item-0', 'item-2']}>
        {FAQ_ITEMS.slice(0, 3).map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionContent>{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
};

export const A11y: Story = {
  name: 'A11y notes',
  render: () => (
    <Section
      title="Acessibilidade"
      description="Radix Accordion usa <button> com aria-expanded em cada trigger. Setas ↑/↓ navegam entre triggers. Espaço/Enter abre/fecha. Home/End para primeiro/último."
    >
      <div className="max-w-md">
        <Accordion type="single" collapsible>
          <AccordionItem value="a">
            <AccordionTrigger>Item A</AccordionTrigger>
            <AccordionContent>Use ↑/↓ para navegar.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Item B</AccordionTrigger>
            <AccordionContent>Espaço/Enter para abrir.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Section>
  ),
};
