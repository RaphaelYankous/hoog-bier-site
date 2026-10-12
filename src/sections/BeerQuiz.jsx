import { useRef, useState } from 'react'
import { ArrowRight, RotateCcw, Sparkles } from 'lucide-react'
import { QUIZ, pickBeer } from '../data/quiz'
import { beerById } from '../data/beers'
import { track } from '../lib/analytics'
import { gsap, useGSAP } from '../lib/gsap'
import { reducedMotion } from '../lib/motion'

export default function BeerQuiz({ onResult }) {
  const root = useRef(null)
  const [answers, setAnswers] = useState([])
  const step = answers.length
  const done = step >= QUIZ.length
  const result = done ? beerById(pickBeer(answers)) : null

  // Cada pergunta (e o resultado) entra com stagger; a garrafa do resultado "cai" no lugar.
  useGSAP(
    () => {
      if (reducedMotion() || step === 0) return
      const q = gsap.utils.selector(root)
      gsap.from(q('[data-q]'), { y: 24, autoAlpha: 0, stagger: 0.06, duration: 0.8 })
      if (done) gsap.from(q('[data-result-bottle]'), { yPercent: -60, rotate: -20, autoAlpha: 0, duration: 1.4, ease: 'bounce.out' })
    },
    { dependencies: [step], scope: root },
  )

  const pick = (opt) => {
    const next = [...answers, opt]
    setAnswers(next)
    if (next.length === QUIZ.length) {
      const id = pickBeer(next)
      track('quiz_result', { beer: id })
      onResult?.(id)
    }
  }

  return (
    <div ref={root} className="relative mx-auto mt-28 max-w-4xl overflow-hidden rounded-[2rem] border border-beer-gold/20 bg-gradient-to-br from-beer-gold/[0.12] via-zinc-950 to-zinc-950 p-6 md:p-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-beer-gold text-black">
            <Sparkles size={20} aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-display text-2xl font-bold uppercase text-white md:text-3xl">
              Qual Hoog é a <span className="font-serif font-normal normal-case italic text-beer-gold">sua?</span>
            </h3>
            <p className="text-sm text-zinc-400">3 perguntas rápidas e a gente indica a cerveja ideal.</p>
          </div>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-40" aria-hidden="true">
          {QUIZ.map((_, i) => (
            <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <span className={`block h-full origin-left bg-beer-gold transition-transform duration-700 ease-expo ${i < step || done ? 'scale-x-100' : i === step ? 'scale-x-50' : 'scale-x-0'}`} />
            </span>
          ))}
        </div>
      </div>

      {!done ? (
        <div key={step}>
          <p data-q className="mb-5 font-display text-xl font-medium uppercase tracking-wide text-white md:text-2xl" aria-live="polite">
            <span className="mr-2 text-beer-gold">{step + 1}/{QUIZ.length}</span> {QUIZ[step].q}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {QUIZ[step].options.map((opt) => (
              <button
                key={opt.label}
                data-q
                type="button"
                onClick={() => pick(opt)}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-left text-sm font-medium text-zinc-200 transition duration-300 hover:border-beer-gold hover:bg-beer-gold hover:text-black"
              >
                {opt.label}
                <ArrowRight size={16} className="shrink-0 -translate-x-2 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:text-left" role="status">
          <img data-result-bottle src={`/images/beers/${result.id}.webp`} alt="" width="100" height="290" className="h-48 w-auto drop-shadow-[0_25px_25px_rgba(0,0,0,0.6)]" />
          <div className="flex-1">
            <p data-q className="text-xs font-bold uppercase tracking-[0.3em] text-beer-gold">
              Sua cerveja ideal
            </p>
            <p data-q className="font-display text-5xl font-bold uppercase leading-none text-white">
              {result.name}
            </p>
            <p data-q className="mb-6 mt-2 font-serif text-xl italic text-zinc-300">
              {result.style} · {result.tagline}
            </p>
            <div data-q className="flex flex-wrap justify-center gap-3 sm:justify-start">
              <a href={`#cerveja-${result.id}`} className="btn-primary !px-6 !py-3 !text-xs">
                Ver no palco <ArrowRight size={14} aria-hidden="true" />
              </a>
              <button type="button" onClick={() => setAnswers([])} className="btn-ghost !px-6 !py-3 !text-xs">
                <RotateCcw size={14} aria-hidden="true" /> Refazer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
