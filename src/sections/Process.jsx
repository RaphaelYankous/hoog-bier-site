import { useRef } from 'react'
import { Activity, ArrowRight, Beer, Package, Thermometer } from 'lucide-react'
import { gsap, DESKTOP } from '../lib/gsap'

const MOBILE = '(max-width: 1023px) and (prefers-reduced-motion: no-preference)'
import { useMotion } from '../hooks/useMotion'
import Reveal from '../components/Reveal'

const STEPS = [
  { icon: Package, title: 'Moagem', tag: 'Maltes selecionados', desc: 'Os maltes são moídos para liberar o amido do grão, preservando a casca que vai filtrar o mosto.' },
  { icon: Thermometer, title: 'Mostura', tag: 'Controle de temperatura', desc: 'Malte e água quente em degraus de temperatura controlados: é aqui que o amido vira açúcar.' },
  { icon: Activity, title: 'Fermentação', tag: 'Leveduras trabalhando', desc: 'A levedura transforma açúcar em álcool e gás carbônico — e cria os aromas de cada estilo.' },
  { icon: Beer, title: 'Maturação', tag: 'Descanso a frio', desc: 'Tempo, frio e paciência, sem aceleradores químicos. O sabor se arredonda e a cerveja fica pronta.' },
]

export default function Process() {
  const root = useRef(null)
  const track = useRef(null)

  // Desktop: a seção fica fixa e o trilho corre na horizontal conforme o scroll vertical.
  useMotion(
    () => {
      const el = track.current
      const distance = () => el.scrollWidth - window.innerWidth
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      gsap.to('[data-progress]', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: true } })
      gsap.utils.toArray('[data-step]', el).forEach((step, i) => {
        // O 1º passo já está na tela antes do trilho andar: entra pelo scroll vertical.
        const trigger = i === 0 ? { trigger: root.current, start: 'top 65%' } : { trigger: step, containerAnimation: tween, start: 'left 85%' }
        gsap.from(step.querySelectorAll('[data-step-in]'), { y: 80, autoAlpha: 0, stagger: 0.08, scrollTrigger: { ...trigger, toggleActions: 'play none none reverse' } })
        gsap.fromTo(step.querySelector('[data-num]'), { xPercent: 30 }, { xPercent: -30, ease: 'none', scrollTrigger: { trigger: step, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } })
      })
    },
    { scope: root, query: DESKTOP },
  )

  return (
    <section ref={root} aria-labelledby="processo-title" className="relative overflow-hidden bg-beer-dark lg:h-[100svh]">
      <div ref={track} className="flex flex-col gap-6 px-4 py-24 lg:h-full lg:w-max lg:flex-row lg:items-stretch lg:gap-0 lg:p-0">
        <div className="flex shrink-0 flex-col justify-center lg:w-[46vw] lg:pl-[max(2rem,calc((100vw-80rem)/2+1rem))] lg:pr-16">
          <Reveal>
            <p className="eyebrow mb-6">Processo artesanal</p>
            <h2 id="processo-title" className="font-display text-[clamp(3.2rem,7vw,7rem)] font-bold uppercase leading-[0.88] tracking-tight text-white">
              Do grão
              <span className="block font-serif font-normal normal-case italic text-beer-gold">ao copo</span>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-zinc-400">Quatro etapas, nenhum atalho. É o mesmo processo há séculos — e a gente não vê motivo para apressar.</p>
            <p className="mt-10 hidden items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 lg:flex">
              Continue rolando <ArrowRight size={14} aria-hidden="true" />
            </p>
          </Reveal>
        </div>

        <ol className="contents">
          {STEPS.map((s, i) => (
            <li key={s.title} data-step className="relative shrink-0 lg:flex lg:h-full lg:w-[38vw] lg:items-center lg:border-l lg:border-white/10 lg:px-12">
              <Reveal query={MOBILE} className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-black p-8 lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-none lg:p-0">
                <span data-num className="text-outline pointer-events-none absolute -top-6 right-2 font-display text-[9rem] font-bold leading-none text-beer-gold/30 lg:-top-40 lg:right-auto lg:left-0 lg:text-[16rem]" aria-hidden="true">
                  0{i + 1}
                </span>
                <div data-step-in className="relative mb-8 grid h-16 w-16 place-items-center rounded-full bg-beer-gold text-black">
                  <s.icon size={28} aria-hidden="true" />
                </div>
                <p data-step-in className="relative mb-3 text-xs font-bold uppercase tracking-[0.3em] text-beer-gold">
                  Etapa {i + 1} · {s.tag}
                </p>
                <h3 data-step-in className="relative font-display text-5xl font-bold uppercase tracking-tight text-white lg:text-7xl">
                  {s.title}
                </h3>
                <p data-step-in className="relative mt-5 max-w-sm text-base leading-relaxed text-zinc-400">
                  {s.desc}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="hidden shrink-0 items-center lg:flex lg:w-[30vw] lg:px-12">
          <a href="#cervejas" className="group block" data-cursor="Ver">
            <span className="block font-serif text-6xl italic text-beer-gold transition-transform duration-700 ease-expo group-hover:translate-x-3">Pronto.</span>
            <span className="mt-2 flex items-center gap-3 font-display text-2xl font-bold uppercase tracking-tight text-white">
              Conheça as sete <ArrowRight className="transition-transform duration-700 ease-expo group-hover:translate-x-2" aria-hidden="true" />
            </span>
          </a>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 hidden h-1 bg-white/5 lg:block" aria-hidden="true">
        <div data-progress className="h-full origin-left scale-x-0 bg-beer-gold" />
      </div>
    </section>
  )
}
