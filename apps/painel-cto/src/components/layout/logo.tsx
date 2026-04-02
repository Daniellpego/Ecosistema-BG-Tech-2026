'use client'

import { cn } from '@/lib/utils'

export function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-8 w-8 rounded-lg gradient-cyan flex items-center justify-center shrink-0">
        <span className="text-bg-navy font-black text-sm">G</span>
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-text-primary leading-tight">Gradios</span>
          <span className="text-[10px] font-medium text-brand-cyan leading-tight">CTO Panel</span>
        </div>
      )}
    </div>
  )
}
