# PRD - Painel do CTO & Portal dos Socios

**Versao:** 1.0.0
**Data:** 01/04/2026
**Autor:** Daniel (CTO) + Claude Code (Arquiteto IA)
**Status:** Aprovado para Scaffold
**Classificacao:** Confidencial - Gradios

---

## 1. Visao Geral

### 1.1 Proposito

O **Painel do CTO** e a central de comando para gestao operacional de todos os projetos da Gradios. Ele substitui o painel-projetos legado (vanilla JS) por um modulo Next.js 15 moderno, com Kanban interativo, timeline Gantt, sincronizacao bidirecional com Google Calendar, e geracao automatizada de apresentacoes .pptx.

O **Portal dos Socios** e uma visao restrita (read-only) do mesmo sistema, onde os socios da empresa acompanham o status macro dos projetos, leem updates curados pelo CTO, e baixam relatorios em PowerPoint gerados automaticamente com dados reais do Supabase.

### 1.2 Usuarios e Roles

| Role | Usuario(s) | Permissoes | Visao |
|------|-----------|------------|-------|
| `cto` | Daniel | Full CRUD em tudo. Gestao completa de projetos, tarefas, milestones, updates. Geracao de relatorios. Sync calendar. | Kanban, Gantt, Dashboard, Calendario, Portal Admin |
| `socio` | Gustavo, demais socios | Read-only em projetos, updates (onde `visivel_socio=true`), apresentacoes. Download de .pptx. | Portal Socios: status macro, feed de updates, biblioteca de relatorios |
| `dev` | Desenvolvedores | Read em projetos. CRUD em tarefas atribuidas a eles. | Kanban simplificado, tarefas proprias |

### 1.3 Casos de Uso Primarios

**CTO (Daniel):**
1. Visualizar todos os projetos em Kanban e arrastar entre colunas (backlog -> em_andamento -> revisao -> entregue)
2. Detalhar um projeto: ver tarefas (mini-Kanban), milestones, updates, metricas
3. Criar/editar milestones e ve-los refletidos automaticamente no Google Calendar
4. Postar updates de projeto com controle de visibilidade para socios
5. Gerar relatorios .pptx (status_report, roadmap, financeiro) com um comando
6. Ver dashboard com KPIs: projetos ativos, atrasados, valor em pipeline, proximas entregas
7. Visao de calendario unificada: milestones + tarefas com prazo + eventos GCal
8. Timeline Gantt horizontal dos projetos com barras de progresso

**Socios:**
1. Acessar portal e ver lista de projetos com status, progresso %, cliente, prazo
2. Ler feed de updates curados pelo CTO (tipo: entrega, milestone, bloqueio)
3. Baixar apresentacoes .pptx da biblioteca de relatorios
4. Solicitar geracao de novo relatorio (via request que o CTO/sistema processa)
5. Ver resumo financeiro macro (receita bruta, MRR, runway) via RPC segura

**Devs:**
1. Ver projetos atribuidos e suas tarefas
2. Mover tarefas proprias no mini-Kanban (todo -> doing -> done)
3. Registrar horas gastas em tarefas

---

## 2. Arquitetura Tecnica

### 2.1 Stack

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Framework | Next.js 15 + App Router + Turbopack | Consistencia com painel-cfo, SSR, RSC |
| Linguagem | TypeScript (strict, zero `any`) | Type-safety, DX |
| Auth | Supabase Auth (email/password) + SSR middleware | Reutiliza infra existente |
| Database | Supabase Postgres + RLS por role | Seguranca row-level nativa |
| Data Fetching | TanStack React Query v5 | Cache, invalidation, optimistic updates |
| UI | Tailwind CSS + Radix UI + Lucide Icons | Consistencia com painel-cfo |
| Charts | Recharts | Gantt customizado, barras de progresso |
| DnD | @dnd-kit/core + @dnd-kit/sortable | Kanban drag-and-drop |
| Animations | Framer Motion | Page transitions, card animations |
| PPTX | PptxGenJS (via script Node.js) | Geracao server-side de .pptx |
| Calendar | MCP Google Calendar (gcal_*) | Sync bidirecional nativa |
| Porta | 3002 | Evita conflito com painel-cfo (3001) |

### 2.2 Estrutura de Pastas

```
apps/painel-cto/
  src/
    app/
      login/page.tsx                    # Auth page
      (authenticated)/
        layout.tsx                      # Sidebar + Providers
        dashboard/page.tsx              # KPIs, alertas, atividade recente
        kanban/page.tsx                 # Kanban de projetos (drag-and-drop)
        projetos/
          [id]/page.tsx                 # Detalhe: mini-kanban, milestones, updates
        timeline/page.tsx               # Gantt horizontal
        calendario/page.tsx             # Visao unificada (milestones + GCal)
        relatorios/page.tsx             # Biblioteca de .pptx + gerador
        portal/                         # Portal dos Socios
          page.tsx                      # Status macro, updates, relatorios
    components/
      layout/
        sidebar.tsx                     # Navegacao lateral
        header.tsx                      # Breadcrumb + user menu
      kanban/
        kanban-board.tsx                # Board principal com DnD
        kanban-column.tsx               # Coluna (backlog, em_andamento, etc.)
        kanban-card.tsx                 # Card de projeto arrastavel
        task-board.tsx                  # Mini-kanban de tarefas dentro do projeto
        task-card.tsx                   # Card de tarefa arrastavel
      projeto/
        projeto-detail.tsx              # Header do projeto + tabs
        milestone-list.tsx              # Lista de milestones com status
        milestone-form.tsx              # Form criar/editar milestone
        update-feed.tsx                 # Feed de updates
        update-form.tsx                 # Form postar update
        tarefa-form.tsx                 # Form criar/editar tarefa
      timeline/
        gantt-chart.tsx                 # Gantt com barras horizontais
        gantt-bar.tsx                   # Barra individual de projeto
      calendario/
        calendar-view.tsx               # Calendario mensal/semanal
        event-card.tsx                  # Card de evento (milestone/tarefa/gcal)
      relatorios/
        report-library.tsx              # Grid de apresentacoes baixaveis
        report-generator.tsx            # Form para solicitar geracao
      portal/
        portal-project-list.tsx         # Lista simplificada para socios
        portal-update-feed.tsx          # Feed filtrado (visivel_socio=true)
      ui/                               # Componentes atomicos compartilhados
        button.tsx
        input.tsx
        dialog.tsx
        skeleton.tsx
        badge.tsx
        tabs.tsx
        dropdown-menu.tsx
        progress.tsx
      motion.tsx                        # PageTransition, AnimatedNumber
    hooks/
      use-projetos.ts                   # CRUD projetos + query por status
      use-tarefas.ts                    # CRUD tarefas + reorder
      use-milestones.ts                 # CRUD milestones + sync status
      use-updates.ts                    # CRUD updates + feed queries
      use-dashboard-cto.ts             # KPIs, alertas, metricas
      use-relatorios.ts                # List/download presentations
      use-kanban-dnd.ts                 # Logica de drag-and-drop
      use-portal.ts                     # Queries do portal dos socios
    lib/
      supabase/
        client.ts                       # Browser client
        server.ts                       # Server client (SSR)
        middleware.ts                   # Auth + role redirect
      format.ts                         # formatCurrency, formatDate, formatPercent
      utils.ts                          # cn(), constantes
      kanban-config.ts                  # Colunas, cores, regras de transicao
    providers/
      query-provider.tsx                # TanStack Query
    types/
      database.ts                       # Tipos do schema Supabase
      kanban.ts                         # Tipos do Kanban/DnD
  public/
    gradios-logo.svg                    # Logo para PPTX e UI
  scripts/
    generate-report.ts                  # Script Node.js para gerar .pptx
  package.json
  next.config.js
  tailwind.config.js
  tsconfig.json
  postcss.config.js
```

### 2.3 Roteamento e Middleware

```typescript
// middleware.ts - Fluxo de autenticacao e autorizacao

// 1. Verificar sessao Supabase (SSR)
// 2. Sem sessao -> redirect /login
// 3. Com sessao -> buscar role do profile
// 4. Role = 'socio' tentando acessar /kanban, /timeline, /calendario -> redirect /portal
// 5. Role = 'dev' tentando acessar /relatorios, /portal -> redirect /kanban
// 6. Role = 'cto' -> acesso total
```

---

## 3. Skills Customizadas - Arquitetura de Integracao

O sistema se apoia em 3 skills customizadas salvas em `.claude/skills/`. Elas atuam como "superpoderes" que o Claude Code invoca automaticamente baseado em palavras-chave do usuario.

### 3.1 Skill: Project Management (`gradios-project-management`)

**Responsabilidade:** Toda operacao de CRUD em projetos, tarefas, milestones e updates.

**Gatilho:** Qualquer mencao a "projeto", "kanban", "tarefa", "milestone", "prazo", "backlog", "status do projeto".

**Fluxo dentro do painel:**
1. Usuario interage com o Kanban (drag de card, click para detalhar)
2. Frontend faz mutacao via Supabase client (TanStack Query mutation)
3. Supabase aplica RLS baseado no role do usuario
4. TanStack Query invalida queries relacionadas (projetos, dashboard KPIs)
5. Triggers do banco disparam side-effects:
   - `on_deal_ganho()`: CRM -> cria projeto automaticamente
   - `on_projeto_entregue()`: Projeto -> registra receita no CFO
   - Recalculo de `progresso` ao mover tarefas

### 3.2 Skill: Google Calendar (`gradios-google-calendar`)

**Responsabilidade:** Sincronizacao bidirecional entre milestones/prazos e Google Calendar.

**Gatilho:** Qualquer mencao a "calendario", "agenda", "sync calendar", "prazo", "deadline sync".

**Fluxo de sincronizacao (detalhado na Secao 5):**
1. CTO cria/atualiza milestone no painel
2. Skill usa MCP tool `gcal_create_event` / `gcal_update_event`
3. Mapeamento gravado em tabela `calendar_sync`
4. Visao unificada na pagina `/calendario` combina 3 fontes

### 3.3 Skill: PPTX Reports (`gradios-pptx-reports`)

**Responsabilidade:** Geracao automatizada de apresentacoes .pptx com dados reais.

**Gatilho:** Qualquer mencao a "relatorio", "apresentacao", "powerpoint", "pptx", "slides", "deck".

**Fluxo de geracao (detalhado na Secao 4):**
1. Socio solicita relatorio via portal OU CTO solicita via comando
2. Pipeline de 6 fases: Gather -> Design -> Generate -> Convert -> QA -> Output
3. Arquivo .pptx salvo no Supabase Storage (bucket `presentations`)
4. Metadados registrados na tabela `presentations`
5. Relatorio aparece automaticamente na biblioteca do Portal dos Socios

---

## 4. Fluxo Completo: Geracao de Relatorio PPTX

Este e o fluxo end-to-end de como um socio solicita e recebe uma apresentacao.

### 4.1 Jornada do Socio

```
[Socio acessa Portal]
    |
    v
[Pagina /portal - ve projetos, updates]
    |
    v
[Clica "Solicitar Relatorio"]
    |
    v
[Seleciona tipo: Status Report / Roadmap / Financeiro]
    |
    v
[INSERT em presentation_requests]
    |  status = 'pending'
    v
[Notificacao para CTO via project_updates]
    |
    v
[CTO aprova e executa geracao]
    |  (ou geracao automatica via n8n trigger)
    v
[Pipeline PPTX inicia - 6 Fases]
```

### 4.2 Pipeline de Geracao (6 Fases)

**Fase 1 - GATHER (Coleta de Dados):**
- Queries SQL no Supabase conforme tipo de relatorio
- Status Report: projetos + tarefas + milestones + bloqueios
- Financeiro: receitas + custos_fixos + gastos_variaveis + caixa
- Roadmap: projetos + milestones + timeline
- Dados coletados em objeto JSON estruturado

**Fase 2 - DESIGN (Estrutura dos Slides):**
- Definicao da sequencia de slides conforme tipo
- Aplicacao do brand book Gradios (dark theme):
  - BG: `0A1628` | Cards: `131F35` | Cyan: `00C8F0`
  - Font: Calibri | Footer: "Gradios | Confidencial"
- Calculos derivados (KPIs, percentuais, totais)

**Fase 3 - GENERATE (Codigo PptxGenJS):**
- Geracao de script Node.js em `scripts/generate-report.ts`
- Slide Masters com dark theme pre-configurado
- Factory functions para KPI cards, tabelas, graficos
- Dados reais injetados no script (nunca placeholders)

**Fase 4 - CONVERT (Execucao):**
```bash
cd apps/painel-cto && node scripts/generate-report.js
# Output: outputs/gradios-{tipo}-{YYYY-MM}.pptx
```

**Fase 5 - QA (Validacao):**
- Verificacao de que todos os numeros conferem com Supabase
- Checklist: cores, contraste, legibilidade, overlap, footer
- Extracao de texto via markitdown para validacao

**Fase 6 - OUTPUT (Upload e Registro):**
```sql
-- Upload para Supabase Storage (bucket 'presentations')
-- Registro de metadados:
INSERT INTO presentations (titulo, tipo, storage_path, storage_url, generated_by, metadata)
VALUES (...);

-- Atualizar request do socio (se aplicavel):
UPDATE presentation_requests SET status = 'completed', presentation_id = :id
WHERE id = :request_id;
```

### 4.3 Tipos de Relatorio

| Tipo | Slides | Dados Primarios | Frequencia Esperada |
|------|--------|-----------------|---------------------|
| `status_report` | 6-8 | projetos, tarefas, milestones, bloqueios | Mensal |
| `roadmap` | 5-7 | projetos, milestones, timeline | Trimestral |
| `financeiro` | 7-9 | receitas, custos, caixa, DRE | Mensal |
| `custom` | Variavel | Combinacao livre | Sob demanda |

---

## 5. Sincronizacao MCP - Google Calendar Bidirecional

### 5.1 Arquitetura de 3 Camadas

```
Camada 1: MCP Tools (Tempo Real)
  gcal_create_event, gcal_update_event, gcal_delete_event
  gcal_list_events, gcal_find_my_free_time
      |
Camada 2: Tabela calendar_sync (Persistencia)
  Mapeamento entity <-> gcal_event_id
  Tracking de sync_status e last_synced_at
      |
Camada 3: Workflow n8n (Batch)
  Sync periodico, deteccao de conflitos, reconciliacao
```

### 5.2 Fluxo: Kanban -> Google Calendar

```
[CTO cria milestone com data_prevista]
    |
    v
[INSERT em project_milestones]
    |
    v
[Skill gcal: gcal_create_event]
    summary: "[Gradios] {projeto} - {milestone}"
    start/end: data_prevista (all-day event)
    colorId: "11" (tomato)
    reminders: popup 1 dia antes
    |
    v
[INSERT em calendar_sync]
    entity_type: 'milestone'
    entity_id: milestone.id
    gcal_event_id: retorno do create
    sync_status: 'synced'
```

### 5.3 Fluxo: Google Calendar -> Kanban (Bidirecional)

```
[CTO move evento no Google Calendar (nova data)]
    |
    v
[n8n webhook detecta mudanca via Google Calendar API]
    |
    v
[Busca calendar_sync por gcal_event_id]
    |
    v
[UPDATE project_milestones SET data_prevista = nova_data]
    |
    v
[UPDATE calendar_sync SET last_synced_at = now()]
    |
    v
[UI do painel reflete nova data via TanStack Query refetch]
```

### 5.4 Visao Unificada do Calendario (/calendario)

A pagina `/calendario` combina 3 fontes em uma unica visao:

| Fonte | Query | Color-coding |
|-------|-------|-------------|
| Milestones | `project_milestones` WHERE data_prevista IN range | Cor do projeto (`projeto.cor`) |
| Tarefas com prazo | `tarefas` WHERE data_limite IN range | Por prioridade: urgente=#EF4444, alta=#F59E0B, media=#00C8F0, baixa=#94A3B8 |
| Eventos GCal | `gcal_list_events` para o periodo | Cinza neutro #6B7280 |

Eventos sincronizados exibem icone de sync para indicar que existem em ambos os sistemas.

### 5.5 Calendario Principal

- ID: `primary` (acessosbgtech@gmail.com)
- Convencoes: prefixo `[Gradios]` no summary
- Milestones: all-day events (sem horario)
- Reunioes: timed events com duracao especifica

---

## 6. Estrutura de Banco de Dados (Supabase)

### 6.1 Diagrama de Entidades

```
auth.users (Supabase Auth)
    |
    | 1:1
    v
profiles (role: cto/socio/dev)
    |
    | (role-based RLS)
    v
projetos ----< tarefas
    |   \
    |    \---< project_milestones ---< calendar_sync
    |     \
    |      \-< project_updates
    |
    +------< presentations
    |
    +------< presentation_requests
```

### 6.2 Tabelas Existentes (ja em producao)

#### `projetos` (extendida)

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | UUID PK | gen_random_uuid() |
| deal_id | UUID FK deals | Vinculo com CRM (nullable) |
| titulo | TEXT NOT NULL | Nome do projeto |
| descricao | TEXT | Descricao detalhada |
| cliente | TEXT | Nome do cliente |
| status | ENUM | `backlog` / `em_andamento` / `revisao` / `entregue` / `cancelado` |
| valor | NUMERIC | Valor do contrato |
| data_inicio | DATE | Data de inicio |
| data_entrega | DATE | Data prevista de entrega |
| responsavel | TEXT | Responsavel principal |
| progresso | INTEGER 0-100 | Calculado automaticamente (% tarefas done) |
| tags | TEXT[] | Tags livres |
| prioridade | ENUM | `baixa` / `media` / `alta` / `urgente` |
| categoria | ENUM | `projeto_avulso` / `mensalidade` / `consultoria` / `mvp` / `interno` |
| cor | TEXT | Hex color para timeline/kanban (default: `00C8F0`) |
| created_at | TIMESTAMPTZ | auto |
| updated_at | TIMESTAMPTZ | auto |
| user_id | UUID | auth.uid() do criador |

#### `tarefas` (extendida)

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | UUID PK | gen_random_uuid() |
| projeto_id | UUID FK projetos | ON DELETE CASCADE |
| titulo | TEXT NOT NULL | Nome da tarefa |
| descricao | TEXT | Detalhes |
| status | ENUM | `todo` / `doing` / `done` |
| prioridade | ENUM | `baixa` / `media` / `alta` / `urgente` |
| responsavel | TEXT | Desenvolvedor atribuido |
| data_limite | DATE | Prazo da tarefa |
| estimativa_horas | NUMERIC | Horas estimadas |
| horas_gastas | NUMERIC | Horas efetivamente gastas |
| ordem | INTEGER | Posicao dentro da coluna |
| created_at | TIMESTAMPTZ | auto |
| updated_at | TIMESTAMPTZ | auto |

### 6.3 Tabelas Novas (migration 011 - Painel CTO)

#### `profiles`

```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role       TEXT NOT NULL DEFAULT 'dev'
    CHECK (role IN ('cto', 'socio', 'dev')),
  nome       TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nome, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'dev'  -- default role, CTO promove manualmente
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### `project_milestones`

```sql
CREATE TABLE IF NOT EXISTS public.project_milestones (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  projeto_id    UUID REFERENCES public.projetos(id) ON DELETE CASCADE NOT NULL,
  titulo        TEXT NOT NULL,
  descricao     TEXT,
  data_prevista DATE NOT NULL,
  data_concluida DATE,
  status        TEXT DEFAULT 'pendente'
    CHECK (status IN ('pendente', 'em_andamento', 'concluido', 'atrasado')),
  ordem         INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_milestones_projeto ON public.project_milestones(projeto_id);
CREATE INDEX idx_milestones_data ON public.project_milestones(data_prevista);
```

#### `project_updates`

```sql
CREATE TABLE IF NOT EXISTS public.project_updates (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  projeto_id    UUID REFERENCES public.projetos(id) ON DELETE CASCADE NOT NULL,
  autor         TEXT NOT NULL,
  tipo          TEXT DEFAULT 'nota'
    CHECK (tipo IN ('nota', 'status_change', 'milestone', 'bloqueio', 'entrega')),
  conteudo      TEXT NOT NULL,
  visivel_socio BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_updates_projeto ON public.project_updates(projeto_id);
CREATE INDEX idx_updates_created ON public.project_updates(created_at DESC);
```

#### `presentations`

```sql
CREATE TABLE IF NOT EXISTS public.presentations (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo       TEXT NOT NULL,
  tipo         TEXT DEFAULT 'status_report'
    CHECK (tipo IN ('status_report', 'roadmap', 'financeiro', 'custom')),
  storage_path TEXT NOT NULL,
  storage_url  TEXT NOT NULL,
  generated_by TEXT NOT NULL,
  metadata     JSONB DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT now()
);
```

#### `presentation_requests`

```sql
CREATE TABLE IF NOT EXISTS public.presentation_requests (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requested_by    UUID REFERENCES auth.users(id) NOT NULL,
  tipo            TEXT NOT NULL
    CHECK (tipo IN ('status_report', 'roadmap', 'financeiro', 'custom')),
  notas           TEXT,
  status          TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'generating', 'completed', 'rejected')),
  presentation_id UUID REFERENCES public.presentations(id),
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_requests_status ON public.presentation_requests(status);
```

#### `calendar_sync`

```sql
CREATE TABLE IF NOT EXISTS public.calendar_sync (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type     TEXT NOT NULL CHECK (entity_type IN ('milestone', 'projeto', 'tarefa')),
  entity_id       UUID NOT NULL,
  gcal_event_id   TEXT NOT NULL,
  gcal_calendar_id TEXT NOT NULL DEFAULT 'primary',
  last_synced_at  TIMESTAMPTZ DEFAULT now(),
  sync_status     TEXT DEFAULT 'synced'
    CHECK (sync_status IN ('synced', 'pending', 'error')),
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX idx_calendar_sync_entity
  ON public.calendar_sync(entity_type, entity_id);
```

### 6.4 RLS (Row Level Security) por Role

```sql
-- Funcao helper (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

**Matriz de Permissoes:**

| Tabela | CTO | Socio | Dev |
|--------|-----|-------|-----|
| `projetos` | Full CRUD | SELECT | SELECT |
| `tarefas` | Full CRUD | - | CRUD onde `responsavel = nome` |
| `project_milestones` | Full CRUD | SELECT | SELECT |
| `project_updates` | Full CRUD | SELECT (visivel_socio=true) | SELECT |
| `presentations` | Full CRUD | SELECT | - |
| `presentation_requests` | Full CRUD | INSERT + SELECT (proprios) | - |
| `calendar_sync` | Full CRUD | - | - |
| `profiles` | Full CRUD | SELECT (proprio) | SELECT (proprio) |

**Fallback critico:** Se `get_user_role() IS NULL` (usuario sem profile), conceder acesso full para manter compatibilidade com o CRM e CFO existentes que usam `auth.role() = 'authenticated'`.

```sql
-- Exemplo: Policy de projetos
CREATE POLICY "cto_full_projetos" ON public.projetos
  FOR ALL TO authenticated
  USING (get_user_role() IN ('cto') OR get_user_role() IS NULL)
  WITH CHECK (get_user_role() IN ('cto') OR get_user_role() IS NULL);

CREATE POLICY "socio_read_projetos" ON public.projetos
  FOR SELECT TO authenticated
  USING (get_user_role() = 'socio');

CREATE POLICY "dev_read_projetos" ON public.projetos
  FOR SELECT TO authenticated
  USING (get_user_role() = 'dev');
```

### 6.5 Triggers e Functions

```sql
-- 1. Recalcular progresso ao mover tarefa
CREATE OR REPLACE FUNCTION public.recalc_projeto_progresso()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projetos SET
    progresso = (
      SELECT COALESCE(
        ROUND(COUNT(CASE WHEN status = 'done' THEN 1 END)::numeric
              / NULLIF(COUNT(*), 0) * 100),
        0
      )
      FROM tarefas WHERE projeto_id = COALESCE(NEW.projeto_id, OLD.projeto_id)
    ),
    updated_at = now()
  WHERE id = COALESCE(NEW.projeto_id, OLD.projeto_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_tarefa_change
  AFTER INSERT OR UPDATE OF status OR DELETE ON tarefas
  FOR EACH ROW EXECUTE FUNCTION recalc_projeto_progresso();

-- 2. Detectar milestones atrasados (executar via cron/n8n diario)
CREATE OR REPLACE FUNCTION public.check_milestones_atrasados()
RETURNS void AS $$
  UPDATE project_milestones
  SET status = 'atrasado', updated_at = now()
  WHERE data_prevista < CURRENT_DATE
    AND status IN ('pendente', 'em_andamento');
$$ LANGUAGE sql SECURITY DEFINER;

-- 3. Log automatico de mudanca de status do projeto
CREATE OR REPLACE FUNCTION public.log_projeto_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO project_updates (projeto_id, autor, tipo, conteudo, visivel_socio)
    VALUES (
      NEW.id,
      'Sistema',
      'status_change',
      'Status alterado de ' || OLD.status || ' para ' || NEW.status,
      true
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_projeto_status_change
  AFTER UPDATE OF status ON projetos
  FOR EACH ROW EXECUTE FUNCTION log_projeto_status_change();

-- 4. Updated_at automatico
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_milestones
  BEFORE UPDATE ON project_milestones
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### 6.6 Supabase Storage

```sql
-- Bucket para apresentacoes
INSERT INTO storage.buckets (id, name, public)
VALUES ('presentations', 'presentations', true);

-- Upload: apenas authenticated
CREATE POLICY "auth_upload_presentations"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'presentations');

-- Download: apenas authenticated (socios precisam estar logados)
CREATE POLICY "auth_read_presentations"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'presentations');
```

---

## 7. Paginas e Componentes

### 7.1 Dashboard CTO (`/dashboard`)

**KPIs (4 cards top):**
1. Projetos Ativos (count WHERE status IN backlog, em_andamento, revisao)
2. Entregas no Mes (count WHERE status='entregue' AND updated_at no mes atual)
3. Projetos Atrasados (count WHERE data_entrega < today AND status NOT IN entregue, cancelado)
4. Valor em Pipeline (SUM valor WHERE status IN backlog, em_andamento, revisao)

**Secoes:**
- Proximas Entregas (7 dias) - lista com titulo, cliente, prazo, progresso
- Milestones Proximos (14 dias) - lista com titulo, projeto, data, status
- Feed de Atividade Recente - ultimos 10 project_updates
- Distribuicao por Status - PieChart (Recharts)
- Burn Rate por Projeto - BarChart horizontal (horas estimadas vs gastas)

### 7.2 Kanban (`/kanban`)

**4 Colunas fixas:**

| Coluna | Status | Header Color | Badge |
|--------|--------|-------------|-------|
| Backlog | `backlog` | `#94A3B8` | Count |
| Em Andamento | `em_andamento` | `#00C8F0` | Count |
| Revisao | `revisao` | `#F59E0B` | Count |
| Entregue | `entregue` | `#10B981` | Count |

**Card de Projeto:**
- Titulo + cor do projeto (borda esquerda)
- Cliente
- Badge de prioridade (urgente=vermelho, alta=amarelo, media=cyan, baixa=cinza)
- Barra de progresso (%)
- Data de entrega (vermelho se atrasado)
- Avatar do responsavel
- Count de tarefas (done/total)

**Interacoes:**
- Drag-and-drop entre colunas (via @dnd-kit)
- Click abre detalhe do projeto (`/projetos/[id]`)
- Ao dropar em "Entregue": confirmar com dialog ("Tem certeza? Isso registrara receita no CFO")
- Filtros: por prioridade, categoria, responsavel

### 7.3 Detalhe do Projeto (`/projetos/[id]`)

**Header:**
- Titulo (editavel inline)
- Status badge + cliente + valor + datas
- Barra de progresso geral

**Tabs:**
1. **Tarefas** - Mini-kanban (todo/doing/done) com DnD + form de criar tarefa
2. **Milestones** - Lista cronologica + form de criar + badge de status + botao "Sync Calendar"
3. **Updates** - Feed de atividade + form de postar (com toggle visivel_socio)
4. **Info** - Dados gerais editaveis (descricao, tags, categoria, responsavel)

### 7.4 Timeline Gantt (`/timeline`)

- Eixo X: semanas/meses
- Eixo Y: projetos (ordenados por data_inicio)
- Barra horizontal por projeto: data_inicio -> data_entrega
- Cor da barra: `projeto.cor`
- Preenchimento: proporcional ao `progresso`
- Markers: milestones como diamonds na timeline
- Linha vertical "hoje" para referencia
- Hover: tooltip com detalhes do projeto
- Zoom: semanal / mensal / trimestral

### 7.5 Calendario (`/calendario`)

- Visao mensal (default) e semanal
- 3 fontes merged (milestones + tarefas + GCal)
- Color-coding por tipo (ver Secao 5.4)
- Click em evento: popover com detalhes
- Icone de sync em eventos sincronizados com GCal
- Botao "Sync All" para sincronizar milestones pendentes

### 7.6 Relatorios (`/relatorios`)

**Secao 1 - Gerador:**
- Selecionar tipo (status_report, roadmap, financeiro, custom)
- Preview dos dados que serao incluidos
- Botao "Gerar Relatorio" -> invoca skill PPTX

**Secao 2 - Biblioteca:**
- Grid de cards com apresentacoes geradas
- Card: titulo, tipo badge, data de geracao, gerado por
- Botoes: Download .pptx, Preview (se PDF disponivel)
- Filtros: por tipo, por periodo

### 7.7 Portal dos Socios (`/portal`)

**Secoes (tudo read-only):**
1. **Status dos Projetos** - Tabela simplificada: titulo, cliente, status badge, progresso %, prazo
2. **Feed de Updates** - Somente onde `visivel_socio = true`
3. **Resumo Financeiro** - KPIs macro via RPC `get_cfo_summary()`: receita bruta, MRR, burn rate, runway
4. **Relatorios** - Biblioteca filtrada com botao de download + botao "Solicitar Relatorio"

---

## 8. Integracoes Cross-System

### 8.1 CRM -> Painel CTO

```
Deal ganho no CRM (status='ganho')
    |
    v
Trigger on_deal_ganho()
    |
    v
INSERT em projetos (status='backlog')
    |
    v
Projeto aparece automaticamente no Kanban do CTO
```

### 8.2 Painel CTO -> CFO

```
Projeto movido para 'entregue' no Kanban
    |
    v
Trigger on_projeto_entregue()
    |
    v
INSERT em receitas (valor do projeto, status='confirmado')
    |
    v
Dashboard do CFO atualizado automaticamente
```

### 8.3 Painel CTO -> Google Calendar

```
Milestone criado/atualizado
    |
    v
MCP gcal_create_event / gcal_update_event
    |
    v
Evento aparece na agenda do CTO
    |
    v
Mapeamento salvo em calendar_sync
```

### 8.4 Painel CTO -> PPTX -> Portal Socios

```
Solicitacao de relatorio (CTO ou Socio)
    |
    v
Pipeline PPTX: Gather -> Design -> Generate -> Convert -> QA -> Output
    |
    v
Upload para Supabase Storage (bucket 'presentations')
    |
    v
INSERT em presentations (metadados)
    |
    v
Relatorio aparece na biblioteca do Portal
```

---

## 9. Brand Book & Design System

| Token | Valor | Uso |
|-------|-------|-----|
| `bg-navy` | `#0A1628` | Background principal |
| `bg-card` | `#131F35` | Cards (classe `card-glass`) |
| `brand-cyan` | `#00C8F0` | CTAs, destaques, links ativos |
| `brand-blue` | `#1A6AAA` | Elementos secundarios |
| `brand-blue-deep` | `#153B5F` | Borders, grid lines |
| `text-primary` | `#F0F4F8` | Texto principal |
| `text-secondary` | `#94A3B8` | Labels, subtextos |
| `status-positive` | `#10B981` | Valores positivos (verde) |
| `status-negative` | `#EF4444` | Valores negativos (vermelho) |
| `status-warning` | `#F59E0B` | Alertas (amarelo) |
| **Font** | Poppins (UI) / Calibri (PPTX) | 300-700 weights |

**Regras de UI:**
- Dark mode only (sem toggle)
- Mobile-first responsive
- Skeleton loaders (nunca spinners genericos)
- `card-glass` para todos os cards (`bg-card` + `backdrop-blur-sm` + `border border-brand-blue-deep/30`)
- Framer Motion `PageTransition` em todas as paginas
- Formularios em Dialog/Sheet modal (nao pagina separada)
- Formato de datas: DD/MM/YYYY na UI, ISO no banco
- Formato de moeda: R$ com 2 casas decimais

---

## 10. Plano de Scaffold (Fases de Desenvolvimento)

### Fase 1: Foundation (Scaffold)
- [ ] Criar `apps/painel-cto/` com Next.js 15 + TypeScript + Tailwind
- [ ] Configurar Supabase client/server/middleware
- [ ] Implementar auth com redirect por role
- [ ] Criar componentes UI base (reutilizar padroes do painel-cfo)
- [ ] Configurar TanStack Query provider

### Fase 2: Database
- [ ] Executar migration 011 (profiles, milestones, updates)
- [ ] Executar migration 012 (presentations, presentation_requests, calendar_sync)
- [ ] Configurar RLS com get_user_role()
- [ ] Criar triggers (recalc_progresso, log_status_change, updated_at)
- [ ] Seed de profiles (Daniel=cto, Gustavo=socio)

### Fase 3: Kanban & Projetos
- [ ] Kanban board com DnD (@dnd-kit)
- [ ] Detalhe do projeto com tabs (tarefas, milestones, updates, info)
- [ ] Mini-kanban de tarefas com DnD
- [ ] CRUD de milestones
- [ ] Feed de updates com form

### Fase 4: Dashboard & Timeline
- [ ] Dashboard CTO com KPIs e graficos
- [ ] Timeline Gantt com Recharts customizado
- [ ] Filtros e ordenacao

### Fase 5: Calendar & PPTX
- [ ] Pagina /calendario com visao unificada
- [ ] Integracao MCP Google Calendar (via skill)
- [ ] Pagina /relatorios com biblioteca e gerador
- [ ] Pipeline PPTX com script Node.js

### Fase 6: Portal dos Socios
- [ ] Pagina /portal com visao macro
- [ ] Feed filtrado (visivel_socio=true)
- [ ] Biblioteca de relatorios com download
- [ ] Formulario de solicitacao de relatorio
- [ ] Resumo financeiro via RPC

### Fase 7: Polish & QA
- [ ] Testes de RLS por role
- [ ] Responsividade mobile
- [ ] Performance (lazy loading, pagination)
- [ ] Documentacao de deploy

---

## 11. Metricas de Sucesso

| Metrica | Target | Como Medir |
|---------|--------|------------|
| Tempo para visualizar status de todos os projetos | < 3 segundos | Dashboard load time |
| Geracao de relatorio PPTX | < 60 segundos | Pipeline end-to-end |
| Sync milestone -> GCal | < 5 segundos | MCP roundtrip |
| Satisfacao dos socios | Eliminacao de "cade o status?" | Reducao de mensagens no WhatsApp |
| Adocao do Kanban | 100% dos projetos gerenciados no painel | COUNT projetos no board |

---

## 12. Riscos e Mitigacoes

| Risco | Impacto | Mitigacao |
|-------|---------|-----------|
| MCP Google Calendar indisponivel | Milestones nao sincronizam | Fallback: calendar_sync com status='pending', sync manual |
| PptxGenJS sem suporte a charts complexos | Graficos limitados nos slides | Usar shapes + text como fallback para graficos simples |
| RLS bloqueando queries do CRM/CFO existente | Paineis antigos quebram | Fallback: get_user_role() IS NULL = acesso full |
| Performance do Kanban com muitos projetos | DnD lento | Pagination: mostrar apenas projetos ativos (nao entregue/cancelado) |
| Socio sem conta Supabase Auth | Nao acessa portal | Criar contas manualmente + email de boas-vindas |

---

*Documento gerado em 01/04/2026. Este PRD e a fonte de verdade para o desenvolvimento do Painel do CTO e Portal dos Socios da Gradios.*
