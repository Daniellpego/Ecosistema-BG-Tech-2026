import { handleLeadInsert } from '../src/supabase/supabase-listener';
import { PrismaClient } from '@prisma/client';

describe('Lead Ingestion', () => {
  const prisma = new PrismaClient();
  const tenantId = 'tenant_test';

  beforeAll(async () => {
    await prisma.lead.deleteMany({ where: { tenantId } });
  });

  it('should create new lead with whatsapp', async () => {
    const row = {
      tenant_id: tenantId,
      nome: 'Teste',
      empresa: 'ACME',
      whatsapp: '+551199999999',
      email: 'teste@acme.com',
      segmento: 'Industrial',
      consent: true,
    };
    await handleLeadInsert(row);
    const lead = await prisma.lead.findFirst({ where: { tenantId, whatsapp: '+551199999999' } });
    expect(lead).toBeTruthy();
    expect(lead?.nome).toBe('Teste');
  });

  it('should dedupe by whatsapp', async () => {
    const row = {
      tenant_id: tenantId,
      nome: 'Teste',
      empresa: 'ACME',
      whatsapp: '+551199999999',
      email: 'teste@acme.com',
      segmento: 'Industrial',
      consent: true,
    };
    await handleLeadInsert(row);
    const leads = await prisma.lead.findMany({ where: { tenantId, whatsapp: '+551199999999' } });
    expect(leads.length).toBe(1);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
