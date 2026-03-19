-- ══════════════════════════════════════════════════════════════════════
-- GRADIOS — Migrations 007 + 008 (CORRIGIDAS para o banco real)
-- Cole este SQL inteiro no Supabase SQL Editor e clique RUN
--
-- Adaptado ao schema real do Supabase:
--   leads.id          = BIGINT (nao UUID)
--   deals             = NAO EXISTE (usar crm_opportunities.id UUID)
--   atividades        = NAO EXISTE
--   update_updated_at = NAO EXISTE (criada aqui)
--   crm_proposals     = JA EXISTE (migration 008 adiciona campos extras)
--
-- Cria: jarvis_agents, jarvis_memory, jarvis_studies,
--       jarvis_orchestrations + altera crm_proposals
-- ══════════════════════════════════════════════════════════════════════


-- ╔══════════════════════════════════════════════════════════════════╗
-- ║  PRE-REQUISITO: Funcao update_updated_at()                      ║
-- ╚══════════════════════════════════════════════════════════════════╝

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ╔══════════════════════════════════════════════════════════════════╗
-- ║  MIGRATION 007 — JARVIS SCHEMA                                 ║
-- ╚══════════════════════════════════════════════════════════════════╝

-- ─── 1. JARVIS_AGENTS ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.jarvis_agents (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  title         TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  is_active     BOOLEAN DEFAULT true,
  model         TEXT DEFAULT 'qwen2.5:14b',
  temperature   NUMERIC(3,2) DEFAULT 0.7,
  max_tokens    INTEGER DEFAULT 4096,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

INSERT INTO public.jarvis_agents (slug, name, title, system_prompt) VALUES
  ('copy',       'Daniel Mathews',       'Copy e Conversao',      'Voce e Daniel Mathews, especialista em copywriting BR. Estruture: HEADLINE -> PROBLEMA -> SOLUCAO -> PROVA -> CTA. Output em portugues BR.'),
  ('dev',        'Guillermo Rauch',      'Arquiteto Next.js',     'Voce e Guillermo Rauch. Stack: Next.js 15, Supabase, TypeScript, Tailwind. Entregue codigo funcional com tipos TS em pt-BR.'),
  ('fiscal',     'Renato Leblon',        'Fiscal BR 2026',        'Voce e Renato Leblon, EY Tax. Dominio: ICMS, CFOP, NCM, PIS/COFINS, Reforma Tributaria 2026 (CBS/IBS/IS). Referencias legais precisas.'),
  ('ads',        'Larry Kim',            'Performance Marketing',  'Voce e Larry Kim. Meta Ads, Google Ads, ROAS 5x+. Entregue estrutura de campanha completa com projecao de ROI.'),
  ('brand',      'Paula Scher',          'Identidade Visual',      'Voce e Paula Scher, Pentagram. Identidade visual, tipografia, brand guidelines. Paleta hex, tipografia, voz da marca.'),
  ('manufatura', 'Siemens Expert',       'ROI Industrial',         'Especialista Siemens. Output: DIAGNOSTICO -> ROI com payback -> CRONOGRAMA -> SQL ERP -> ARQUITETURA. Cite normas ABNT.'),
  ('cfo',        'McKinsey CFO Advisor', 'Dashboard CFO',          'Advisor McKinsey. DRE, EBITDA, valuation, KPIs. Queries SQL para Power BI, metas SMART, benchmarks BR.'),
  ('crm',        'JARVIS CRM',          'Pipeline e Clientes',    'Modulo CRM JARVIS. Pipeline B2B, forecast, playbooks, Supabase schema. Scripts de abordagem e propostas comerciais.')
ON CONFLICT (slug) DO NOTHING;

-- ─── 2. JARVIS_MEMORY ────────────────────────────────────────────
-- lead_id = BIGINT (leads.id e BIGINT no banco real)

CREATE TABLE IF NOT EXISTS public.jarvis_memory (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id      UUID NOT NULL,
  agent           TEXT NOT NULL REFERENCES public.jarvis_agents(slug),
  user_message    TEXT NOT NULL,
  agent_response  TEXT NOT NULL,
  lead_id         BIGINT REFERENCES public.leads(id) ON DELETE SET NULL,
  org_id          UUID,
  tokens_used     INTEGER,
  model_used      TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_jarvis_memory_session ON public.jarvis_memory(session_id);
CREATE INDEX IF NOT EXISTS idx_jarvis_memory_agent ON public.jarvis_memory(agent);
CREATE INDEX IF NOT EXISTS idx_jarvis_memory_lead ON public.jarvis_memory(lead_id);
CREATE INDEX IF NOT EXISTS idx_jarvis_memory_created ON public.jarvis_memory(created_at DESC);

-- ─── 3. JARVIS_STUDIES ───────────────────────────────────────────
-- lead_id = BIGINT (leads.id e BIGINT)
-- opportunity_id = UUID (crm_opportunities.id — substitui deal_id que nao existe)

CREATE TABLE IF NOT EXISTS public.jarvis_studies (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title           TEXT NOT NULL,
  agent           TEXT NOT NULL REFERENCES public.jarvis_agents(slug),
  content         TEXT NOT NULL,
  summary         TEXT,
  tags            TEXT[] DEFAULT '{}',
  status          TEXT DEFAULT 'completo'
                    CHECK (status IN ('rascunho', 'completo', 'arquivado')),
  lead_id         BIGINT REFERENCES public.leads(id) ON DELETE SET NULL,
  opportunity_id  UUID REFERENCES public.crm_opportunities(id) ON DELETE SET NULL,
  session_id      UUID,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  created_by      UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_jarvis_studies_agent ON public.jarvis_studies(agent);
CREATE INDEX IF NOT EXISTS idx_jarvis_studies_status ON public.jarvis_studies(status);
CREATE INDEX IF NOT EXISTS idx_jarvis_studies_lead ON public.jarvis_studies(lead_id);
CREATE INDEX IF NOT EXISTS idx_jarvis_studies_created ON public.jarvis_studies(created_at DESC);

-- ─── 4. JARVIS_ORCHESTRATIONS ────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.jarvis_orchestrations (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id        UUID NOT NULL,
  user_message      TEXT NOT NULL,
  agents_consulted  TEXT[] NOT NULL,
  responses         JSONB NOT NULL,
  total_tokens      INTEGER,
  duration_ms       INTEGER,
  created_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_jarvis_orch_session ON public.jarvis_orchestrations(session_id);
CREATE INDEX IF NOT EXISTS idx_jarvis_orch_created ON public.jarvis_orchestrations(created_at DESC);

-- ─── TRIGGERS (007) ──────────────────────────────────────────────

DO $$ BEGIN
  CREATE TRIGGER trg_jarvis_agents_updated BEFORE UPDATE ON public.jarvis_agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_jarvis_studies_updated BEFORE UPDATE ON public.jarvis_studies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─── RLS (007) ───────────────────────────────────────────────────

ALTER TABLE public.jarvis_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jarvis_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jarvis_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jarvis_orchestrations ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "auth_all_jarvis_agents" ON public.jarvis_agents FOR ALL TO authenticated USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_all_jarvis_memory" ON public.jarvis_memory FOR ALL TO authenticated USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_all_jarvis_studies" ON public.jarvis_studies FOR ALL TO authenticated USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_all_jarvis_orch" ON public.jarvis_orchestrations FOR ALL TO authenticated USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE POLICY "deny_anon_jarvis_agents" ON public.jarvis_agents AS RESTRICTIVE FOR ALL TO anon USING (false) WITH CHECK (false); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "deny_anon_jarvis_memory" ON public.jarvis_memory AS RESTRICTIVE FOR ALL TO anon USING (false) WITH CHECK (false); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "deny_anon_jarvis_studies" ON public.jarvis_studies AS RESTRICTIVE FOR ALL TO anon USING (false) WITH CHECK (false); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "deny_anon_jarvis_orch" ON public.jarvis_orchestrations AS RESTRICTIVE FOR ALL TO anon USING (false) WITH CHECK (false); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- JARVIS API usa service_role key → bypassa RLS automaticamente

-- ─── REALTIME (007) ──────────────────────────────────────────────

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.jarvis_memory;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.jarvis_studies;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ╔══════════════════════════════════════════════════════════════════╗
-- ║  MIGRATION 008 — PROPOSTAS (extende crm_proposals existente)    ║
-- ║                                                                  ║
-- ║  crm_proposals ja existe com: id, opportunity_id, title, value,  ║
-- ║  status, content, sent_date, created_at, updated_at              ║
-- ║  Adicionamos campos do JARVIS sem quebrar o que existe           ║
-- ╚══════════════════════════════════════════════════════════════════╝

-- Adiciona colunas JARVIS na tabela existente crm_proposals

DO $$ BEGIN
  ALTER TABLE public.crm_proposals ADD COLUMN lead_id BIGINT REFERENCES public.leads(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.crm_proposals ADD COLUMN gerada_por TEXT DEFAULT 'manual'
    CHECK (gerada_por IN ('jarvis', 'manual'));
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.crm_proposals ADD COLUMN agent_usado TEXT REFERENCES public.jarvis_agents(slug);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.crm_proposals ADD COLUMN session_id UUID;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.crm_proposals ADD COLUMN versao INTEGER DEFAULT 1;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.crm_proposals ADD COLUMN respondida_em TIMESTAMPTZ;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Indexes para as novas colunas
CREATE INDEX IF NOT EXISTS idx_crm_proposals_lead ON public.crm_proposals(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_proposals_gerada_por ON public.crm_proposals(gerada_por);

-- Trigger updated_at (se nao existir)
DO $$ BEGIN
  CREATE TRIGGER trg_crm_proposals_updated BEFORE UPDATE ON public.crm_proposals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Trigger: proposta aceita → registra data de resposta
CREATE OR REPLACE FUNCTION on_proposta_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Registra respondida_em quando status muda para aceita/recusada
  IF NEW.status IN ('Aceita', 'Recusada') AND OLD.status IS DISTINCT FROM NEW.status THEN
    NEW.respondida_em := now();
  END IF;

  -- Registra sent_date quando status muda para Enviada
  IF NEW.status = 'Enviada' AND OLD.status IS DISTINCT FROM NEW.status THEN
    IF NEW.sent_date IS NULL THEN
      NEW.sent_date := CURRENT_DATE;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  CREATE TRIGGER trg_proposta_status_change
    BEFORE UPDATE ON public.crm_proposals
    FOR EACH ROW EXECUTE FUNCTION on_proposta_status_change();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
