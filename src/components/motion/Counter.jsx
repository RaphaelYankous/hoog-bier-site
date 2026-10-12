import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { reducedMotion } from '../../lib/motion'

const fmt = (n, decimals) => n.toFixed(decimals).replace('.', ',')

/**
 * Número que "rola" até o novo valor quando muda. Com `onView`, também conta desde zero ao aparecer.
 * O HTML inicial (SSR) já traz o valor final.
 */
export default function Counter({ value, decimals = 0, duration = 0.9, onView = false, className = '' }) {
  const ref = useRef(null)
  const shown = useRef(value)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (reducedMotion()) {
      el.textContent = fmt(value, decimals)
      shown.current = value
      return undefined
    }
    const obj = { v: shown.current }
    const tween = gsap.to(obj, {
      v: value,
      duration,
      ease: 'power3.out',
      onUpdate: () => {
        el.textContent = fmt(obj.v, decimals)
        shown.current = obj.v
      },
    })
    return () => tween.kill()
  }, [value, decimals, duration])

  useEffect(() => {
    if (!onView || reducedMotion()) return undefined
    const el = ref.current
    const obj = { v: 0 }
    el.textContent = fmt(0, decimals)
    const tween = gsap.to(obj, {
      v: value,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => (el.textContent = fmt(obj.v, decimals)),
    })
    return () => tween.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só na montagem
  }, [])

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {fmt(value, decimals)}
    </span>
  )
}
