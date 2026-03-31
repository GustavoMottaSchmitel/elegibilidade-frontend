import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['DM Mono', 'monospace'],
        serif: ['Fraunces', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#080809',
          900: '#0f0f11',
          800: '#18181c',
          700: '#222228',
          600: '#2e2e38',
          500: '#44444f',
          400: '#6b6b7a',
          300: '#9898a8',
          200: '#c4c4cf',
          100: '#e8e8ed',
          50:  '#f5f5f8',
        },
        amber: {
          DEFAULT: '#d97706',
          light:   '#fbbf24',
          dim:     '#92400e',
          glow:    '#d9770620',
        },
        status: {
          green:   '#22c55e',
          greenBg: '#052e16',
          yellow:  '#eab308',
          yellowBg:'#1c1a05',
          red:     '#ef4444',
          redBg:   '#2d0606',
          gray:    '#6b7280',
          grayBg:  '#111827',
        }
      },
      animation: {
        'fade-up':    'fadeUp 0.4s ease forwards',
        'fade-in':    'fadeIn 0.3s ease forwards',
        'scan':       'scan 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer':    'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'amber': '0 0 20px rgba(217,119,6,0.15)',
        'panel': '0 1px 0 rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.3) inset',
      }
    },
  },
  plugins: [],
}

export default config
