'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { toRecord } from '@/lib/supabase-helpers'

export interface ConfigCFO {
  id: string
  aliquota_simples: number
  prolabore_valor: number
  prolabore_socios: number
  prolabore_inss_percentual: number
  updated_at: string
}

export function useConfigCFO() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['config-cfo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('configuracoes_cfo')
        .select('*')
        .limit(1)
        .single()

      if (error) throw error
      return data as ConfigCFO
    },
    staleTime: 5 * 60 * 1000,
  })
}

export interface ConfigCFOUpdate {
  aliquota_simples?: number
  prolabore_valor?: number
  prolabore_socios?: number
  prolabore_inss_percentual?: number
}

export function useUpdateConfigCFO() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (updates: ConfigCFOUpdate) => {
      const { data: existingRaw } = await supabase
        .from('configuracoes_cfo')
        .select('id')
        .limit(1)
        .single()

      const existing = existingRaw as { id: string } | null
      if (!existing) throw new Error('Configuração não encontrada')

      const { data, error } = await supabase
        .from('configuracoes_cfo')
        .update(toRecord({ ...updates, updated_at: new Date().toISOString() }))
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      return data as ConfigCFO
    },
    onSuccess: () => {
      toast.success('Configurações salvas!')
      queryClient.invalidateQueries({ queryKey: ['config-cfo'] })
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar configurações: ${error.message}`)
    },
  })
}

// Computed values
export function computeProLabore(config: ConfigCFO | undefined) {
  if (!config || config.prolabore_valor <= 0) {
    return { totalProLabore: 0, totalINSS: 0, custoTotal: 0 }
  }
  const totalProLabore = config.prolabore_valor * config.prolabore_socios
  const totalINSS = totalProLabore * (config.prolabore_inss_percentual / 100)
  return { totalProLabore, totalINSS, custoTotal: totalProLabore + totalINSS }
}
