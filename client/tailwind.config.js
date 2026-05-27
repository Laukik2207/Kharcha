export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ffffff',
          50: '#fafafa', 100: '#f5f5f5', 200: '#e5e5e5',
          300: '#d4d4d4', 400: '#a3a3a3', 500: '#737373',
          600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717',
          container: '#e2e2e2',
          fixed: '#e2e2e2',
          'fixed-dim': '#c6c6c7',
        },
        surface: {
          50: '#e3e2e2',
          100: '#c4c7c8',
          200: '#8e9192',
          300: '#444748',
          400: '#383939', /* surface-bright */
          500: '#343535', /* surface-container-highest */
          600: '#292a2a', /* surface-container-high */
          700: '#1f2020', /* surface-container */
          800: '#1b1c1c', /* surface-container-low */
          900: '#121414', /* surface / background */
          950: '#0d0e0f', /* surface-container-lowest */
          black: '#000000',
        },
        glass: {
          light: 'rgba(255,255,255,0.03)',
          border: 'rgba(255,255,255,0.08)',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backdropBlur: { xs: '2px' },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-up': 'fadeUp 0.4s ease-out',
        'fade-down': 'fadeDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'marquee-left': 'marqueeLeft 40s linear infinite',
        'marquee-right': 'marqueeRight 40s linear infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        fadeUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeDown: { from: { opacity: '0', transform: 'translateY(-16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { from: { opacity: '0', transform: 'translateX(24px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        slideInLeft: { from: { opacity: '0', transform: 'translateX(-24px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        shimmer: { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        glow: { from: { boxShadow: '0 0 10px rgba(59,130,246,0.3)' }, to: { boxShadow: '0 0 25px rgba(59,130,246,0.6)' } },
        marqueeLeft: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-100%)' } },
        marqueeRight: { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } },
      },
      boxShadow: {
        'glass': '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)',
        'glass-lg': '0 30px 60px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.15)',
        'card': '0 20px 40px rgba(0,0,0,0.4)',
        'card-hover': '0 24px 48px rgba(0,0,0,0.5)',
      },
      borderRadius: {
        'xl': '0.75rem', /* 12px for interactive elements */
        '2xl': '1rem', 
        '3xl': '1.5rem', /* 24px for primary containers */
        '4xl': '2rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Hanken Grotesk', 'sans-serif'],
        mono: ['Geist', 'monospace'],
      },
    },
  },
  plugins: [],
}
