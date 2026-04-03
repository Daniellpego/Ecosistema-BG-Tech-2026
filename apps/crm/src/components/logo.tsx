import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  collapsed?: boolean
  className?: string
}

export function Logo({ collapsed = false, className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative w-10 h-10 shrink-0">
        <Image 
          src="/logo.png" 
          alt="Gradios Logo" 
          fill 
          className="object-contain drop-shadow-sm"
        />
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Gradios</span>
          <span className="text-[10px] font-semibold text-brand-cyan tracking-widest uppercase opacity-80">
            Painel CRM
          </span>
        </div>
      )}
    </div>
  )
}
