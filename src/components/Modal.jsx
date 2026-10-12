import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { lockScroll, unlockScroll } from '../lib/motion'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Modal / drawer acessível: role=dialog, foco preso, Esc fecha, trava o scroll
 * e devolve o foco ao elemento que abriu.
 */
export default function Modal({ title, onClose, children, side = false, labelledBy = 'modal-title', dismissible = true, wide = false }) {
  const panel = useRef(null)
  // Ref para o callback: o efeito roda só ao abrir/fechar (senão cada re-render roubaria o foco dos campos).
  const closeRef = useRef(onClose)
  useEffect(() => {
    closeRef.current = onClose
  })

  useEffect(() => {
    const previous = document.activeElement
    lockScroll()
    const first = panel.current?.querySelector('[data-autofocus]') || panel.current?.querySelector(FOCUSABLE)
    first?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape' && dismissible) {
        e.stopPropagation()
        closeRef.current?.()
      }
      if (e.key === 'Tab' && panel.current) {
        const nodes = [...panel.current.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null)
        if (!nodes.length) return
        const a = nodes[0]
        const z = nodes[nodes.length - 1]
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault()
          z.focus()
        } else if (!e.shiftKey && document.activeElement === z) {
          e.preventDefault()
          a.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      unlockScroll()
      previous?.focus?.()
    }
  }, [dismissible])

  return createPortal(
    <div className={`fixed inset-0 z-[100] flex ${side ? 'justify-end' : 'items-center justify-center p-4'}`}>
      <div className="absolute inset-0 animate-fade-in bg-black/80 backdrop-blur-sm" onClick={dismissible ? onClose : undefined} aria-hidden="true" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        data-lenis-prevent
        className={
          side
            ? 'relative flex h-full w-full max-w-md animate-slide-in-right flex-col rounded-l-[2rem] border-l border-white/10 bg-zinc-950 shadow-2xl'
            : `relative max-h-[92vh] w-full ${wide ? 'max-w-4xl' : 'max-w-md'} animate-pop overflow-y-auto rounded-[2rem] border border-beer-gold/25 bg-zinc-950 p-6 shadow-2xl md:p-8`
        }
      >
        {dismissible && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-4 top-4 z-10 rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={22} />
          </button>
        )}
        {title && (
          <h2 id={labelledBy} className="sr-only">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>,
    document.body,
  )
}
