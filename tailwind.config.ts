import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          950: '#0B0207',
          900: '#14040F',
          850: '#1B0615',
          800: '#24081C',
          700: '#340C29',
          600: '#4D123D',
        },
        glc: {
          magenta: '#F45197',
          pink: '#FF2D8D',
          rose: '#E6007E',
          orange: '#F58232',
          amber: '#FF7A00',
          burgundy: '#5B0C38',
        },
        cream: {
          50: '#FDFBF9',
          100: '#F7EFE8',
          200: '#EBDCD0',
          300: '#C7B2A2',
          400: '#9E8878',
        },
        peach: {
          300: '#ffc5b6',
          DEFAULT: '#ffc5b6',
        },
      },
      fontFamily: {
        tektype: ['var(--font-tektype)', 'system-ui', 'sans-serif'],
        display: ['var(--font-tektype)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-sabon)', 'Georgia', 'serif'],
      },
      keyframes: {
        'flow-drift': {
          '0%, 100%': { transform: 'scale(1) translate(0px, 0px)' },
          '50%': { transform: 'scale(1.03) translate(-8px, -4px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', filter: 'brightness(1)' },
          '50%': { opacity: '0.9', filter: 'brightness(1.2)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'flow-drift': 'flow-drift 14s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 6s ease-in-out infinite',
        'shimmer': 'shimmer 4s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
