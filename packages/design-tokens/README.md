# @gradios/design-tokens

Single source of truth da identidade visual v2 do `apps/site` (Apple-style light).

Painéis CFO/CRM/CTO seguem usando `@gradios/tailwind-config` (preset dark legado) — este pacote **não os afeta** até a fase 2 do redesign.

## O que tem aqui

```
src/
  tokens.ts      → primitives (color.neutral.500) + semantics (semantic.fg.primary)
  css-vars.ts    → gera string CSS com :root { --gd-* } a partir das semantics
  preset.ts     → Tailwind preset que consome os tokens (cores semânticas via CSS vars)
  index.ts       → re-exports
```

## Quando usar cada token

| Categoria | Quando | Exemplo Tailwind |
|---|---|---|
| Semantic (preferido) | Sempre que possível em UI | `bg-base`, `text-fg-primary`, `border-DEFAULT` |
| Primitive | Casos pontuais (dataviz, gradientes) | `bg-primary-500`, `text-neutral-700` |
| Tipografia | Sempre via tokens nomeados | `text-display-1`, `text-title-2`, `text-body`, `text-callout` |
| Spacing de section | Vertical de seções | `py-section-regular`, `py-section-hero` |
| Spacing de bloco | Entre blocos de conteúdo | `gap-block-tight`, `mb-block-normal` |
| Spacing fino | Dentro de componentes | scale numérica padrão (`gap-2`, `p-4`) |

## Como consumir no `apps/site`

```ts
// tailwind.config.ts
import preset from '@gradios/design-tokens/preset';
import type { Config } from 'tailwindcss';

const config: Config = {
  presets: [preset],
  content: ['./src/**/*.{ts,tsx}'],
};
export default config;
```

```css
/* globals.css */
/* injetar CSS vars (build-time ou hardcode) */
@import url('./tokens.css'); /* gerado por cssVarsLight() */
```

```tsx
import { cssVarsLight } from '@gradios/design-tokens/css-vars';
// dentro de um <style> no layout, ou via build-time codegen
```

## Convenções não-negociáveis

- **Texto principal** = `#1D1D1F`, **nunca** `#000000`.
- **Body base** = 17px (não 16).
- **Pesos Inter** = 400 e 600. 700 só em exceção justificada.
- **Sem gradientes em CTAs.** Botão primário = preto sólido (`bg-fg-primary`).
- **Ciano (`secondary`)** = só accent (hover/foco/dataviz). Nunca em CTA.
- **Animações** restritas à `motion.whitelist` em `tokens.ts`.

## Versionamento

Mudança breaking de token = bump de major. Adição = minor. Refactor interno = patch.
