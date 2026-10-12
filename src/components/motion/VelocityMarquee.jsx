import { useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { useMotion } from '../../hooks/useMotion'

/**
 * Letreiro infinito que acelera, inclina e inverte o sentido conforme a velocidade do scroll.
 * Só roda enquanto está na tela. Com "reduzir movimento" fica parado (e o conteúdo continua legível).
 */
export default function VelocityMarquee({ children, speed = 60, direction = 1, skew = true, className = '', label }) {
  const root = useRef(null)
  const track = useRef(null)

  useMotion(
    () => {
      const el = track.current
      const copy = el.firstElementChild
      let width = copy.offsetWidth
      let x = 0
      let dir = direction
      let boost = 0
      let active = false

      const skewTo = gsap.quickTo(el, 'skewX', { duration: 0.6, ease: 'power3.out' })
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (active = self.isActive),
        onUpdate: (self) => {
          const v = self.getVelocity()
          dir = (v < 0 ? -1 : 1) * direction
          boost = Math.min(Math.abs(v) / 120, 12)
          if (skew) skewTo(gsap.utils.clamp(-8, 8, v / -250))
        },
      })

      const tick = (_, dt) => {
        if (!active || !width) return
        boost *= 0.94
        x -= ((speed * (1 + boost)) * dir * dt) / 1000
        x = gsap.utils.wrap(-width, 0, x)
        gsap.set(el, { x })
        if (boost < 0.05 && skew) skewTo(0)
      }
      gsap.ticker.add(tick)
      const ro = new ResizeObserver(() => (width = copy.offsetWidth))
      ro.observe(copy)

      return () => {
        gsap.ticker.remove(tick)
        ro.disconnect()
        st.kill()
      }
    },
    { scope: root },
  )

  return (
    <div ref={root} className={`marquee-root overflow-hidden ${className}`} role={label ? 'region' : undefined} aria-label={label}>
      <div ref={track} className="flex w-max will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  )
}
