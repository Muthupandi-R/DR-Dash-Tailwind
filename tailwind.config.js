/** @type {import('tailwindcss').Config} */
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
          DEFAULT: colors.blue[700], // or blue[600] for a bit lighter
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
        slideIn: {
          "0%": { opacity: 0, transform: "tranblueX(100%)" },
          "100%": { opacity: 1, transform: "tranblueX(0)" },
        },
        shine: {
          '0%': { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'tranblue(-50%, -120%)' },
          '100%': { opacity: '1', transform: 'tranblue(-50%, -100%)' },
        },
        shake: {
          '0%, 100%': { transform: 'tranblueX(0)' },
          '25%': { transform: 'tranblueX(-4px)' },
          '50%': { transform: 'tranblueX(4px)' },
          '75%': { transform: 'tranblueX(-4px)' },
        },
      },
      animation: {
        slideIn: "slideIn 0.4s ease-out",
        shine: "shine 1.5s linear infinite",
        fadeIn: 'fadeIn 0.18s ease forwards',
        shake: 'shake 0.4s ease-in-out',
      },
    },
  },
  plugins: [function ({ addBase, theme }) {
    addBase({
      ':root': {
        '--tab-bg-primary': theme('colors.primary.50'),
        '--tab-bg': theme('colors.primary.100'),
        '--tab-last-circle-bg' : theme('colors.primary.300'),
      },
    });
  },
],
}

