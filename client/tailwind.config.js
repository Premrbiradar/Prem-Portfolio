/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#05070D',
          900: '#0A0E1A',
          800: '#111827',
          700: '#1E293B',
          600: '#2B3648',
          500: '#64748B',
        },
        paper: {
          50: '#F8FAFC',
          100: '#E2E8F0',
          200: '#CBD5E1',
          400: '#94A3B8',
        },
        signal: {
          teal: '#22D3EE',
          tealDim: '#06B6D4',
          tealDeep: '#0E7490',
        },
        brass: {
          DEFAULT: '#FB923C',
          light: '#FDBA74',
          dark: '#C2410C',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
        code: ['"JetBrains Mono"', 'monospace'],
      },
      maxWidth: {
        prose: '72ch',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(20px, -16px)' },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        particle: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: 0 },
          '20%': { opacity: 0.8 },
          '100%': { transform: 'translateY(-120px) scale(0.6)', opacity: 0 },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.55 },
          '50%': { opacity: 1 },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-25%)' },
        },
        marqueeReverse: {
          '0%': { transform: 'translateX(-25%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scan: {
          '0%': { top: '-18%' },
          '100%': { top: '105%' },
        },
        kenburns: {
          '0%': { transform: 'scale(1) translate(0,0)' },
          '100%': { transform: 'scale(1.1) translate(-2%, -2%)' },
        },
        auroraMove: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(4%, -6%) scale(1.08)' },
          '66%': { transform: 'translate(-3%, 4%) scale(0.96)' },
        },
        spinSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        borderFlow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        drift: 'drift 14s ease-in-out infinite',
        blink: 'blink 1s step-end infinite',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        particle: 'particle 9s ease-in infinite',
        'pulse-glow': 'pulseGlow 5s ease-in-out infinite',
        marquee: 'marquee 38s linear infinite',
        'marquee-reverse': 'marqueeReverse 46s linear infinite',
        scan: 'scan 2.2s linear infinite',
        kenburns: 'kenburns 20s ease-in-out infinite alternate',
        aurora: 'auroraMove 22s ease-in-out infinite',
        'aurora-slow': 'auroraMove 30s ease-in-out infinite reverse',
        'spin-slow': 'spinSlow 12s linear infinite',
        'border-flow': 'borderFlow 4s ease infinite',
      },
    },
  },
  plugins: [],
};
