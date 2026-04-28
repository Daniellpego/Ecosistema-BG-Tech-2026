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
    50: '#EEF1FA',
    100: '#DDE3F3',
    200: '#BAC7E7',
    300: '#8EA3D2',
    400: '#5470AE',
    500: '#1E3D8A',
    600: '#1A3577',
    700: '#162D63',
    800: '#122550',
    900: '#0D1C3D',
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
    // tertiary deve ter diferença visível com secondary. Subimos para neutral.400
    // (#A1A1A6) para aumentar a diferença com secondary (neutral.700 / #424245).
    tertiary: color.neutral[400],
    onInverse: color.white,
    brand: color.primary[500],
    // Sem fg.accent: ciano não faz sentido como cor de TEXTO (contraste insuficiente
    // sobre fundo claro e desalinhado com a regra "ciano só como accent restrito").
    danger: color.danger[700],
  },
  border: {
    // Border default contrastada (#C7C7CC, iOS system gray3). Era #D1D1D6 e
    // antes neutral.200 (#E8E8ED) — cada subida foi pra ganhar definição
    // sem perder a delicadeza Apple.
    default: '#C7C7CC',
    subtle: color.neutral[200],
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

// display-2 e display-1 usam weight 700 — exceção justificada à regra "Inter 400/600".
// São os únicos níveis com peso 700, reservados para hero/momentos editoriais.
const fontSize: Record<string, FontSizeEntry> = {
  'display-2': ['88px', { lineHeight: '1.00', letterSpacing: '-0.045em', fontWeight: '700' }],
  'display-1': ['72px', { lineHeight: '1.02', letterSpacing: '-0.04em', fontWeight: '700' }],
  'title-1': ['52px', { lineHeight: '1.08', letterSpacing: '-0.035em', fontWeight: '600' }],
  'title-2': ['40px', { lineHeight: '1.10', letterSpacing: '-0.025em', fontWeight: '600' }],
  'title-3': ['32px', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' }],
  headline: ['24px', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
  subhead: ['20px', { lineHeight: '1.35', letterSpacing: '-0.01em', fontWeight: '600' }],
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
  // Section sizes: 3 níveis. flagship foi removido — virava redundante com hero
  // (escolhi reduzir para 128px que já era o valor de hero) e a presença de 4
  // níveis incentivava decisões arbitrárias.
  'section-compact': '4rem',
  'section-regular': '6rem',
  'section-hero': '8rem',
  'block-tight': '1.5rem',
  'block-normal': '2.5rem',
  'block-loose': '4rem',
  // Container gutters. Desktop subiu de 2rem (32px) → 3rem (48px) para dar
  // mais respiro lateral em telas largas (alinha à sensibilidade Apple).
  'gutter-mobile': '1rem',
  'gutter-tablet': '1.5rem',
  'gutter-desktop': '3rem',
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

// Sistema de radius unificado por papel:
//   pill    → Badge (rounded-full)
//   md      → Button + Input (10px — ligeiramente arredondado, Apple-like)
//   lg      → Card (12px — diferenciação clara do botão)
//   xl/2xl  → superfícies grandes (modal, hero card)
//   xs/sm   → casos pontuais
export const radius = {
  none: '0',
  xs: '4px',
  sm: '6px',
  md: '10px',
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
  md: '0 4px 10px rgba(0, 0, 0, 0.04), 0 2px 3px rgba(0, 0, 0, 0.03)',
  lg: '0 12px 24px rgba(0, 0, 0, 0.06), 0 4px 8px rgba(0, 0, 0, 0.04)',
  xl: '0 24px 48px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.04)',
  // Focus ring sutil: 3px em vez de 4px, opacity 0.12 em vez de 0.15.
  // Mantém visibilidade mas sem peso visual excessivo.
  focus: '0 0 0 3px rgba(30, 61, 138, 0.12)',
  focusAccent: '0 0 0 3px rgba(0, 191, 255, 0.18)',
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
    'shimmer-slow',
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
