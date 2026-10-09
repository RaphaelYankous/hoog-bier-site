import { ChevronDown, ShoppingBag, Star, Wheat, Droplets, Flower2 } from 'lucide-react'
import { SITE } from '../config/site'

const PILLS = [
  { icon: Wheat, text: 'Puro malte' },
  { icon: Flower2, text: 'Lúpulo nobre' },
  { icon: Droplets, text: 'Água, malte, lúpulo e levedura' },
]

export default function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-16 pt-32 md:pt-36">
      <div className="absolute inset-0 -z-10 bg-beer-dark" />
      <div className="absolute -right-40 top-10 -z-10 h-[620px] w-[620px] rounded-full bg-beer-gold/20 blur-[140px]" aria-hidden="true" />
      <div className="absolute -left-40 bottom-0 -z-10 h-[420px] w-[420px] rounded-full bg-orange-700/20 blur-[140px]" aria-hidden="true" />
      <div className="bg-noise absolute inset-0 -z-10 opacity-60" aria-hidden="true" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="text-center lg:text-left">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-beer-gold/30 bg-black/40 px-5 py-2 backdrop-blur-md">
            <Star className="h-3 w-3 animate-pulse fill-beer-gold text-beer-gold motion-reduce:animate-none" aria-hidden="true" />
            <span className="font-display text-xs font-medium uppercase tracking-[0.25em] text-zinc-200 md:text-sm">Desde {SITE.foundedYear} em Contagem-MG</span>
          </div>

          <h1 id="hero-title" className="font-display text-[3.4rem] font-bold uppercase leading-[0.92] tracking-tight text-white sm:text-7xl xl:text-[6.5rem]">
            O melhor chopp
            <span className="text-gradient-gold block">puro malte</span>
            <span className="mt-4 block font-sans text-xl font-semibold normal-case italic tracking-normal text-zinc-300 sm:text-3xl">para o seu bar, sua casa e o seu evento</span>
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-zinc-400 md:text-lg lg:mx-0">
            Barris, long necks e growlers direto da fábrica, com entrega refrigerada e chopeira instalada na sua festa. <strong className="text-white">Sete estilos, nenhum atalho.</strong>
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            <a href="#cervejas" className="btn-primary px-10 py-5 text-base">
              <ShoppingBag size={20} /> Montar meu pedido
            </a>
            <a href="#eventos" className="btn-ghost px-10 py-5 text-base">
              Chopp para eventos
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap justify-center gap-3 lg:justify-start">
            {PILLS.map(({ icon: Icon, text }) => (
              <li key={text} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-300">
                <Icon size={14} className="text-beer-gold" aria-hidden="true" /> {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="absolute -inset-4 -z-10 rotate-3 rounded-[2.5rem] bg-gradient-to-br from-beer-gold/40 to-transparent blur-2xl" aria-hidden="true" />
          <div className="animate-float-slow overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_30px_80px_-20px_rgba(245,158,11,0.45)] motion-reduce:animate-none">
            <img
              src="/images/hero-glasses.webp"
              alt="Copos de chopp Hoog Bier gelados com colarinho cremoso"
              width="720"
              height="903"
              fetchPriority="high"
              decoding="async"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 -left-3 rotate-[-4deg] rounded-2xl bg-white px-5 py-3 font-display text-xl font-bold uppercase tracking-wide text-black shadow-xl md:-left-8 md:text-2xl">
            #VemDeHoog
          </div>
        </div>
      </div>

      <a href="#taplist" aria-label="Rolar para baixo" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-white/40 transition hover:text-white md:block">
        <ChevronDown size={32} className="animate-bounce motion-reduce:animate-none" />
      </a>
    </section>
  )
}
