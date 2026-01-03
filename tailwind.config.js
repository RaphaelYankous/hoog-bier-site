/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'beer-gold': '#F59E0B',
        'beer-dark': '#111827',
      },
      fontFamily: {
        // Oswald para títulos (visual industrial/cervejaria)
        sans: ['Montserrat', 'sans-serif'], 
        display: ['Oswald', 'sans-serif'], 
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}