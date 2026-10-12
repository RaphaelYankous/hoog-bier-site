import { Beer, Calendar, Music, RefreshCw, Truck } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import Magnetic from '../components/motion/Magnetic'
import { useSheet } from '../hooks/useSheet'
import { SHEETS, SITE } from '../config/site'

const ICONS = { musica: Music, comida: Truck, promocao: Beer }
const iconFor = (cat = '') => {
  const key = cat.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  const match = Object.keys(ICONS).find((k) => key.includes(k))
  return ICONS[match] || Calendar
}

const Skeleton = () => <div className="h-72 animate-pulse rounded-[2rem] border border-white/5 bg-white/5 motion-reduce:animate-none" aria-hidden="true" />

export default function Agenda({ onReserve }) {
  const { rows, status, retry } = useSheet(SHEETS.agenda, { requiredField: 'titulo' })

  return (
    <section id="agenda" aria-labelledby="agenda-title" className="relative overflow-hidden rounded-t-[2.5rem] bg-zinc-900 pb-28 pt-28 md:rounded-t-[4rem] md:pt-36">
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading id="agenda-title" eyebrow="Happy hour & eventos" title="Agenda" highlight="Hoog" align="left" className="!mb-0" />
          <Reveal className="mb-2 shrink-0">
            <Magnetic>
              <button type="button" onClick={onReserve} className="btn-primary">
                <Calendar size={16} aria-hidden="true" /> Reservar mesa
              </button>
            </Magnetic>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-3" aria-live="polite" aria-busy={status === 'loading'}>
          {status === 'loading' && [0, 1, 2].map((i) => <Skeleton key={i} />)}

          {status === 'error' && (
            <div className="col-span-full rounded-[2rem] border border-white/10 bg-white/5 py-14 text-center">
              <p className="mb-4 text-zinc-300">Não conseguimos carregar a programação agora.</p>
              <button type="button" onClick={retry} className="btn-ghost">
                <RefreshCw size={16} aria-hidden="true" /> Tentar novamente
              </button>
            </div>
          )}

          {status === 'ready' && rows.length === 0 && (
            <div className="col-span-full rounded-[2rem] border border-white/10 bg-white/5 py-14 text-center">
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
                <Reveal key={`${ev.titulo}-${i}`} delay={(i % 3) * 110} className="h-full">
                  <article className={`group relative flex h-full min-h-[18rem] flex-col overflow-hidden rounded-[2rem] border p-8 transition-all duration-700 ease-expo hover:-translate-y-2 ${featured ? 'border-beer-gold bg-beer-gold text-black' : 'border-white/10 bg-black/40 text-white hover:border-beer-gold/50'}`}>
                    {featured && <span className="absolute right-6 top-6 rounded-full bg-black px-3 py-1 font-display text-[11px] font-bold uppercase tracking-wider text-beer-gold">Destaque</span>}
                    <span className={`mb-8 grid h-12 w-12 place-items-center rounded-full transition-transform duration-700 ease-expo group-hover:rotate-[20deg] ${featured ? 'bg-black text-beer-gold' : 'bg-white/5 text-beer-gold'}`}>
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <p className={`font-display text-4xl font-bold uppercase leading-none ${featured ? '' : 'text-beer-gold'}`}>{ev.dia}</p>
                    {ev.horario && <p className={`mt-1 text-sm font-semibold ${featured ? 'text-black/70' : 'text-zinc-400'}`}>{ev.horario}</p>}
                    <h3 className="mb-2 mt-auto pt-8 font-display text-2xl font-semibold uppercase leading-tight">{ev.titulo}</h3>
                    <p className={`text-sm leading-relaxed ${featured ? 'text-black/75' : 'text-zinc-400'}`}>{ev.descricao}</p>
                  </article>
                </Reveal>
              )
            })}
        </div>
      </div>
    </section>
  )
}
