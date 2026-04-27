/**
 * Tailwind preset que consome os tokens da identidade v2.
 *
 * Apps light (atualmente: site) usam direto:
 *   import preset from '@gradios/design-tokens/preset';
 *   const config: Config = { presets: [preset], content: [...] };
 *
 * Convenções de uso em UI:
 *   - Cores semânticas (bg-base, text-fg-primary, border-DEFAULT) → CSS vars,
 *     trocáveis em runtime.
 *   - Cores primitivas (neutral-500, primary-500) → casos pontuais.
 *   - Tipografia: usar text-display-1, text-title-2, text-body, text-callout
 *     em vez de tamanhos arbitrários (text-[18px]).
 *   - Spacing: usar tokens semânticos (py-section-regular) em sections,
 *     scale numérica padrão dentro de blocos.
 */

import type { Config } from 'tailwindcss';
import animatePlugin from 'tailwindcss-animate';
import {
  color,
  typography,
  layout,
  radius,
  shadow,
  motion,
  breakpoints,
  spacing,
} from './tokens';

const preset = {
  darkMode: 'class',
  content: [],
  theme: {
    screens: { ...breakpoints },
    container: {
      center: true,
      padding: {
        DEFAULT: spacing['gutter-mobile'],
        sm: spacing['gutter-tablet'],
        lg: spacing['gutter-desktop'],
      },
    },
    extend: {
      colors: {
        neutral: color.neutral,
        primary: color.primary,
        secondary: color.secondary,
        success: color.success,
        warning: color.warning,
        danger: color.danger,

        bg: {
          base: 'var(--gd-semantic-bg-base)',
          surface: 'var(--gd-semantic-bg-surface)',
          subtle: 'var(--gd-semantic-bg-subtle)',
          muted: 'var(--gd-semantic-bg-muted)',
          inverse: 'var(--gd-semantic-bg-inverse)',
        },
        fg: {
          primary: 'var(--gd-semantic-fg-primary)',
          secondary: 'var(--gd-semantic-fg-secondary)',
          tertiary: 'var(--gd-semantic-fg-tertiary)',
          'on-inverse': 'var(--gd-semantic-fg-onInverse)',
          brand: 'var(--gd-semantic-fg-brand)',
          danger: 'var(--gd-semantic-fg-danger)',
        },
        accent: {
          DEFAULT: 'var(--gd-semantic-accent-primary)',
          hover: 'var(--gd-semantic-accent-primaryHover)',
          active: 'var(--gd-semantic-accent-primaryActive)',
          muted: 'var(--gd-semantic-accent-primaryMuted)',
          secondary: 'var(--gd-semantic-accent-secondary)',
          'secondary-hover': 'var(--gd-semantic-accent-secondaryHover)',
        },
      },

      borderColor: {
        DEFAULT: 'var(--gd-semantic-border-default)',
        subtle: 'var(--gd-semantic-border-subtle)',
        strong: 'var(--gd-semantic-border-strong)',
        focus: 'var(--gd-semantic-border-focus)',
      },

      fontFamily: { ...typography.fontFamily },
      fontSize: typography.fontSize,
      fontWeight: { ...typography.fontWeight },
      letterSpacing: { ...typography.letterSpacing },
      lineHeight: { ...typography.lineHeight },

      spacing: { ...spacing },

      maxWidth: {
        'container-narrow': layout.container.narrow,
        'container-default': layout.container.default,
        'container-hero': layout.container.hero,
      },

      borderRadius: { ...radius },

      boxShadow: {
        xs: shadow.xs,
        sm: shadow.sm,
        md: shadow.md,
        lg: shadow.lg,
        xl: shadow.xl,
        focus: shadow.focus,
        'focus-accent': shadow.focusAccent,
      },

      transitionDuration: { ...motion.duration },
      transitionTimingFunction: { ...motion.easing },

      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up-sm': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'navbar-shrink': {
          from: { height: '5rem' },
          to: { height: '4rem' },
        },
        'accordion-expand': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-collapse': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'fade-in': `fade-in ${motion.duration.normal} ${motion.easing.out}`,
        'slide-up-sm': `slide-up-sm ${motion.duration.normal} ${motion.easing.emphasized}`,
        'navbar-shrink': `navbar-shrink ${motion.duration.fast} ${motion.easing.standard}`,
        'accordion-expand': `accordion-expand ${motion.duration.fast} ${motion.easing.out}`,
        'accordion-collapse': `accordion-collapse ${motion.duration.fast} ${motion.easing.out}`,
      },
    },
  },
  plugins: [animatePlugin],
} satisfies Config;

export default preset;
