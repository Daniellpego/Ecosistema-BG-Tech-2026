/**
 * Unit tests for the quiz-lead qualification worker.
 *
 * Mocks Prisma + LLM adapter so tests run without DB/Redis/API keys.
 */

// ─── Mocks ───────────────────────────────────────────────────

const mockPrisma = {
  lead: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  account: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  opportunity: {
    create: jest.fn(),
  },
  agentLog: {
    create: jest.fn(),
  },
  $executeRawUnsafe: jest.fn(),
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
}));

jest.mock('../../src/agents/adapters/llm.factory', () => ({
  createLlmAdapter: jest.fn(),
}));

// Mock the prompt file read
jest.mock('fs', () => ({
  readFileSync: jest.fn().mockReturnValue(JSON.stringify({
    system: 'Mock qualification system prompt',
    instructions: 'Mock instructions',
    schema: { type: 'object' },
  })),
}));

import { processLeadQualification } from '../../src/agents/qualification-worker';
import { createLlmAdapter } from '../../src/agents/adapters/llm.factory';
import type { AgentJobData } from '../../src/agents/queue';

const MOCK_LEAD = {
  id: 'lead-001',
  tenantId: 'tenant-001',
  nome: 'Maria Souza',
  empresa: 'InovaTech',
  whatsapp: '+5511988887777',
  segmento: 'Indústria',
  horasPerdidas: '30h/mês',
  dorPrincipal: 'Falta de automação',
  faturamento: 'R$ 1M - R$ 5M',
  maturidade: 'Avançado',
  janelaDecisao: 'Imediato',
  leadTemperature: 'hot',
  score: null,
  custoMensal: 'R$ 25.000',
  diagnosticoId: 'diag-xyz',
  rawQuizResponse: {},
};

function makeMockLlm(output: any) {
  return {
    name: 'mock',
    chat: jest.fn().mockResolvedValue({
      content: JSON.stringify(output),
      tokensUsed: 150,
      latencyMs: 80,
      model: 'mock',
    }),
  };
}

describe('processLeadQualification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.lead.findUnique.mockResolvedValue(MOCK_LEAD);
    mockPrisma.lead.update.mockResolvedValue({});
    mockPrisma.agentLog.create.mockResolvedValue({});
    mockPrisma.$executeRawUnsafe.mockResolvedValue(null);
  });

  it('should qualify a hot lead and create opportunity', async () => {
    const hotOutput = {
      lead_score: 85,
      lead_category: 'hot',
      recommended_stage: 'qualified',
      summary: 'Lead qualificado com alta dor e budget compatível',
      budget_estimate_brl: 300000,
      decision_makers: ['CEO'],
      must_have_reqs: ['Dashboard', 'Automação'],
      risk_flags: [],
    };

    const mockLlm = makeMockLlm(hotOutput);
    (createLlmAdapter as jest.Mock).mockReturnValue(mockLlm);

    mockPrisma.account.findFirst.mockResolvedValue(null);
    mockPrisma.account.create.mockResolvedValue({ id: 'acc-new' });
    mockPrisma.opportunity.create.mockResolvedValue({ id: 'opp-new' });

    const jobData: AgentJobData = {
      tenantId: 'tenant-001',
      agentName: 'qualification',
      action: 'qualify_lead',
      payload: { leadId: 'lead-001' },
    };

    const result = await processLeadQualification(jobData);

    // LLM was called
    expect(mockLlm.chat).toHaveBeenCalledTimes(1);

    // RLS context was set
    expect(mockPrisma.$executeRawUnsafe).toHaveBeenCalledWith(
      "SELECT set_config('my.tenant', $1, true)",
      'tenant-001',
    );

    // Lead was updated
    expect(mockPrisma.lead.update).toHaveBeenCalled();
    const leadUpdate = mockPrisma.lead.update.mock.calls[0][0];
    expect(leadUpdate.data.score).toBe(85);

    // Hot lead → opportunity created
    expect(mockPrisma.account.create).toHaveBeenCalled();
    expect(mockPrisma.opportunity.create).toHaveBeenCalledTimes(1);
    const oppData = mockPrisma.opportunity.create.mock.calls[0][0].data;
    expect(oppData.stage).toBe('qualified');
    expect(oppData.source).toBe('quiz');

    // Lead linked to opportunity (converted)
    const lastLeadUpdate = mockPrisma.lead.update.mock.calls;
    const conversionUpdate = lastLeadUpdate.find(
      (c: any) => c[0].data.leadStatus === 'converted',
    );
    expect(conversionUpdate).toBeDefined();

    // AgentLog persisted
    expect(mockPrisma.agentLog.create).toHaveBeenCalledTimes(1);
    const logData = mockPrisma.agentLog.create.mock.calls[0][0].data;
    expect(logData.status).toBe('success');
    expect(logData.agentName).toBe('qualification');
    expect(logData.model).toBe('mock');

    // Result
    expect(result.status).toBe('success');
    expect(result.output.lead_score).toBe(85);
  });

  it('should qualify a warm lead WITHOUT creating opportunity', async () => {
    const warmOutput = {
      lead_score: 60,
      lead_category: 'warm',
      recommended_stage: 'nurture',
      summary: 'Lead com interesse mas budget limitado',
      budget_estimate_brl: 50000,
      decision_makers: ['Gerente'],
      must_have_reqs: ['CRM básico'],
      risk_flags: ['orçamento_limitado'],
    };

    const mockLlm = makeMockLlm(warmOutput);
    (createLlmAdapter as jest.Mock).mockReturnValue(mockLlm);

    const jobData: AgentJobData = {
      tenantId: 'tenant-001',
      agentName: 'qualification',
      action: 'qualify_lead',
      payload: { leadId: 'lead-001' },
    };

    const result = await processLeadQualification(jobData);

    // Lead was updated
    expect(mockPrisma.lead.update).toHaveBeenCalled();

    // NO opportunity created for warm lead
    expect(mockPrisma.opportunity.create).not.toHaveBeenCalled();

    // AgentLog persisted
    expect(mockPrisma.agentLog.create).toHaveBeenCalledTimes(1);

    expect(result.status).toBe('success');
    expect(result.output.lead_category).toBe('warm');
  });

  it('should handle LLM errors and log them', async () => {
    const mockLlm = {
      name: 'mock',
      chat: jest.fn().mockRejectedValue(new Error('LLM timeout')),
    };
    (createLlmAdapter as jest.Mock).mockReturnValue(mockLlm);

    const jobData: AgentJobData = {
      tenantId: 'tenant-001',
      agentName: 'qualification',
      action: 'qualify_lead',
      payload: { leadId: 'lead-001' },
    };

    await expect(processLeadQualification(jobData)).rejects.toThrow('LLM timeout');

    // Error log persisted
    expect(mockPrisma.agentLog.create).toHaveBeenCalledTimes(1);
    const logData = mockPrisma.agentLog.create.mock.calls[0][0].data;
    expect(logData.status).toBe('error');
    expect(logData.errorMessage).toBe('LLM timeout');
  });

  it('should use passed context when lead not in DB', async () => {
    mockPrisma.lead.findUnique.mockResolvedValue(null);

    const mockLlm = makeMockLlm({
      lead_score: 45,
      lead_category: 'cold',
      recommended_stage: 'lead',
    });
    (createLlmAdapter as jest.Mock).mockReturnValue(mockLlm);

    const jobData: AgentJobData = {
      tenantId: 'tenant-001',
      agentName: 'qualification',
      action: 'qualify_lead',
      payload: {
        leadId: 'lead-missing',
        context: { nome: 'Test', empresa: 'TestCo' },
      },
    };

    const result = await processLeadQualification(jobData);

    expect(mockLlm.chat).toHaveBeenCalledTimes(1);
    // Verify the user message contains the passed context
    const userMsg = mockLlm.chat.mock.calls[0][1];
    expect(userMsg).toContain('TestCo');

    expect(result.status).toBe('success');
  });

  it('should reuse existing account when empresa matches', async () => {
    const hotOutput = {
      lead_score: 90,
      lead_category: 'hot',
      recommended_stage: 'qualified',
      budget_estimate_brl: 200000,
    };
    const mockLlm = makeMockLlm(hotOutput);
    (createLlmAdapter as jest.Mock).mockReturnValue(mockLlm);

    // Account already exists
    mockPrisma.account.findFirst.mockResolvedValue({ id: 'acc-existing' });
    mockPrisma.opportunity.create.mockResolvedValue({ id: 'opp-reuse' });

    const jobData: AgentJobData = {
      tenantId: 'tenant-001',
      agentName: 'qualification',
      action: 'qualify_lead',
      payload: { leadId: 'lead-001' },
    };

    await processLeadQualification(jobData);

    // Should NOT create new account
    expect(mockPrisma.account.create).not.toHaveBeenCalled();

    // Opportunity uses existing account
    const oppData = mockPrisma.opportunity.create.mock.calls[0][0].data;
    expect(oppData.accountId).toBe('acc-existing');
  });
});
