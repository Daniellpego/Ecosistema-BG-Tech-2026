import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatCurrency, formatPercent, formatDate, formatRelative, daysUntil } from '@/lib/format'

describe('formatCurrency', () => {
  it('formata valores positivos em BRL', () => {
    expect(formatCurrency(10000)).toBe('R$\u00a010.000,00')
  })

  it('formata zero', () => {
    expect(formatCurrency(0)).toBe('R$\u00a00,00')
  })

  it('handles NaN returning R$ 0,00', () => {
    expect(formatCurrency(NaN)).toBe('R$ 0,00')
  })

  it('handles Infinity returning R$ 0,00', () => {
    expect(formatCurrency(Infinity)).toBe('R$ 0,00')
  })

  it('handles -Infinity returning R$ 0,00', () => {
    expect(formatCurrency(-Infinity)).toBe('R$ 0,00')
  })

  it('formata valores com centavos', () => {
    expect(formatCurrency(1234.56)).toBe('R$\u00a01.234,56')
  })
})

describe('formatPercent', () => {
  it('formata percentual positivo', () => {
    expect(formatPercent(75)).toBe('75%')
  })

  it('formata percentual zero', () => {
    expect(formatPercent(0)).toBe('0%')
  })

  it('handles NaN returning 0%', () => {
    expect(formatPercent(NaN)).toBe('0%')
  })

  it('handles Infinity returning 0%', () => {
    expect(formatPercent(Infinity)).toBe('0%')
  })
})

describe('formatDate', () => {
  it('formata uma data ISO em dd/MM/yyyy', () => {
    expect(formatDate('2026-04-01')).toBe('01/04/2026')
  })

  it('aceita um objeto Date', () => {
    expect(formatDate(new Date('2026-12-25T00:00:00'))).toBe('25/12/2026')
  })

  it('handles invalid date string returning empty string', () => {
    expect(formatDate('not-a-date')).toBe('')
  })

  it('handles invalid Date object returning empty string', () => {
    expect(formatDate(new Date('invalid'))).toBe('')
  })
})

describe('formatRelative', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-23T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "agora" for timestamps less than 60 seconds ago', () => {
    const thirtySecondsAgo = new Date('2026-04-23T11:59:40Z').toISOString()
    expect(formatRelative(thirtySecondsAgo)).toBe('agora')
  })

  it('returns minutes for timestamps less than 1 hour ago', () => {
    const fiveMinAgo = new Date('2026-04-23T11:55:00Z').toISOString()
    expect(formatRelative(fiveMinAgo)).toBe('5min')
  })

  it('returns hours for timestamps less than 1 day ago', () => {
    const threeHoursAgo = new Date('2026-04-23T09:00:00Z').toISOString()
    expect(formatRelative(threeHoursAgo)).toBe('3h')
  })

  it('returns days for timestamps less than 1 week ago', () => {
    const twoDaysAgo = new Date('2026-04-21T12:00:00Z').toISOString()
    expect(formatRelative(twoDaysAgo)).toBe('2d')
  })

  it('returns formatted date for timestamps older than 1 week', () => {
    const twoWeeksAgo = '2026-04-09'
    const result = formatRelative(twoWeeksAgo)
    expect(result).toBe('09/04/2026')
  })
})

describe('daysUntil', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-23T10:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns 0 for today', () => {
    expect(daysUntil('2026-04-23')).toBe(0)
  })

  it('returns positive number for future dates', () => {
    expect(daysUntil('2026-04-30')).toBe(7)
  })

  it('returns negative number for past dates', () => {
    expect(daysUntil('2026-04-20')).toBe(-3)
  })

  it('returns 1 for tomorrow', () => {
    expect(daysUntil('2026-04-24')).toBe(1)
  })
})
