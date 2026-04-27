'use client';

import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

/**
 * useReducedMotion — retorna true quando o usuário pediu menos animação via
 * SO/navegador (`@media (prefers-reduced-motion: reduce)`).
 *
 * Wrapper sobre o hook do framer-motion: normaliza `null` → `false` para
 * facilitar uso direto em condicionais e variants.
 *
 * Uso:
 *   const reduced = useReducedMotion();
 *   <motion.div variants={fadeIn({ reducedMotion: reduced })} />
 */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false;
}
