import { useRef } from 'react'
import { gsap, SplitText } from '../../lib/gsap'
import { useMotion } from '../../hooks/useMotion'

// Parágrafo em que as palavras "acendem" conforme o scroll avança.
export default function ScrubText({ as: Tag = 'p', children, className = '', dim = 0.14 }) {
  const ref = useRef(null)

  useMotion(
    () => {
      const split = SplitText.create(ref.current, { type: 'words', aria: 'none', autoSplit: true, onSplit(self) {
        return gsap.fromTo(
          self.words,
          { opacity: dim },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: { trigger: ref.current, start: 'top 82%', end: 'bottom 48%', scrub: true },
          },
        )
      } })
      return () => split.revert()
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
