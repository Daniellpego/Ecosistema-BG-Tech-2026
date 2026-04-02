'use client'

import type { ReactNode } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { useCurrentUser } from '@/hooks/use-current-user'

export default function AuthenticatedLayoutClient({ children }: { children: ReactNode }) {
  const { data: user } = useCurrentUser()

  return (
    <div className="min-h-screen bg-bg-navy">
      <Sidebar />
      <main className="lg:pl-[260px] transition-all duration-300">
        <header className="sticky top-0 z-20 bg-bg-navy/70 backdrop-blur-md border-b border-brand-blue-deep/20 px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between pl-12 lg:pl-0">
            <h2 className="text-sm font-semibold text-text-secondary">Painel do CTO</h2>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-status-positive animate-pulse" />
              <span className="text-xs text-text-muted">{user?.nome ?? 'Carregando...'}</span>
            </div>
          </div>
        </header>
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
