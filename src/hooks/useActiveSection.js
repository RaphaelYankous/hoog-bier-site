import { useEffect, useState } from 'react'

// Scroll-spy: devolve o id da seção visível (para destacar o menu).
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!els.length) return undefined
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.2, 0.5] },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [ids])
  return active
}
