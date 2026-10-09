import { useEffect, useState } from 'react'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { NAV } from '../config/site'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { useActiveSection } from '../hooks/useActiveSection'
import { useCart } from '../hooks/useCart'

const IDS = NAV.map((n) => n.id)

export default function Navbar() {
  const { scrolled, progress } = useScrollProgress()
  const active = useActiveSection(IDS)
  const { count, setOpen: openCart } = useCart()
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    if (!menu) return undefined
    const onKey = (e) => e.key === 'Escape' && setMenu(false)
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [menu])

  const cartButton = (className = '') => (
    <button type="button" onClick={() => { setMenu(false); openCart(true) }} aria-label={`Meu pedido${count ? `, ${count} itens` : ''}`} className={`relative inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition hover:border-beer-gold hover:text-beer-gold ${className}`}>
      <ShoppingBag size={16} />
      <span>Meu pedido</span>
      {count > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-beer-gold px-1 text-[11px] font-black text-black">{count}</span>}
    </button>
  )

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled || menu ? 'border-b border-white/5 bg-beer-dark/85 py-2 backdrop-blur-xl' : 'bg-transparent py-4'}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-[72px]">
        <a href="#inicio" aria-label="Hoog Bier — início" className="shrink-0">
          <img src="/images/logo-hoog.png" alt="Hoog Bier" width="240" height="160" className="h-14 w-auto drop-shadow-lg md:h-[60px]" />
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? 'true' : undefined} className={`nav-link ${active === item.id ? 'is-active' : ''}`}>
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
          <button type="button" onClick={() => setMenu((v) => !v)} aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu ? 'Fechar menu' : 'Abrir menu'} className="rounded-xl border border-white/10 bg-white/10 p-2.5 text-white backdrop-blur-md">
            {menu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menu && (
        <nav id="mobile-menu" aria-label="Menu mobile" className="absolute left-0 top-full h-[calc(100dvh-100%)] w-full animate-fade-in overflow-y-auto border-t border-white/5 bg-beer-dark/95 backdrop-blur-xl lg:hidden">
          <ul className="px-6 py-8">
            {NAV.map((item) => (
              <li key={item.id} className="border-b border-white/5">
                <a href={`#${item.id}`} onClick={() => setMenu(false)} className={`block py-5 font-display text-2xl font-semibold uppercase tracking-wider ${active === item.id ? 'text-beer-gold' : 'text-white'}`}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="px-6">
            <a href="#cervejas" onClick={() => setMenu(false)} className="btn-primary w-full justify-center py-4">
              Pedir agora
            </a>
          </div>
        </nav>
      )}

      <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-beer-gold transition-opacity" style={{ transform: `scaleX(${progress})`, opacity: scrolled ? 1 : 0 }} aria-hidden="true" />
    </header>
  )
}
