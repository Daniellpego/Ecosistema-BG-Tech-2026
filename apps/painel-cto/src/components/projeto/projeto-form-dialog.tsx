'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { useCreateProjeto } from '@/hooks/use-projetos'
import { CATEGORIA_LABELS } from '@/lib/kanban-config'
import type { Prioridade, Categoria } from '@/types/database'

export function ProjetoFormDialog() {
  const [open, setOpen] = useState(false)
  const createProjeto = useCreateProjeto()

  const [nome, setNome] = useState('')
  const [cliente, setCliente] = useState('')
  const [descricao, setDescricao] = useState('')
  const [prioridade, setPrioridade] = useState<Prioridade>('media')
  const [categoria, setCategoria] = useState<Categoria>('projeto_avulso')
  const [valor, setValor] = useState('')
  const [dataEntrega, setDataEntrega] = useState('')

  function resetForm() {
    setNome('')
    setCliente('')
    setDescricao('')
    setPrioridade('media')
    setCategoria('projeto_avulso')
    setValor('')
    setDataEntrega('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim()) return

    createProjeto.mutate(
      {
        nome: nome.trim(),
        titulo: null,
        deal_id: null,
        descricao: descricao.trim() || null,
        cliente: cliente.trim() || null,
        status: 'backlog',
        valor: valor ? Number(valor) : null,
        prazo: null,
        data_inicio: new Date().toISOString().split('T')[0] ?? null,
        data_entrega: dataEntrega || null,
        responsavel: null,
        tags: null,
        prioridade,
        categoria,
        cor: null,
        user_id: null,
      },
      {
        onSuccess: () => {
          resetForm()
          setOpen(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" /> Novo Projeto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Projeto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nome do Projeto *</Label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: App Mobile BG" className="mt-1" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Cliente</Label>
              <Input value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Nome do cliente" className="mt-1" />
            </div>
            <div>
              <Label>Valor (R$)</Label>
              <Input type="number" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0,00" className="mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Prioridade</Label>
              <Select value={prioridade} onValueChange={(v) => setPrioridade(v as Prioridade)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Categoria</Label>
              <Select value={categoria} onValueChange={(v) => setCategoria(v as Categoria)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORIA_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Data de Entrega</Label>
            <Input type="date" value={dataEntrega} onChange={(e) => setDataEntrega(e.target.value)} className="mt-1" />
          </div>

          <div>
            <Label>Descricao</Label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Breve descricao do projeto..."
              rows={3}
              className="mt-1 w-full rounded-lg bg-bg-input border border-brand-blue-deep/30 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-cyan/30 focus:border-brand-cyan/50 resize-none"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={!nome.trim() || createProjeto.isPending}>
              {createProjeto.isPending ? 'Criando...' : 'Criar Projeto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
