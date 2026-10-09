import { useMemo, useState } from 'react'
import { Calculator, Clock, GlassWater, MessageCircle, Package, Users, Truck, PartyPopper, Wrench } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { calcChopp, suggestKegs } from '../lib/chopp'
import { waLink } from '../lib/whatsapp'
import { track } from '../lib/analytics'
import { BEERS } from '../data/beers'

const STEPS = [
  { icon: Calculator, title: 'Você calcula', desc: 'Informe convidados e duração. Indicamos o volume e os barris.' },
  { icon: Truck, title: 'Nós entregamos', desc: 'Barril refrigerado na porta do seu evento, com a chopeira.' },
  { icon: Wrench, title: 'Nós instalamos', desc: 'Levamos a extensão e deixamos tudo pronto para servir.' },
  { icon: PartyPopper, title: 'Você aproveita', desc: 'É só servir o chopp bem gelado e curtir a festa.' },
]

function Range({ id, label, icon: Icon, value, min, max, step, unit, onChange }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label htmlFor={id} className="flex items-center gap-2 font-display text-sm uppercase tracking-widest text-beer-gold">
          <Icon size={16} aria-hidden="true" /> {label}
        </label>
        <output htmlFor={id} className="font-display text-2xl font-bold text-white">
          {value}
          <span className="ml-1 text-sm font-normal text-zinc-400">{unit}</span>
        </output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="range" style={{ '--pct': `${pct}%` }} />
    </div>
  )
}

export default function Events() {
  const [guests, setGuests] = useState(40)
  const [hours, setHours] = useState(5)
  const [beerId, setBeerId] = useState('pilsen')

  const { liters, kegs, cups } = useMemo(() => {
    const l = calcChopp(guests, hours)
    return { liters: l, kegs: suggestKegs(l), cups: Math.round(l / 0.4) }
  }, [guests, hours])

  const kegText = [kegs.k50 ? `${kegs.k50}× barril 50L` : null, kegs.k30 ? `${kegs.k30}× barril 30L` : null].filter(Boolean).join(' + ')
  const beer = BEERS.find((b) => b.id === beerId)
  const message = `Olá! Fiz o cálculo no site: evento com ${guests} pessoas por ${hours}h (~${liters} litros). Gostaria de orçamento para ${kegText} de ${beer.name}, com chopeira.`

  return (
    <section id="eventos" aria-labelledby="eventos-title" className="relative overflow-hidden bg-zinc-950 pb-44 pt-28">
      <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-beer-gold/10 blur-[120px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4">
        <SectionHeading id="eventos-title" eyebrow="Chopeira para eventos" title="Seu evento com" highlight="chopp de verdade">
          Churrasco, aniversário, casamento ou confraternização: calculamos o volume certo, entregamos e instalamos a chopeira. Sem desperdício e sem faltar.
        </SectionHeading>

        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur md:p-10">
              <div className="mb-8 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-beer-gold text-black">
                  <Calculator aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-2xl font-bold uppercase text-white">Calculadora de chopp</h3>
                  <p className="text-sm text-zinc-400">Planeje sua festa sem desperdício</p>
                </div>
              </div>

              <div className="space-y-8">
                <Range id="guests" label="Convidados" icon={Users} value={guests} min={5} max={300} step={5} unit="pessoas" onChange={setGuests} />
                <Range id="hours" label="Duração" icon={Clock} value={hours} min={1} max={12} step={1} unit="horas" onChange={setHours} />
                <div>
                  <label htmlFor="beer-select" className="mb-2 flex items-center gap-2 font-display text-sm uppercase tracking-widest text-beer-gold">
                    <GlassWater size={16} aria-hidden="true" /> Estilo
                  </label>
                  <select id="beer-select" value={beerId} onChange={(e) => setBeerId(e.target.value)} className="field">
                    {BEERS.filter((b) => b.formats.keg30).map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} — {b.style}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="relative overflow-hidden rounded-3xl border border-beer-gold/30 bg-gradient-to-br from-beer-gold/15 via-zinc-900 to-zinc-900 p-6 md:p-10" aria-live="polite">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-beer-gold/20 blur-3xl" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">Recomendação</p>
              <p className="mt-2 font-display text-7xl font-bold leading-none text-beer-gold md:text-8xl">
                {liters}
                <span className="ml-2 text-3xl text-white">litros</span>
              </p>
              <p className="mt-3 text-sm text-zinc-400">≈ {cups} copos de 400 ml</p>

              <div className="my-6 rounded-2xl border border-white/10 bg-black/40 p-5">
                <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
                  <Package size={14} className="text-beer-gold" aria-hidden="true" /> Barris sugeridos
                </p>
                <p className="font-display text-2xl font-semibold uppercase text-white">{kegText}</p>
                <p className="mt-1 text-xs text-zinc-400">
                  Total de {kegs.total} L · sobra estimada de {kegs.waste} L
                </p>
              </div>

              <a href={waLink(message)} target="_blank" rel="noopener noreferrer" onClick={() => track('calc_quote', { guests, hours, liters })} className="btn-whatsapp w-full justify-center py-4">
                <MessageCircle size={20} /> Pedir orçamento deste evento
              </a>
              <p className="mt-3 text-center text-[11px] text-zinc-400">Estimativa de ~0,45 L por pessoa/hora. Nosso time ajusta para o seu perfil de público.</p>
            </div>
          </Reveal>
        </div>

        <ol className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 100} className="h-full">
                <div className="card-hover h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <s.icon className="text-beer-gold" size={28} aria-hidden="true" />
                    <span className="font-display text-4xl font-bold text-white/10">0{i + 1}</span>
                  </div>
                  <h3 className="mb-1 font-display text-xl font-semibold uppercase text-white">{s.title}</h3>
                  <p className="text-sm text-zinc-400">{s.desc}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      <div className="wave-bottom" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>
    </section>
  )
}
