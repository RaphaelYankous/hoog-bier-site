import { Instagram } from 'lucide-react'
import Reveal from '../components/Reveal'
import { BEERS } from '../data/beers'
import { SITE } from '../config/site'

const PAIRINGS = [
  { id: 'ipa', emoji: '🍔', title: 'Burgers & IPA', text: 'O amargor corta a gordura e limpa o paladar.' },
  { id: 'pilsen', emoji: '🥨', title: 'Petiscos & Pilsen', text: 'Leveza e frescor para acompanhar frituras e queijos frescos.' },
  { id: 'california', emoji: '🥩', title: 'Carnes & California', text: 'Corpo maltado e final seco para grelhados intensos.' },
  { id: 'stout', emoji: '🍫', title: 'Doces & Dry Stout', text: 'Torrado que lembra café, ótimo com petit gâteau.' },
]

export default function Experience() {
  return (
    <section aria-labelledby="exp-title" className="relative overflow-hidden bg-beer-gold py-24 text-beer-dark">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden="true">
        <span className="absolute -bottom-10 -right-10 font-display text-[22rem] font-bold leading-none">HOOG</span>
      </div>
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-14 px-4 lg:flex-row">
        <div className="lg:w-5/12">
          <Reveal>
            <span className="mb-4 block font-display text-xs font-medium uppercase tracking-[0.4em] text-black/70">Harmonização</span>
            <h2 id="exp-title" className="mb-5 font-display text-5xl font-bold uppercase leading-[0.98] md:text-6xl">
              Mais que cerveja, uma experiência
            </h2>
            <p className="mb-7 text-lg font-medium leading-relaxed text-black/80">
              Uma boa cerveja merece uma boa comida. Das nossas fichas técnicas saem as harmonizações que funcionam de verdade — do churrasco de domingo ao jantar sofisticado.
            </p>
            <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border-b-2 border-black pb-1 font-bold transition hover:border-white hover:text-white">
              Ver dicas no Instagram <Instagram size={18} />
            </a>
          </Reveal>
        </div>

        <ul className="grid w-full gap-4 sm:grid-cols-2 lg:w-7/12">
          {PAIRINGS.map((p, i) => {
            const beer = BEERS.find((b) => b.id === p.id)
            return (
              <li key={p.id}>
                <Reveal delay={i * 100} className="h-full">
                  <a href={`#cerveja-${p.id}`} className="group flex h-full items-start gap-4 rounded-2xl border border-black/10 bg-black/10 p-5 transition hover:-translate-y-1 hover:bg-black/20">
                    <span className="text-4xl" aria-hidden="true">
                      {p.emoji}
                    </span>
                    <span>
                      <span className="block font-display text-xl font-bold uppercase tracking-tight">{p.title}</span>
                      <span className="mt-1 block text-sm text-black/75">{p.text}</span>
                      <span className="mt-2 block text-xs font-bold uppercase tracking-widest text-black/60 transition group-hover:text-black">Ver {beer.name} →</span>
                    </span>
                  </a>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
