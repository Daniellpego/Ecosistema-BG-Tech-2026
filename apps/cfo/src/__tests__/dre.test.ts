import { describe, it, expect } from 'vitest'
import { computeMonthDRE } from '@/hooks/use-dre'
import type { Receita, CustoFixo, GastoVariavel } from '@/types/database'

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

function makeCustoFixo(overrides: Partial<CustoFixo> = {}): CustoFixo {
  return {
    id: 'cf1',
    nome: 'Custo Teste',
    categoria: 'ferramentas',
    valor_mensal: 2000,
    data_inicio: '2026-01-01',
    dia_vencimento: null,
    recorrencia: 'mensal',
    obrigatorio: true,
    status: 'ativo',
    observacoes: null,
    comprovante_url: null,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    created_by: null,
    ...overrides,
  }
}

function makeGastoVariavel(overrides: Partial<GastoVariavel> = {}): GastoVariavel {
  return {
    id: 'gv1',
    data: '2026-01-10',
    descricao: 'Gasto Teste',
    cliente: null,
    categoria: 'marketing',
    tipo: 'marketing',
    valor: 1000,
    status: 'confirmado',
    observacoes: null,
    comprovante_url: null,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    created_by: null,
    ...overrides,
  }
}

// ─── DRE cascade ──────────────────────────────────────────────────────────────

describe('computeMonthDRE', () => {
  it('retorna zeros quando não há dados', () => {
    const result = computeMonthDRE([], [], [])
    expect(result.receitaBruta).toBe(0)
    expect(result.custosVariaveisTotal).toBe(0)
    expect(result.margemBruta).toBe(0)
    expect(result.cfTotal).toBe(0)
    expect(result.resultadoOperacional).toBe(0)
    expect(result.impostos).toBe(0)
    expect(result.resultadoLiquido).toBe(0)
    expect(result.pctMargemBruta).toBe(0)
    expect(result.pctMargemLiquida).toBe(0)
  })

  it('calcula a cascata DRE corretamente', () => {
    const receitas = [makeReceita({ valor_bruto: 10000 })]
    const custosFixos = [makeCustoFixo({ valor_mensal: 2000 })]
    const gastosVariaveis = [makeGastoVariavel({ tipo: 'operacional', valor: 1000 })]

    const result = computeMonthDRE(receitas, custosFixos, gastosVariaveis)

    expect(result.receitaBruta).toBe(10000)
    expect(result.custosVariaveisTotal).toBe(1000) // gasto operacional
    expect(result.margemBruta).toBe(9000) // 10000 - 1000
    expect(result.cfTotal).toBe(2000)
    expect(result.resultadoOperacional).toBe(7000) // 9000 - 2000
    expect(result.impostos).toBe(0) // nenhum gasto com tipo=impostos
    expect(result.resultadoLiquido).toBe(7000)
  })

  it('separa impostos dos demais custos variáveis (Regra Simples Nacional)', () => {
    const receitas = [makeReceita({ valor_bruto: 20000 })]
    const custosFixos = [makeCustoFixo({ valor_mensal: 3000 })]
    const gastosVariaveis = [
      makeGastoVariavel({ tipo: 'operacional', valor: 2000 }),
      makeGastoVariavel({ id: 'gv2', tipo: 'impostos', valor: 3000 }),
    ]

    const result = computeMonthDRE(receitas, custosFixos, gastosVariaveis)

    // impostos NÃO entram nos custos variáveis
    expect(result.custosVariaveisTotal).toBe(2000)
    expect(result.margemBruta).toBe(18000) // 20000 - 2000

    // impostos saem DEPOIS do resultado operacional
    expect(result.resultadoOperacional).toBe(15000) // 18000 - 3000
    expect(result.impostos).toBe(3000)
    expect(result.resultadoLiquido).toBe(12000) // 15000 - 3000
  })

  it('ignora receitas com status diferente de confirmado', () => {
    const receitas = [
      makeReceita({ id: 'r1', status: 'confirmado', valor_bruto: 10000 }),
      makeReceita({ id: 'r2', status: 'previsto', valor_bruto: 5000 }),
      makeReceita({ id: 'r3', status: 'cancelado', valor_bruto: 2000 }),
    ]

    const result = computeMonthDRE(receitas, [], [])

    expect(result.receitaBruta).toBe(10000)
  })

  it('ignora custos fixos com status diferente de ativo', () => {
    const custosFixos = [
      makeCustoFixo({ id: 'cf1', status: 'ativo', valor_mensal: 2000 }),
      makeCustoFixo({ id: 'cf2', status: 'suspenso', valor_mensal: 1000 }),
      makeCustoFixo({ id: 'cf3', status: 'cancelado', valor_mensal: 500 }),
    ]

    const result = computeMonthDRE([], custosFixos, [])

    expect(result.cfTotal).toBe(2000)
  })

  it('ignora gastos variáveis com status diferente de confirmado', () => {
    const gastosVariaveis = [
      makeGastoVariavel({ id: 'gv1', status: 'confirmado', valor: 1000, tipo: 'operacional' }),
      makeGastoVariavel({ id: 'gv2', status: 'previsto', valor: 500, tipo: 'operacional' }),
    ]

    const result = computeMonthDRE([], [], gastosVariaveis)

    expect(result.custosVariaveisTotal).toBe(1000)
  })

  it('calcula percentual de margem bruta corretamente', () => {
    const receitas = [makeReceita({ valor_bruto: 10000 })]
    const gastosVariaveis = [makeGastoVariavel({ tipo: 'operacional', valor: 2500 })]

    const result = computeMonthDRE(receitas, [], gastosVariaveis)

    expect(result.pctMargemBruta).toBeCloseTo(75, 2) // (10000 - 2500) / 10000 * 100 = 75%
  })

  it('calcula MRR a partir de receitas recorrentes', () => {
    const receitas = [
      makeReceita({ id: 'r1', tipo: 'mensalidade', recorrente: true, valor_bruto: 5000 }),
      makeReceita({ id: 'r2', tipo: 'setup', recorrente: false, valor_bruto: 3000 }),
      makeReceita({ id: 'r3', tipo: 'mensalidade', recorrente: true, valor_bruto: 2000 }),
    ]

    const result = computeMonthDRE(receitas, [], [])

    // receitaMensalidades = somente tipo mensalidade
    expect(result.receitaMensalidades).toBe(7000)
    expect(result.receitaSetup).toBe(3000)
    expect(result.receitaBruta).toBe(10000)
  })

  it('categoriza custos fixos por categoria', () => {
    const custosFixos = [
      makeCustoFixo({ id: 'cf1', categoria: 'ferramentas', valor_mensal: 1000 }),
      makeCustoFixo({ id: 'cf2', categoria: 'contabilidade', valor_mensal: 800 }),
      makeCustoFixo({ id: 'cf3', categoria: 'pro_labore', valor_mensal: 5000 }),
      makeCustoFixo({ id: 'cf4', categoria: 'infraestrutura', valor_mensal: 500 }),
    ]

    const result = computeMonthDRE([], custosFixos, [])

    expect(result.cfFerramentas).toBe(1000)
    expect(result.cfContabilidade).toBe(800)
    expect(result.cfProLabore).toBe(5000)
    expect(result.cfInfra).toBe(500)
    expect(result.cfTotal).toBe(7300)
  })

  it('resultado negativo (prejuízo) é calculado corretamente', () => {
    const receitas = [makeReceita({ valor_bruto: 1000 })]
    const custosFixos = [makeCustoFixo({ valor_mensal: 5000 })]

    const result = computeMonthDRE(receitas, custosFixos, [])

    expect(result.resultadoLiquido).toBe(-4000)
    expect(result.pctMargemLiquida).toBeCloseTo(-400, 0)
  })
})
