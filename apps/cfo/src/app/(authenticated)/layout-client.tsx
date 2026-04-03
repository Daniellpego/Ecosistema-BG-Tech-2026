'use client'

import type { ReactNode } from 'react'
import { Sidebar } from '@/components/sidebar'
import { PeriodFilter } from '@/components/period-filter'
import { PeriodProvider } from '@/providers/period-provider'
import { TaxProvider, useTax } from '@/providers/tax-provider'
import { Switch } from '@/components/ui/switch'

function SimplesToggle() {
  const { simplesEnabled, setSimplesEnabled, aliquota, anexo, setAnexo } = useTax()

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={simplesEnabled}
        onCheckedChange={setSimplesEnabled}
        aria-label="Toggle Simples Nacional"
      />
      <span className={simplesEnabled ? 'text-xs font-medium text-status-warning' : 'text-xs text-text-dark'}>
        Simples {aliquota.toFixed(1)}%
      </span>
      {simplesEnabled && (
        <select
          value={anexo}
          onChange={(e) => setAnexo(e.target.value as 'III' | 'V')}
          className="text-[10px] bg-transparent border border-brand-blue-deep/30 rounded px-1.5 py-0.5 text-text-secondary"
        >
          <option value="III">Anexo III</option>
          <option value="V">Anexo V</option>
        </select>
      )}
    </div>
  )
}

export default function AuthenticatedLayoutClient({ children }: { children: ReactNode }) {
  return (
    <PeriodProvider>
      <TaxProvider>
        <div className="min-h-screen">
          <Sidebar />
          <main className="lg:pl-[260px] transition-all duration-300">
            {/* Header with period filter */}
            <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-md border-b border-slate-200/50 px-4 sm:px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="pl-12 lg:pl-0">
                  <PeriodFilter />
                </div>
                <SimplesToggle />
              </div>
            </header>

            {/* Content */}
            <div className="p-4 sm:p-6">
              {children}
            </div>
          </main>
        </div>
      </TaxProvider>
    </PeriodProvider>
  )
}
