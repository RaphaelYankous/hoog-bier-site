import { useRef } from 'react'
import { ArrowDown, ShoppingBag } from 'lucide-react'
import { SITE } from '../config/site'
import { gsap, SplitText, useGSAP, MOTION } from '../lib/gsap'
import { markAppReady, whenIntro } from '../lib/motion'
import Magnetic from '../components/motion/Magnetic'
import Bubbles from '../components/motion/Bubbles'

const STACK = '(min-width: 1024px) and (min-height: 640px)'
const BADGE = `PURO MALTE • DESDE ${SITE.foundedYear} • CONTAGEM-MG • `

function Badge() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full animate-spin-slow" aria-hidden="true">
      <defs>
        <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
      </defs>
      <circle cx="100" cy="100" r="99" fill="#0f0e0c" />
      <text fontFamily="Oswald Variable, Oswald, sans-serif" fontSize="17.5" fontWeight="600" letterSpacing="4.2" fill="#FFF4DC">
        <textPath href="#badge-circle">{BADGE}</textPath>
      </text>
    </svg>
  )
}

export default function Hero() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION, () => {
        const q = gsap.utils.selector(root)
        const split = SplitText.create(q('[data-split]'), { type: 'lines,words,chars', mask: 'lines', linesClass: 'split-line', aria: 'hidden' })

        // Estado inicial (antes do primeiro paint pós-hidratação; a tela de abertura cobre tudo).
        gsap.set(split.chars, { yPercent: 120, rotate: 8, transformOrigin: '0% 100%' })
        gsap.set(q('[data-arch]'), { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 32px 32px)' })
        gsap.set(q('[data-hero-img]'), { scale: 1.45 })
        gsap.set(q('[data-badge]'), { scale: 0, rotate: -120 })
        gsap.set(q('[data-fade]'), { y: 30, autoAlpha: 0 })

        const intro = gsap
          .timeline({ paused: true, defaults: { ease: 'expo.out' } })
          .to(split.chars, { yPercent: 0, rotate: 0, duration: 1.5, stagger: 0.03 }, 0)
          .to(q('[data-arch]'), { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 32px 32px)', duration: 1.8, ease: 'expo.inOut' }, 0.05)
          .to(q('[data-hero-img]'), { scale: 1, duration: 2.4 }, 0.15)
          .to(q('[data-badge]'), { scale: 1, rotate: 0, duration: 1.6, ease: 'back.out(1.6)' }, 0.8)
          .to(q('[data-fade]'), { y: 0, autoAlpha: 1, duration: 1.2, stagger: 0.08 }, 0.6)

        let alive = true
        whenIntro().then(() => alive && intro.play())


        // Mouse: brilho e arco seguem o cursor com atraso (profundidade).
        const glowX = gsap.quickTo(q('[data-glow]'), 'x', { duration: 1.6, ease: 'power3.out' })
        const glowY = gsap.quickTo(q('[data-glow]'), 'y', { duration: 1.6, ease: 'power3.out' })
        const tiltY = gsap.quickTo(q('[data-tilt]'), 'rotateY', { duration: 1.2, ease: 'power3.out' })
        const tiltX = gsap.quickTo(q('[data-tilt]'), 'rotateX', { duration: 1.2, ease: 'power3.out' })
        const onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          glowX(nx * 260)
          glowY(ny * 200)
          tiltY(nx * 10)
          tiltX(ny * -8)
        }
        const fine = window.matchMedia('(pointer: fine)').matches
        if (fine) window.addEventListener('pointermove', onMove, { passive: true })

        return () => {
          alive = false
          window.removeEventListener('pointermove', onMove)
          split.revert()
        }
      })
      mm.add({ stack: STACK, motion: MOTION }, ({ conditions }) => {
        if (!conditions.motion) return
        const q = gsap.utils.selector(root)
        if (conditions.stack) {
          // Desktop: o hero fica fixo, recua e escurece enquanto o catálogo sobe por cima dele como uma folha.
          gsap
            .timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: '+=100%', scrub: true, pin: true, pinSpacing: false } })
            .to(q('[data-hero-content]'), { scale: 0.88, yPercent: -4, ease: 'none' }, 0)
            .to(q('[data-parallax]'), { yPercent: -18, ease: 'none' }, 0)
            .to(q('[data-badge-wrap]'), { rotate: 160, ease: 'none' }, 0)
            .fromTo(q('[data-shade]'), { opacity: 0 }, { opacity: 0.8, ease: 'none' }, 0)
        } else {
          // Celular/telas baixas: o hero é mais alto que a tela (não dá para fixar), então só um parallax leve.
          gsap.to(q('[data-parallax]'), { yPercent: 12, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
        }
      })
      markAppReady()
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} id="inicio" aria-labelledby="hero-title" className="relative isolate min-h-[100svh] overflow-hidden bg-beer-dark">
      <div data-shade className="pointer-events-none absolute inset-0 z-20 bg-black opacity-0" aria-hidden="true" />
      <div data-glow className="pointer-events-none absolute left-[55%] top-[45%] -z-10 h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.2),transparent_58%)]" aria-hidden="true" />
      <Bubbles className="-z-10" />

      <div data-hero-content className="mx-auto flex min-h-[100svh] max-w-7xl flex-col px-4 pb-8 pt-28 md:pt-32">
        <div className="grid flex-1 items-center gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="text-center lg:col-span-7 lg:text-left">
            <p data-fade className="eyebrow mb-6 justify-center lg:justify-start">
              <span className="hidden sm:inline">Cervejaria artesanal ·&nbsp;</span>Contagem-MG · desde {SITE.foundedYear}
            </p>

            <h1 id="hero-title" aria-label="O melhor chopp puro malte para o seu bar, sua casa e o seu evento" className="font-display font-bold uppercase leading-[0.86] tracking-tight text-white">
              <span data-split className="block text-[clamp(2.9rem,min(12vw,9vh),5.8rem)] lg:whitespace-nowrap lg:text-[clamp(3rem,min(7.2vw,11.5vh),5.8rem)]">
                O melhor chopp
              </span>
              <span data-split className="block whitespace-nowrap font-serif text-[clamp(3.4rem,min(16vw,11vh),7.2rem)] font-normal normal-case italic leading-[0.95] tracking-normal text-beer-gold lg:text-[clamp(3.6rem,min(8.6vw,14vh),7.2rem)]">
                puro malte
              </span>
              <span data-fade className="mt-4 block font-sans text-lg font-medium normal-case tracking-normal text-zinc-300 sm:text-xl xl:text-2xl">
                para o seu bar, sua casa e o seu evento
              </span>
            </h1>

            <p data-fade className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-400 md:text-lg lg:mx-0">
              Barris, long necks e growlers direto da fábrica, com entrega refrigerada e chopeira instalada na sua festa. <strong className="font-semibold text-white">Sete estilos, nenhum atalho.</strong>
            </p>

            <div data-fade className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <Magnetic>
                <a href="#cervejas" className="btn-primary px-9 py-5 text-base">
                  <ShoppingBag size={20} aria-hidden="true" /> Montar meu pedido
                </a>
              </Magnetic>
              <Magnetic>
                <a href="#eventos" className="btn-ghost px-9 py-5 text-base">
                  Chopp para eventos
                </a>
              </Magnetic>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[19rem] [perspective:1200px] sm:max-w-sm lg:col-span-5 lg:max-w-none lg:pl-8">
            <div data-parallax>
              <div data-tilt className="relative [transform-style:preserve-3d]">
                <div data-arch className="relative overflow-hidden rounded-b-[32px] rounded-t-[999px] border border-white/10 shadow-[0_40px_120px_-30px_rgba(245,158,11,0.55)]">
                  <img
                    data-hero-img
                    src="/images/hero-glasses.webp"
                    alt="Copos de chopp Hoog Bier gelados com colarinho cremoso"
                    width="720"
                    height="903"
                    fetchPriority="high"
                    decoding="async"
                    className="aspect-[4/5] w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" aria-hidden="true" />
                </div>
                <p data-fade className="absolute -right-2 top-10 rotate-6 rounded-full bg-foam px-4 py-2 font-display text-base font-bold uppercase tracking-wide text-black shadow-xl md:-right-6 md:text-lg">
                  #VemDeHoog
                </p>
              </div>
            </div>
            <div data-badge-wrap className="absolute -bottom-8 -left-4 h-28 w-28 md:-left-10 md:h-36 md:w-36">
              <div data-badge className="relative h-full w-full">
                <Badge />
                <img src="/images/logo-hoog.png" alt="" width="240" height="160" className="absolute left-1/2 top-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        <div data-fade className="mt-10 flex items-center justify-between gap-6 border-t border-white/10 pt-5 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
          <span className="hidden sm:inline">Desde {SITE.foundedYear}</span>
          <a href="#cervejas" className="group mx-auto inline-flex items-center gap-3 transition hover:text-beer-gold sm:mx-0">
            Role e conheça as sete
            <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-white/20 transition group-hover:border-beer-gold">
              <ArrowDown size={14} className="animate-bounce motion-reduce:animate-none" aria-hidden="true" />
            </span>
          </a>
          <span className="hidden sm:inline">Água · malte · lúpulo · levedura</span>
        </div>
      </div>

    </section>
  )
}
