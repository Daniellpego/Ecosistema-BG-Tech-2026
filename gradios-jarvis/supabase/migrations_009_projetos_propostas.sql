-- Migration 009: Tabelas projetos e propostas
-- GRADIOS AIOX — Bloco 3 (Kanban) e Bloco 5 (PDF)

-- Tabela de projetos (Kanban)
CREATE TABLE IF NOT EXISTS projetos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    cliente TEXT NOT NULL,
    valor NUMERIC(12,2) DEFAULT 0,
    prazo DATE,
    responsavel TEXT DEFAULT 'Daniel',
    status TEXT DEFAULT 'backlog' CHECK (status IN ('backlog','em_andamento','em_revisao','entregue','cancelado')),
    progresso INTEGER DEFAULT 0 CHECK (progresso >= 0 AND progresso <= 100),
    descricao TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de propostas (historico de PDFs gerados)
CREATE TABLE IF NOT EXISTS propostas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente TEXT NOT NULL,
    lead_nome TEXT DEFAULT '',
    valor NUMERIC(12,2) DEFAULT 0,
    status TEXT DEFAULT 'gerada' CHECK (status IN ('gerada','enviada','aceita','recusada')),
    filename TEXT DEFAULT '',
    servicos TEXT DEFAULT '',
    segmento TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_projetos_status ON projetos(status);
CREATE INDEX IF NOT EXISTS idx_projetos_prazo ON projetos(prazo);
CREATE INDEX IF NOT EXISTS idx_propostas_cliente ON propostas(cliente);

-- RLS (Row Level Security) — aberto para service key
ALTER TABLE projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE propostas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projetos_all" ON projetos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "propostas_all" ON propostas FOR ALL USING (true) WITH CHECK (true);

-- Trigger updated_at para projetos
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_projetos_updated_at ON projetos;
CREATE TRIGGER set_projetos_updated_at
    BEFORE UPDATE ON projetos
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();
