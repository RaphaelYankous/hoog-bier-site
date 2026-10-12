import { useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useMotion } from '../../hooks/useMotion'

const INTERACTIVE = 'a, button, [role="tab"], label, select, summary'

/**
 * Cursor seguidor (anel dourado) que cresce sobre links e mostra um rótulo em elementos com
 * data-cursor="Texto". O cursor nativo continua visível — é um reforço, não um substituto.
 */
export default function Cursor() {
  const ref = useRef(null)

  useMotion(
    () => {
      const el = ref.current
      const label = el.firstElementChild
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })
      let shown = false

      const move = (e) => {
        if (!shown) {
          gsap.set(el, { x: e.clientX, y: e.clientY })
          el.classList.remove('is-hidden')
          shown = true
        }
        xTo(e.clientX)
        yTo(e.clientY)
      }
      const over = (e) => {
        const t = e.target instanceof Element ? e.target : null
        const tagged = t?.closest('[data-cursor]')
        const typing = t?.closest('input, textarea, iframe')
        el.classList.toggle('is-label', !!tagged)
        el.classList.toggle('is-link', !tagged && !!t?.closest(INTERACTIVE))
        el.classList.toggle('is-hidden', !!typing)
        label.textContent = tagged?.getAttribute('data-cursor') || ''
      }
      const out = () => {
        el.classList.add('is-hidden')
        shown = false
      }
      window.addEventListener('pointermove', move, { passive: true })
      document.addEventListener('pointerover', over, { passive: true })
      document.documentElement.addEventListener('pointerleave', out)
      return () => {
        window.removeEventListener('pointermove', move)
        document.removeEventListener('pointerover', over)
        document.documentElement.removeEventListener('pointerleave', out)
      }
    },
    { query: '(pointer: fine) and (prefers-reduced-motion: no-preference)' },
  )

  return (
    <div ref={ref} className="cursor is-hidden hidden [@media(pointer:fine)]:grid" aria-hidden="true">
      <span />
    </div>
  )
}
