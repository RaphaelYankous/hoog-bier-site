/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'beer-gold': '#F59E0B',
        'beer-dark': '#0f0e0c',
        foam: '#FFF4DC',
        malt: '#1a120b',
        amber: { deep: '#B45309' },
      },
      fontFamily: {
        sans: ['"Montserrat Variable"', 'Montserrat', 'system-ui', 'sans-serif'],
        display: ['"Oswald Variable"', 'Oswald', 'Impact', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-100%)' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-in-up': { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pop: { from: { opacity: '0', transform: 'scale(0.96) translateY(8px)' }, to: { opacity: '1', transform: 'scale(1) translateY(0)' } },
        'slide-in-right': { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        spin: { to: { transform: 'rotate(360deg)' } },
        wave: { to: { transform: 'translateX(-50%)' } },
        rise: { '0%': { transform: 'translateY(0)', opacity: '0' }, '10%': { opacity: '0.9' }, '100%': { transform: 'translateY(-110vh)', opacity: '0' } },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        'fade-in': 'fade-in 0.25s ease-out both',
        'fade-in-up': 'fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        pop: 'pop 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in-right': 'slide-in-right 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'spin-slow': 'spin 18s linear infinite',
        wave: 'wave 7s linear infinite',
        'wave-fast': 'wave 4.5s linear infinite',
      },
    },
  },
  plugins: [],
}
