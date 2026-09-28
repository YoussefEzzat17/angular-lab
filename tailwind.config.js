/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Runaq-inspired warm gold accent, replacing the old violet brand color.
        gold: {
          50: '#faf6ec',
          100: '#f3e9d0',
          200: '#e8d3a6',
          300: '#dbb877',
          400: '#c9a263',
          500: '#b58a4a',
          600: '#96703a',
          700: '#78592f',
          800: '#5c4526',
          900: '#3a2a1c',
          950: '#241a12',
        },
      },
    },
  },
  plugins: [],
}
