import { useRef } from 'react'
import { ArrowUp, Instagram, Facebook, Phone, MapPin, Clock } from 'lucide-react'
import { NAV, SITE, fullAddress, mapsQuery } from '../config/site'
import { waLink, MSG } from '../lib/whatsapp'
import { gsap, SplitText } from '../lib/gsap'
import { useMotion } from '../hooks/useMotion'
import { scrollToTarget } from '../lib/motion'

export default function Footer({ onOpenPrivacy }) {
  const root = useRef(null)

  // Efeito cortina: o rodapé "sobe de baixo" da página enquanto ela termina; a marca gigante nasce letra a letra.
  useMotion(
    () => {
      gsap.fromTo('[data-footer-inner]', { yPercent: -35 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true } })
      const split = SplitText.create('[data-wordmark]', { type: 'chars', aria: 'hidden' })
      gsap.from(split.chars, { yPercent: 100, stagger: 0.05, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '[data-wordmark]', start: 'top 98%', once: true } })
      return () => split.revert()
    },
    { scope: root },
  )

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-white/10 bg-beer-dark">
      <div data-footer-inner className="pt-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <img src="/images/logo-hoog.png" alt="Hoog Bier" width="240" height="160" loading="lazy" className="mb-6 h-20 w-auto" />
              <p className="max-w-xs text-sm leading-relaxed text-zinc-400">Cervejaria artesanal em Contagem-MG. Chopp e cervejas puro malte, com delivery e chopeiras para o seu evento.</p>
              <div className="mt-6 flex gap-3">
                {[
                  { href: SITE.social.instagram, label: 'Instagram', icon: Instagram },
                  { href: SITE.social.facebook, label: 'Facebook', icon: Facebook },
                  { href: waLink(MSG.generic), label: 'WhatsApp', icon: Phone },
                ].map(({ href, label, icon: Icon }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-12 w-12 place-items-center rounded-full border border-white/10 text-zinc-400 transition duration-500 ease-expo hover:-translate-y-1 hover:border-beer-gold hover:bg-beer-gold hover:text-black">
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            <nav aria-label="Rodapé" className="md:col-span-2">
              <p className="mb-5 font-display text-sm uppercase tracking-[0.25em] text-beer-gold">Navegue</p>
              <ul className="space-y-3 text-sm">
                {NAV.map((n) => (
                  <li key={n.id}>
                    <a href={`#${n.id}`} className="group inline-flex items-center gap-2 text-zinc-400 transition hover:text-white">
                      <span className="h-px w-0 bg-beer-gold transition-all duration-500 ease-expo group-hover:w-4" aria-hidden="true" />
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="md:col-span-3">
              <p className="mb-5 font-display text-sm uppercase tracking-[0.25em] text-beer-gold">Visite-nos</p>
              <address className="space-y-4 text-sm not-italic text-zinc-400">
                <a href={mapsQuery(fullAddress())} target="_blank" rel="noopener noreferrer" className="flex gap-3 transition hover:text-white">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-beer-gold" aria-hidden="true" />
                  <span>
                    {SITE.address.street}
                    <br />
                    {SITE.address.district}, {SITE.address.city}/{SITE.address.state}
                  </span>
                </a>
                <a href={waLink(MSG.generic)} target="_blank" rel="noopener noreferrer" className="flex gap-3 transition hover:text-white">
                  <Phone size={18} className="shrink-0 text-beer-gold" aria-hidden="true" />
                  {SITE.phoneDisplay}
                </a>
              </address>
            </div>

            <div className="md:col-span-3">
              <p className="mb-5 font-display text-sm uppercase tracking-[0.25em] text-beer-gold">Horários</p>
              <ul className="space-y-3 text-sm text-zinc-400">
                {SITE.hours.map((h) => (
                  <li key={h.label} className="flex gap-3">
                    <Clock size={18} className="mt-0.5 shrink-0 text-beer-gold" aria-hidden="true" />
                    <span>
                      {h.label}
                      <br />
                      <span className="text-white">
                        {h.open.replace(':00', 'h')} às {h.close.replace(':00', 'h')}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center text-xs text-zinc-400 md:flex-row md:text-left">
            <p>
              © {new Date().getFullYear()} {SITE.legalName} Todos os direitos reservados.
              <button type="button" onClick={onOpenPrivacy} className="ml-3 underline underline-offset-2 transition hover:text-white">
                Privacidade
              </button>
            </p>
            <p>
              Desenvolvido por{' '}
              <a href={SITE.developer.url} target="_blank" rel="noopener noreferrer" className="font-bold text-beer-gold hover:underline">
                {SITE.developer.name}
              </a>
            </p>
            <button type="button" onClick={() => scrollToTarget('#inicio', { duration: 2 })} className="inline-flex items-center gap-2 font-bold uppercase tracking-[0.2em] transition hover:text-beer-gold">
              Voltar ao topo <ArrowUp size={14} aria-hidden="true" />
            </button>
          </div>
          <p className="mt-6 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">Beba com moderação. Venda proibida para menores de 18 anos.</p>
        </div>

        <p data-wordmark className="pointer-events-none mt-8 select-none overflow-hidden whitespace-nowrap text-center font-display text-[21vw] font-bold uppercase leading-[0.95] tracking-tighter text-beer-gold" aria-hidden="true">
          Hoog Bier
        </p>
      </div>
    </footer>
  )
}
