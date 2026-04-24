import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { normalizeProjetoStatus, getProjetoEntrega, type Projeto, type ProjetoStatus } from '@/types/database'

// ── Helper: create a mock Projeto ──
function makeProjeto(overrides: Omit<Partial<Projeto>, 'status'> & { status: string }): Projeto {
  const { status, ...rest } = overrides
  return {
    id: crypto.randomUUID(),
    nome: 'Projeto Teste',
    titulo: null,
    deal_id: null,
    descricao: null,
    cliente: null,
    valor: null,
    prazo: null,
    data_inicio: null,
    data_entrega: null,
    responsavel: null,
    progresso: 0,
    tags: null,
    prioridade: 'media',
    categoria: null,
    cor: null,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    user_id: null,
    ...rest,
    status: normalizeProjetoStatus(status),
  }
}

// ── Replicate dashboard filter logic as pure functions ──
function filterEntreguesMes(projetos: Projeto[], month: number, year: number): Projeto[] {
  return projetos.filter((p) => {
    if (p.status !== 'entregue') return false
    const entregaDate = p.data_entrega ?? p.updated_at
    const d = new Date(entregaDate)
    return d.getMonth() === month && d.getFullYear() === year
  })
}

function filterAtrasados(projetos: Projeto[], today: string): Projeto[] {
  return projetos.filter((p) => {
    const entrega = getProjetoEntrega(p)
    return entrega != null && entrega < today && !['entregue', 'cancelado'].includes(p.status)
  })
}

function calcStatusDistribuicao(projetos: Projeto[]) {
  return {
    backlog: projetos.filter((p) => p.status === 'backlog').length,
    em_andamento: projetos.filter((p) => p.status === 'em_andamento').length,
    revisao: projetos.filter((p) => p.status === 'revisao').length,
    entregue: projetos.filter((p) => p.status === 'entregue').length,
  }
}

function calcValorPipeline(projetos: Projeto[]): number {
  const ativos = projetos.filter((p) => ['backlog', 'em_andamento', 'revisao'].includes(p.status))
  return ativos.reduce((sum, p) => sum + (p.valor ?? 0), 0)
}

// ── Tests ──

describe('Entregas no Mes', () => {
  it('uses data_entrega (not updated_at) when available', () => {
    const projetos = [
      makeProjeto({
        status: 'entregue',
        data_entrega: '2026-04-15',
        updated_at: '2026-03-01T00:00:00Z',
      }),
    ]
    // April = month 3
    const result = filterEntreguesMes(projetos, 3, 2026)
    expect(result).toHaveLength(1)
  })

  it('falls back to updated_at when data_entrega is null', () => {
    const projetos = [
      makeProjeto({
        status: 'entregue',
        data_entrega: null,
        updated_at: '2026-04-20T00:00:00Z',
      }),
    ]
    const result = filterEntreguesMes(projetos, 3, 2026)
    expect(result).toHaveLength(1)
  })

  it('excludes non-entregue projects', () => {
    const projetos = [
      makeProjeto({
        status: 'em_andamento',
        data_entrega: '2026-04-15',
      }),
    ]
    const result = filterEntreguesMes(projetos, 3, 2026)
    expect(result).toHaveLength(0)
  })
})

describe('Atrasados', () => {
  it('correctly identifies overdue projects', () => {
    const projetos = [
      makeProjeto({
        status: 'em_andamento',
        data_entrega: '2026-04-01',
      }),
    ]
    const result = filterAtrasados(projetos, '2026-04-23')
    expect(result).toHaveLength(1)
  })

  it('excludes entregue projects even if past deadline', () => {
    const projetos = [
      makeProjeto({
        status: 'entregue',
        data_entrega: '2026-04-01',
      }),
    ]
    const result = filterAtrasados(projetos, '2026-04-23')
    expect(result).toHaveLength(0)
  })

  it('excludes cancelado projects even if past deadline', () => {
    const projetos = [
      makeProjeto({
        status: 'cancelado',
        data_entrega: '2026-04-01',
      }),
    ]
    const result = filterAtrasados(projetos, '2026-04-23')
    expect(result).toHaveLength(0)
  })

  it('excludes projects with future data_entrega', () => {
    const projetos = [
      makeProjeto({
        status: 'em_andamento',
        data_entrega: '2026-05-01',
      }),
    ]
    const result = filterAtrasados(projetos, '2026-04-23')
    expect(result).toHaveLength(0)
  })

  it('uses prazo as fallback via getProjetoEntrega', () => {
    const projetos = [
      makeProjeto({
        status: 'em_andamento',
        data_entrega: null,
        prazo: '2026-04-01',
      }),
    ]
    const result = filterAtrasados(projetos, '2026-04-23')
    expect(result).toHaveLength(1)
  })

  it('excludes projects with no delivery date at all', () => {
    const projetos = [
      makeProjeto({
        status: 'em_andamento',
        data_entrega: null,
        prazo: null,
      }),
    ]
    const result = filterAtrasados(projetos, '2026-04-23')
    expect(result).toHaveLength(0)
  })
})

describe('Status distribuicao', () => {
  it('counts are correct for mixed statuses', () => {
    const projetos = [
      makeProjeto({ status: 'backlog' }),
      makeProjeto({ status: 'backlog' }),
      makeProjeto({ status: 'em_andamento' }),
      makeProjeto({ status: 'revisao' }),
      makeProjeto({ status: 'entregue' }),
      makeProjeto({ status: 'entregue' }),
      makeProjeto({ status: 'entregue' }),
    ]
    const dist = calcStatusDistribuicao(projetos)
    expect(dist.backlog).toBe(2)
    expect(dist.em_andamento).toBe(1)
    expect(dist.revisao).toBe(1)
    expect(dist.entregue).toBe(3)
  })

  it('returns zeros for empty array', () => {
    const dist = calcStatusDistribuicao([])
    expect(dist.backlog).toBe(0)
    expect(dist.em_andamento).toBe(0)
    expect(dist.revisao).toBe(0)
    expect(dist.entregue).toBe(0)
  })

  it('normalizes em_revisao to revisao', () => {
    const projetos = [makeProjeto({ status: 'em_revisao' as string })]
    const dist = calcStatusDistribuicao(projetos)
    expect(dist.revisao).toBe(1)
  })
})

describe('Valor pipeline', () => {
  it('sums valor of active projects only', () => {
    const projetos = [
      makeProjeto({ status: 'em_andamento', valor: 5000 }),
      makeProjeto({ status: 'backlog', valor: 3000 }),
      makeProjeto({ status: 'entregue', valor: 10000 }),
    ]
    expect(calcValorPipeline(projetos)).toBe(8000)
  })

  it('handles null valor as 0', () => {
    const projetos = [
      makeProjeto({ status: 'em_andamento', valor: null }),
      makeProjeto({ status: 'backlog', valor: 2000 }),
    ]
    expect(calcValorPipeline(projetos)).toBe(2000)
  })

  it('returns 0 for empty array', () => {
    expect(calcValorPipeline([])).toBe(0)
  })

  it('includes revisao in pipeline', () => {
    const projetos = [
      makeProjeto({ status: 'revisao', valor: 7000 }),
    ]
    expect(calcValorPipeline(projetos)).toBe(7000)
  })
})
