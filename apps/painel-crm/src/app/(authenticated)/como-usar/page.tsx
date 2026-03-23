'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageTransition, StaggerContainer, MotionCard } from '@/components/motion'
import { PageTitle } from '@/components/page-title'
import {
  LayoutDashboard,
  Users,
  Kanban,
  DollarSign,
  BarChart3,
  Handshake,
  Settings,
  Plus,
  ArrowRight,
  MessageCircle,
  Brain,
  Zap,
  Target,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── Pipeline stages ── */
const PIPELINE_FLOW = [
  { label: 'Novo', color: 'bg-slate-400', desc: 'Lead acabou de entrar' },
  { label: 'Qualificado', color: 'bg-cyan-500', desc: 'Tem perfil e potencial' },
  { label: 'Reuniao', color: 'bg-amber-500', desc: 'Agendou ou fez reuniao' },
  { label: 'Proposta', color: 'bg-blue-600', desc: 'Proposta enviada' },
  { label: 'Ganho', color: 'bg-emerald-500', desc: 'Fechou negocio' },
]

/* ── Sections data ── */
const sections = [
  {
    id: 'visao-geral',
    icon: LayoutDashboard,
    title: 'Visao Geral (Dashboard)',
    shortDesc: 'O ponto de partida. Mostra KPIs, leads recentes, follow-ups pendentes e o mini pipeline.',
    content: [
      {
        subtitle: 'KPIs no topo',
        text: 'Total de leads, valor estimado no pipeline, taxa de conversao e follow-ups pendentes. Tudo filtrado pelo periodo selecionado no header.',
      },
      {
        subtitle: 'Mini Pipeline',
        text: 'Visualizacao rapida de quantos leads existem em cada etapa (Novo, Qualificado, Reuniao, Proposta, Ganho). Clique em qualquer etapa para ir direto ao Pipeline.',
      },
      {
        subtitle: 'Leads Recentes',
        text: 'Os ultimos 5 leads criados. Mostra nome, empresa, origem e temperatura. Clique para abrir o detalhe.',
      },
      {
        subtitle: 'Follow-ups Pendentes',
        text: 'Leads com data de proximo contato que ja passou ou vence hoje. Priorize esses contatos para nao perder oportunidade.',
      },
    ],
  },
  {
    id: 'leads',
    icon: Users,
    title: 'Leads',
    shortDesc: 'Cadastre, filtre e gerencie todos os contatos. Cada lead tem historico completo.',
    content: [
      {
        subtitle: 'Criar lead',
        text: 'Clique no botao "+ Novo Lead" no topo. Preencha nome, empresa, email, WhatsApp, setor, origem e temperatura. Leads do Quiz sao criados automaticamente.',
      },
      {
        subtitle: 'Filtros',
        text: 'Use a barra de filtros para buscar por nome/empresa, filtrar por status, origem, temperatura ou responsavel. Os filtros combinam entre si.',
      },
      {
        subtitle: 'Detalhe do lead',
        text: 'Clique em qualquer lead para ver o perfil completo: dados de contato, resultado do Quiz (se veio do diagnostico), historico de atividades e deals vinculados.',
      },
      {
        subtitle: 'Registrar atividade',
        text: 'Dentro do detalhe, registre notas, ligacoes, emails, reunioes e follow-ups. Cada atividade fica salva no historico com data e autor.',
      },
      {
        subtitle: 'Analise por IA',
        text: 'No detalhe do lead, clique em "Analisar com IA" para receber uma qualificacao automatica baseada nos dados do lead e do Quiz.',
      },
    ],
  },
  {
    id: 'pipeline',
    icon: Kanban,
    title: 'Pipeline',
    shortDesc: 'Kanban visual. Arraste leads entre etapas para atualizar o status automaticamente.',
    content: [
      {
        subtitle: 'Como funciona',
        text: 'O pipeline mostra leads organizados em colunas por status. Arraste um card de uma coluna para outra e o status atualiza automaticamente no banco.',
      },
      {
        subtitle: 'Etapas do pipeline',
        text: 'Novo > Qualificado > Reuniao > Proposta > Ganho. Leads em "Perdido" nao aparecem no Kanban (ficam acessiveis via filtro na pagina de Leads).',
      },
      {
        subtitle: 'Cards do pipeline',
        text: 'Cada card mostra nome, empresa, valor estimado e temperatura (frio/morno/quente). Clique no card para abrir o detalhe completo.',
      },
    ],
  },
  {
    id: 'deals',
    icon: DollarSign,
    title: 'Deals',
    shortDesc: 'Oportunidades de negocio vinculadas a leads. Controle valor, MRR e probabilidade.',
    content: [
      {
        subtitle: 'Criar deal',
        text: 'Crie um deal a partir do detalhe de um lead ou diretamente na pagina de Deals. Vincule ao lead, defina valor, tipo de servico (setup, mensalidade, projeto avulso, consultoria, MVP) e probabilidade.',
      },
      {
        subtitle: 'Status do deal',
        text: 'Aberto (em negociacao), Ganho (fechou) ou Perdido (nao evoluiu). Deals ganhos alimentam a metrica de receita.',
      },
      {
        subtitle: 'MRR',
        text: 'Se o deal tem componente recorrente (mensalidade), preencha o campo MRR. O dashboard soma todos os MRRs ativos.',
      },
    ],
  },
  {
    id: 'analytics',
    icon: BarChart3,
    title: 'Analytics',
    shortDesc: 'Graficos de desempenho: distribuicao por status, origem, temperatura, tendencia semanal e valor por origem.',
    content: [
      {
        subtitle: 'Graficos disponiveis',
        text: 'Leads por Status (barra), Leads por Origem (pizza), Leads por Temperatura (barra), Tendencia Semanal (linha) e Valor por Origem (barra horizontal).',
      },
      {
        subtitle: 'Periodo',
        text: 'Todos os graficos respeitam o filtro de periodo no header (7 dias, 30 dias, 90 dias ou personalizado).',
      },
    ],
  },
  {
    id: 'clientes',
    icon: Handshake,
    title: 'Clientes',
    shortDesc: 'Leads que foram convertidos (status "Ganho"). Visualize e busque na base de clientes.',
    content: [
      {
        subtitle: 'Quem aparece aqui',
        text: 'Apenas leads com status "fechado_ganho". Ao mover um lead para Ganho no Pipeline, ele automaticamente aparece aqui.',
      },
      {
        subtitle: 'Busca',
        text: 'Pesquise por nome ou empresa. Use para consultar rapidamente dados de contato de clientes ativos.',
      },
    ],
  },
  {
    id: 'configuracoes',
    icon: Settings,
    title: 'Configuracoes',
    shortDesc: 'Equipe, notificacoes e informacoes do sistema.',
    content: [
      {
        subtitle: 'Equipe',
        text: 'Lista os responsaveis configurados (Daniel, Gustavo, Sistema). Cada lead e deal tem um responsavel vinculado.',
      },
      {
        subtitle: 'Notificacoes',
        text: 'Ative ou desative alertas de novos leads (Quiz), follow-ups pendentes e deals ganhos.',
      },
    ],
  },
]

/* ── Tips ── */
const tips = [
  {
    icon: Zap,
    title: 'Leads do Quiz entram sozinhos',
    text: 'Quando alguem completa o diagnostico no site (gradios.co/diagnostico), um lead e criado automaticamente com setor, gargalos e score. Voce recebe um alerta na sidebar.',
  },
  {
    icon: Target,
    title: 'Use temperatura para priorizar',
    text: 'Quente = demonstrou interesse claro ou tem urgencia. Morno = tem potencial mas precisa de nurturing. Frio = entrou mas nao engajou. Foque nos quentes primeiro.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp direto do CRM',
    text: 'No detalhe do lead, clique no icone do WhatsApp para abrir uma conversa direta. O numero ja vai preenchido.',
  },
  {
    icon: Brain,
    title: 'IA qualifica o lead por voce',
    text: 'Use a analise por IA no detalhe do lead. Ela cruza dados do Quiz, setor e perfil para sugerir se o lead tem potencial e qual abordagem usar.',
  },
  {
    icon: Lightbulb,
    title: 'Filtro de periodo e global',
    text: 'O seletor de periodo no header (7d, 30d, 90d) filtra todas as paginas ao mesmo tempo: Dashboard, Leads, Deals e Analytics.',
  },
]

/* ── Section Component ── */
function SectionCard({ section, index }: { section: typeof sections[0]; index: number }) {
  const [expanded, setExpanded] = useState(index === 0)
  const Icon = section.icon

  return (
    <MotionCard>
      <div className="card-glass overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-4 p-5 text-left hover:bg-bg-hover/50 transition-colors"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-cyan/10 text-brand-cyan shrink-0">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-text-primary text-base">{section.title}</h3>
            <p className="text-sm text-text-secondary mt-0.5 truncate">{section.shortDesc}</p>
          </div>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-text-muted shrink-0" />
          ) : (
            <ChevronDown className="h-5 w-5 text-text-muted shrink-0" />
          )}
        </button>

        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-slate-100"
          >
            <div className="p-5 space-y-4">
              {section.content.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-cyan shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{item.subtitle}</p>
                    <p className="text-sm text-text-secondary mt-0.5 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </MotionCard>
  )
}

export default function ComoUsarPage() {
  return (
    <PageTransition>
      <PageTitle title="Como Usar" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-cyan/10 text-brand-cyan">
              <BookOpen className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Como usar o Painel CRM</h1>
          </div>
          <p className="text-text-secondary mt-2 leading-relaxed">
            Guia completo de cada funcionalidade. Clique em uma secao para expandir.
          </p>
        </div>

        {/* Pipeline flow visual */}
        <div className="card-glass p-5 mb-8">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Fluxo do Pipeline</p>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {PIPELINE_FLOW.map((stage, i) => (
              <div key={stage.label} className="flex items-center gap-2 shrink-0">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold', stage.color)}>
                    {i + 1}
                  </div>
                  <span className="text-xs font-medium text-text-primary">{stage.label}</span>
                  <span className="text-[10px] text-text-muted text-center max-w-[80px]">{stage.desc}</span>
                </div>
                {i < PIPELINE_FLOW.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-slate-300 shrink-0 mb-6" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-3 mb-10">
          {sections.map((section, i) => (
            <SectionCard key={section.id} section={section} index={i} />
          ))}
        </div>

        {/* Tips */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Dicas
          </h2>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tips.map((tip, i) => {
              const Icon = tip.icon
              return (
                <MotionCard key={i}>
                  <div className="card-glass p-4 h-full">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50 text-amber-600 shrink-0 mt-0.5">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{tip.title}</p>
                        <p className="text-xs text-text-secondary mt-1 leading-relaxed">{tip.text}</p>
                      </div>
                    </div>
                  </div>
                </MotionCard>
              )
            })}
          </StaggerContainer>
        </div>

        {/* Quick actions */}
        <div className="card-glass p-5 mb-6">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Acoes rapidas</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Plus, label: 'Novo Lead', href: '/leads' },
              { icon: Kanban, label: 'Ver Pipeline', href: '/pipeline' },
              { icon: BarChart3, label: 'Analytics', href: '/analytics' },
              { icon: Settings, label: 'Configurar', href: '/configuracoes' },
            ].map((action) => {
              const Icon = action.icon
              return (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-bg-hover transition-colors text-center"
                >
                  <Icon className="h-5 w-5 text-brand-cyan" />
                  <span className="text-xs font-medium text-text-primary">{action.label}</span>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
