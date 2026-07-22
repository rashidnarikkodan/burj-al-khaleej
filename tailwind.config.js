/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fffcf0',
          100: '#fef7d6',
          200: '#fde89c',
          300: '#fbd45a',
          400: '#fabd2c',
          500: '#D4AF37',
          600: '#b8962e',
          700: '#967a26',
          800: '#78611e',
          900: '#625019',
          950: '#3c310f',
        },
        accent: {
          gold: '#D4AF37',
          cream: '#FFFDD0',
        },
        surface: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e7e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        arabic: ['"Readex Pro"', 'Cairo', 'sans-serif'],
        'arabic-heading': ['Cairo', '"Readex Pro"', 'sans-serif'],
        hindi: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
