import { useState } from 'react'
import { Minus, Plus, ShoppingBag, Trash2, MessageCircle } from 'lucide-react'
import Modal from './Modal'
import { useCart, orderLink } from '../hooks/useCart'
import { BEERS, FORMATS } from '../data/beers'
import { track } from '../lib/analytics'

export default function CartDrawer() {
  const { lines, count, setQty, clear, open, setOpen } = useCart()
  const [form, setForm] = useState({ nome: '', endereco: '', data: '' })
  if (!open) return null
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <Modal side title="Seu pedido" labelledBy="cart-title" onClose={() => setOpen(false)}>
      <div className="flex items-center gap-3 border-b border-white/10 p-6 pr-14">
        <ShoppingBag className="text-beer-gold" />
        <div>
          <p id="cart-title" className="font-display text-2xl font-bold uppercase text-white">
            Seu pedido
          </p>
          <p className="text-xs text-zinc-400">{count ? `${count} ${count === 1 ? 'item' : 'itens'}` : 'Nenhum item ainda'}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {lines.length === 0 ? (
          <div className="py-16 text-center text-zinc-400">
            <ShoppingBag className="mx-auto mb-4 text-zinc-700" size={48} />
            <p className="mb-1 font-bold text-white">Seu pedido está vazio</p>
            <p className="mb-6 text-sm">Escolha suas cervejas no catálogo e monte o pedido em segundos.</p>
            <a href="#cervejas" onClick={() => setOpen(false)} className="btn-primary inline-flex">
              Ver cervejas
            </a>
          </div>
        ) : (
          <>
            <ul className="space-y-3">
              {lines.map((l) => {
                const beer = BEERS.find((b) => b.id === l.beerId)
                const fmt = FORMATS.find((f) => f.id === l.format)
                return (
                  <li key={l.beerId + l.format} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                    <img src={`/images/beers/${beer.id}.webp`} alt="" width="40" height="120" className="h-16 w-auto object-contain" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-white">{beer.name}</p>
                      <p className="text-xs text-beer-gold">{fmt.label}</p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40">
                      <button type="button" aria-label={`Diminuir ${beer.name}`} onClick={() => setQty(l.beerId, l.format, l.qty - 1)} className="p-2 text-zinc-300 hover:text-white">
                        {l.qty === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                      </button>
                      <span className="w-6 text-center text-sm font-bold tabular-nums" aria-live="polite">
                        {l.qty}
                      </span>
                      <button type="button" aria-label={`Aumentar ${beer.name}`} onClick={() => setQty(l.beerId, l.format, l.qty + 1)} className="p-2 text-zinc-300 hover:text-white">
                        <Plus size={14} />
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="mt-6 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Dados para a entrega (opcional)</p>
              <input className="field" placeholder="Seu nome" value={form.nome} onChange={set('nome')} autoComplete="name" aria-label="Seu nome" />
              <input className="field" placeholder="Endereço de entrega" value={form.endereco} onChange={set('endereco')} autoComplete="street-address" aria-label="Endereço de entrega" />
              <input className="field" type="date" value={form.data} onChange={set('data')} aria-label="Data desejada" min={new Date().toISOString().slice(0, 10)} />
            </div>
          </>
        )}
      </div>

      {lines.length > 0 && (
        <div className="space-y-3 border-t border-white/10 p-6">
          <a
            href={orderLink(lines, { ...form, data: form.data ? form.data.split('-').reverse().join('/') : '' })}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('order_whatsapp', { items: count })}
            className="btn-whatsapp w-full justify-center py-4"
          >
            <MessageCircle size={20} /> Enviar pedido no WhatsApp
          </a>
          <button type="button" onClick={clear} className="w-full text-center text-xs text-zinc-400 underline-offset-2 transition hover:text-white hover:underline">
            Limpar pedido
          </button>
          <p className="text-center text-[11px] text-zinc-400">Valores e prazo são confirmados pelo nosso time no WhatsApp.</p>
        </div>
      )}
    </Modal>
  )
}
