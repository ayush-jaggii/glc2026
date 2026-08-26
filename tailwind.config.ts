import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#FFFFFF',
          subtle: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          highlight: '#F1F5F9',
          dark: '#0F172A',
        },
        brand: {
          orange: '#F58232',
          'orange-light': '#FF9E53',
          'orange-dark': '#D66A1E',
          pink: '#F45197',
        },
        geo: {
          cyan: '#0284C7',
          emerald: '#059669',
          gold: '#D97706',
          line: 'rgba(2, 132, 199, 0.15)',
        },
        editorial: {
          dark: '#0F172A',
          subtle: '#1E293B',
          muted: '#475569',
          dim: '#64748B',
          white: '#FFFFFF',
        }
      },
      fontFamily: {
        // Strict TAPMI Guidelines Typography: Helvetica Now & Sabon LT Std
        sans: ['"Helvetica Now"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['"Sabon LT Std"', '"Sabon"', '"EB Garamond"', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)",
        'dot-pattern': "radial-gradient(rgba(15, 23, 42, 0.08) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
}

export default config
