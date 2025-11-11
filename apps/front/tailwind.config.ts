import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,css}'],
  corePlugins: {
    preflight: false
  },
  important: '#__next',
  plugins: [
    require('tailwindcss-logical'),
    require('./src/@core/tailwind/plugin'),
    function ({ addComponents }: any) {
      addComponents({
        '.form-field-wrapper': {
          '@apply mb-1': {},
          '& > *': {
            '@apply !mb-0': {}
          }
        }
      })
    }
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#0578BE'
        },
        tertiary: {
          main: '#F2F2F2'
        },
        warning: {
          dark: '#8A570A',
          light: '#F7A83333',
        },
        gray: {
          box: '#F2F2F2'
        }
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '50%': { opacity: '50' },
          '100%': { opacity: '100' }
        },
        'fade-out': {
          '0%': { opacity: '100' },
          '100%': { opacity: '0' }
        },
        'fade-in-out': {
          '0%': { opacity: '0' },
          '50%': { opacity: '100' },
          '100%': { opacity: '0' }
        },
        'fade-in-out-reverse': {
          '0%': { opacity: '100' },
          '50%': { opacity: '0' },
          '100%': { opacity: '100' }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out',
        'fade-out': 'fade-out 0.5s ease-in-out',
        'fade-in-out': 'fade-in-out 0.5s ease-in-out',
        'fade-in-out-reverse': 'fade-in-out-reverse 0.5s ease-in-out',
        shake: 'shake 0.5s ease-in-out'
      }
    }
  }
}

export default config
