'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useCurrentUser() {
  const supabase = createClient()
  return useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) return null

      // Try to get profile name
      const { data: profile } = await supabase
        .from('profiles')
        .select('nome, role')
        .eq('user_id', user.id)
        .single()

      return {
        id: user.id,
        email: user.email ?? '',
        nome: profile?.nome ?? user.email?.split('@')[0] ?? 'Usuario',
        role: profile?.role ?? 'dev',
      }
    },
    staleTime: 5 * 60 * 1000, // cache for 5 min
  })
}
