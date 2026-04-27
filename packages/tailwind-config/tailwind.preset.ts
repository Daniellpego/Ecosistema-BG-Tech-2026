import type { Config } from 'tailwindcss';
import animatePlugin from 'tailwindcss-animate';
import { palette, radius, motion, breakpoints, fontWeights } from './tokens';

/**
 * @gradios/tailwind-config — preset Tailwind unificado.
 *
 * Consolida apps/cfo, apps/crm, apps/cto e apps/site em uma única fonte de
 * verdade. Cada app deve apenas:
 *   import preset from '@gradios/tailwind-config';
 *   const config: Config = { presets: [preset], content: [...] };
 *
 * Decisões de consolidação:
 *   • Breakpoints: usa o set do CTO (inclui xs: 380px) para mobile-first real.
 *   • text.muted: #94A3B8 (CRM/CTO) — supera #B0BEC5 (CFO) por contraste WCAG.
 *   • darkMode: 'class' habilitado para preparação futura (sem toggle ativo).
 *   • Aliases legados (bg.*, brand.*, status.*, text.*) preservados para
 *     compatibilidade com classes já espalhadas pelo monorepo.
 */
const preset = {
  darkMode: 'class',
  content: [],
  theme: {
    screens: { ...breakpoints },
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        // ─── Tokens semânticos (preferência futura) ────────────────────────
        surface: palette.surface.base,
        'surface-sidebar': palette.surface.sidebar,
        'surface-card': palette.surface.card,
        'surface-hover': palette.surface.hover,
        'surface-input': palette.surface.input,
        'surface-dark': palette.brand.navy,
        'surface-dark-card': palette.brand['navy-card'],

        foreground: palette.ink.primary,
        'foreground-on-dark': palette.ink.onDark,
        muted: palette.ink.muted,
        'muted-foreground': palette.ink.secondary,
        'border-default': palette.surface.border,
        accent: palette.brand.cyan,

        'brand-primary': palette.brand.blue,
        'brand-secondary': palette.brand['blue-secondary'],
        'brand-deep': palette.brand['blue-deep'],
        'brand-accent': palette.brand.cyan,

        danger: palette.status.negative,
        warning: palette.status.warning,
        success: palette.status.positive,
        info: palette.status.info,

        // ─── Aliases legados (compat com apps atuais) ──────────────────────
        bg: {
          base: palette.surface.base,
          sidebar: palette.surface.sidebar,
          card: palette.surface.card,
          hover: palette.surface.hover,
          input: palette.surface.input,
          navy: palette.brand.navy,
        },
        brand: {
          blue: palette.brand.blue,
          cyan: palette.brand.cyan,
          'cyan-light': palette.brand['cyan-light'],
          'cyan-lighter': palette.brand['cyan-lighter'],
          'blue-secondary': palette.brand['blue-secondary'],
          'blue-deep': palette.brand['blue-deep'],
        },
        status: {
          positive: palette.status.positive,
          negative: palette.status.negative,
          warning: palette.status.warning,
        },
        text: {
          primary: palette.ink.primary,
          secondary: palette.ink.secondary,
          muted: palette.ink.muted,
          dark: palette.ink.primary,
        },
      },

      fontFamily: {
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontWeight: { ...fontWeights },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
      },

      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      borderRadius: {
        sm: radius.sm,
        md: radius.md,
        lg: radius.lg,
        xl: radius.xl,
        '2xl': radius['2xl'],
        card: radius.card,
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        'card-hover':
          '0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -1px rgba(15, 23, 42, 0.04)',
        glow: '0 0 20px rgba(0, 191, 255, 0.35)',
        focus: '0 0 0 2px rgba(0, 191, 255, 0.5)',
      },

      transitionDuration: {
        fast: motion.duration.fast,
        normal: motion.duration.normal,
        slow: motion.duration.slow,
      },
      transitionTimingFunction: {
        'out-expo': motion.easing['out-expo'],
        'in-expo': motion.easing['in-expo'],
        'in-out-expo': motion.easing['in-out-expo'],
      },

      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(0, 191, 255, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 191, 255, 0.6)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [animatePlugin],
} satisfies Config;

export default preset;
