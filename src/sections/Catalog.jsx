import { useCallback, useEffect, useState } from 'react'
import SplitReveal from '../components/motion/SplitReveal'
import PosterModal from '../components/PosterModal'
import Reveal from '../components/Reveal'
import BeerStage from './BeerStage'
import BeerQuiz from './BeerQuiz'
import { BEERS } from '../data/beers'
import { scrollToTarget } from '../lib/motion'

const idFromHash = (hash) => {
  const m = /^#cerveja-(.+)$/.exec(hash || '')
  return m && BEERS.some((b) => b.id === m[1]) ? m[1] : null
}

export default function Catalog() {
  const [active, setActive] = useState(BEERS[0].id)
  const [poster, setPoster] = useState(null)

  const show = useCallback((id) => {
    setActive(id)
    scrollToTarget('#palco')
  }, [])

  // Links "#cerveja-xxx" (harmonizações, quiz, URL compartilhada) abrem a cerveja no palco.
  useEffect(() => {
    const fromUrl = idFromHash(window.location.hash)
    if (fromUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- deep link lido após montar (SSR-safe)
      setActive(fromUrl)
    }
    const onClick = (e) => {
      const a = e.target instanceof Element && e.target.closest('a[href^="#cerveja-"]')
      const id = a && idFromHash(a.getAttribute('href'))
      if (!id) return
      e.preventDefault()
      e.stopPropagation()
      show(id)
      history.replaceState(null, '', `#cerveja-${id}`)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [show])

  return (
    <section id="cervejas" aria-labelledby="catalogo-title" className="relative z-10 overflow-hidden rounded-t-[2.5rem] border-t border-white/10 bg-[#13110e] pb-32 pt-24 shadow-[0_-40px_100px_rgba(0,0,0,0.7)] md:rounded-t-[4rem] md:pt-32">
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        {/* Cabeçalho compacto: o palco das cervejas precisa aparecer logo depois do hero. */}
        <div className="mb-12 grid items-end gap-6 md:mb-14 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <Reveal y={20}>
              <p className="eyebrow mb-5">Nossas cervejas</p>
            </Reveal>
            <SplitReveal id="catalogo-title" className="font-display text-[clamp(2.6rem,5.2vw,4.75rem)] font-bold uppercase leading-[0.92] tracking-tight text-white">
              Sete estilos, <span className="font-serif font-normal normal-case italic text-beer-gold">nenhum atalho</span>
            </SplitReveal>
          </div>
          <Reveal delay={150} y={24}>
            <p className="max-w-md text-base leading-relaxed text-zinc-400 md:text-lg">Todos feitos só com água, malte, lúpulo e levedura. Escolha a cerveja e o formato, monte o pedido e finalize pelo WhatsApp.</p>
          </Reveal>
        </div>

        <div id="palco">
          <BeerStage activeId={active} onSelect={setActive} onPoster={setPoster} />
        </div>

        <Reveal>
          <BeerQuiz onResult={setActive} />
        </Reveal>
      </div>

      {poster && <PosterModal beer={poster} onClose={() => setPoster(null)} />}
    </section>
  )
}
