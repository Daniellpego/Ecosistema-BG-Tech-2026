import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { QueryProvider } from '@/providers/query-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gradios — CFO',
  description: 'Gestão financeira inteligente — Gradios',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>
          <TooltipProvider delayDuration={200}>
            {children}
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
