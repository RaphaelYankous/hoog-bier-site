import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/montserrat'
import '@fontsource-variable/oswald'
import './index.css'
import App from './App.jsx'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Em produção o HTML vem pré-renderizado (SEO + primeiro paint instantâneo): hidrata.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)

// Remove a tela de abertura estática quando o app estiver pronto.
const boot = document.getElementById('boot')
if (boot) {
  const hide = () => {
    boot.classList.add('boot-out')
    boot.addEventListener('transitionend', () => boot.remove(), { once: true })
    setTimeout(() => boot.remove(), 900)
  }
  const ready = document.fonts?.ready ?? Promise.resolve()
  Promise.race([ready, new Promise((r) => setTimeout(r, 1200))]).then(() => requestAnimationFrame(hide))
}
