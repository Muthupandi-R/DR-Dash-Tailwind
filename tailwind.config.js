// tailwind.config.js
import colors from 'tailwindcss/colors';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: colors.blue[700],
          50: colors.blue[50],
          100: colors.blue[100],
          200: colors.blue[200],
          300: colors.blue[300],
          400: colors.blue[400],
          500: colors.blue[500],
          600: colors.blue[600],
          700: colors.blue[700],
          800: colors.blue[800],
          900: colors.blue[900],
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-100px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shine: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '50%': { transform: 'translateX(4px)' },
          '75%': { transform: 'translateX(-4px)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out forwards',
        fadeLeft: 'fadeLeft 0.5s ease-out both',
        fadeDown: 'fadeDown 0.5s ease-out both',
        shine: 'shine 2s linear infinite',
        shake: 'shake 0.4s ease-in-out',
      },
    },
  },
  plugins: [
    // require("daisyui"),
    function ({ addBase, theme }) {
      addBase({
        ':root': {
          '--tab-bg-primary': theme('colors.primary.50'),
          '--tab-bg': theme('colors.primary.100'),
          '--tab-last-circle-bg': theme('colors.primary.300'),
        },
      });
    },
  ],
}
