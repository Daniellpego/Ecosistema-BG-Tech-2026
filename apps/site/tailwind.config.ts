import type { Config } from 'tailwindcss';
import legacyPreset from '@gradios/tailwind-config';
import v2Preset from '@gradios/design-tokens/preset';

/**
 * Coexistência transitória durante a Fase 3 do redesign.
 *
 * - legacyPreset: mantém classes que rotas ainda não migradas usam
 *   (text-primary, bg-bg-alt, text-text-muted, bg-brand-gradient, etc).
 * - v2Preset: adiciona classes da identidade nova (text-display-2,
 *   bg-base/subtle/inverse, border default semântica, animate-shimmer-slow).
 *
 * Onde houver conflito, v2 vence (vem por último). Quando todas as rotas
 * estiverem migradas para v2, removemos legacyPreset e o `extend` abaixo.
 */
const config: Config = {
  presets: [legacyPreset, v2Preset],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    // v2 components escaneados para gerar classes declaradas dentro do CVA
    '../../packages/ui/src/v2/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Site continua só com Inter (decisão: sem Inter Display por enquanto).
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        display: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      colors: {
        // Aliases legacy mantidos APENAS para rotas ainda não migradas.
        // Removidos no PR final da Fase 3.
        primary: '#2546BD',
        secondary: '#00BFFF',
        bg: '#F5F5F7',
        'bg-alt': '#FFFFFF',
        text: '#0A1B3D',
        'text-muted': '#64748B',
        'card-border': '#E2E8F0',
      },
      backgroundImage: {
        // Gradient legacy — só rotas não migradas usam. Em rotas v2, NÃO usar.
        'gradient-primary':
          'linear-gradient(90deg, #2546BD 0%, #1E3FA8 25%, #1856C0 50%, #0090D9 75%, #00BFFF 100%)',
      },
      borderRadius: {
        card: '16px',
        // pill já vem do v2Preset; mantemos aqui por explicitude.
        pill: '9999px',
      },
    },
  },
};

export default config;
