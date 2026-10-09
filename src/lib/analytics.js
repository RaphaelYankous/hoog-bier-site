import { GA_ID } from '../config/site'

let loaded = false

// Só carrega o GA4 se houver ID configurado E o visitante tiver aceitado.
export function enableAnalytics() {
  if (loaded || !GA_ID || typeof document === 'undefined') return
  loaded = true
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(s)
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { anonymize_ip: true })
}

export function track(event, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') window.gtag('event', event, params)
}
