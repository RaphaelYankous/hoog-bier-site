import { useEffect, useRef, useState } from 'react'

// Anima a entrada ao rolar. Sem JS (ou com "reduzir movimento") o conteúdo fica visível.
export default function Reveal({ children, delay = 0, as: Tag = 'div', className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (!('IntersectionObserver' in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- fallback para navegadores sem IntersectionObserver
      setVisible(true)
      return undefined
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <Tag ref={ref} style={delay ? { transitionDelay: `${delay}ms` } : undefined} className={`reveal ${visible ? 'is-in' : ''} ${className}`}>
      {children}
    </Tag>
  )
}
