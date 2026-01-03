/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'beer-gold': '#F59E0B', // Amarelo Dourado
        'beer-dark': '#111827', // Fundo Escuro
        'beer-foam': '#FEF3C7', // Clarinhho
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}