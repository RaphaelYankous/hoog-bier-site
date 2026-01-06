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
      // --- ADICIONE DAQUI PARA BAIXO ---
      animation: {
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      }
      // --- ATÉ AQUI ---
    },
  },
  plugins: [],
}
