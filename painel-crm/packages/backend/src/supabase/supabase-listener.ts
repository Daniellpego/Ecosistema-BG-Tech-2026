/**
 * Supabase Realtime Listener — watches INSERT on public.leads
 * and triggers lead ingestion: dedupe → create/update → enqueue qualification.
 *
 * Start via: ts-node src/supabase/supabase-listener.ts
 * Or call startSupabaseListener() from main.ts.
 *
 * Requires env: SUPABASE_URL, SUPABASE_SERVICE_KEY
 */
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import { enqueueAgentJob } from '../agents/queue';
import { normalizePhone } from '../utils/phone';

const prisma = new PrismaClient();

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

let channel: RealtimeChannel | null = null;

/**
 * Start Supabase realtime listener on public.leads INSERTs.
 */
export async function startSupabaseListener(): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.warn(
      '[supabase-listener] SUPABASE_URL or SUPABASE_SERVICE_KEY not set — listener disabled',
    );
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  channel = supabase
    .channel('leads-ingest')
    .on(
      'postgres_changes' as any,
      { event: 'INSERT', schema: 'public', table: 'leads' },
      async (payload: any) => {
        try {
          await handleLeadInsert(payload.new ?? payload.record);
        } catch (err) {
          console.error('[supabase-listener] Error handling lead insert:', err);
        }
      },
    )
    .subscribe((status: string) => {
      console.log(`[supabase-listener] Subscription status: ${status}`);
    });

  console.log('[supabase-listener] Listening for INSERT on public.leads');
}

/**
 * Stop the listener gracefully.
 */
export async function stopSupabaseListener(): Promise<void> {
  if (channel) {
    await channel.unsubscribe();
    channel = null;
    console.log('[supabase-listener] Stopped');
  }
}

// ─── Lead Ingestion Handler ────────────────────────────────────────────────

export async function handleLeadInsert(row: Record<string, any>): Promise<void> {
  const tenantId: string = row.tenant_id ?? process.env.DEFAULT_TENANT_ID ?? 'default';
  const whatsapp = normalizePhone(row.whatsapp);

  const leadPayload = {
    tenantId,
    nome: row.nome ?? null,
    empresa: row.empresa ?? null,
    email: row.email ?? null,
    whatsapp,
    segmento: row.segmento ?? null,
    horasPerdidas: row.horas_perdidas ?? null,
    dorPrincipal: row.dor_principal ?? null,
    faturamento: row.faturamento ?? null,
    maturidade: row.maturidade ?? null,
    janelaDecisao: row.janela_decisao ?? null,
    leadTemperature: row.lead_temperature ?? null,
    score: row.score != null ? Number(row.score) : null,
    custoMensal: row.custo_mensal ?? null,
    diagnosticoId: row.diagnostico_id ?? null,
    rawQuizResponse: row,
    consent: row.consent ?? true,
  };

  // ─── Dedupe: whatsapp → email ────────────────────────────────
  let existing: any = null;

  if (whatsapp) {
    existing = await prisma.lead.findFirst({
      where: { tenantId, whatsapp },
    });
  }
  if (!existing && leadPayload.email) {
    existing = await prisma.lead.findFirst({
      where: { tenantId, email: leadPayload.email },
    });
  }

  if (existing) {
    // Merge: append latest quiz response
    const prevRaw = (existing.rawQuizResponse as Record<string, any>) || {};
    await prisma.lead.update({
      where: { id: existing.id },
      data: {
        rawQuizResponse: { ...prevRaw, latest: leadPayload.rawQuizResponse },
        updatedAt: new Date(),
      },
    });

    console.log(`[supabase-listener] Duplicate lead updated: ${existing.id} (whatsapp=${whatsapp})`);

    // Re-qualify
    await enqueueAgentJob({
      tenantId,
      agentName: 'qualification',
      action: 'requalify_lead',
      payload: { leadId: existing.id, context: leadPayload },
    });
    return;
  }

  // ─── Create new lead ────────────────────────────────────────
  const created = await prisma.lead.create({
    data: {
      ...leadPayload,
      leadStatus: 'new',
      leadTags: [],
    },
  });

  console.log(`[supabase-listener] New lead created: ${created.id} (${created.nome})`);

  // Enqueue qualification
  await enqueueAgentJob({
    tenantId,
    agentName: 'qualification',
    action: 'qualify_lead',
    payload: { leadId: created.id, context: leadPayload },
  });
}

// ─── Standalone entry point ───────────────────────────────────────────────
if (require.main === module) {
  startSupabaseListener().catch((err) => {
    console.error('Failed to start listener:', err);
    process.exit(1);
  });

  process.on('SIGINT', async () => {
    await stopSupabaseListener();
    await prisma.$disconnect();
    process.exit(0);
  });
}
