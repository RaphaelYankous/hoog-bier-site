/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'beer-gold': '#F59E0B',
        'beer-dark': '#0f0e0c',
      },
      fontFamily: {
        sans: ['"Montserrat Variable"', 'Montserrat', 'system-ui', 'sans-serif'],
        display: ['"Oswald Variable"', 'Oswald', 'Impact', 'sans-serif'],
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-100%)' } },
        'float-slow': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-in-up': { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pop: { from: { opacity: '0', transform: 'scale(0.96) translateY(8px)' }, to: { opacity: '1', transform: 'scale(1) translateY(0)' } },
        'slide-in-right': { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        'float-slow': 'float-slow 7s ease-in-out infinite',
        'fade-in': 'fade-in 0.25s ease-out both',
        'fade-in-up': 'fade-in-up 0.4s ease-out both',
        pop: 'pop 0.28s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        'slide-in-right': 'slide-in-right 0.32s cubic-bezier(0.2, 0.8, 0.2, 1) both',
      },
    },
  },
  plugins: [],
}
