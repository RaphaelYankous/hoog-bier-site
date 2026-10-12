import { useRef } from 'react'
import { CheckCircle, Clock, Truck } from 'lucide-react'
import { SITE } from '../config/site'
import { BEERS, FORMATS } from '../data/beers'
import { gsap } from '../lib/gsap'
import { useMotion } from '../hooks/useMotion'
import ScrubText from '../components/motion/ScrubText'
import Counter from '../components/motion/Counter'

const FEATURES = [
  { icon: CheckCircle, title: 'Puro malte', desc: 'Sem milho ou arroz. Apenas insumos nobres importados.' },
  { icon: Clock, title: 'Maturação lenta', desc: 'Respeitamos o tempo da natureza. Sem aceleradores químicos.' },
  { icon: Truck, title: 'Logística própria', desc: 'Entrega rápida e refrigerada para toda a região de Contagem.' },
]

const STATS = [
  { value: SITE.foundedYear, label: 'Ano de fundação' },
  { value: BEERS.length, label: 'Estilos artesanais' },
  { value: 100, suffix: '%', label: 'Puro malte' },
  { value: FORMATS.length, label: 'Formatos, da long neck ao barril' },
]

export default function Manifesto() {
  const root = useRef(null)

  useMotion(
    () => {
      gsap.utils.toArray('[data-rule]', root.current).forEach((el) => {
        gsap.from(el, { scaleX: 0, transformOrigin: '0% 50%', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
      })
      gsap.from(gsap.utils.toArray('[data-feature]', root.current), {
        y: 60,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 1.3,
        scrollTrigger: { trigger: '[data-features]', start: 'top 85%', once: true },
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="manifesto" aria-labelledby="manifesto-title" className="relative bg-beer-dark pb-28 pt-24 text-white md:pb-36 md:pt-32">
      <div className="mx-auto max-w-7xl px-4">
        <h2 id="manifesto-title" className="eyebrow mb-10">
          Nosso manifesto
        </h2>

        <ScrubText dim={0.18} className="max-w-6xl font-display text-[clamp(2rem,5.4vw,5rem)] font-bold uppercase leading-[1.02] tracking-tight">
          Água, malte, lúpulo e levedura. <em className="font-serif font-normal normal-case text-beer-gold">Só isso.</em> Nada de milho, nada de arroz, nada de atalho. Desde {SITE.foundedYear} a gente faz chopp do jeito que tem que ser:{' '}
          <em className="font-serif font-normal normal-case text-beer-gold">devagar, puro e fresco</em> — direto da fábrica em Contagem para o seu copo.
        </ScrubText>

        <ul data-features className="mt-20 grid gap-10 md:mt-28 md:grid-cols-3 md:gap-8">
          {FEATURES.map((f, i) => (
            <li key={f.title} data-feature>
              <div data-rule className="mb-6 h-px bg-white/15" />
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display text-sm font-bold tracking-[0.3em] text-beer-gold">0{i + 1}</span>
                <f.icon size={26} strokeWidth={1.6} className="text-beer-gold" aria-hidden="true" />
              </div>
              <h3 className="mb-2 font-display text-3xl font-bold uppercase tracking-tight md:text-4xl">{f.title}</h3>
              <p className="max-w-xs text-[15px] leading-relaxed text-zinc-400">{f.desc}</p>
            </li>
          ))}
        </ul>

        <dl className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 md:mt-28 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="border-l border-white/15 pl-5">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-[clamp(3rem,7vw,5.5rem)] font-bold leading-none tracking-tight">
                <Counter value={s.value} onView />
                <span className="text-beer-gold">{s.suffix}</span>
              </dd>
              <dd className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500" aria-hidden="true">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
