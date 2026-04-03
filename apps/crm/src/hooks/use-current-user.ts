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
      return {
        id: user.id,
        email: user.email ?? '',
        name: (user.user_metadata?.name as string) || (user.user_metadata?.full_name as string) || user.email || 'Usuário',
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}
