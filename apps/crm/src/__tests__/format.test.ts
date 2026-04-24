import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatCurrency, formatDate, formatTimeAgo, formatPercent, formatPhone, formatWhatsAppUrl } from '@/lib/format'

describe('formatCurrency', () => {
  it('formata valores positivos em BRL', () => {
    expect(formatCurrency(10000)).toBe('R$\u00a010.000,00')
  })

  it('formata zero', () => {
    expect(formatCurrency(0)).toBe('R$\u00a00,00')
  })

  it('formata valores com centavos', () => {
    expect(formatCurrency(1234.56)).toBe('R$\u00a01.234,56')
  })

  it('formata valores negativos', () => {
    const result = formatCurrency(-5000)
    expect(result).toContain('5.000,00')
  })

  it('formata valores grandes', () => {
    expect(formatCurrency(1000000)).toBe('R$\u00a01.000.000,00')
  })
})

describe('formatDate', () => {
  it('formata uma data ISO em dd/MM/yyyy', () => {
    expect(formatDate('2026-04-01')).toBe('01/04/2026')
  })

  it('aceita um objeto Date', () => {
    expect(formatDate(new Date('2026-12-25T00:00:00'))).toBe('25/12/2026')
  })

  it('formata data com timestamp', () => {
    expect(formatDate('2026-06-15T14:30:00Z')).toBe('15/06/2026')
  })
})

describe('formatTimeAgo', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-23T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('produces relative time for recent dates', () => {
    const oneHourAgo = new Date('2026-04-23T11:00:00Z').toISOString()
    const result = formatTimeAgo(oneHourAgo)
    // date-fns formatDistanceToNow with ptBR locale
    expect(result).toContain('hora')
  })

  it('produces relative time for days ago', () => {
    const twoDaysAgo = new Date('2026-04-21T12:00:00Z').toISOString()
    const result = formatTimeAgo(twoDaysAgo)
    expect(result).toContain('2')
    expect(result).toContain('dia')
  })

  it('includes suffix (ha ... atras)', () => {
    const yesterday = new Date('2026-04-22T12:00:00Z').toISOString()
    const result = formatTimeAgo(yesterday)
    // addSuffix: true adds "ha X" in ptBR
    expect(result).toMatch(/h[aá]/)
  })

  it('accepts Date objects', () => {
    const d = new Date('2026-04-23T11:30:00Z')
    const result = formatTimeAgo(d)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
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

  it('aceita numero de casas decimais personalizado', () => {
    expect(formatPercent(33.333, 2)).toBe('+33.33%')
  })
})

describe('formatPhone', () => {
  it('formata celular com 11 digitos', () => {
    expect(formatPhone('11999887766')).toBe('(11) 99988-7766')
  })

  it('formata fixo com 10 digitos', () => {
    expect(formatPhone('1133224455')).toBe('(11) 3322-4455')
  })

  it('returns raw input for non-standard lengths', () => {
    expect(formatPhone('123')).toBe('123')
  })
})

describe('formatWhatsAppUrl', () => {
  it('generates correct URL without message', () => {
    expect(formatWhatsAppUrl('11999887766')).toBe('https://wa.me/5511999887766')
  })

  it('does not double-add country code', () => {
    expect(formatWhatsAppUrl('5511999887766')).toBe('https://wa.me/5511999887766')
  })

  it('includes personalized message when name provided', () => {
    const url = formatWhatsAppUrl('11999887766', 'Maria')
    expect(url).toContain('https://wa.me/5511999887766?text=')
    expect(url).toContain('Maria')
  })

  it('strips non-digit characters from phone', () => {
    expect(formatWhatsAppUrl('(11) 99988-7766')).toBe('https://wa.me/5511999887766')
  })
})
