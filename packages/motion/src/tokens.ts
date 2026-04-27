/**
 * Motion tokens — durações em SEGUNDOS (formato Framer Motion) e easings
 * como tuplas cubic-bezier. Espelha @gradios/tailwind-config/tokens (que usa
 * milissegundos em CSS strings).
 *
 * GPU-friendly: presets desta lib só animam transform e opacity.
 */

export const duration = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
} as const;

export const easing = {
  /** Saídas suaves, padrão preferido para entrada de elementos. */
  outExpo: [0.16, 1, 0.3, 1] as const,
  /** Entrada acelerada, padrão para saída de elementos. */
  inExpo: [0.7, 0, 0.84, 0] as const,
  /** Movimento simétrico para transições reversíveis. */
  inOutExpo: [0.87, 0, 0.13, 1] as const,
} as const;

export type Duration = typeof duration;
export type Easing = typeof easing;
