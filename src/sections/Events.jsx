import { useMemo, useRef, useState } from 'react'
import { Calculator, Clock, GlassWater, MessageCircle, Package, Users, Truck, PartyPopper, Wrench } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import Counter from '../components/motion/Counter'
import { calcChopp, suggestKegs } from '../lib/chopp'
import { waLink } from '../lib/whatsapp'
import { track } from '../lib/analytics'
import { BEERS } from '../data/beers'
import { gsap, useGSAP } from '../lib/gsap'
import { useMotion } from '../hooks/useMotion'
import { reducedMotion } from '../lib/motion'

const STEPS = [
  { icon: Calculator, title: 'Você calcula', desc: 'Informe convidados e duração. Indicamos o volume e os barris.' },
  { icon: Truck, title: 'Nós entregamos', desc: 'Barril refrigerado na porta do seu evento, com a chopeira.' },
  { icon: Wrench, title: 'Nós instalamos', desc: 'Levamos a extensão e deixamos tudo pronto para servir.' },
  { icon: PartyPopper, title: 'Você aproveita', desc: 'É só servir o chopp bem gelado e curtir a festa.' },
]

const MAX_KEGS = 10

function Keg({ size }) {
  const big = size === 50
  return (
    <span data-keg className={`relative flex flex-col items-center justify-end overflow-hidden rounded-xl border-2 border-beer-gold/70 bg-gradient-to-b from-zinc-800 to-zinc-900 ${big ? 'h-[4.5rem] w-12' : 'h-14 w-10'}`}>
      <span className="absolute inset-x-0 bottom-0 h-[82%] bg-gradient-to-b from-[#FBBF24] to-amber-deep" />
      <span className="absolute inset-x-0 top-[18%] h-1.5 bg-foam/90" />
      <span className="relative mb-1 font-display text-[10px] font-bold text-black">{size}L</span>
    </span>
  )
}

function Range({ id, label, icon: Icon, value, min, max, step, unit, onChange }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="mb-4 flex items-end justify-between">
        <label htmlFor={id} className="flex items-center gap-2 font-display text-sm uppercase tracking-widest text-beer-gold">
          <Icon size={16} aria-hidden="true" /> {label}
        </label>
        <output htmlFor={id} className="font-display text-4xl font-bold leading-none text-white">
          {value}
          <span className="ml-1.5 text-sm font-normal text-zinc-400">{unit}</span>
        </output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="range" style={{ '--pct': `${pct}%` }} />
    </div>
  )
}

export default function Events() {
  const root = useRef(null)
  const kegsRef = useRef(null)
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
  const kegList = [...Array(kegs.k50).fill(50), ...Array(kegs.k30).fill(30)]

  // Barris "pulam" para dentro quando a combinação muda.
  useGSAP(
    () => {
      if (reducedMotion()) return
      gsap.from(kegsRef.current.querySelectorAll('[data-keg]'), { scale: 0, y: 20, stagger: 0.05, duration: 0.7, ease: 'back.out(2)', overwrite: 'auto' })
    },
    { dependencies: [kegs.k30, kegs.k50], scope: kegsRef },
  )

  // Linha do tempo: o traço se desenha conforme o scroll e cada etapa acende ao ser alcançada.
  useMotion(
    () => {
      const steps = gsap.utils.toArray('[data-step]', root.current)
      const line = { trigger: '[data-steps]', start: 'top 75%', end: 'bottom 60%', scrub: true }
      gsap.fromTo('[data-line="x"]', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { ...line } })
      gsap.fromTo('[data-line="y"]', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { ...line } })
      steps.forEach((el) => {
        gsap.fromTo(
          el.querySelector('[data-dot]'),
          { backgroundColor: '#18181b', color: '#F59E0B', scale: 0.8 },
          { backgroundColor: '#F59E0B', color: '#000', scale: 1, duration: 0.5, ease: 'back.out(2)', scrollTrigger: { trigger: el, start: 'top 68%', toggleActions: 'play none none reverse' } },
        )
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="eventos" aria-labelledby="eventos-title" className="relative overflow-hidden bg-zinc-950 pb-32 pt-28 md:pt-36">
      <div className="pointer-events-none absolute -left-40 top-20 h-[30rem] w-[30rem] rounded-full bg-beer-gold/10 blur-[140px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4">
        <SectionHeading id="eventos-title" eyebrow="Chopeira para eventos" title="Sua festa com" highlight="chopp de verdade">
          Churrasco, aniversário, casamento ou confraternização: calculamos o volume certo, entregamos e instalamos a chopeira. Sem desperdício e sem faltar.
        </SectionHeading>

        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          <Reveal className="h-full">
            <div className="h-full rounded-[2rem] border border-white/10 bg-zinc-900/60 p-6 backdrop-blur md:p-10">
              <div className="mb-10 flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-beer-gold text-black">
                  <Calculator size={22} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-2xl font-bold uppercase text-white">Calculadora de chopp</h3>
                  <p className="text-sm text-zinc-400">Planeje sua festa sem desperdício</p>
                </div>
              </div>

              <div className="space-y-10">
                <Range id="guests" label="Convidados" icon={Users} value={guests} min={5} max={300} step={5} unit="pessoas" onChange={setGuests} />
                <Range id="hours" label="Duração" icon={Clock} value={hours} min={1} max={12} step={1} unit="horas" onChange={setHours} />
                <div>
                  <label htmlFor="beer-select" className="mb-3 flex items-center gap-2 font-display text-sm uppercase tracking-widest text-beer-gold">
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

          <Reveal delay={120} className="h-full">
            <div className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-beer-gold/30 bg-gradient-to-br from-beer-gold/15 via-zinc-900 to-zinc-900 p-6 md:p-10" aria-live="polite">
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-beer-gold/20 blur-3xl" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">Recomendação</p>
              <p className="mt-2 font-display text-[clamp(5rem,12vw,8.5rem)] font-bold leading-[0.85] tracking-tight text-beer-gold">
                <Counter value={liters} />
                <span className="ml-3 font-serif text-4xl font-normal italic text-white md:text-5xl">litros</span>
              </p>
              <p className="mt-3 text-sm text-zinc-400">
                ≈ <Counter value={cups} /> copos de 400 ml
              </p>

              <div className="my-8 rounded-2xl border border-white/10 bg-black/40 p-5">
                <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
                  <Package size={14} className="text-beer-gold" aria-hidden="true" /> Barris sugeridos
                </p>
                <div ref={kegsRef} className="mb-4 flex min-h-[4.5rem] flex-wrap items-end gap-2" aria-hidden="true">
                  {kegList.slice(0, MAX_KEGS).map((size, i) => (
                    <Keg key={`${size}-${i}-${kegs.k30}-${kegs.k50}`} size={size} />
                  ))}
                  {kegList.length > MAX_KEGS && <span className="self-center font-display text-xl font-bold text-beer-gold">+{kegList.length - MAX_KEGS}</span>}
                </div>
                <p className="font-display text-2xl font-semibold uppercase text-white">{kegText}</p>
                <p className="mt-1 text-xs text-zinc-400">
                  Total de {kegs.total} L · sobra estimada de {kegs.waste} L
                </p>
              </div>

              <a href={waLink(message)} target="_blank" rel="noopener noreferrer" onClick={() => track('calc_quote', { guests, hours, liters })} className="btn-whatsapp mt-auto w-full justify-center py-4">
                <MessageCircle size={20} aria-hidden="true" /> Pedir orçamento deste evento
              </a>
              <p className="mt-3 text-center text-[11px] text-zinc-400">Estimativa de ~0,45 L por pessoa/hora. Nosso time ajusta para o seu perfil de público.</p>
            </div>
          </Reveal>
        </div>

        <ol data-steps className="relative mt-24 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <span className="absolute left-0 right-0 top-7 hidden h-px bg-white/10 lg:block" aria-hidden="true">
            <span data-line="x" className="block h-full origin-left bg-beer-gold" />
          </span>
          <span className="absolute bottom-0 left-7 top-0 w-px bg-white/10 sm:hidden" aria-hidden="true">
            <span data-line="y" className="block h-full w-full origin-top bg-beer-gold" />
          </span>
          {STEPS.map((s, i) => (
            <li key={s.title} data-step className="relative pl-20 sm:pl-0">
              <span data-dot className="absolute left-0 top-0 grid h-14 w-14 place-items-center rounded-full border border-beer-gold/40 bg-zinc-900 text-beer-gold sm:relative sm:mb-6">
                <s.icon size={22} aria-hidden="true" />
              </span>
              <p className="mb-1 font-display text-sm font-bold tracking-[0.3em] text-zinc-500">0{i + 1}</p>
              <h3 className="mb-2 font-display text-2xl font-semibold uppercase text-white">{s.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
