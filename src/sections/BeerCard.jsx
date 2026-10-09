import { useState } from 'react'
import { Activity, Check, FileText, Plus, Utensils, X } from 'lucide-react'
import FlavorRadar from '../components/FlavorRadar'
import { FORMATS, fmtNumber } from '../data/beers'
import { useCart } from '../hooks/useCart'
import { track } from '../lib/analytics'

const Spec = ({ label, value }) => (
  <div className="flex flex-col items-center px-1">
    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{label}</span>
    <span className="font-display text-lg font-semibold text-white">{value}</span>
  </div>
)

export default function BeerCard({ beer, highlighted, onPoster }) {
  const { add } = useCart()
  const available = FORMATS.filter((f) => beer.formats[f.id])
  const [format, setFormat] = useState(available[0].id)
  const [flipped, setFlipped] = useState(false)
  const [added, setAdded] = useState(false)

  const addToCart = () => {
    add(beer.id, format, 1)
    track('add_to_cart', { item: beer.name, format })
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <article
      id={`cerveja-${beer.id}`}
      aria-labelledby={`beer-${beer.id}`}
      className={`group relative flex h-full flex-col rounded-[2rem] border bg-white/[0.04] p-6 pt-0 transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.07] ${highlighted ? 'border-beer-gold shadow-[0_0_60px_-10px_rgba(245,158,11,0.5)]' : 'border-white/10 hover:border-beer-gold/40'}`}
      style={{ '--glow': beer.glow }}
    >
      <div className="relative -mt-14 mb-5 flex h-72 items-end justify-center">
        <div className="absolute bottom-6 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full opacity-40 blur-[70px] transition-opacity duration-700 group-hover:opacity-70" style={{ background: beer.glow }} aria-hidden="true" />
        <img
          src={`/images/beers/${beer.id}.webp`}
          alt={`Garrafa da cerveja ${beer.name}`}
          width="260"
          height="760"
          loading="lazy"
          decoding="async"
          className="relative z-10 h-full w-auto object-contain drop-shadow-[0_25px_30px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2"
        />
      </div>

      <div className="flex flex-1 flex-col text-center">
        <span className={`mx-auto mb-3 inline-block rounded-md bg-gradient-to-r ${beer.color} px-3 py-1 font-display text-[11px] font-bold uppercase tracking-widest text-black`}>{beer.style}</span>
        <h3 id={`beer-${beer.id}`} className="font-display text-3xl font-bold uppercase leading-none tracking-tight text-white transition-colors group-hover:text-beer-gold">
          {beer.name}
        </h3>
        <p className="mb-4 mt-2 text-sm italic text-zinc-400">“{beer.tagline}”</p>
        <p className="mb-5 text-sm leading-relaxed text-zinc-300">{beer.desc}</p>

        <div className="mb-4 grid grid-cols-4 divide-x divide-white/5 rounded-xl border border-white/5 bg-black/40 py-3">
          <Spec label="ABV" value={`${fmtNumber(beer.abv)}%`} />
          <Spec label="IBU" value={beer.ibu != null ? fmtNumber(beer.ibu) : '—'} />
          <Spec label="EBC" value={beer.ebc != null ? fmtNumber(beer.ebc) : '—'} />
          <Spec label="Servir" value={beer.temp.replace(' ', '')} />
        </div>

        <div className="mb-5 rounded-xl border border-white/5 bg-black/30 p-3 text-xs text-zinc-400">
          <p className="mb-1 flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider text-beer-gold">
            <Utensils size={12} aria-hidden="true" /> Combina com
          </p>
          {beer.pairing}
        </div>

        <fieldset className="mt-auto">
          <legend className="mb-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400">Formato</legend>
          <div className="flex flex-wrap justify-center gap-2">
            {available.map((f) => (
              <label key={f.id} className={`cursor-pointer rounded-full border px-2.5 py-1.5 text-[11px] font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-beer-gold ${format === f.id ? 'border-beer-gold bg-beer-gold text-black' : 'border-white/15 text-zinc-300 hover:border-white/40'}`}>
                <input type="radio" name={`fmt-${beer.id}`} value={f.id} checked={format === f.id} onChange={() => setFormat(f.id)} className="sr-only" />
                {f.label}
              </label>
            ))}
          </div>
        </fieldset>

        <button type="button" onClick={addToCart} className={`mt-5 w-full justify-center py-3.5 ${added ? 'btn-success' : 'btn-primary'}`} aria-live="polite">
          {added ? (
            <>
              <Check size={16} /> Adicionado
            </>
          ) : (
            <>
              <Plus size={16} /> Adicionar ao pedido
            </>
          )}
        </button>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setFlipped(true)} aria-label={`Ver perfil de sabor da ${beer.name}`} className="chip">
            <Activity size={14} /> Sabor
          </button>
          <button type="button" onClick={() => onPoster(beer)} aria-label={`Ver ficha técnica da ${beer.name}`} className="chip">
            <FileText size={14} /> Ficha
          </button>
        </div>
      </div>

      {flipped && (
        <div className="absolute inset-0 z-20 flex animate-pop flex-col items-center justify-center rounded-[2rem] border border-beer-gold/50 bg-zinc-950/95 p-6 backdrop-blur">
          <button type="button" onClick={() => setFlipped(false)} aria-label="Voltar ao card" className="absolute right-4 top-4 rounded-full border border-white/15 p-2 text-zinc-300 transition hover:border-beer-gold hover:text-beer-gold">
            <X size={16} />
          </button>
          <p className="font-display text-2xl font-bold uppercase text-white">Perfil sensorial</p>
          <p className="mb-4 text-sm text-beer-gold">{beer.name}</p>
          <div className="h-64 w-full max-w-[18rem]">
            <FlavorRadar data={beer.flavor} color={beer.glow} title={`Perfil sensorial da ${beer.name}`} />
          </div>
          <p className="mt-4 max-w-[16rem] text-center text-xs text-zinc-400">Gráfico indicativo da percepção sensorial (escala de 0 a 10).</p>
        </div>
      )}
    </article>
  )
}
