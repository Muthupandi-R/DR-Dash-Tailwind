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
        gradientPrimary: {
          DEFAULT: "bg-gradient-to-l from-primary-200 via-primary-300 to-primary-200",
        },
        gradientSecondary: {
          DEFAULT: "bg-gradient-to-l from-primary-50 via-primary-800 to-primary-50",
        },
        gradientBg: {
          DEFAULT: "bg-gradient-to-b from-[#7b2ff2] to-[#22c1c3]",
        },
      },
      keyframes: {
        slideIn: {
          "0%": { opacity: 0, transform: "translateX(100%)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        shine: {
          '0%': { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translate(-50%, -120%)' },
          '100%': { opacity: '1', transform: 'translate(-50%, -100%)' },
        },
      },
      animation: {
        slideIn: "slideIn 0.4s ease-out",
        shine: "shine 1.5s linear infinite",
        fadeIn: 'fadeIn 0.18s ease forwards',
      },
    },
  },
  plugins: [],
}

