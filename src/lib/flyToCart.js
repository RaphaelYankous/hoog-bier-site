import { gsap } from './gsap'
import { CART_EVENT, reducedMotion } from './motion'

// Uma cópia da garrafa faz um arco até o botão "Meu pedido" na navbar, que então "pula".
export function flyToCart(sourceImg) {
  window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: { phase: 'start' } }))
  const bump = () => window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: { phase: 'land' } }))
  const target = [...document.querySelectorAll('[data-cart-target]')].find((el) => el.offsetParent !== null)
  if (!sourceImg || !target || reducedMotion()) return bump()

  const s = sourceImg.getBoundingClientRect()
  const t = target.getBoundingClientRect()
  const clone = sourceImg.cloneNode()
  clone.removeAttribute('data-bottle')
  clone.alt = ''
  Object.assign(clone.style, {
    position: 'fixed',
    left: `${s.left}px`,
    top: `${s.top}px`,
    width: `${s.width}px`,
    height: `${s.height}px`,
    margin: '0',
    zIndex: '300',
    pointerEvents: 'none',
    objectFit: 'contain',
  })
  document.body.appendChild(clone)

  const dx = t.left + t.width / 2 - (s.left + s.width / 2)
  const dy = t.top + t.height / 2 - (s.top + s.height / 2)
  gsap
    .timeline({ onComplete: () => (clone.remove(), bump()) })
    .to(clone, { x: dx, duration: 0.95, ease: 'power1.inOut' }, 0)
    .to(clone, { y: dy, duration: 0.95, ease: 'back.in(1.7)' }, 0)
    .to(clone, { scale: 0.08, rotate: 25, duration: 0.95, ease: 'power3.in' }, 0)
    .to(clone, { autoAlpha: 0, duration: 0.15 }, 0.82)
}
