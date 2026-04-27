/**
 * @gradios/design-tokens — fonte de verdade da identidade visual v2.
 *
 * Filosofia:
 *   - PRIMITIVES: paletas brutas (color.neutral.500). Não usar em UI.
 *   - SEMANTIC: tokens com intenção (semantic.fg.primary). Usar em UI.
 *   - Light theme é o único ativo. Tokens semânticos abrem caminho para
 *     dark futuro (sem toggle agora) sem refactor.
 *
 * Convenções:
 *   - Spacing rhythm = múltiplos de 8 (com exceções 4 e 12 marcadas).
 *   - Tipografia base = 17px (Apple HIG).
 *   - Texto principal = #1D1D1F (não preto puro).
 *   - Contraste mínimo WCAG AA.
 */

// ─── PRIMITIVES ──────────────────────────────────────────────────────────────

export const color = {
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F7',
    200: '#E8E8ED',
    300: '#D2D2D7',
    400: '#A1A1A6',
    500: '#86868B',
    600: '#6E6E73',
    700: '#424245',
    800: '#2C2C2E',
    900: '#1D1D1F',
  },
  primary: {
    50: '#EEF2FE',
    100: '#DDE5FD',
    200: '#BCC8FB',
    300: '#94A8F6',
    400: '#6680E8',
    500: '#2546BD',
    600: '#1F3CA0',
    700: '#1A3284',
    800: '#15296B',
    900: '#112256',
  },
  secondary: {
    50: '#E6F8FF',
    100: '#CCF1FF',
    200: '#99E3FF',
    300: '#66D6FF',
    400: '#33C8FF',
    500: '#00BFFF',
    600: '#00A0DC',
    700: '#0083B5',
    800: '#00688E',
    900: '#004D6B',
  },
  success: { 50: '#ECFDF5', 500: '#10B981', 700: '#047857' },
  warning: { 50: '#FFFBEB', 500: '#F59E0B', 700: '#B45309' },
  danger: { 50: '#FEF2F2', 500: '#EF4444', 700: '#B91C1C' },
  white: '#FFFFFF',
  black: '#000000',
} as const;

// ─── SEMANTIC TOKENS (light theme) ───────────────────────────────────────────

export const semantic = {
  bg: {
    base: color.white,
    surface: color.white,
    subtle: color.neutral[100],
    muted: color.neutral[200],
    inverse: color.neutral[900],
  },
  fg: {
    primary: color.neutral[900],
    secondary: color.neutral[700],
    tertiary: color.neutral[500],
    onInverse: color.white,
    brand: color.primary[500],
    accent: color.secondary[500],
    danger: color.danger[700],
  },
  border: {
    default: color.neutral[200],
    subtle: color.neutral[100],
    strong: color.neutral[300],
    focus: color.primary[500],
  },
  accent: {
    primary: color.primary[500],
    primaryHover: color.primary[600],
    primaryActive: color.primary[700],
    primaryMuted: color.primary[50],
    secondary: color.secondary[500],
    secondaryHover: color.secondary[600],
  },
  status: {
    successBg: color.success[50],
    successFg: color.success[700],
    warningBg: color.warning[50],
    warningFg: color.warning[700],
    dangerBg: color.danger[50],
    dangerFg: color.danger[700],
  },
} as const;

// ─── TYPOGRAPHY ──────────────────────────────────────────────────────────────

type FontSizeEntry = [
  size: string,
  config: { lineHeight: string; letterSpacing: string; fontWeight: string }
];

const fontSize: Record<string, FontSizeEntry> = {
  'display-2': ['80px', { lineHeight: '1.05', letterSpacing: '-0.04em', fontWeight: '600' }],
  'display-1': ['64px', { lineHeight: '1.05', letterSpacing: '-0.04em', fontWeight: '600' }],
  'title-1': ['48px', { lineHeight: '1.10', letterSpacing: '-0.03em', fontWeight: '600' }],
  'title-2': ['40px', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' }],
  'title-3': ['32px', { lineHeight: '1.20', letterSpacing: '-0.02em', fontWeight: '600' }],
  headline: ['24px', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
  subhead: ['20px', { lineHeight: '1.40', letterSpacing: '-0.01em', fontWeight: '500' }],
  'body-lg': ['19px', { lineHeight: '1.50', letterSpacing: '0', fontWeight: '400' }],
  body: ['17px', { lineHeight: '1.50', letterSpacing: '0', fontWeight: '400' }],
  callout: ['15px', { lineHeight: '1.45', letterSpacing: '0', fontWeight: '400' }],
  footnote: ['13px', { lineHeight: '1.40', letterSpacing: '0', fontWeight: '400' }],
  caption: ['11px', { lineHeight: '1.35', letterSpacing: '0.02em', fontWeight: '500' }],
};

export const typography = {
  fontFamily: {
    sans: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    display: 'var(--font-inter-display), var(--font-inter), -apple-system, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, "Cascadia Code", monospace',
  },
  fontSize,
  fontWeight: {
    regular: '400',
    semibold: '600',
    bold: '700',
  },
  letterSpacing: {
    tighter: '-0.04em',
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
  },
  lineHeight: {
    tight: '1.1',
    snug: '1.25',
    normal: '1.5',
    relaxed: '1.625',
  },
} as const;

// ─── SPACING (rhythm 8) ──────────────────────────────────────────────────────
// Tokens semânticos em complemento à scale numérica padrão do Tailwind.

export const spacing = {
  'section-compact': '4rem',
  'section-regular': '6rem',
  'section-hero': '8rem',
  'section-flagship': '10rem',
  'block-tight': '1.5rem',
  'block-normal': '2.5rem',
  'block-loose': '4rem',
  'gutter-mobile': '1rem',
  'gutter-tablet': '1.5rem',
  'gutter-desktop': '2rem',
} as const;

// ─── LAYOUT ──────────────────────────────────────────────────────────────────

export const layout = {
  container: {
    narrow: '768px',
    default: '1200px',
    hero: '1440px',
  },
  grid: {
    columns: 12,
    gutter: {
      mobile: '16px',
      tablet: '20px',
      desktop: '24px',
    },
  },
} as const;

// ─── RADIUS ──────────────────────────────────────────────────────────────────

export const radius = {
  none: '0',
  xs: '4px',
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '22px',
  pill: '9999px',
} as const;

// ─── SHADOW (Apple-sutil) ────────────────────────────────────────────────────

export const shadow = {
  none: 'none',
  xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
  sm: '0 2px 4px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 12px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.04)',
  lg: '0 12px 24px rgba(0, 0, 0, 0.06), 0 4px 8px rgba(0, 0, 0, 0.04)',
  xl: '0 24px 48px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.04)',
  focus: '0 0 0 4px rgba(37, 70, 189, 0.15)',
  focusAccent: '0 0 0 4px rgba(0, 191, 255, 0.20)',
} as const;

// ─── MOTION ──────────────────────────────────────────────────────────────────

export const motion = {
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '250ms',
    slow: '400ms',
    deliberate: '600ms',
  },
  easing: {
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    emphasized: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  // Lista branca de animações permitidas no marketing site.
  // Qualquer animação fora desta lista precisa de revisão de design.
  whitelist: [
    'fade-in',
    'navbar-shrink',
    'dialog-enter',
    'dialog-exit',
    'accordion-expand',
    'accordion-collapse',
  ],
} as const;

// ─── BREAKPOINTS ─────────────────────────────────────────────────────────────

export const breakpoints = {
  xs: '380px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ─── EXPORT AGREGADO ─────────────────────────────────────────────────────────

export const tokens = {
  color,
  semantic,
  typography,
  spacing,
  layout,
  radius,
  shadow,
  motion,
  breakpoints,
} as const;

export type Tokens = typeof tokens;
export type Color = typeof color;
export type Semantic = typeof semantic;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type Layout = typeof layout;
export type Radius = typeof radius;
export type Shadow = typeof shadow;
export type Motion = typeof motion;
export type Breakpoints = typeof breakpoints;
