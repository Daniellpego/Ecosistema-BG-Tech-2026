// ── Enums ──
export type ProjetoStatus = 'backlog' | 'em_andamento' | 'revisao' | 'em_revisao' | 'entregue' | 'cancelado'
export type Prioridade = 'baixa' | 'media' | 'alta' | 'urgente'
export type Categoria = 'projeto_avulso' | 'mensalidade' | 'consultoria' | 'mvp' | 'interno'
export type TarefaStatus = 'todo' | 'doing' | 'done'
export type MilestoneStatus = 'pendente' | 'em_andamento' | 'concluido' | 'atrasado'
export type UpdateTipo = 'nota' | 'status_change' | 'milestone' | 'bloqueio' | 'entrega'
export type PresentationType = 'status_report' | 'roadmap' | 'financeiro' | 'custom'
export type RequestStatus = 'pending' | 'approved' | 'generating' | 'completed' | 'rejected'
export type SyncStatus = 'synced' | 'pending' | 'error'
export type UserRole = 'cto' | 'socio' | 'dev'

// ── Tables ──
export interface Projeto {
  id: string
  nome: string
  titulo: string | null
  deal_id: string | null
  descricao: string | null
  cliente: string | null
  status: ProjetoStatus
  valor: number | null
  prazo: string | null
  data_inicio: string | null
  data_entrega: string | null
  responsavel: string | null
  progresso: number
  tags: string[] | null
  prioridade: Prioridade
  categoria: Categoria | null
  cor: string | null
  created_at: string
  updated_at: string
  user_id: string | null
}

/** Helper to get display title (titulo or nome fallback) */
export function getProjetoTitulo(p: Projeto): string {
  return p.titulo ?? p.nome
}

/** Helper to get delivery date (data_entrega or prazo fallback) */
export function getProjetoEntrega(p: Projeto): string | null {
  return p.data_entrega ?? p.prazo
}

export interface Tarefa {
  id: string
  projeto_id: string
  titulo: string
  descricao: string | null
  status: TarefaStatus
  prioridade: Prioridade
  responsavel: string | null
  data_limite: string | null
  estimativa_horas: number | null
  horas_gastas: number | null
  ordem: number
  created_at: string
  updated_at: string
}

export interface ProjectMilestone {
  id: string
  projeto_id: string
  titulo: string
  descricao: string | null
  data_prevista: string
  data_concluida: string | null
  status: MilestoneStatus
  ordem: number
  created_at: string
  updated_at: string
}

export interface ProjectUpdate {
  id: string
  projeto_id: string
  autor: string
  tipo: UpdateTipo
  conteudo: string
  visivel_socio: boolean
  created_at: string
  projeto_titulo?: string
}

export interface Profile {
  id: string
  user_id: string
  role: UserRole
  nome: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Presentation {
  id: string
  titulo: string
  tipo: PresentationType
  storage_path: string
  storage_url: string
  generated_by: string
  metadata: Record<string, unknown>
  created_at: string
}

export interface PresentationRequest {
  id: string
  requested_by: string
  tipo: PresentationType
  notas: string | null
  status: RequestStatus
  presentation_id: string | null
  created_at: string
  updated_at: string
}

export interface CalendarSync {
  id: string
  entity_type: 'milestone' | 'projeto' | 'tarefa'
  entity_id: string
  gcal_event_id: string
  gcal_calendar_id: string
  last_synced_at: string
  sync_status: SyncStatus
  created_at: string
}

// ── Insert types ──
export type ProjetoInsert = Omit<Projeto, 'id' | 'created_at' | 'updated_at' | 'progresso'>
export type TarefaInsert = Omit<Tarefa, 'id' | 'created_at' | 'updated_at'>
export type MilestoneInsert = Omit<ProjectMilestone, 'id' | 'created_at' | 'updated_at' | 'data_concluida'>
export type UpdateInsert = Omit<ProjectUpdate, 'id' | 'created_at' | 'projeto_titulo'>
