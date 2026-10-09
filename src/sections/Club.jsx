import { ArrowRight, Crown } from 'lucide-react'
import Reveal from '../components/Reveal'
import { MSG, waLink } from '../lib/whatsapp'
import { track } from '../lib/analytics'

export default function Club() {
  return (
    <section aria-labelledby="club-title" className="bg-gradient-to-r from-beer-gold to-yellow-500 py-20 text-black">
      <Reveal>
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-8 px-4 md:flex-row">
          <div className="flex-1 text-center md:text-left">
            <h2 id="club-title" className="mb-3 flex items-center justify-center gap-3 font-display text-4xl font-bold uppercase tracking-tight md:justify-start md:text-5xl">
              <Crown className="rounded-full border-2 border-black p-1.5" size={40} aria-hidden="true" /> Clube Hoog VIP
            </h2>
            <p className="font-medium text-black/80">Entre na nossa lista exclusiva no WhatsApp e receba promoções relâmpago, convites para eventos e lançamentos antes de todo mundo.</p>
          </div>
          <a href={waLink(MSG.club)} target="_blank" rel="noopener noreferrer" onClick={() => track('club_join')} className="inline-flex items-center gap-2 rounded-xl bg-black px-8 py-4 font-display text-lg font-semibold uppercase tracking-widest text-beer-gold shadow-xl transition hover:-translate-y-1 hover:text-white">
            Quero entrar grátis <ArrowRight size={18} />
          </a>
        </div>
      </Reveal>
    </section>
  )
}
