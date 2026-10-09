import { useState } from 'react'
import { ArrowRight, RotateCcw, Sparkles } from 'lucide-react'
import { QUIZ, pickBeer } from '../data/quiz'
import { beerById } from '../data/beers'
import { track } from '../lib/analytics'

export default function BeerQuiz({ onResult }) {
  const [answers, setAnswers] = useState([])
  const step = answers.length
  const done = step >= QUIZ.length
  const result = done ? beerById(pickBeer(answers)) : null

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
    <div className="mx-auto mb-20 max-w-3xl rounded-3xl border border-beer-gold/20 bg-gradient-to-br from-beer-gold/10 via-transparent to-transparent p-6 md:p-10">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-beer-gold text-black">
          <Sparkles size={20} aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-display text-2xl font-bold uppercase text-white">Qual Hoog é a sua?</h3>
          <p className="text-sm text-zinc-400">3 perguntas rápidas e a gente indica a cerveja ideal.</p>
        </div>
      </div>

      {!done ? (
        <div key={step} className="animate-fade-in">
          <div className="mb-4 flex items-center gap-2" aria-hidden="true">
            {QUIZ.map((_, i) => (
              <span key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-beer-gold' : 'bg-white/10'}`} />
            ))}
          </div>
          <p className="mb-4 text-lg font-semibold text-white" aria-live="polite">
            {step + 1}. {QUIZ[step].q}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {QUIZ[step].options.map((opt) => (
              <button key={opt.label} type="button" onClick={() => pick(opt)} className="rounded-xl border border-white/10 bg-black/30 px-4 py-4 text-left text-sm font-medium text-zinc-200 transition hover:border-beer-gold hover:bg-beer-gold/10 hover:text-white">
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex animate-fade-in flex-col items-center gap-6 text-center sm:flex-row sm:text-left" role="status">
          <img src={`/images/beers/${result.id}.webp`} alt="" width="100" height="290" className="h-40 w-auto drop-shadow-2xl" />
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-beer-gold">Sua cerveja ideal</p>
            <p className="font-display text-4xl font-bold uppercase text-white">{result.name}</p>
            <p className="mb-4 mt-1 text-sm text-zinc-400">{result.style} · {result.tagline}</p>
            <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
              <a href={`#cerveja-${result.id}`} className="btn-primary !px-5 !py-3 !text-xs">
                Ver no catálogo <ArrowRight size={14} />
              </a>
              <button type="button" onClick={() => setAnswers([])} className="btn-ghost !px-5 !py-3 !text-xs">
                <RotateCcw size={14} /> Refazer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
