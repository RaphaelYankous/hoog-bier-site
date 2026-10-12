import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/montserrat'
import '@fontsource-variable/oswald'
import '@fontsource/instrument-serif/latin-400-italic.css'
import 'lenis/dist/lenis.css'
import './index.css'
import App from './App.jsx'
import { initSmoothScroll, markBooted, reducedMotion, whenAppReady } from './lib/motion'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Em produção o HTML vem pré-renderizado (SEO + primeiro paint instantâneo): hidrata.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)

initSmoothScroll()

// Remove a tela de abertura quando o app estiver hidratado, as fontes prontas e o "copo cheio".
const boot = document.getElementById('boot')
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const fast = document.documentElement.classList.contains('boot-fast') || reducedMotion()

if (boot) {
  const fonts = Promise.race([document.fonts?.ready ?? Promise.resolve(), wait(1500)])
  const ready = Promise.race([whenAppReady(), wait(3000)])
  Promise.all([fonts, ready, wait(fast ? 450 : 1400)]).then(() => {
    requestAnimationFrame(() => {
      boot.classList.add('boot-out')
      markBooted()
      setTimeout(() => boot.remove(), 1100)
      try {
        sessionStorage.setItem('hoog:booted', '1')
      } catch {
        /* ignora */
      }
    })
  })
} else {
  markBooted()
}
