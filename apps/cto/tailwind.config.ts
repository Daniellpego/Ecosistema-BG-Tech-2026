import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          navy: '#0A1628',
          card: '#131F35',
          hover: '#1A2744',
          input: '#0E1B30',
        },
        brand: {
          cyan: '#00C8F0',
          'cyan-light': '#33D4F5',
          blue: '#1A6AAA',
          'blue-deep': '#153B5F',
        },
        status: {
          positive: '#10B981',
          negative: '#EF4444',
          warning: '#F59E0B',
        },
        text: {
          primary: '#F0F4F8',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
        kanban: {
          backlog: '#94A3B8',
          andamento: '#00C8F0',
          revisao: '#F59E0B',
          entregue: '#10B981',
        },
        prioridade: {
          baixa: '#94A3B8',
          media: '#00C8F0',
          alta: '#F59E0B',
          urgente: '#EF4444',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(0, 200, 240, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 200, 240, 0.6)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
