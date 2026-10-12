import { useRef } from 'react'
import { ArrowUpRight, Instagram } from 'lucide-react'
import { BEERS } from '../data/beers'
import { SITE } from '../config/site'
import { gsap } from '../lib/gsap'
import { useMotion } from '../hooks/useMotion'
import SplitReveal from '../components/motion/SplitReveal'
import Reveal from '../components/Reveal'

const PAIRINGS = [
  { id: 'ipa', emoji: '🍔', title: 'Burgers & IPA', text: 'O amargor corta a gordura e limpa o paladar a cada mordida.' },
  { id: 'pilsen', emoji: '🥨', title: 'Petiscos & Pilsen', text: 'Leveza e frescor para acompanhar frituras e queijos frescos.' },
  { id: 'california', emoji: '🥩', title: 'Carnes & California', text: 'Corpo maltado e final seco para grelhados intensos.' },
  { id: 'stout', emoji: '🍫', title: 'Doces & Dry Stout', text: 'Torrado que lembra café, ótimo com petit gâteau.' },
]

export default function Experience() {
  const root = useRef(null)

  // Cards empilhados: ao chegar o próximo, o anterior encolhe e escurece (profundidade).
  useMotion(
    () => {
      const cards = gsap.utils.toArray('[data-card]', root.current)
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return
        gsap.to(card.firstElementChild, {
          scale: 0.9 + i * 0.02,
          filter: 'brightness(0.55)',
          ease: 'none',
          scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 25%', scrub: true },
        })
      })
      gsap.to('[data-bigword]', { xPercent: -30, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="exp-title" className="relative overflow-clip bg-beer-dark py-24 text-white md:py-32">
      <p data-bigword className="pointer-events-none absolute -bottom-6 left-0 whitespace-nowrap font-display text-[24vw] font-bold uppercase leading-none text-white/[0.03]" aria-hidden="true">
        Harmonize · Harmonize
      </p>

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal y={20}>
              <p className="eyebrow mb-6">Harmonização</p>
            </Reveal>
            <SplitReveal id="exp-title" className="mb-6 font-display text-[clamp(2.8rem,6vw,5.5rem)] font-bold uppercase leading-[0.9] tracking-tight">
              Mais que cerveja, uma <span className="font-serif font-normal normal-case italic text-beer-gold">experiência</span>
            </SplitReveal>
            <Reveal delay={150} y={24}>
              <p className="mb-8 max-w-md text-lg leading-relaxed text-zinc-400">
                Uma boa cerveja merece uma boa comida. Das nossas fichas técnicas saem as harmonizações que funcionam de verdade — do churrasco de domingo ao jantar sofisticado.
              </p>
              <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <Instagram size={18} aria-hidden="true" /> Dicas no Instagram
              </a>
            </Reveal>
          </div>
        </div>

        <ul className="space-y-6 lg:col-span-7">
          {PAIRINGS.map((p, i) => {
            const beer = BEERS.find((b) => b.id === p.id)
            return (
              <li key={p.id} data-card className="sticky" style={{ top: `calc(7rem + ${i * 1.25}rem)` }}>
                <a
                  href={`#cerveja-${p.id}`}
                  data-cursor="Ver"
                  className="group relative flex min-h-[16rem] origin-top items-center gap-6 overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900 p-7 text-white shadow-[0_30px_60px_-25px_rgba(0,0,0,0.8)] transition-colors duration-500 hover:border-beer-gold/40 md:min-h-[19rem] md:p-10"
                >
                  <div className="pointer-events-none absolute -right-16 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full opacity-40 blur-[80px] transition-opacity duration-700 group-hover:opacity-70" style={{ background: beer.glow }} aria-hidden="true" />
                  <div className="relative flex-1">
                    <span className="mb-4 block text-5xl md:text-6xl" aria-hidden="true">
                      {p.emoji}
                    </span>
                    <span className="block font-display text-3xl font-bold uppercase leading-none tracking-tight md:text-4xl">{p.title}</span>
                    <span className="mt-3 block max-w-sm text-sm leading-relaxed text-zinc-400 md:text-base">{p.text}</span>
                    <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-beer-gold">
                      Ver {beer.name} <ArrowUpRight size={16} className="transition-transform duration-500 ease-expo group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                  <img
                    src={`/images/beers/${p.id}.webp`}
                    alt=""
                    width="90"
                    height="260"
                    loading="lazy"
                    className="relative h-44 w-auto rotate-6 drop-shadow-[0_20px_20px_rgba(0,0,0,0.6)] transition-transform duration-700 ease-expo group-hover:-translate-y-2 group-hover:rotate-0 md:h-56"
                  />
                  <span className="absolute right-6 top-6 font-display text-sm font-bold tracking-[0.3em] text-white/30">0{i + 1}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
