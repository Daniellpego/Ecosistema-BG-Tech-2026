import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  Button,
  Input,
} from '@gradios/ui/v2';
import { Section } from '../lib/preview-helpers';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Modal centralizada baseada em Radix UI Dialog. Backdrop com blur sutil + dialog com slide-up. Foco preso e Escape para fechar via Radix.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Abrir dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. O registro vai sumir do histórico.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancelar</Button>
          </DialogClose>
          <Button>Excluir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithForm: Story = {
  name: 'Com formulário',
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Editar perfil</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>
            Atualize seu nome e email. As mudanças se aplicam imediatamente.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="dlg-name"
              className="block text-callout text-fg-primary font-semibold mb-1.5"
            >
              Nome
            </label>
            <Input id="dlg-name" defaultValue="Gradios" />
          </div>
          <div>
            <label
              htmlFor="dlg-email"
              className="block text-callout text-fg-primary font-semibold mb-1.5"
            >
              Email
            </label>
            <Input id="dlg-email" type="email" defaultValue="contato@gradios.co" />
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancelar</Button>
          </DialogClose>
          <Button>Salvar mudanças</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const HideClose: Story = {
  name: 'Sem botão de close (forçar decisão)',
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Pagamento pendente</Button>
      </DialogTrigger>
      <DialogContent hideClose>
        <DialogHeader>
          <DialogTitle>Pagamento não confirmado</DialogTitle>
          <DialogDescription>
            Confirma o pagamento ou cancela. Não dá pra ignorar essa.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancelar</Button>
          </DialogClose>
          <Button>Confirmar pagamento</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const A11y: Story = {
  name: 'A11y notes',
  render: () => (
    <Section
      title="Acessibilidade"
      description="Radix Dialog cuida de: trap focus, return focus ao trigger, Escape para fechar, role=dialog + aria-labelledby/describedby. Apenas garantir que DialogTitle/DialogDescription estejam presentes."
    >
      <Dialog>
        <DialogTrigger asChild>
          <Button>Testar com teclado</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Foco preso aqui</DialogTitle>
            <DialogDescription>
              Tab navega só dentro do dialog. Esc fecha. Click fora também fecha.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost">Ação 1</Button>
            <Button variant="secondary">Ação 2</Button>
            <Button>Ação 3</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Section>
  ),
};
