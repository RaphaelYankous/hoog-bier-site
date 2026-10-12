// Estado global de movimento: instância do Lenis (smooth scroll) e o "portão" da intro.
import { gsap, ScrollTrigger } from './gsap'

let lenis = null

export const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export async function initSmoothScroll() {
  if (lenis || reducedMotion()) return lenis
  const { default: Lenis } = await import('lenis')
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, autoRaf: false })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  document.documentElement.classList.add('has-lenis')

  // Links internos (#secao): rolagem suave. Espera um tique para que menus/modais que fecham no clique destravem o scroll antes.
  document.addEventListener('click', (e) => {
    const a = e.target instanceof Element && e.target.closest('a[href^="#"]')
    const href = a?.getAttribute('href')
    if (!href || href === '#' || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return
    const el = document.getElementById(decodeURIComponent(href.slice(1)))
    if (!el) return
    e.preventDefault()
    setTimeout(() => scrollToTarget(el), 0)
  })
  return lenis
}

export const getLenis = () => lenis

// Trava/destrava o scroll (modais e menu). Funciona com ou sem Lenis.
let locks = 0
export function lockScroll() {
  locks += 1
  if (locks > 1) return
  lenis?.stop()
  document.documentElement.style.overflow = 'hidden'
}
export function unlockScroll() {
  locks = Math.max(0, locks - 1)
  if (locks) return
  document.documentElement.style.overflow = ''
  lenis?.start()
}

export function scrollToTarget(target, opts = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return
  // O Lenis já respeita o scroll-padding-top do CSS (espaço da navbar fixa).
  if (lenis) lenis.scrollTo(el, { duration: 1.4, force: true, ...opts })
  else el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' })
}

// Intro: o hero só anima depois que a tela de abertura sai E a idade foi confirmada.
const deferred = () => {
  let resolve
  const promise = new Promise((r) => (resolve = r))
  return { promise, resolve }
}
const booted = deferred()
const ageOk = deferred()
const appReady = deferred()

export const markAppReady = () => appReady.resolve()
export const whenAppReady = () => appReady.promise
export const markBooted = () => booted.resolve()
export const markAgeOk = () => ageOk.resolve()
export const whenIntro = () => Promise.all([booted.promise, ageOk.promise])

// Animação "voar para o carrinho": a navbar escuta e reage.
export const CART_EVENT = 'hoog:cart-bump'
