# GRADIOS — ECOSYSTEM.md
# Contexto completo do ecossistema para Claude Code
# Daniel Pego / GRADIOS 2026
# github.com/Daniellpego/Ecosistema-BG-Tech-2026

---

## QUEM SOMOS

**GRADIOS** e uma empresa de engenharia de software e automacao inteligente.
Tagline: "O cerebro da sua operacao"
Proposta: Identificamos o gargalo, construimos a automacao, resultado em 2 semanas.

**O que entregamos para clientes:**
- Automacao de processos (aprovacoes, relatorios, integracoes, notificacoes)
- Desenvolvimento de software sob medida
- Integracoes e APIs entre sistemas
- Dashboards e relatorios em tempo real
- IA aplicada ao negocio (atendimento, analise, decisao)

**Segmentos atendidos:** Varejo, Industria, Logistica, Saude, Financeiro, SaaS

**Contato:** (43) 98837-2540 | contato@gradios.co
**Site:** https://www.gradios.co
**GitHub:** https://github.com/Daniellpego/Ecosistema-BG-Tech-2026

---

## ECOSSISTEMA DE SISTEMAS

O ecossistema GRADIOS e composto por 5 sistemas integrados via Supabase:

```
gradios.co (site principal)
    |
    |-- Quiz/Funil --> capta leads --> Supabase (tabela leads/contatos)
    |                                       |
    |                                       v
    |                              Painel CRM (gestao de pipeline)
    |                                       |
    |                                       v
    |                              Painel CFO (financeiro/metricas)
    |
    |-- JARVIS (IA C-Level local)
            |-- 8 agents especializados
            |-- Memoria no Supabase
            |-- Serve a equipe interna GRADIOS
```

---

## SISTEMA 1 — SITE PRINCIPAL

**URL:** https://www.gradios.co
**Stack:** Next.js (Vercel)
**Funcao:** Vitrine da empresa + captacao de leads

**Secoes do site:**
- Hero: "Automatize sua operacao. Escale sem contratar mais."
- Solucoes: Automacao, Dev sob medida, Integracoes, Dashboards, Suporte, IA
- Como funciona: Diagnostico → Desenvolvimento → Automacao rodando
- Cases: resultados reais de clientes
- FAQ
- Formulario de contato (captura: nome, empresa, email, desafio)

**Fluxo de lead:**
1. Visitante preenche formulario "Diagnostico Gratuito"
2. Dado vai para o Supabase
3. Aparece no Painel CRM como novo lead

**Melhorias pendentes:**
- Conectar formulario de contato ao Supabase de forma robusta
- Adicionar webhook para notificar equipe no WhatsApp/Slack quando lead entra
- A/B test nas CTAs
- Analytics de conversao

---

## SISTEMA 2 — QUIZ / FUNIL DE CAPTACAO

**Funcao:** Qualificar leads antes de entrar no CRM
**Stack:** Next.js (Vercel) + Supabase

**Fluxo esperado:**
1. Lead acessa quiz via link (anuncio, site, indicacao)
2. Responde perguntas de qualificacao (segmento, tamanho, desafio, urgencia)
3. Recebe resultado personalizado
4. Dados salvos no Supabase com score de qualificacao
5. Lead qualificado aparece no CRM com todas as respostas

**Tabelas Supabase relacionadas:**
- `leads` ou `contatos` — dados do lead + respostas do quiz
- `qualificacoes` — score, segmento, potencial

**Melhorias pendentes:**
- Score automatico de qualificacao (1-10)
- Segmentacao automatica por segmento respondido
- Email automatico de boas-vindas apos quiz
- Integracao com JARVIS agent CRM para sugerir abordagem

---

## SISTEMA 3 — PAINEL CRM

**Funcao:** Gestao de pipeline de vendas e clientes da GRADIOS
**Stack:** Next.js (Vercel) + Supabase
**Status:** Existe, nao totalmente testado na pratica

**Funcionalidades esperadas:**
- Pipeline Kanban: Lead → Contato → Proposta → Negociacao → Cliente → Recorrente
- Perfil completo de cada empresa/contato
- Historico de interacoes e notas
- Propostas comerciais geradas com IA (agent CRM do JARVIS)
- Tarefas e follow-ups com data
- Dashboard de conversao por etapa
- Filtros por segmento, status, responsavel

**Tabelas Supabase relacionadas:**
- `clientes` — empresas no pipeline
- `contatos` — pessoas de contato
- `oportunidades` — deals em andamento
- `interacoes` — historico de ligacoes, emails, reunioes
- `propostas` — propostas geradas
- `tarefas` — follow-ups pendentes

**Integracao com JARVIS:**
- Agent CRM gera scripts de abordagem para cada lead
- Agent CFO calcula potencial de receita do pipeline
- Agent Copy gera emails e mensagens de follow-up

**Melhorias pendentes:**
- Testar fluxo completo lead → cliente
- Automatizar notificacao de follow-up vencido
- Gerar proposta comercial com 1 clique via JARVIS
- Relatorio semanal de pipeline automatico

---

## SISTEMA 4 — PAINEL CFO

**Funcao:** Dashboard financeiro e estrategico da GRADIOS
**Stack:** Next.js (Vercel) + Supabase
**Status:** Existe, em desenvolvimento

**Funcionalidades esperadas:**
- DRE (Demonstrativo de Resultado) em tempo real
- Fluxo de caixa projetado vs realizado
- MRR (Monthly Recurring Revenue) e crescimento
- CAC (Custo de Aquisicao de Cliente) por canal
- LTV (Lifetime Value) por segmento
- Margem por projeto/cliente
- Projecao de receita (3, 6, 12 meses)
- Alertas de risco financeiro
- KPIs da operacao: projetos ativos, horas, entregas

**Tabelas Supabase relacionadas:**
- `financeiro` ou `transacoes` — entradas e saidas
- `projetos` — projetos ativos com valor e status
- `recorrencias` — contratos mensais
- `despesas` — custos operacionais
- `metas` — targets mensais/trimestrais

**Integracao com JARVIS:**
- Agent CFO analisa dados e gera relatorio narrativo
- Agent CFO alerta sobre desvios de meta
- Agent CFO sugere acoes baseadas nos numeros

**Melhorias pendentes:**
- Conectar dados reais de projetos/financeiro
- Automatizar DRE mensal
- Dashboard executivo para reuniao de diretoria
- Exportar relatorio PDF com 1 clique

---

## SISTEMA 5 — JARVIS (IA C-Level)

**Funcao:** Cerebro de IA interno da GRADIOS — equipe de advisors virtuais 24/7
**Stack:** FastAPI + Ollama Qwen2.5:14b (local, RTX 4070Ti) + Next.js 15
**Localizado em:** E:\gradios
**Porta API:** 8001
**Porta UI:** 3000

**Os 8 Agents:**

| Agent | Persona | Especialidade |
|---|---|---|
| copy | Daniel Mathews | Landing pages, VSL, email, anuncios |
| dev | Guillermo Rauch | Next.js 15, Supabase, TypeScript |
| fiscal | Renato Leblon | ICMS, CFOP, Reforma Tributaria 2026 |
| ads | Larry Kim | Meta/Google Ads, ROAS 5x+ |
| brand | Paula Scher | Identidade visual, branding premium |
| manufatura | Siemens Expert | ROI industrial, automacao, payback |
| cfo | McKinsey Advisor | DRE, EBITDA, dashboards financeiros |
| crm | JARVIS CRM | Pipeline B2B, playbooks, propostas |

**Como o JARVIS serve o ecossistema:**
- **Para a equipe GRADIOS:** consultar agents para entregar mais rapido para clientes
- **Para o CRM:** agent CRM gera scripts, propostas, follow-ups automaticamente
- **Para o CFO:** agent CFO analisa numeros e gera relatorio narrativo
- **Para os clientes:** cada cliente da GRADIOS pode ter seu proprio JARVIS white-label
- **Para o Marketing:** agent Copy + Ads cria campanhas e conteudo

---

## INFRAESTRUTURA

**Hospedagem producao:** Vercel (frontend) + Supabase (banco)
**Hospedagem JARVIS:** Local — Windows + RTX 4070Ti
**Banco de dados:** Supabase (PostgreSQL)
**IA local:** Ollama + qwen2.5:14b (E:\gradios\ollama-models)
**IA premium:** Claude API (Anthropic) — para casos complexos
**Repositorio:** github.com/Daniellpego/Ecosistema-BG-Tech-2026

**Variaveis de ambiente criticas:**
```
SUPABASE_URL=https://urpuiznydrlwmaqhdids.supabase.co
SUPABASE_KEY=[service_role key]
ANTHROPIC_API_KEY=[quando disponivel]
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:14b
NEXT_PUBLIC_JARVIS_URL=http://localhost:8001
```

---

## SCHEMA SUPABASE (tabelas existentes ou a criar)

### Tabelas do JARVIS (ja definidas em agents.sql)
```sql
jarvis_memory        — historico de conversas por sessao
jarvis_agents        — configuracao dos 8 agents
jarvis_studies       — estudos e analises gerados
jarvis_orchestrations — log de chamadas multi-agent
```

### Tabelas do Ecossistema (CRM/CFO/Quiz)
```sql
clientes             — empresas clientes e leads
contatos             — pessoas de contato
oportunidades        — pipeline de vendas
interacoes           — historico CRM
propostas            — propostas comerciais
projetos             — projetos em execucao
transacoes           — financeiro (entradas/saidas)
recorrencias         — contratos mensais
tarefas              — follow-ups e pendencias
quiz_respostas       — respostas do funil de captacao
```

---

## INTEGRACAO JARVIS + ECOSSISTEMA (visao futura)

O objetivo final e o JARVIS ser o cerebro operacional de toda a GRADIOS:

```
[Lead entra no Quiz]
        |
        v
[JARVIS CRM agent] — analisa perfil e sugere abordagem
        |
        v
[Vendedor usa script gerado] — faz a abordagem
        |
        v
[JARVIS Copy agent] — gera proposta personalizada
        |
        v
[Cliente fecha] → entra no Painel CFO
        |
        v
[JARVIS CFO agent] — monitora margem e entrega do projeto
        |
        v
[JARVIS Dev agent] — apoia execucao tecnica do projeto
```

---

## MISSAO DO CLAUDE CODE NESTE CONTEXTO

Voce tem acesso ao repositorio completo do ecossistema.
Sua missao e:

1. **Entender a arquitetura** — ler todos os arquivos antes de modificar qualquer coisa
2. **Conectar os sistemas** — JARVIS precisa se integrar ao CRM e CFO via Supabase
3. **Construir os agents com profundidade** — cada agent tem system prompt especializado, outputs estruturados e conhecimento real do dominio
4. **Nao quebrar o que funciona** — o site esta no ar, o CRM e CFO existem
5. **Codigo de produto** — nao de prototipo. Tipado, testado, documentado.

---

## PROXIMOS PASSOS PRIORITARIOS

1. [ ] Clonar repo e mapear estrutura atual de todos os sistemas
2. [ ] Identificar tabelas Supabase existentes e alinhar com schema do JARVIS
3. [ ] Conectar JARVIS ao CRM (agent CRM le e escreve no Supabase do CRM)
4. [ ] Conectar JARVIS ao CFO (agent CFO le dados financeiros do Supabase)
5. [ ] Criar agent CRM completo com prompts de elite
6. [ ] Criar agent CFO completo integrado aos dados reais
7. [ ] Webhook: lead entra no quiz → notifica JARVIS → sugere abordagem
8. [ ] Deploy JARVIS na Vercel ou VPS para acesso remoto

---

## COMO FALAR COM O DANIEL

- Direto ao ponto — ele e empreendedor, nao desenvolvedor
- Explica o que vai fazer antes de fazer
- Mostra resultado visual sempre que possivel
- Quando tiver duvida sobre o negocio, pergunta
- Preferencia: portugues BR em tudo
