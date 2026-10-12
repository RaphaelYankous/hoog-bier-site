import { useEffect, useRef, useState } from 'react'
import { Menu, X, ShoppingBag, ArrowUpRight } from 'lucide-react'
import { NAV, SITE } from '../config/site'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { useActiveSection } from '../hooks/useActiveSection'
import { useCart } from '../hooks/useCart'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { CART_EVENT, lockScroll, reducedMotion, unlockScroll } from '../lib/motion'
import { waLink, MSG } from '../lib/whatsapp'

const IDS = NAV.map((n) => n.id)

export default function Navbar() {
  const header = useRef(null)
  const menuRef = useRef(null)
  const { scrolled, progress } = useScrollProgress()
  const active = useActiveSection(IDS)
  const { count, setOpen: openCart } = useCart()
  const [menu, setMenu] = useState(false)
  const [hidden, setHidden] = useState(false)

  // Some ao rolar para baixo, volta ao rolar para cima.
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => setHidden(self.direction === 1 && self.scroll() > 400),
    })
    return () => st.kill()
  }, [])

  // Garrafa voando para o carrinho: mostra a navbar e faz o contador "pular" quando ela pousa.
  useEffect(() => {
    const onBump = (e) => {
      setHidden(false)
      if (e.detail?.phase !== 'land' || reducedMotion()) return
      gsap.fromTo(header.current.querySelectorAll('[data-cart-target]'), { scale: 1.25 }, { scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.35)' })
    }
    window.addEventListener(CART_EVENT, onBump)
    return () => window.removeEventListener(CART_EVENT, onBump)
  }, [])

  useEffect(() => {
    if (!menu) return undefined
    const onKey = (e) => e.key === 'Escape' && setMenu(false)
    document.addEventListener('keydown', onKey)
    lockScroll()
    return () => {
      document.removeEventListener('keydown', onKey)
      unlockScroll()
    }
  }, [menu])

  useGSAP(
    () => {
      if (!menu || reducedMotion()) return
      gsap
        .timeline()
        .from(menuRef.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: 'expo.inOut' })
        .from(menuRef.current.querySelectorAll('[data-menu-item]'), { yPercent: 110, duration: 0.9, stagger: 0.06, ease: 'expo.out' }, 0.35)
        .from(menuRef.current.querySelectorAll('[data-menu-fade]'), { autoAlpha: 0, y: 20, duration: 0.6 }, 0.6)
    },
    { dependencies: [menu] },
  )

  const cartButton = (className = '') => (
    <button
      type="button"
      data-cart-target
      onClick={() => {
        setMenu(false)
        openCart(true)
      }}
      aria-label={`Meu pedido${count ? `, ${count} itens` : ''}`}
      className={`relative inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md transition hover:border-beer-gold hover:text-beer-gold ${className}`}
    >
      <ShoppingBag size={16} aria-hidden="true" />
      <span className="hidden sm:inline">Meu pedido</span>
      {count > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-beer-gold px-1 text-[11px] font-black text-black">{count}</span>}
    </button>
  )

  return (
    <header
      ref={header}
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,padding,border-color] duration-700 ease-expo ${hidden && !menu ? '-translate-y-full' : 'translate-y-0'} ${scrolled || menu ? 'border-b border-white/5 bg-beer-dark/80 py-2 backdrop-blur-xl' : 'border-b border-transparent py-4'}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-[72px]">
        <a href="#inicio" aria-label="Hoog Bier — início" className="shrink-0 transition-transform duration-500 ease-expo hover:scale-105">
          <img src="/images/logo-hoog.png" alt="Hoog Bier" width="240" height="160" className="h-12 w-auto drop-shadow-lg md:h-14" />
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? 'true' : undefined} className={`nav-link py-1 ${active === item.id ? 'is-active' : ''}`}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {cartButton()}
          <a href="#cervejas" className="btn-primary !px-6 !py-3 !text-xs">
            Pedir agora
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {cartButton('!px-3')}
          <button type="button" onClick={() => setMenu((v) => !v)} aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu ? 'Fechar menu' : 'Abrir menu'} className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/20 text-white backdrop-blur-md">
            {menu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menu && (
        <nav ref={menuRef} id="mobile-menu" aria-label="Menu mobile" data-lenis-prevent className="absolute left-0 top-full flex h-[calc(100dvh-100%)] w-full flex-col overflow-y-auto bg-beer-dark px-6 pb-8 pt-6 lg:hidden">
          <ul className="flex-1">
            {NAV.map((item, i) => (
              <li key={item.id} className="overflow-hidden border-b border-white/10">
                <a href={`#${item.id}`} onClick={() => setMenu(false)} data-menu-item className={`flex items-baseline gap-4 py-4 font-display text-5xl font-bold uppercase tracking-tight ${active === item.id ? 'text-beer-gold' : 'text-white'}`}>
                  <span className="font-sans text-xs font-bold tracking-widest text-zinc-500">0{i + 1}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div data-menu-fade className="mt-8 space-y-3">
            <a href="#cervejas" onClick={() => setMenu(false)} className="btn-primary w-full py-4">
              Pedir agora
            </a>
            <a href={waLink(MSG.generic)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
              WhatsApp {SITE.phoneDisplay} <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </nav>
      )}

      <div className="absolute inset-x-0 bottom-0 h-px origin-left bg-beer-gold transition-opacity" style={{ transform: `scaleX(${progress})`, opacity: scrolled ? 1 : 0 }} aria-hidden="true" />
    </header>
  )
}
