import type { Variants } from 'framer-motion';
import { duration as DUR, easing as EASE } from './tokens';

/**
 * Motion presets — funções que retornam Variants para Framer Motion.
 *
 * Padrão de uso:
 *   const reduced = useReducedMotion();
 *   <motion.div initial="hidden" animate="visible"
 *     variants={fadeIn({ delay: 0.1, reducedMotion: reduced })} />
 *
 * Princípios:
 *   • Apenas transform e opacity (GPU-friendly, sem layout thrashing)
 *   • Quando reducedMotion=true, o estado final é aplicado instantaneamente
 *     (duration: 0) para preservar a finalidade visual sem o movimento.
 *   • Durações vêm dos tokens (fast/normal/slow).
 */

export interface PresetOptions {
  /** Atraso antes de iniciar a animação (segundos). Default: 0. */
  delay?: number;
  /** Duração da animação (segundos). Default: tokens.duration.normal. */
  duration?: number;
  /** Honrar prefers-reduced-motion. Default: false. */
  reducedMotion?: boolean;
  /** Distância em pixels para slides. Default: 16. */
  distance?: number;
  /** Escala inicial/final para zoom. Default: 0.95. */
  scale?: number;
}

type CubicBezier = readonly [number, number, number, number];

const baseTransition = (opts: PresetOptions, ease: CubicBezier) => ({
  duration: opts.reducedMotion ? 0 : (opts.duration ?? DUR.normal),
  delay: opts.reducedMotion ? 0 : (opts.delay ?? 0),
  ease: [ease[0], ease[1], ease[2], ease[3]] as [number, number, number, number],
});

// ─── Fade ────────────────────────────────────────────────────────────────

export const fadeIn = (opts: PresetOptions = {}): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: baseTransition(opts, EASE.outExpo),
  },
});

export const fadeOut = (opts: PresetOptions = {}): Variants => ({
  visible: { opacity: 1 },
  hidden: {
    opacity: 0,
    transition: baseTransition(opts, EASE.inExpo),
  },
});

// ─── Slide ───────────────────────────────────────────────────────────────

export const slideUp = (opts: PresetOptions = {}): Variants => {
  const distance = opts.distance ?? 16;
  return {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: baseTransition(opts, EASE.outExpo),
    },
  };
};

export const slideDown = (opts: PresetOptions = {}): Variants => {
  const distance = opts.distance ?? 16;
  return {
    hidden: { opacity: 0, y: -distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: baseTransition(opts, EASE.outExpo),
    },
  };
};

export const slideLeft = (opts: PresetOptions = {}): Variants => {
  const distance = opts.distance ?? 16;
  return {
    hidden: { opacity: 0, x: distance },
    visible: {
      opacity: 1,
      x: 0,
      transition: baseTransition(opts, EASE.outExpo),
    },
  };
};

export const slideRight = (opts: PresetOptions = {}): Variants => {
  const distance = opts.distance ?? 16;
  return {
    hidden: { opacity: 0, x: -distance },
    visible: {
      opacity: 1,
      x: 0,
      transition: baseTransition(opts, EASE.outExpo),
    },
  };
};

// ─── Scale ───────────────────────────────────────────────────────────────

export const scaleIn = (opts: PresetOptions = {}): Variants => {
  const scale = opts.scale ?? 0.95;
  return {
    hidden: { opacity: 0, scale },
    visible: {
      opacity: 1,
      scale: 1,
      transition: baseTransition(opts, EASE.outExpo),
    },
  };
};

export const scaleOut = (opts: PresetOptions = {}): Variants => {
  const scale = opts.scale ?? 0.95;
  return {
    visible: { opacity: 1, scale: 1 },
    hidden: {
      opacity: 0,
      scale,
      transition: baseTransition(opts, EASE.inExpo),
    },
  };
};

// ─── Stagger Container ───────────────────────────────────────────────────

export interface StaggerOptions {
  /** Intervalo entre filhos (segundos). Default: 0.05 (50ms). */
  staggerChildren?: number;
  /** Atraso antes do primeiro filho (segundos). Default: 0. */
  delayChildren?: number;
  /** Honrar prefers-reduced-motion (zera tudo). Default: false. */
  reducedMotion?: boolean;
}

export const staggerContainer = (opts: StaggerOptions = {}): Variants => {
  const reduced = opts.reducedMotion ?? false;
  return {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reduced ? 0 : (opts.staggerChildren ?? 0.05),
        delayChildren: reduced ? 0 : (opts.delayChildren ?? 0),
      },
    },
  };
};
