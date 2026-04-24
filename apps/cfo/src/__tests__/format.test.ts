import { describe, it, expect } from 'vitest'
import { formatCurrency, formatPercent, formatDate, formatMonthYear } from '@/lib/format'

describe('formatCurrency', () => {
  it('formata valores positivos em BRL', () => {
    expect(formatCurrency(10000)).toBe('R$\u00a010.000,00')
  })

  it('formata valores negativos em BRL', () => {
    const result = formatCurrency(-5000)
    expect(result).toContain('5.000,00')
  })

  it('formata zero', () => {
    expect(formatCurrency(0)).toBe('R$\u00a00,00')
  })

  it('formata valores com centavos', () => {
    expect(formatCurrency(1234.56)).toBe('R$\u00a01.234,56')
  })

  it('formata valores grandes com separador de milhar', () => {
    expect(formatCurrency(1000000)).toBe('R$\u00a01.000.000,00')
  })

  it('retorna R$ 0,00 para NaN', () => {
    expect(formatCurrency(NaN)).toBe('R$ 0,00')
  })

  it('retorna R$ 0,00 para Infinity', () => {
    expect(formatCurrency(Infinity)).toBe('R$ 0,00')
  })

  it('retorna R$ 0,00 para -Infinity', () => {
    expect(formatCurrency(-Infinity)).toBe('R$ 0,00')
  })
})

describe('formatPercent', () => {
  it('formata percentual positivo com prefixo +', () => {
    expect(formatPercent(75)).toBe('+75.0%')
  })

  it('formata percentual zero com prefixo +', () => {
    expect(formatPercent(0)).toBe('+0.0%')
  })

  it('formata percentual negativo sem prefixo +', () => {
    expect(formatPercent(-15)).toBe('-15.0%')
  })

  it('aceita número de casas decimais personalizado', () => {
    expect(formatPercent(33.333, 2)).toBe('+33.33%')
  })

  it('retorna — para NaN', () => {
    expect(formatPercent(NaN)).toBe('—')
  })

  it('retorna — para Infinity', () => {
    expect(formatPercent(Infinity)).toBe('—')
  })

  it('retorna — para -Infinity', () => {
    expect(formatPercent(-Infinity)).toBe('—')
  })
})

describe('formatDate', () => {
  it('formata uma data ISO em dd/MM/yyyy', () => {
    expect(formatDate('2026-04-01')).toBe('01/04/2026')
  })

  it('aceita um objeto Date', () => {
    expect(formatDate(new Date('2026-12-25T12:00:00'))).toBe('25/12/2026')
  })
})

describe('formatMonthYear', () => {
  it('formata mês e ano em português', () => {
    const result = formatMonthYear('2026-01-15')
    expect(result.toLowerCase()).toContain('janeiro')
    expect(result).toContain('2026')
  })
})
