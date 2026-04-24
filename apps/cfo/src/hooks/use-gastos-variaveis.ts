'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { toRecord } from '@/lib/supabase-helpers'
import { logAction } from '@/lib/audit-log'
import { usePeriod } from '@/providers/period-provider'
import type { GastoVariavel, GastoVariavelCategoria, GastoVariavelTipo, GastoVariavelStatus } from '@/types/database'

export interface GastoVariavelInsert {
  data: string
  descricao: string
  cliente?: string | null
  categoria: GastoVariavelCategoria
  tipo: GastoVariavelTipo
  valor: number
  status: GastoVariavelStatus
  observacoes?: string | null
  comprovante_url?: string | null
}

export function useGastosVariaveis() {
  const { startDate, endDate } = usePeriod()
  const supabase = createClient()

  return useQuery({
    queryKey: ['gastos-variaveis', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gastos_variaveis')
        .select('*')
        .gte('data', startDate)
        .lte('data', endDate)
        .order('data', { ascending: false })

      if (error) throw error
      return data as GastoVariavel[]
    },
  })
}

export function useGastosVariaveisMesAnterior() {
  const { month, year } = usePeriod()
  const supabase = createClient()

  const prevMonth = month === 1 ? 12 : month - 1
  const prevYear = month === 1 ? year - 1 : year
  const prevStart = `${prevYear}-${String(prevMonth).padStart(2, '0')}-01`
  const lastDay = new Date(prevYear, prevMonth, 0).getDate()
  const prevEnd = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

  return useQuery({
    queryKey: ['gastos-variaveis-prev', prevStart, prevEnd],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gastos_variaveis')
        .select('*')
        .gte('data', prevStart)
        .lte('data', prevEnd)

      if (error) throw error
      return data as GastoVariavel[]
    },
  })
}

export function useCreateGastoVariavel() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (gasto: GastoVariavelInsert) => {
      const { data, error } = await supabase
        .from('gastos_variaveis')
        .insert(toRecord(gasto))
        .select()
        .single()

      if (error) throw error
      return data as GastoVariavel
    },
    onSuccess: () => {
      logAction('create', 'gastos_variaveis', 'new')
      toast.success('Gasto criado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['gastos-variaveis'] })
      queryClient.invalidateQueries({ queryKey: ['gastos-variaveis-prev'] })
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar gasto: ${error.message}`)
    },
  })
}

export function useUpdateGastoVariavel() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<GastoVariavelInsert> & { id: string }) => {
      const { data, error } = await supabase
        .from('gastos_variaveis')
        .update(toRecord(updates))
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as GastoVariavel
    },
    onSuccess: () => {
      logAction('update', 'gastos_variaveis', 'updated')
      toast.success('Gasto atualizado!')
      queryClient.invalidateQueries({ queryKey: ['gastos-variaveis'] })
      queryClient.invalidateQueries({ queryKey: ['gastos-variaveis-prev'] })
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar gasto: ${error.message}`)
    },
  })
}

export function useDeleteGastoVariavel() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('gastos_variaveis')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      logAction('delete', 'gastos_variaveis', 'deleted')
      toast.success('Gasto removido.')
      queryClient.invalidateQueries({ queryKey: ['gastos-variaveis'] })
      queryClient.invalidateQueries({ queryKey: ['gastos-variaveis-prev'] })
    },
    onError: (error: Error) => {
      toast.error(`Erro ao excluir gasto: ${error.message}`)
    },
  })
}
