/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'], 
        sans: ['"Montserrat"', 'sans-serif'],
      },
      colors: {
        // CORRIGIDO: Agora é um preto neutro/quente, sem azul.
        'beer-dark': '#080808', 
        // CORRIGIDO: Creme levemente mais quente
        'beer-cream': '#F7F5F0', 
        'beer-gold': '#Dda756',
        'beer-brown': '#3E2723',
        // Adicionando um cinza quente para fundos secundários
        'beer-stone': '#1c1917', 
      },
      backgroundImage: {
         'paper-texture': "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
         'noise': "url('https://www.transparenttextures.com/patterns/stardust.png')",
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'pulse-gold': 'pulseGold 2s infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        }
      }
    },
  },
  plugins: [],
}