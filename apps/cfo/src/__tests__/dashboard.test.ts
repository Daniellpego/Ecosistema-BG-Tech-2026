import { describe, it, expect } from 'vitest'
import {
  computeMRR,
  computeBurnRate,
  computeRunway,
  computeMargem,
  computeBreakEven,
  computeMargemBruta,
  computeHealthStatus,
} from '@/hooks/use-dashboard'
import type { DashboardKPIs } from '@/hooks/use-dashboard'
import type { Receita } from '@/types/database'

// ─── helpers ──────────────────────────────────────────────────────────────────

function makeReceita(overrides: Partial<Receita> = {}): Receita {
  return {
    id: 'r1',
    data: '2026-01-15',
    cliente: 'Cliente Teste',
    descricao: null,
    tipo: 'mensalidade',
    valor_bruto: 10000,
    taxas: 0,
    valor_liquido: 10000,
    recorrente: true,
    status: 'confirmado',
    categoria: null,
    observacoes: null,
    comprovante_url: null,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    created_by: null,
    ...overrides,
  }
}

function makeKPIs(overrides: Partial<DashboardKPIs> = {}): DashboardKPIs {
  return {
    receitaTotal: 20000,
    mrr: 15000,
    burnRate: 10000,
    custosFixos: 5000,
    custosVariaveis: 3000,
    resultadoLiquido: 5000,
    caixaDisponivel: 50000,
    runway: 5,
    margem: 25,
    breakEven: 8000,
    margemBruta: 85,
    ...overrides,
  }
}

// ─── MRR ──────────────────────────────────────────────────────────────────────

describe('computeMRR', () => {
  it('soma apenas receitas recorrentes (excluindo setup)', () => {
    const receitas = [
      makeReceita({ id: 'r1', recorrente: true, tipo: 'mensalidade', valor_bruto: 5000 }),
      makeReceita({ id: 'r2', recorrente: true, tipo: 'setup', valor_bruto: 3000 }),
      makeReceita({ id: 'r3', recorrente: false, tipo: 'projeto_avulso', valor_bruto: 8000 }),
      makeReceita({ id: 'r4', recorrente: true, tipo: 'consultoria', valor_bruto: 2000 }),
    ]

    expect(computeMRR(receitas)).toBe(7000) // 5000 + 2000
  })

  it('retorna 0 quando não há receitas recorrentes', () => {
    const receitas = [
      makeReceita({ id: 'r1', recorrente: false, tipo: 'projeto_avulso', valor_bruto: 8000 }),
      makeReceita({ id: 'r2', recorrente: true, tipo: 'setup', valor_bruto: 3000 }),
    ]

    expect(computeMRR(receitas)).toBe(0)
  })

  it('retorna 0 para lista vazia', () => {
    expect(computeMRR([])).toBe(0)
  })

  it('inclui receitas recorrentes tipo consultoria e mvp', () => {
    const receitas = [
      makeReceita({ id: 'r1', recorrente: true, tipo: 'consultoria', valor_bruto: 4000 }),
      makeReceita({ id: 'r2', recorrente: true, tipo: 'mvp', valor_bruto: 6000 }),
    ]

    expect(computeMRR(receitas)).toBe(10000)
  })
})

// ─── Burn Rate ────────────────────────────────────────────────────────────────

describe('computeBurnRate', () => {
  it('soma custos fixos + média gastos variáveis 3m + média impostos 3m', () => {
    const result = computeBurnRate(5000, 2000, 1000)
    expect(result).toBe(8000) // 5000 + 2000 + 1000
  })

  it('retorna apenas custos fixos quando não há variáveis', () => {
    expect(computeBurnRate(5000, 0, 0)).toBe(5000)
  })

  it('retorna 0 quando tudo é zero', () => {
    expect(computeBurnRate(0, 0, 0)).toBe(0)
  })

  it('inclui impostos separados dos gastos variáveis', () => {
    // This validates that impostos are a SEPARATE parameter from gastos variáveis
    const burnRate = computeBurnRate(3000, 1500, 800)
    expect(burnRate).toBe(5300)
  })
})

// ─── Runway ───────────────────────────────────────────────────────────────────

describe('computeRunway', () => {
  it('calcula runway em meses (caixa / burnRate)', () => {
    expect(computeRunway(30000, 10000)).toBe(3)
  })

  it('retorna 0 quando burnRate é 0', () => {
    expect(computeRunway(50000, 0)).toBe(0)
  })

  it('retorna 0 quando caixa e burnRate são 0', () => {
    expect(computeRunway(0, 0)).toBe(0)
  })

  it('retorna valor fracionário', () => {
    expect(computeRunway(15000, 10000)).toBeCloseTo(1.5, 2)
  })
})

// ─── Margem ───────────────────────────────────────────────────────────────────

describe('computeMargem', () => {
  it('calcula margem líquida em percentual', () => {
    // resultadoLiquido / receitaTotal * 100
    expect(computeMargem(5000, 20000)).toBe(25)
  })

  it('retorna 0 quando receita é 0', () => {
    expect(computeMargem(0, 0)).toBe(0)
  })

  it('retorna valor negativo quando resultado é negativo', () => {
    expect(computeMargem(-3000, 10000)).toBe(-30)
  })

  it('retorna 0 quando receita é 0 mesmo com resultado não-zero', () => {
    expect(computeMargem(-5000, 0)).toBe(0)
  })
})

// ─── Break-Even ──────────────────────────────────────────────────────────────

describe('computeBreakEven', () => {
  it('calcula break-even: custosFixos / (1 - cvRatio)', () => {
    // cvRatio = 0.25 → break-even = 5000 / 0.75 = 6666.67
    expect(computeBreakEven(5000, 0.25)).toBeCloseTo(6666.67, 0)
  })

  it('retorna 0 quando cvRatio >= 1 (impossível cobrir custos fixos)', () => {
    expect(computeBreakEven(5000, 1)).toBe(0)
    expect(computeBreakEven(5000, 1.5)).toBe(0)
  })

  it('retorna custos fixos quando cvRatio é 0 (sem custos variáveis)', () => {
    expect(computeBreakEven(5000, 0)).toBe(5000)
  })

  it('retorna 0 quando custos fixos são 0', () => {
    expect(computeBreakEven(0, 0.3)).toBe(0)
  })
})

// ─── Margem Bruta ────────────────────────────────────────────────────────────

describe('computeMargemBruta', () => {
  it('calcula margem bruta em percentual', () => {
    // (20000 - 5000) / 20000 * 100 = 75%
    expect(computeMargemBruta(20000, 5000)).toBe(75)
  })

  it('retorna 0 quando receita é 0', () => {
    expect(computeMargemBruta(0, 0)).toBe(0)
  })

  it('retorna 100% quando não há gastos variáveis', () => {
    expect(computeMargemBruta(10000, 0)).toBe(100)
  })

  it('retorna valor negativo quando gastos excedem receita', () => {
    expect(computeMargemBruta(5000, 8000)).toBeCloseTo(-60, 0)
  })
})

// ─── Health Status ───────────────────────────────────────────────────────────

describe('computeHealthStatus', () => {
  it('retorna sem_dados quando todos os valores são 0', () => {
    const kpis = makeKPIs({
      receitaTotal: 0,
      custosFixos: 0,
      custosVariaveis: 0,
      caixaDisponivel: 0,
    })
    expect(computeHealthStatus(kpis, false)).toBe('sem_dados')
  })

  it('retorna critico quando runway < 1', () => {
    const kpis = makeKPIs({ runway: 0.5 })
    expect(computeHealthStatus(kpis, false)).toBe('critico')
  })

  it('retorna critico quando burnRate > receitaTotal', () => {
    const kpis = makeKPIs({ burnRate: 25000, receitaTotal: 20000, runway: 5 })
    expect(computeHealthStatus(kpis, false)).toBe('critico')
  })

  it('retorna critico quando caixa caindo 3 meses', () => {
    const kpis = makeKPIs({ runway: 5 })
    expect(computeHealthStatus(kpis, true)).toBe('critico')
  })

  it('retorna atencao quando runway entre 1 e 3', () => {
    const kpis = makeKPIs({ runway: 2, burnRate: 5000, receitaTotal: 20000 })
    expect(computeHealthStatus(kpis, false)).toBe('atencao')
  })

  it('retorna atencao quando resultado negativo mas leve (< 10% da receita)', () => {
    const kpis = makeKPIs({
      runway: 5,
      burnRate: 5000,
      receitaTotal: 20000,
      resultadoLiquido: -1500, // > -(20000*0.1) = -2000
      margem: -7.5,
    })
    expect(computeHealthStatus(kpis, false)).toBe('atencao')
  })

  it('retorna saudavel quando runway >= 3, resultado >= 0, margem >= 30', () => {
    const kpis = makeKPIs({
      runway: 5,
      burnRate: 5000,
      receitaTotal: 20000,
      resultadoLiquido: 8000,
      margem: 40,
    })
    expect(computeHealthStatus(kpis, false)).toBe('saudavel')
  })

  it('retorna atencao como fallback (margem < 30 com resultado positivo)', () => {
    const kpis = makeKPIs({
      runway: 5,
      burnRate: 5000,
      receitaTotal: 20000,
      resultadoLiquido: 2000,
      margem: 10,
    })
    expect(computeHealthStatus(kpis, false)).toBe('atencao')
  })
})
