import { Beer, Calendar, Music, RefreshCw, Truck } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { useSheet } from '../hooks/useSheet'
import { SHEETS, SITE } from '../config/site'

const ICONS = { musica: Music, comida: Truck, promocao: Beer }
const iconFor = (cat = '') => {
  const key = cat.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  const match = Object.keys(ICONS).find((k) => key.includes(k))
  return ICONS[match] || Calendar
}

const Skeleton = () => (
  <div className="h-64 animate-pulse rounded-3xl border border-white/5 bg-white/5 motion-reduce:animate-none" aria-hidden="true" />
)

export default function Agenda({ onReserve }) {
  const { rows, status, retry } = useSheet(SHEETS.agenda, { requiredField: 'titulo' })

  return (
    <section id="agenda" aria-labelledby="agenda-title" className="relative overflow-hidden bg-zinc-900 pb-28 pt-40">
      <div className="wave-top" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <Reveal className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="mb-4 block font-display text-xs font-medium uppercase tracking-[0.4em] text-beer-gold">Happy hour & eventos</span>
            <h2 id="agenda-title" className="font-display text-4xl font-bold uppercase tracking-tight text-white md:text-6xl">
              Agenda <span className="text-gradient-gold">Hoog</span>
            </h2>
          </div>
          <button type="button" onClick={onReserve} className="btn-ghost">
            <Calendar size={16} /> Reservar mesa
          </button>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3" aria-live="polite" aria-busy={status === 'loading'}>
          {status === 'loading' && [0, 1, 2].map((i) => <Skeleton key={i} />)}

          {status === 'error' && (
            <div className="col-span-full rounded-3xl border border-white/10 bg-white/5 py-12 text-center">
              <p className="mb-4 text-zinc-300">Não conseguimos carregar a programação agora.</p>
              <button type="button" onClick={retry} className="btn-ghost">
                <RefreshCw size={16} /> Tentar novamente
              </button>
            </div>
          )}

          {status === 'ready' && rows.length === 0 && (
            <div className="col-span-full rounded-3xl border border-white/10 bg-white/5 py-12 text-center">
              <p className="text-zinc-300">Nenhum evento programado para esta semana.</p>
              <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block font-bold text-beer-gold hover:underline">
                Acompanhe as novidades no Instagram
              </a>
            </div>
          )}

          {status === 'ready' &&
            rows.map((ev, i) => {
              const featured = /sim|true|1|x/i.test(ev.destaque || '')
              const Icon = iconFor(ev.categoria)
              return (
                <Reveal key={`${ev.titulo}-${i}`} delay={(i % 3) * 100} className="h-full">
                  <article className={`card-hover group relative flex h-full flex-col overflow-hidden rounded-3xl border p-8 ${featured ? 'border-beer-gold/40 bg-gradient-to-br from-beer-gold/20 to-black/40' : 'border-white/10 bg-black/40'}`}>
                    {featured && <span className="absolute right-0 top-0 rounded-bl-xl bg-beer-gold px-3 py-1 font-display text-[11px] font-bold uppercase tracking-wider text-black">Destaque</span>}
                    <div className="mb-6 flex items-start justify-between">
                      <div className={`rounded-xl border px-4 py-2 text-center font-display text-xl font-bold leading-tight ${featured ? 'border-beer-gold bg-beer-gold text-black' : 'border-beer-gold/20 bg-beer-gold/10 text-beer-gold'}`}>
                        {ev.dia}
                        {ev.horario && <span className="block text-sm font-medium opacity-80">{ev.horario}</span>}
                      </div>
                      <span className="rounded-full bg-white/5 p-3 text-zinc-400 transition-colors group-hover:text-beer-gold">
                        <Icon size={22} aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mb-2 font-display text-2xl font-semibold uppercase leading-tight text-white">{ev.titulo}</h3>
                    <p className="flex-1 text-sm leading-relaxed text-zinc-400">{ev.descricao}</p>
                  </article>
                </Reveal>
              )
            })}
        </div>
      </div>
    </section>
  )
}
