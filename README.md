# AIOX — Ecossistema Gradios

Plataforma interna da Gradios: site, CRM, CFO e CTO integrados via Supabase.

## Estrutura

```
apps/
  site/    — gradios.co (landing + quiz diagnostico)
  crm/     — pipeline de vendas B2B
  cfo/     — dashboard financeiro
  cto/     — projetos, kanban, timeline, relatorios
supabase/  — migrations, edge functions, RLS
```

## Stack

Next.js 15 · TypeScript · Tailwind · Radix UI · TanStack Query · Supabase · Vercel

## Rodar local

```bash
cd apps/cfo && npm install && npm run dev   # localhost:3000
cd apps/crm && npm install && npm run dev   # localhost:3001
cd apps/cto && npm install && npm run dev   # localhost:3002
cd apps/site && npm install && npm run dev  # localhost:3003
```

## Links

- [gradios.co](https://www.gradios.co)
- [Quiz Diagnostico](https://www.gradios.co/diagnostico)
- contato@gradios.co · (43) 98837-2540
