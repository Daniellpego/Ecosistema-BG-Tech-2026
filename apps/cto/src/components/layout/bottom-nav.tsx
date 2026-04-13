'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Kanban, GanttChart, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

const ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/kanban', label: 'Kanban', icon: Kanban },
  { href: '/timeline', label: 'Timeline', icon: GanttChart },
  { href: '/calendario', label: 'Calendario', icon: Calendar },
] as const

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-2xl rounded-t-[14px]"
      style={{
        background: 'rgba(255,255,255,0.92)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -4px 24px rgba(0,102,138,0.06)',
      }}
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-1.5">
        {ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 py-1.5 px-4 rounded-[14px] transition-all duration-200 active:scale-[0.90]',
                isActive
                  ? 'bg-gradient-to-br from-[#00668a] to-[#00BFFF] text-white shadow-lg shadow-brand-cyan/20'
                  : 'text-text-muted hover:text-brand-cyan'
              )}
            >
              <Icon className="h-[22px] w-[22px]" />
              <span className={cn('text-[10px] font-medium leading-tight', isActive && 'font-semibold')}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
