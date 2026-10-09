import { Instagram, Facebook, Phone, MapPin, Clock } from 'lucide-react'
import { NAV, SITE, fullAddress, mapsQuery } from '../config/site'
import { waLink, MSG } from '../lib/whatsapp'

export default function Footer({ onOpenPrivacy }) {
  return (
    <footer className="border-t border-white/5 bg-black pt-16 pb-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <img src="/images/logo-hoog.png" alt="Hoog Bier" width="240" height="160" loading="lazy" className="mb-5 h-24 w-auto" />
            <p className="max-w-xs text-sm leading-relaxed text-zinc-400">Cervejaria artesanal em Contagem-MG. Chopp e cervejas puro malte, com delivery e chopeiras para o seu evento.</p>
            <div className="mt-6 flex gap-3">
              {[
                { href: SITE.social.instagram, label: 'Instagram', icon: Instagram },
                { href: SITE.social.facebook, label: 'Facebook', icon: Facebook },
                { href: waLink(MSG.generic), label: 'WhatsApp', icon: Phone },
              ].map(({ href, label, icon: Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-zinc-400 transition hover:border-beer-gold hover:text-beer-gold">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Rodapé">
            <p className="mb-4 font-display text-sm uppercase tracking-[0.25em] text-beer-gold">Navegue</p>
            <ul className="space-y-3 text-sm">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="text-zinc-400 transition hover:text-white">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-4 font-display text-sm uppercase tracking-[0.25em] text-beer-gold">Visite-nos</p>
            <address className="space-y-4 text-sm not-italic text-zinc-400">
              <a href={mapsQuery(fullAddress())} target="_blank" rel="noopener noreferrer" className="flex gap-3 transition hover:text-white">
                <MapPin size={18} className="mt-0.5 shrink-0 text-beer-gold" />
                {SITE.address.street}
                <br />
                {SITE.address.district}, {SITE.address.city}/{SITE.address.state}
              </a>
              <a href={waLink(MSG.generic)} target="_blank" rel="noopener noreferrer" className="flex gap-3 transition hover:text-white">
                <Phone size={18} className="shrink-0 text-beer-gold" />
                {SITE.phoneDisplay}
              </a>
            </address>
          </div>

          <div>
            <p className="mb-4 font-display text-sm uppercase tracking-[0.25em] text-beer-gold">Horários</p>
            <ul className="space-y-3 text-sm text-zinc-400">
              {SITE.hours.map((h) => (
                <li key={h.label} className="flex gap-3">
                  <Clock size={18} className="mt-0.5 shrink-0 text-beer-gold" />
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

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-center text-xs text-zinc-400 md:flex-row md:text-left">
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
        </div>
        <p className="mt-6 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Beba com moderação. Venda proibida para menores de 18 anos.</p>
      </div>
    </footer>
  )
}
