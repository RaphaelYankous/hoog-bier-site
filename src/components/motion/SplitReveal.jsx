import { useRef } from 'react'
import { gsap, SplitText } from '../../lib/gsap'
import { useMotion } from '../../hooks/useMotion'

/**
 * Texto que "sobe" de dentro de uma máscara, linha a linha ou letra a letra.
 * O SplitText refaz a divisão sozinho quando a largura muda (autoSplit).
 */
export default function SplitReveal({ as: Tag = 'h2', children, className = '', type = 'lines', delay = 0, start = 'top 88%', ...rest }) {
  const ref = useRef(null)

  useMotion(
    () => {
      const chars = type === 'chars'
      const split = SplitText.create(ref.current, {
        type: chars ? 'lines,words,chars' : 'lines',
        aria: chars ? 'auto' : 'none',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit(self) {
          return gsap.from(chars ? self.chars : self.lines, {
            yPercent: 120,
            rotate: chars ? 6 : 3,
            transformOrigin: '0% 100%',
            duration: chars ? 1.1 : 1.4,
            stagger: chars ? 0.022 : 0.12,
            delay,
            scrollTrigger: { trigger: ref.current, start, once: true },
          })
        },
      })
      return () => split.revert()
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}
