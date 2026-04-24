import { describe, it, expect } from 'vitest'
import {
  PIPELINE_STAGES,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_COLORS,
  type LeadStatus,
} from '@/types/database'

describe('PIPELINE_STAGES', () => {
  it('includes contatado', () => {
    expect(PIPELINE_STAGES).toContain('contatado')
  })

  it('has correct order', () => {
    expect(PIPELINE_STAGES).toEqual([
      'novo',
      'contatado',
      'qualificado',
      'reuniao',
      'proposta',
      'fechado_ganho',
    ])
  })

  it('does not include fechado_perdido (not a pipeline stage)', () => {
    expect(PIPELINE_STAGES).not.toContain('fechado_perdido')
  })

  it('starts with novo and ends with fechado_ganho', () => {
    expect(PIPELINE_STAGES[0]).toBe('novo')
    expect(PIPELINE_STAGES[PIPELINE_STAGES.length - 1]).toBe('fechado_ganho')
  })
})

describe('LeadStatus labels and colors', () => {
  const allStatuses: LeadStatus[] = [
    'novo',
    'contatado',
    'qualificado',
    'reuniao',
    'proposta',
    'fechado_ganho',
    'fechado_perdido',
  ]

  it('all LeadStatus values have corresponding labels', () => {
    for (const status of allStatuses) {
      expect(LEAD_STATUS_LABELS[status]).toBeDefined()
      expect(typeof LEAD_STATUS_LABELS[status]).toBe('string')
      expect(LEAD_STATUS_LABELS[status].length).toBeGreaterThan(0)
    }
  })

  it('all LeadStatus values have corresponding colors', () => {
    for (const status of allStatuses) {
      expect(LEAD_STATUS_COLORS[status]).toBeDefined()
      expect(LEAD_STATUS_COLORS[status]).toMatch(/^#[0-9A-Fa-f]{6}$/)
    }
  })

  it('labels are human-readable (not raw enum values)', () => {
    expect(LEAD_STATUS_LABELS.novo).toBe('Novo')
    expect(LEAD_STATUS_LABELS.fechado_ganho).toBe('Ganho')
    expect(LEAD_STATUS_LABELS.fechado_perdido).toBe('Perdido')
  })
})
