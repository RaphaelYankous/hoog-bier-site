import { useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useMotion } from '../../hooks/useMotion'

// Botão "magnético": é atraído pelo cursor e volta com efeito elástico. Só com mouse.
export default function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null)

  useMotion(
    () => {
      const el = ref.current
      const xTo = gsap.quickTo(el, 'x', { duration: 0.9, ease: 'elastic.out(1, 0.35)' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.9, ease: 'elastic.out(1, 0.35)' })
      const move = (e) => {
        const r = el.getBoundingClientRect()
        xTo((e.clientX - (r.left + r.width / 2)) * strength)
        yTo((e.clientY - (r.top + r.height / 2)) * strength)
      }
      const leave = () => {
        xTo(0)
        yTo(0)
      }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      }
    },
    { scope: ref, query: '(pointer: fine) and (prefers-reduced-motion: no-preference)' },
  )

  return (
    <span ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </span>
  )
}
