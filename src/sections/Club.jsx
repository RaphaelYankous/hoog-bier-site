import { useRef } from 'react'
import { ArrowUpRight, Crown } from 'lucide-react'
import { MSG, waLink } from '../lib/whatsapp'
import { track } from '../lib/analytics'
import { gsap } from '../lib/gsap'
import { useMotion } from '../hooks/useMotion'
import Liquid from '../components/motion/Liquid'
import Magnetic from '../components/motion/Magnetic'
import SplitReveal from '../components/motion/SplitReveal'

// O botão é um "copo": a cerveja sobe dentro dele conforme a seção entra na tela e termina de encher no hover.
export default function Club() {
  const root = useRef(null)

  useMotion(
    () => {
      gsap.fromTo('[data-club-liquid]', { yPercent: 100 }, { yPercent: 24, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'center 55%', scrub: true } })
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="club-title" className="relative isolate overflow-hidden border-t border-white/5 bg-beer-dark py-24 md:py-32">
      <div className="pointer-events-none absolute -right-40 top-1/2 -z-10 h-[36rem] w-[36rem] -translate-y-1/2 rounded-full bg-beer-gold/10 blur-[140px]" aria-hidden="true" />
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-14 px-4 text-center lg:flex-row lg:justify-between lg:text-left">
        <div className="max-w-3xl">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-beer-gold/30 bg-beer-gold/10 px-4 py-2 font-display text-xs font-semibold uppercase tracking-[0.3em] text-beer-gold">
            <Crown size={14} aria-hidden="true" /> Grátis no WhatsApp
          </p>
          <SplitReveal id="club-title" type="chars" className="font-display text-[clamp(3.4rem,9vw,8rem)] font-bold uppercase leading-[0.85] tracking-tight text-white">
            Clube Hoog <span className="font-serif font-normal normal-case italic text-beer-gold">VIP</span>
          </SplitReveal>
          <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400 lg:mx-0">Entre na nossa lista exclusiva e receba promoções relâmpago, convites para eventos e lançamentos antes de todo mundo.</p>
        </div>

        <Magnetic strength={0.4}>
          <a
            href={waLink(MSG.club)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('club_join')}
            className="group relative isolate grid h-48 w-48 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-beer-gold/70 text-center font-display text-lg font-semibold uppercase leading-tight tracking-widest text-beer-dark shadow-[0_0_80px_-20px_rgba(245,158,11,0.6)] md:h-60 md:w-60 md:text-xl"
          >
            <span data-club-liquid className="absolute inset-0 -z-10">
              <span className="absolute inset-0 transition-transform duration-1000 ease-expo group-hover:-translate-y-[24%]">
                <Liquid waveClassName="h-5 md:h-6" />
              </span>
            </span>
            <span className="relative flex flex-col items-center gap-2">
              <ArrowUpRight size={28} className="transition-transform duration-500 ease-expo group-hover:rotate-45" aria-hidden="true" />
              Quero entrar
            </span>
          </a>
        </Magnetic>
      </div>
    </section>
  )
}
