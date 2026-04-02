import { describe, it, expect } from 'vitest'
import { computeProLabore } from '@/hooks/use-config-cfo'
import type { ConfigCFO } from '@/hooks/use-config-cfo'

function makeConfig(overrides: Partial<ConfigCFO> = {}): ConfigCFO {
  return {
    id: 'cfg1',
    aliquota_simples: 6,
    prolabore_valor: 3000,
    prolabore_socios: 2,
    prolabore_inss_percentual: 11,
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('computeProLabore', () => {
  it('retorna zeros quando config é undefined', () => {
    const result = computeProLabore(undefined)
    expect(result.totalProLabore).toBe(0)
    expect(result.totalINSS).toBe(0)
    expect(result.custoTotal).toBe(0)
  })

  it('retorna zeros quando prolabore_valor é 0', () => {
    const config = makeConfig({ prolabore_valor: 0 })
    const result = computeProLabore(config)
    expect(result.totalProLabore).toBe(0)
    expect(result.totalINSS).toBe(0)
    expect(result.custoTotal).toBe(0)
  })

  it('calcula pro-labore para múltiplos sócios', () => {
    const config = makeConfig({ prolabore_valor: 3000, prolabore_socios: 2, prolabore_inss_percentual: 11 })
    const result = computeProLabore(config)

    expect(result.totalProLabore).toBe(6000) // 3000 * 2
    expect(result.totalINSS).toBeCloseTo(660, 2) // 6000 * 0.11
    expect(result.custoTotal).toBeCloseTo(6660, 2) // 6000 + 660
  })

  it('calcula pro-labore para um único sócio', () => {
    const config = makeConfig({ prolabore_valor: 5000, prolabore_socios: 1, prolabore_inss_percentual: 11 })
    const result = computeProLabore(config)

    expect(result.totalProLabore).toBe(5000)
    expect(result.totalINSS).toBeCloseTo(550, 2)
    expect(result.custoTotal).toBeCloseTo(5550, 2)
  })

  it('calcula INSS com alíquota personalizada', () => {
    const config = makeConfig({ prolabore_valor: 10000, prolabore_socios: 1, prolabore_inss_percentual: 20 })
    const result = computeProLabore(config)

    expect(result.totalINSS).toBe(2000) // 10000 * 0.20
    expect(result.custoTotal).toBe(12000)
  })
})
