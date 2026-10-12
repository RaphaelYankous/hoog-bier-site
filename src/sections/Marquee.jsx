import { Fragment } from 'react'
import { TAPLIST } from '../config/site'
import VelocityMarquee from '../components/motion/VelocityMarquee'

const SERVICES = ['Delivery refrigerado', 'Chopeira instalada', 'Barris de 30 e 50 litros', 'Growlers', 'Long necks', 'Eventos e festas']

const Star = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={`mx-6 h-5 w-5 shrink-0 md:mx-10 md:h-7 md:w-7 ${className}`} aria-hidden="true">
    <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" fill="currentColor" />
  </svg>
)

// Duas faixas cruzadas. Reagem à velocidade do scroll.
export default function Marquee() {
  return (
    <section id="taplist" aria-label="Hoje nas torneiras" className="relative z-20 overflow-hidden bg-beer-dark py-16 md:py-24">
      <div className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 rotate-[5deg] border-y border-white/5 bg-zinc-900 py-3 text-zinc-400 md:py-4" aria-hidden="true">
        <VelocityMarquee speed={40} direction={-1} skew={false}>
          {SERVICES.concat(SERVICES).map((s, i) => (
            <Fragment key={i}>
              <span className="whitespace-nowrap font-display text-lg font-semibold uppercase tracking-[0.2em] md:text-2xl">{s}</span>
              <Star className="text-beer-gold" />
            </Fragment>
          ))}
        </VelocityMarquee>
      </div>

      <div className="relative -rotate-[3deg] bg-beer-gold py-4 text-beer-dark shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] md:py-6">
        <p className="sr-only">Hoje nas torneiras: {TAPLIST.join(', ')}.</p>
        <div aria-hidden="true">
        <VelocityMarquee speed={70}>
          <span className="whitespace-nowrap font-serif text-3xl italic md:text-5xl">Hoje nas torneiras</span>
          <Star />
          {TAPLIST.map((name) => (
            <Fragment key={name}>
              <span className="whitespace-nowrap font-display text-3xl font-bold uppercase tracking-tight md:text-6xl">{name}</span>
              <Star />
            </Fragment>
          ))}
        </VelocityMarquee>
        </div>
      </div>
    </section>
  )
}
