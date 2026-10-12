import { useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useMotion } from '../hooks/useMotion'

// Entrada ao rolar. Nada fica escondido por CSS: sem JS (ou com "reduzir movimento") tudo aparece normalmente.
export default function Reveal({ children, delay = 0, as: Tag = 'div', className = '', y = 56, query, ...rest }) {
  const ref = useRef(null)

  useMotion(
    () => {
      gsap.from(ref.current, {
        y,
        autoAlpha: 0,
        duration: 1.3,
        delay: delay / 1000,
        scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true },
      })
    },
    { scope: ref, query },
  )

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}
