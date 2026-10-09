import { useState } from 'react'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import PosterModal from '../components/PosterModal'
import BeerCard from './BeerCard'
import BeerQuiz from './BeerQuiz'
import { BEERS, CATEGORIES } from '../data/beers'

export default function Catalog() {
  const [category, setCategory] = useState('all')
  const [highlight, setHighlight] = useState(null)
  const [poster, setPoster] = useState(null)
  const list = category === 'all' ? BEERS : BEERS.filter((b) => b.category === category)

  return (
    <section id="cervejas" aria-labelledby="catalogo-title" className="bg-noise relative overflow-hidden bg-beer-dark pb-32 pt-28">
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <SectionHeading id="catalogo-title" eyebrow="Nossa alma" title="Catálogo" highlight="Hoog">
          Sete estilos artesanais, todos feitos só com água, malte, lúpulo e levedura. Escolha o formato, monte o pedido e finalize pelo WhatsApp.
        </SectionHeading>

        <Reveal>
          <BeerQuiz onResult={setHighlight} />
        </Reveal>

        <div role="group" aria-label="Filtrar cervejas por estilo" className="mb-24 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={category === c.id}
              onClick={() => setCategory(c.id)}
              className={`rounded-full border px-5 py-2.5 font-display text-sm font-medium uppercase tracking-widest transition ${category === c.id ? 'border-beer-gold bg-beer-gold text-black' : 'border-white/15 text-zinc-300 hover:border-beer-gold hover:text-beer-gold'}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <ul className="grid grid-cols-1 gap-x-8 gap-y-24 pt-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((beer, i) => (
            <li key={beer.id} className={list.length % 3 === 1 && i === list.length - 1 ? 'lg:col-start-2' : ''}>
              <Reveal delay={(i % 3) * 100} className="h-full">
                <BeerCard beer={beer} highlighted={highlight === beer.id} onPoster={setPoster} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>


      {poster && <PosterModal beer={poster} onClose={() => setPoster(null)} />}
    </section>
  )
}
