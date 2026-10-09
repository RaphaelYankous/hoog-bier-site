import { useMemo, useState } from 'react'
import { MapPin, Search } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { useSheet } from '../hooks/useSheet'
import { SHEETS, mapsQuery } from '../config/site'

export default function Partners() {
  const { rows, status } = useSheet(SHEETS.parceiros, { requiredField: 'nome' })
  const [q, setQ] = useState('')

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    return term ? rows.filter((p) => `${p.nome} ${p.endereco || ''}`.toLowerCase().includes(term)) : rows
  }, [rows, q])

  // Sem parceiros cadastrados (ou erro), a seção não aparece.
  if (status === 'error' || (status === 'ready' && rows.length === 0)) return null

  return (
    <section id="onde-encontrar" aria-labelledby="parceiros-title" className="border-t border-white/5 bg-black py-24">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading id="parceiros-title" eyebrow="Pontos de venda" title="Onde encontrar" highlight="Hoog">
          Bares, restaurantes e empórios que servem Hoog perto de você.
        </SectionHeading>

        {rows.length > 6 && (
          <div className="relative mx-auto mb-10 max-w-md">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome ou bairro" aria-label="Buscar parceiro" className="field !pl-11" />
          </div>
        )}

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy={status === 'loading'}>
          {status === 'loading' && [0, 1, 2].map((i) => <li key={i} className="h-28 animate-pulse rounded-2xl bg-white/5 motion-reduce:animate-none" aria-hidden="true" />)}
          {list.map((p, i) => (
            <li key={`${p.nome}-${i}`}>
              <Reveal delay={(i % 3) * 80} className="h-full">
                <a href={mapsQuery(`${p.nome} ${p.endereco || ''}`)} target="_blank" rel="noopener noreferrer" className="card-hover group flex h-full items-start gap-4 rounded-2xl border border-white/10 p-5 transition hover:border-beer-gold">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-beer-gold/10 text-beer-gold transition group-hover:bg-beer-gold group-hover:text-black">
                    <MapPin size={20} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-display text-xl font-semibold uppercase text-white">{p.nome}</span>
                    {p.endereco && <span className="mt-1 block text-sm text-zinc-400">{p.endereco}</span>}
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
          {status === 'ready' && list.length === 0 && <li className="col-span-full text-center text-zinc-400">Nenhum ponto encontrado para “{q}”.</li>}
        </ul>
      </div>
    </section>
  )
}
