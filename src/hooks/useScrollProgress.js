import { useEffect, useState } from 'react'

// Retorna { scrolled, progress (0-1) } com listener passivo e throttle via rAF.
export function useScrollProgress(threshold = 40) {
  const [state, setState] = useState({ scrolled: false, progress: 0 })
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const y = window.scrollY
      setState({ scrolled: y > threshold, progress: max > 0 ? Math.min(1, y / max) : 0 })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [threshold])
  return state
}
