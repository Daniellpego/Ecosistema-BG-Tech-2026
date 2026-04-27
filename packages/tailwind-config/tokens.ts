/**
 * Design tokens canônicos do ecossistema Gradios.
 * Fonte de verdade para cores, tipografia, espaçamentos e motion.
 *
 * Conflito histórico resolvido: text.muted = #94A3B8 (CRM/CTO) supera
 * #B0BEC5 (CFO antigo) por melhor contraste WCAG AA sobre branco.
 */

export const palette = {
  brand: {
    blue: '#0A1B5C',
    'blue-deep': '#06103D',
    'blue-secondary': '#14298A',
    cyan: '#00BFFF',
    'cyan-light': '#33CCFF',
    'cyan-lighter': '#66D9FF',
    navy: '#0A1628',
    'navy-card': '#131F35',
    'navy-deep': '#153B5F',
  },
  status: {
    positive: '#10B981',
    negative: '#EF4444',
    warning: '#F59E0B',
    info: '#00BFFF',
  },
  ink: {
    primary: '#0F172A',
    secondary: '#64748B',
    muted: '#94A3B8',
    onDark: '#F0F4F8',
  },
  surface: {
    base: '#FFFFFF',
    sidebar: '#F8FAFC',
    card: '#FFFFFF',
    hover: '#F1F5F9',
    input: '#F8FAFC',
    border: '#E2E8F0',
  },
} as const;

export const radius = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  card: '14px',
} as const;

export const motion = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
    'in-expo': 'cubic-bezier(0.7, 0, 0.84, 0)',
    'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
  },
} as const;

export const breakpoints = {
  xs: '380px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const fontWeights = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export type Palette = typeof palette;
export type Radius = typeof radius;
export type Motion = typeof motion;
export type Breakpoints = typeof breakpoints;
