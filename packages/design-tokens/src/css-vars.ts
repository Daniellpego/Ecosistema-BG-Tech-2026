/**
 * Gera CSS custom properties derivadas dos tokens semânticos.
 *
 * Permite trocar valores em runtime (preparação para dark mode futuro,
 * A/B test de tema, etc) sem rebuild dos componentes.
 *
 * Uso:
 *   import { cssVarsLight } from '@gradios/design-tokens/css-vars';
 *   // injetar em globals.css ou via <style> no layout
 *
 * Convenção de nomes: --gd-{categoria}-{path-em-kebab}
 *   ex: semantic.fg.primary  →  --gd-semantic-fg-primary
 *       color.neutral.500    →  --gd-color-neutral-500
 */

import { color, semantic, radius, shadow, motion } from './tokens';

const VAR_PREFIX = '--gd';

type NestedRecord = { [key: string]: string | NestedRecord };

const flatten = (prefix: string, obj: NestedRecord): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const k = `${prefix}-${key}`;
    if (typeof value === 'string') {
      out[k] = value;
    } else if (value && typeof value === 'object') {
      Object.assign(out, flatten(k, value));
    }
  }
  return out;
};

const buildVarsLight = (): Record<string, string> => ({
  ...flatten(`${VAR_PREFIX}-color`, color as NestedRecord),
  ...flatten(`${VAR_PREFIX}-semantic`, semantic as NestedRecord),
  ...flatten(`${VAR_PREFIX}-radius`, radius as NestedRecord),
  ...flatten(`${VAR_PREFIX}-shadow`, shadow as NestedRecord),
  ...flatten(`${VAR_PREFIX}-motion-duration`, motion.duration as NestedRecord),
  ...flatten(`${VAR_PREFIX}-motion-easing`, motion.easing as NestedRecord),
});

const renderBlock = (vars: Record<string, string>, indent = '  '): string =>
  Object.entries(vars)
    .map(([k, v]) => `${indent}${k}: ${v};`)
    .join('\n');

/**
 * Retorna string CSS pronta para injetar em :root.
 */
export const cssVarsLight = (): string => {
  return `:root {\n${renderBlock(buildVarsLight())}\n}\n`;
};

/**
 * Retorna o objeto plano de CSS vars (útil para Tailwind extend ou inline styles).
 */
export const cssVarsLightObject = (): Record<string, string> => buildVarsLight();
