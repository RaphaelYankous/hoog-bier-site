import { Plus } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { FAQS } from '../data/faqs'
import { MSG, waLink } from '../lib/whatsapp'

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative bg-beer-dark py-28 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading id="faq-title" eyebrow="Tira-dúvidas" title="Perguntas" highlight="frequentes" align="left" className="!mb-8" />
            <Reveal delay={200} y={20}>
              <p className="mb-3 text-sm text-zinc-400">Ainda tem dúvidas?</p>
              <a href={waLink(MSG.generic)} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                Fale com nosso Mestre Cervejeiro
              </a>
            </Reveal>
          </div>
        </div>

        <div className="border-t border-white/10 lg:col-span-7">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 60} y={30}>
              <details className="acc group border-b border-white/10">
                <summary className="flex cursor-pointer select-none items-center gap-5 py-6 text-left md:py-8">
                  <span className="font-display text-sm font-bold tracking-[0.2em] text-zinc-600 transition-colors group-open:text-beer-gold">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1 font-display text-xl font-medium uppercase leading-tight tracking-wide text-white transition-colors group-hover:text-beer-gold md:text-2xl">{f.q}</span>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 transition-all duration-500 ease-expo group-open:rotate-[135deg] group-open:border-beer-gold group-open:bg-beer-gold group-open:text-black" aria-hidden="true">
                    <Plus size={18} />
                  </span>
                </summary>
                <p className="max-w-xl pb-8 pl-11 text-base leading-relaxed text-zinc-400">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
