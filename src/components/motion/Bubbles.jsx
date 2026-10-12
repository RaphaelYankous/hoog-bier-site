import { useEffect, useRef } from 'react'
import { reducedMotion } from '../../lib/motion'

/**
 * Bolhas de gás subindo em canvas 2D (leve: sem WebGL, DPR limitado,
 * pausa fora da tela e com a aba oculta). Reage de leve ao mouse.
 */
export default function Bubbles({ className = '', density = 1 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || reducedMotion()) return undefined
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let w = 0
    let h = 0
    let raf = 0
    let visible = true
    let mx = -9999
    let my = -9999
    let bubbles = []

    const spawn = (y) => ({
      x: Math.random() * w,
      y: y ?? h + Math.random() * 40,
      r: 1 + Math.random() * Math.random() * 7,
      speed: 0.25 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2,
      sway: 0.3 + Math.random() * 0.8,
      alpha: 0.15 + Math.random() * 0.45,
    })

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round((w < 768 ? 22 : 48) * density)
      bubbles = Array.from({ length: count }, () => spawn(Math.random() * h))
    }

    const draw = (t) => {
      raf = requestAnimationFrame(draw)
      if (!visible) return
      ctx.clearRect(0, 0, w, h)
      for (const b of bubbles) {
        b.y -= b.speed * (1 + b.r * 0.08)
        let x = b.x + Math.sin(t * 0.001 * b.sway + b.phase) * 6
        const dx = x - mx
        const dy = b.y - my
        const d2 = dx * dx + dy * dy
        if (d2 < 14000) {
          const push = (1 - d2 / 14000) * 18
          b.x += (dx / Math.sqrt(d2 || 1)) * push * 0.15
          x = b.x
        }
        if (b.y < -20) Object.assign(b, spawn())
        ctx.beginPath()
        ctx.arc(x, b.y, b.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(251, 191, 36, ${b.alpha})`
        ctx.lineWidth = 1
        ctx.stroke()
        if (b.r > 3) {
          ctx.beginPath()
          ctx.arc(x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.25, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 244, 220, ${b.alpha * 0.8})`
          ctx.fill()
        }
      }
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mx = e.clientX - rect.left
      my = e.clientY - rect.top
    }
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting && !document.hidden))
    const onVis = () => (visible = !document.hidden)

    resize()
    raf = requestAnimationFrame(draw)
    io.observe(canvas)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [density])

  return <canvas ref={ref} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true" />
}
