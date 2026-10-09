import { TAPLIST } from '../config/site'

function Track({ hidden }) {
  return (
    <div className="animate-marquee flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      <span className="font-display text-sm font-bold uppercase tracking-[0.25em]">🍺 Hoje nas torneiras</span>
      {TAPLIST.map((name) => (
        <span key={name} className="flex items-center gap-10 font-display text-sm font-bold uppercase tracking-[0.25em]">
          <span className="text-black/40">•</span>
          {name}
        </span>
      ))}
      <span className="text-black/40">•</span>
      <span className="font-display text-sm font-bold uppercase tracking-[0.25em]">Corra antes que acabe</span>
      <span className="text-black/40">•</span>
      <span className="font-display text-sm font-bold uppercase tracking-[0.25em]">Delivery rápido</span>
      <span className="text-black/40">•</span>
    </div>
  )
}

export default function Marquee() {
  return (
    <section id="taplist" aria-label="Cervejas disponíveis" className="marquee relative z-20 flex overflow-hidden border-y-4 border-black bg-beer-gold py-3 text-black">
      <Track />
      <Track hidden />
    </section>
  )
}
