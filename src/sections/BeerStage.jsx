import { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, FileText, Plus, Utensils } from 'lucide-react'
import FlavorRadar from '../components/FlavorRadar'
import Counter from '../components/motion/Counter'
import { BEERS, CATEGORIES, FORMATS } from '../data/beers'
import { useCart } from '../hooks/useCart'
import { track } from '../lib/analytics'
import { flyToCart } from '../lib/flyToCart'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { reducedMotion } from '../lib/motion'

const shortName = (b) => b.name.replace(/^Hoog /, '')
const categoryLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label

function Spec({ label, children }) {
  return (
    <div className="flex flex-col gap-1 px-3 py-4 first:pl-0">
      <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{label}</dt>
      <dd className="font-display text-2xl font-semibold text-white md:text-3xl">{children}</dd>
    </div>
  )
}

/**
 * Palco: uma cerveja por vez, em destaque. Trocar de estilo anima a garrafa, o nome gigante
 * ao fundo, a cor ambiente, os números e o radar de sabor. Teclado (setas), swipe e trilho de abas.
 */
export default function BeerStage({ activeId, onSelect, onPoster }) {
  const root = useRef(null)
  const bottle = useRef(null)
  const dir = useRef(1)
  const shownId = useRef(activeId)
  const swiped = useRef(false)
  const swipe = useRef(null)
  const { add } = useCart()
  const [formatPref, setFormatPref] = useState('longNeck')
  const [added, setAdded] = useState(false)

  const index = BEERS.findIndex((b) => b.id === activeId)
  const beer = BEERS[index]
  const available = FORMATS.filter((f) => beer.formats[f.id])
  const format = beer.formats[formatPref] ? formatPref : available[0].id

  const go = (i) => {
    const next = (i + BEERS.length) % BEERS.length
    dir.current = next > index || (index === BEERS.length - 1 && next === 0) ? 1 : -1
    onSelect(BEERS[next].id)
  }

  // Entrada a cada troca de cerveja.
  useGSAP(
    () => {
      if (shownId.current === activeId) return
      shownId.current = activeId
      if (reducedMotion()) return
      const q = gsap.utils.selector(root)
      const d = dir.current
      const split = SplitText.create(q('[data-bigname]'), { type: 'chars', aria: 'hidden' })
      gsap
        .timeline({ defaults: { ease: 'expo.out', overwrite: 'auto' } })
        .fromTo(bottle.current, { xPercent: 40 * d, yPercent: 8, rotate: 14 * d, autoAlpha: 0 }, { xPercent: 0, yPercent: 0, rotate: 0, autoAlpha: 1, duration: 1.3 }, 0)
        .fromTo(split.chars, { yPercent: 100 * d, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.1, stagger: 0.035 * d }, 0)
        .fromTo(q('[data-swap]'), { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.05 }, 0.08)
        .fromTo(q('[data-shadow]'), { scaleX: 0.4, autoAlpha: 0 }, { scaleX: 1, autoAlpha: 1, duration: 1.2 }, 0.1)
      return () => split.revert()
    },
    { dependencies: [activeId], scope: root },
  )

  const addToCart = () => {
    add(beer.id, format, 1)
    track('add_to_cart', { item: beer.name, format })
    flyToCart(bottle.current)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  const onKeyRail = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const next = (index + (e.key === 'ArrowRight' ? 1 : -1) + BEERS.length) % BEERS.length
    go(next)
    requestAnimationFrame(() => document.getElementById(`tab-${BEERS[next].id}`)?.focus())
  }

  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse') swipe.current = e.clientX
  }
  const onPointerUp = (e) => {
    if (swipe.current == null) return
    const dx = e.clientX - swipe.current
    swipe.current = null
    swiped.current = Math.abs(dx) > 50
    if (swiped.current) go(index + (dx < 0 ? 1 : -1))
  }

  // Nome gigante: uma palavra por linha, dimensionado pela palavra mais longa para caber na coluna da garrafa.
  const nameWords = shortName(beer).split(' ')
  const nameWidth = Math.max(...nameWords.map((w) => w.length)) * 0.6

  return (
    <div ref={root} className="relative">
      {BEERS.map((b) => (
        <span key={b.id} id={`cerveja-${b.id}`} className="absolute -top-24" aria-hidden="true" />
      ))}

      {/* Trilho de abas */}
      <div role="tablist" aria-label="Escolha a cerveja" onKeyDown={onKeyRail} className="-mx-4 mb-8 flex snap-x gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:px-0 xl:justify-start">
        {BEERS.map((b) => {
          const on = b.id === activeId
          return (
            <button
              key={b.id}
              id={`tab-${b.id}`}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls="beer-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => b.id !== activeId && go(BEERS.indexOf(b))}
              className={`group relative flex shrink-0 snap-start items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-4 transition-colors duration-500 ${on ? 'border-beer-gold bg-beer-gold/10 text-white' : 'border-white/10 text-zinc-400 hover:border-white/30 hover:text-white'}`}
            >
              <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-white/5">
                <img src={`/images/beers/${b.id}.webp`} alt="" width="40" height="116" loading="lazy" className={`h-9 w-auto transition-transform duration-500 ease-expo ${on ? 'scale-110' : 'group-hover:-translate-y-0.5'}`} />
              </span>
              <span className="whitespace-nowrap font-display text-sm font-medium uppercase tracking-wider">{shortName(b)}</span>
            </button>
          )
        })}
      </div>

      <div id="beer-panel" role="tabpanel" aria-labelledby={`tab-${beer.id}`} className="relative grid items-center gap-10 lg:min-h-[min(780px,86svh)] lg:grid-cols-12 lg:gap-8">
        {/* Ambiente: cor da cerveja */}
        <div className="pointer-events-none absolute left-1/2 top-[38%] -z-10 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[120px] transition-[background-color] duration-1000 lg:left-[28%] lg:top-1/2" style={{ backgroundColor: beer.glow }} aria-hidden="true" />
        <div className="relative flex touch-pan-y select-none flex-col items-center lg:col-span-5" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => (swipe.current = null)}>
          <p
            data-bigname
            key={beer.id}
            className="text-outline pointer-events-none absolute left-1/2 top-[42%] -z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center font-display text-[length:min(15rem,calc(86vw/var(--w)))] font-bold uppercase leading-[0.85] text-white/[0.12] lg:left-auto lg:right-0 lg:translate-x-0 lg:text-right lg:text-[length:min(15rem,calc(38vw/var(--w)))]"
            style={{ '--w': nameWidth }}
            aria-hidden="true"
          >
            {nameWords.map((w) => (
              <span key={w} className="block">
                {w}
              </span>
            ))}
          </p>
          <div className="relative flex h-[22rem] items-end justify-center sm:h-[28rem] lg:h-[34rem]" data-cursor="Ficha" onClick={() => (swiped.current ? (swiped.current = false) : onPoster(beer))} role="presentation">
            <img
              ref={bottle}
              data-bottle
              src={`/images/beers/${beer.id}.webp`}
              alt={`Garrafa da cerveja ${beer.name}`}
              width="263"
              height="760"
              decoding="async"
              className="relative z-10 h-full w-auto cursor-zoom-in object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,0.6)]"
            />
            <div data-shadow className="absolute -bottom-3 left-1/2 h-6 w-48 -translate-x-1/2 rounded-[50%] bg-black/70 blur-md" aria-hidden="true" />
          </div>
          <div className="mt-8 flex items-center gap-4">
            <button type="button" onClick={() => go(index - 1)} aria-label="Cerveja anterior" className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-white transition hover:border-beer-gold hover:bg-beer-gold hover:text-black">
              <ArrowLeft size={18} />
            </button>
            <span className="font-display text-sm tabular-nums tracking-[0.3em] text-zinc-400" aria-hidden="true">
              <span className="text-white">{String(index + 1).padStart(2, '0')}</span> / {String(BEERS.length).padStart(2, '0')}
            </span>
            <button type="button" onClick={() => go(index + 1)} aria-label="Próxima cerveja" className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-white transition hover:border-beer-gold hover:bg-beer-gold hover:text-black">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div data-swap className="mb-4 flex flex-wrap items-center gap-3">
            <span className={`inline-block rounded-full bg-gradient-to-r ${beer.color} px-3 py-1 font-display text-[11px] font-bold uppercase tracking-widest text-black`}>{beer.style}</span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{categoryLabel(beer.category)}</span>
          </div>
          <h3 data-swap className="font-display text-[clamp(3rem,6.5vw,5.75rem)] font-bold uppercase leading-[0.9] tracking-tight text-white">
            {beer.name}
          </h3>
          <p data-swap className="mt-2 font-serif text-2xl italic text-beer-gold md:text-3xl">“{beer.tagline}”</p>
          <p data-swap className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-300">
            {beer.desc}
          </p>

          <dl data-swap className="mt-7 grid grid-cols-4 divide-x divide-white/10 border-y border-white/10">
            <Spec label="Álcool">
              <Counter value={beer.abv} decimals={1} />%
            </Spec>
            <Spec label="IBU">{beer.ibu != null ? <Counter value={beer.ibu} decimals={beer.ibu % 1 ? 1 : 0} /> : '—'}</Spec>
            <Spec label="EBC">{beer.ebc != null ? <Counter value={beer.ebc} decimals={beer.ebc % 1 ? 1 : 0} /> : '—'}</Spec>
            <Spec label="Servir">{beer.temp.replace(' ', '')}</Spec>
          </dl>

          <div data-swap className="mt-7 grid items-center gap-6 sm:grid-cols-[1fr_auto]">
            <div>
              <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-beer-gold">
                <Utensils size={13} aria-hidden="true" /> Combina com
              </p>
              <p className="text-sm leading-relaxed text-zinc-300">{beer.pairing}</p>
              <p className="mt-2 text-xs text-zinc-500">Ingredientes: {beer.ingredients.toLowerCase()}.</p>
            </div>
            <div className="mx-auto h-44 w-44 sm:mx-0">
              <FlavorRadar data={beer.flavor} color={beer.glow} title={`Perfil sensorial da ${beer.name}`} />
            </div>
          </div>

          <div data-swap className="mt-7">
            <fieldset>
              <legend className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Formato</legend>
              <div className="flex flex-wrap gap-2">
                {available.map((f) => (
                  <label key={f.id} className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-beer-gold ${format === f.id ? 'border-beer-gold bg-beer-gold text-black' : 'border-white/15 text-zinc-300 hover:border-white/40'}`}>
                    <input type="radio" name="beer-format" value={f.id} checked={format === f.id} onChange={() => setFormatPref(f.id)} className="sr-only" />
                    {f.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={addToCart} className={`flex-1 py-4 text-base ${added ? 'btn-success' : 'btn-primary'}`}>
                <span aria-live="polite" className="inline-flex items-center gap-2">
                  {added ? <Check size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
                  {added ? 'Adicionado ao pedido' : 'Adicionar ao pedido'}
                </span>
              </button>
              <button type="button" onClick={() => onPoster(beer)} className="btn-ghost py-4">
                <FileText size={16} aria-hidden="true" /> Ficha técnica
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
