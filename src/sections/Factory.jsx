import { useEffect, useState } from 'react'
import { Clock, MapPin, Navigation, ShoppingBag, Truck } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { SITE, fullAddress, mapsEmbed, mapsQuery } from '../config/site'
import { openStatus } from '../lib/hours'
import { waLink, MSG } from '../lib/whatsapp'

export default function Factory() {
  const [status, setStatus] = useState(null)
  const [mapOn, setMapOn] = useState(false)

  useEffect(() => {
    const tick = () => setStatus(openStatus())
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [])

  const address = `${fullAddress()}, Brasil`

  return (
    <section id="fabrica" aria-labelledby="fabrica-title" className="relative bg-black py-28">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading id="fabrica-title" eyebrow="Nossa casa" title="Fábrica" highlight="& loja">
          A Hoog Bier é um marco da produção artesanal em Contagem. Unimos tecnologia e tradição para entregar o chopp mais fresco da cidade.
        </SectionHeading>

        <div className="grid items-stretch gap-8 lg:grid-cols-2">
          <Reveal className="h-full">
            <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-black p-8 md:p-10">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-3xl font-bold uppercase text-white">Visite-nos</h3>
                {status && (
                  <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${status.open ? 'border-green-500/40 bg-green-500/10 text-green-400' : 'border-white/15 bg-white/5 text-zinc-400'}`}>
                    <span className={`h-2 w-2 rounded-full ${status.open ? 'animate-pulse bg-green-400' : 'bg-zinc-500'}`} aria-hidden="true" />
                    {status.text}
                  </span>
                )}
              </div>

              <div className="space-y-7">
                <div className="flex gap-4">
                  <MapPin className="mt-1 shrink-0 text-beer-gold" aria-hidden="true" />
                  <div>
                    <p className="mb-1 text-sm font-bold uppercase tracking-wider text-white">Localização</p>
                    <address className="not-italic text-zinc-400">
                      {SITE.address.street}
                      <br />
                      {SITE.address.district}, {SITE.address.city}/{SITE.address.state}
                    </address>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Clock className="mt-1 shrink-0 text-beer-gold" aria-hidden="true" />
                  <div>
                    <p className="mb-1 text-sm font-bold uppercase tracking-wider text-white">Horários</p>
                    <ul className="text-zinc-400">
                      {SITE.hours.map((h) => (
                        <li key={h.label}>
                          {h.label}: <span className="text-zinc-200">{h.open.replace(':00', 'h')} às {h.close.replace(':00', 'h')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Truck className="mt-1 shrink-0 text-beer-gold" aria-hidden="true" />
                  <div>
                    <p className="mb-1 text-sm font-bold uppercase tracking-wider text-white">Delivery de chopp</p>
                    <p className="text-zinc-400">Levamos a chopeira e instalamos no seu evento.</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto grid gap-3 pt-10 sm:grid-cols-2">
                <a href={mapsQuery(address)} target="_blank" rel="noopener noreferrer" className="btn-ghost justify-center py-4">
                  <Navigation size={18} /> Como chegar
                </a>
                <a href={waLink(MSG.budget)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp justify-center py-4">
                  <ShoppingBag size={18} /> Orçamento rápido
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150} className="h-full">
            <div className="relative min-h-[380px] overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 lg:h-full">
              {mapOn ? (
                <iframe title={`Mapa: ${fullAddress()}`} src={mapsEmbed(address)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0 grayscale-[0.4] invert-[0.92] hue-rotate-180" allowFullScreen />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.18),transparent_55%)] p-8 text-center">
                  <MapPin size={48} className="text-beer-gold" aria-hidden="true" />
                  <p className="font-display text-2xl font-bold uppercase text-white">{SITE.address.street}</p>
                  <p className="text-sm text-zinc-400">{SITE.address.district}, {SITE.address.city}/{SITE.address.state}</p>
                  <button type="button" onClick={() => setMapOn(true)} className="btn-primary">
                    Carregar mapa
                  </button>
                  <p className="max-w-xs text-[11px] text-zinc-400">O mapa é do Google e só é carregado se você clicar, para proteger sua privacidade.</p>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
