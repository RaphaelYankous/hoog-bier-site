import { CheckCircle, Clock, Truck, Thermometer, Activity, Beer, Package } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'

const FEATURES = [
  { icon: CheckCircle, title: 'Puro malte', desc: 'Sem milho ou arroz. Apenas insumos nobres importados.' },
  { icon: Clock, title: 'Maturação lenta', desc: 'Respeitamos o tempo da natureza. Sem aceleradores químicos.' },
  { icon: Truck, title: 'Logística própria', desc: 'Entrega rápida e refrigerada para toda a região de Contagem.' },
]

const STEPS = [
  { icon: Package, title: 'Moagem', desc: 'Maltes selecionados' },
  { icon: Thermometer, title: 'Mostura', desc: 'Controle de temperatura' },
  { icon: Activity, title: 'Fermentação', desc: 'Leveduras trabalhando' },
  { icon: Beer, title: 'Maturação', desc: 'Descanso a frio' },
]

export default function Features() {
  return (
    <>
      <section aria-labelledby="diferenciais-title" className="bg-noise relative z-20 border-b border-white/5 bg-beer-dark py-24">
        <div className="mx-auto max-w-7xl px-4">
          <h2 id="diferenciais-title" className="sr-only">
            Diferenciais da Hoog Bier
          </h2>
          <ul className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <li key={f.title}>
                <Reveal delay={i * 120} className="h-full">
                  <div className="card-hover group flex h-full flex-col items-center rounded-3xl border border-white/5 bg-gradient-to-b from-zinc-900 to-transparent p-10 text-center">
                    <div className="mb-6 rounded-2xl bg-white/5 p-5 shadow-lg transition-all duration-500 group-hover:bg-beer-gold group-hover:text-black">
                      <f.icon className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <h3 className="mb-3 font-display text-2xl font-semibold uppercase tracking-wider text-white">{f.title}</h3>
                    <p className="text-sm leading-relaxed text-zinc-400">{f.desc}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="processo-title" className="border-b border-white/5 bg-zinc-950 py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading id="processo-title" eyebrow="Processo artesanal" title="Do grão" highlight="ao copo" />
          <ol className="relative grid grid-cols-2 gap-10 md:grid-cols-4">
            <div className="absolute left-[12.5%] right-[12.5%] top-10 hidden h-px bg-gradient-to-r from-transparent via-beer-gold/40 to-transparent md:block" aria-hidden="true" />
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <Reveal delay={i * 120}>
                  <div className="group relative text-center">
                    <div className="relative mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full border border-beer-gold/30 bg-black text-beer-gold transition-all duration-300 group-hover:scale-110 group-hover:bg-beer-gold group-hover:text-black">
                      <s.icon size={30} aria-hidden="true" />
                      <span className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-beer-gold font-display text-sm font-bold text-black">{i + 1}</span>
                    </div>
                    <h3 className="font-display text-xl font-semibold uppercase tracking-wide text-white">{s.title}</h3>
                    <p className="mt-1 text-sm text-zinc-400">{s.desc}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
