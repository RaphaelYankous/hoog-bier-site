import { HelpCircle, Minus, Plus } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { FAQS } from '../data/faqs'
import { MSG, waLink } from '../lib/whatsapp'

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative overflow-hidden bg-beer-dark py-28">
      <div className="relative z-10 mx-auto max-w-4xl px-4">
        <SectionHeading id="faq-title" eyebrow="Tira-dúvidas" title="Perguntas" highlight="frequentes" />
        <div className="space-y-4">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <details className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-beer-gold/30 open:border-beer-gold/40">
                <summary className="flex cursor-pointer select-none items-center justify-between gap-4 p-5 font-semibold text-white md:p-6">
                  <span className="flex items-center gap-3">
                    <HelpCircle className="shrink-0 text-beer-gold" size={20} aria-hidden="true" />
                    {f.q}
                  </span>
                  <span className="rounded-full bg-white/10 p-1 transition-colors group-open:bg-beer-gold group-open:text-black" aria-hidden="true">
                    <Plus size={16} className="group-open:hidden" />
                    <Minus size={16} className="hidden group-open:block" />
                  </span>
                </summary>
                <div className="border-t border-white/5 bg-black/20 px-5 pb-6 pt-4 text-sm leading-relaxed text-zinc-400 md:px-6">{f.a}</div>
              </details>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="mb-3 text-sm text-zinc-400">Ainda tem dúvidas?</p>
          <a href={waLink(MSG.generic)} target="_blank" rel="noopener noreferrer" className="font-bold text-beer-gold underline underline-offset-4 transition hover:text-white">
            Fale com nosso Mestre Cervejeiro no WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
