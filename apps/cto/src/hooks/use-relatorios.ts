'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { toRecord } from '@/lib/supabase-helpers'
import type { Presentation, PresentationRequest } from '@/types/database'

export function usePresentations() {
  const supabase = createClient()
  return useQuery({
    queryKey: ['presentations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('presentations')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Presentation[]
    },
  })
}

export function usePresentationRequests() {
  const supabase = createClient()
  return useQuery({
    queryKey: ['presentation-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('presentation_requests')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as PresentationRequest[]
    },
  })
}

export function useCreatePresentationRequest() {
  const qc = useQueryClient()
  const supabase = createClient()
  return useMutation({
    mutationFn: async (request: { tipo: string; notas?: string; requested_by: string }) => {
      const { data, error } = await supabase
        .from('presentation_requests')
        .insert(toRecord(request))
        .select()
        .single()
      if (error) throw error
      return data as PresentationRequest
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['presentation-requests'] })
    },
  })
}
