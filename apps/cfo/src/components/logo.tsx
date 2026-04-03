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
          width={40}
          height={40}
          className="object-contain drop-shadow-sm"
          sizes="40px"
        />
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className="font-black text-xl tracking-tight text-slate-900">
            Gradios
          </span>
          <span className="text-[10px] font-semibold text-brand-cyan tracking-widest uppercase opacity-80">
            Painel CFO
          </span>
        </div>
      )}
    </div>
  )
}
