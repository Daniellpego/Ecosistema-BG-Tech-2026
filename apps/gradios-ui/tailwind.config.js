/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // GRADIOS Brand
        brand: {
          navy: "#0A1B5C",
          cyan: "#00BFFF",
          "cyan-dim": "#0090D9",
        },
        // Dark UI System
        bg: "#09090B",
        "bg-raised": "#111113",
        "bg-overlay": "#18181B",
        "border-subtle": "#1F1F23",
        "border-default": "#27272A",
        "border-hover": "#3F3F46",
        // Text
        text: "#FAFAFA",
        "text-secondary": "#A1A1AA",
        "text-muted": "#71717A",
        "text-dim": "#52525B",
        // Status
        "status-ok": "#10B981",
        "status-warn": "#F59E0B",
        "status-error": "#EF4444",
        "status-info": "#3B82F6",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #0A1B5C 0%, #00BFFF 100%)",
        "gradient-brand-h": "linear-gradient(90deg, #0A1B5C 0%, #0E2878 25%, #1440A0 50%, #0090D9 75%, #00BFFF 100%)",
        "gradient-glow": "radial-gradient(ellipse at 50% 0%, rgba(0,191,255,0.08) 0%, transparent 60%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 191, 255, 0.15)",
        "glow-sm": "0 0 10px rgba(0, 191, 255, 0.1)",
        card: "0 2px 8px rgba(0, 0, 0, 0.3)",
        "card-hover": "0 8px 24px rgba(0, 0, 0, 0.4)",
      },
      borderRadius: {
        card: "12px",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.2s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 4px rgba(0, 191, 255, 0.2)" },
          "50%": { boxShadow: "0 0 12px rgba(0, 191, 255, 0.4)" },
        },
      },
    },
  },
  plugins: [],
};
