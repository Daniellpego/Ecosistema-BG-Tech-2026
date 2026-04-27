'use client'

export const dynamic = 'force-dynamic'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, Users, DollarSign, TrendingUp, MessageCircle, ExternalLink, Eye } from 'lucide-react'
import { PageTransition, StaggerContainer, StaggerItem, AnimatedNumber, MotionCard } from '@/components/motion'
import { PageTitle } from '@/components/page-title'
import { Button } from '@gradios/ui'
import { Input } from '@gradios/ui'
import { Skeleton } from '@gradios/ui'
import { EmptyState } from '@/components/ui/empty-state'
import { Inbox } from 'lucide-react'
import { useAllLeads } from '@/hooks/use-leads'
import { formatCurrency, formatDate, formatWhatsAppUrl, formatPhone } from '@/lib/format'
import { ORIGENS_LABELS, ORIGENS_COLORS } from '@/types/database'

export default function ClientesPage() {
  const { data: allLeads, isLoading } = useAllLeads()
  const [search, setSearch] = useState('')

  const clientes = useMemo(() => {
    if (!allLeads) return []
    let filtered = allLeads.filter((l) => l.status === 'fechado_ganho')
    if (search) {
      const s = search.toLowerCase()
      filtered = filtered.filter(
        (l) =>
          l.nome.toLowerCase().includes(s) ||
          (l.empresa?.toLowerCase().includes(s) ?? false)
      )
    }
    return filtered
  }, [allLeads, search])

  const totalClientes = clientes.length
  const totalValor = clientes.reduce((sum, c) => sum + c.valor_estimado, 0)
  const ticketMedio = totalClientes > 0 ? totalValor / totalClientes : 0

  if (isLoading) {
    return (
      <PageTransition>
        <div className="space-y-6">
        <div className="flex flex-col gap-1 mb-2">
          <h1 className="text-2xl font-black text-text-primary tracking-tight">Clientes</h1>
          <p className="text-sm text-text-muted font-medium">Leads que concluíram a jornada e se tornaram parceiros.</p>
        </div>
        <Skeleton className="h-96" />
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <PageTitle title="Clientes" />
      <div className="space-y-6">
        <div className="flex flex-col gap-1 mb-2">
          <h1 className="text-2xl font-black text-text-primary tracking-tight">Clientes</h1>
          <p className="text-sm text-text-muted font-medium">Leads que concluíram a jornada e se tornaram parceiros.</p>
        </div>

        {/* KPIs */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StaggerItem>
            <MotionCard className="card-glass flex items-center gap-3">
              <div className="p-2 rounded-lg bg-status-positive/10">
                <Users className="h-5 w-5 text-status-positive" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Total Clientes</p>
                <p className="text-xl font-bold text-text-primary">
                  <AnimatedNumber value={totalClientes} format={(n: number) => String(n)} />
                </p>
              </div>
            </MotionCard>
          </StaggerItem>
          <StaggerItem>
            <MotionCard className="card-glass flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-cyan/10">
                <DollarSign className="h-5 w-5 text-brand-cyan" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Valor Total</p>
                <p className="text-xl font-bold text-brand-cyan">
                  <AnimatedNumber value={totalValor} format={formatCurrency} />
                </p>
              </div>
            </MotionCard>
          </StaggerItem>
          <StaggerItem>
            <MotionCard className="card-glass flex items-center gap-3">
              <div className="p-2 rounded-lg bg-status-warning/10">
                <TrendingUp className="h-5 w-5 text-status-warning" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Ticket Médio</p>
                <p className="text-xl font-bold text-status-warning">
                  <AnimatedNumber value={ticketMedio} format={formatCurrency} />
                </p>
              </div>
            </MotionCard>
          </StaggerItem>
        </StaggerContainer>

        {/* Search */}
        <div className="card-glass">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dark" />
            <Input
              placeholder="Buscar cliente por nome ou empresa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table */}
        {clientes.length === 0 ? (
          <div className="py-12 px-4">
            <EmptyState
              icon={Inbox}
              title={search ? "Nenhum cliente encontrado" : "Ainda não há clientes"}
              description={search 
                ? `Não encontramos resultados para "${search}".` 
                : "Seus leads convertidos aparecerão automaticamente nesta lista."}
              action={search ? {
                label: "Limpar busca",
                onClick: () => setSearch('')
              } : undefined}
            />
          </div>
        ) : (
          <div className="card-glass p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="table-header">
                    <th className="text-left p-3">Nome</th>
                    <th className="text-left p-3 hidden sm:table-cell">Empresa</th>
                    <th className="text-left p-3 hidden md:table-cell">WhatsApp</th>
                    <th className="text-left p-3 hidden lg:table-cell">Origem</th>
                    <th className="text-right p-3 hidden md:table-cell">Valor</th>
                    <th className="text-left p-3 hidden lg:table-cell">Data</th>
                    <th className="text-right p-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente) => (
                    <tr key={cliente.id} className="table-row">
                      <td className="p-3">
                        <div>
                          <p className="text-sm font-medium text-text-primary">{cliente.nome}</p>
                          <p className="text-xs text-text-secondary sm:hidden">{cliente.empresa}</p>
                        </div>
                      </td>
                      <td className="p-3 hidden sm:table-cell">
                        <p className="text-sm text-text-secondary">{cliente.empresa ?? '-'}</p>
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        {cliente.whatsapp ? (
                          <a
                            href={formatWhatsAppUrl(cliente.whatsapp, cliente.nome)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-brand-cyan hover:underline flex items-center gap-1"
                          >
                            {formatPhone(cliente.whatsapp)}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-sm text-text-dark">-</span>
                        )}
                      </td>
                      <td className="p-3 hidden lg:table-cell">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-md"
                          style={{
                            color: ORIGENS_COLORS[cliente.origem] ?? '#94A3B8',
                            background: `${ORIGENS_COLORS[cliente.origem] ?? '#94A3B8'}20`,
                          }}
                        >
                          {ORIGENS_LABELS[cliente.origem] ?? cliente.origem}
                        </span>
                      </td>
                      <td className="p-3 text-right hidden md:table-cell">
                        <span className="text-sm text-brand-cyan font-medium">
                          {formatCurrency(cliente.valor_estimado)}
                        </span>
                      </td>
                      <td className="p-3 hidden lg:table-cell">
                        <span className="text-xs text-text-secondary">
                          {formatDate(cliente.created_at)}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-1">
                          {cliente.whatsapp && (
                            <a
                              href={formatWhatsAppUrl(cliente.whatsapp, cliente.nome)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MessageCircle className="h-4 w-4 text-status-positive" />
                              </Button>
                            </a>
                          )}
                          <Link href={`/leads/${cliente.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
