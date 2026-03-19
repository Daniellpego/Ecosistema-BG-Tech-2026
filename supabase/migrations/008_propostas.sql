-- ══════════════════════════════════════════════════════════════
-- Migration 008: Extende crm_proposals com campos JARVIS
--
-- crm_proposals ja existe com: id(UUID), opportunity_id, title,
-- value, status, content, sent_date, created_at, updated_at
--
-- Adiciona: lead_id(BIGINT), gerada_por, agent_usado, session_id,
--           versao, respondida_em + trigger de status
-- ══════════════════════════════════════════════════════════════

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

CREATE INDEX IF NOT EXISTS idx_crm_proposals_lead ON public.crm_proposals(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_proposals_gerada_por ON public.crm_proposals(gerada_por);

DO $$ BEGIN
  CREATE TRIGGER trg_crm_proposals_updated BEFORE UPDATE ON public.crm_proposals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE OR REPLACE FUNCTION on_proposta_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('Aceita', 'Recusada') AND OLD.status IS DISTINCT FROM NEW.status THEN
    NEW.respondida_em := now();
  END IF;

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
