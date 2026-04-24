'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { toRecord } from '@/lib/supabase-helpers'
import { logAction } from '@/lib/audit-log'
import type { CustoFixo, CustoFixoCategoria, CustoFixoRecorrencia, CustoFixoStatus } from '@/types/database'

export interface CustoFixoInsert {
  nome: string
  categoria: CustoFixoCategoria
  valor_mensal: number
  data_inicio: string
  dia_vencimento?: number | null
  recorrencia: CustoFixoRecorrencia
  obrigatorio: boolean
  status: CustoFixoStatus
  observacoes?: string | null
  comprovante_url?: string | null
}

export function useCustosFixos() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['custos-fixos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custos_fixos')
        .select('*')
        .order('valor_mensal', { ascending: false })

      if (error) throw error
      return data as CustoFixo[]
    },
  })
}

export function useCreateCustoFixo() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (custoFixo: CustoFixoInsert) => {
      const { data, error } = await supabase
        .from('custos_fixos')
        .insert(toRecord(custoFixo))
        .select()
        .single()

      if (error) throw error
      return data as CustoFixo
    },
    onSuccess: () => {
      logAction('create', 'custos_fixos', 'new')
      toast.success('Custo fixo criado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['custos-fixos'] })
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar custo fixo: ${error.message}`)
    },
  })
}

export function useUpdateCustoFixo() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CustoFixoInsert> & { id: string }) => {
      const { data, error } = await supabase
        .from('custos_fixos')
        .update(toRecord(updates))
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as CustoFixo
    },
    onSuccess: () => {
      logAction('update', 'custos_fixos', 'updated')
      toast.success('Custo fixo atualizado!')
      queryClient.invalidateQueries({ queryKey: ['custos-fixos'] })
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar custo fixo: ${error.message}`)
    },
  })
}

export function useDeleteCustoFixo() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('custos_fixos')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      logAction('delete', 'custos_fixos', 'deleted')
      toast.success('Custo fixo removido.')
      queryClient.invalidateQueries({ queryKey: ['custos-fixos'] })
    },
    onError: (error: Error) => {
      toast.error(`Erro ao excluir custo fixo: ${error.message}`)
    },
  })
}
