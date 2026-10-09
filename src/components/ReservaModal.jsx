import { useState } from 'react'
import { Calendar, MessageCircle } from 'lucide-react'
import Modal from './Modal'
import { waLink } from '../lib/whatsapp'
import { track } from '../lib/analytics'

export default function ReservaModal({ onClose }) {
  const [f, setF] = useState({ nome: '', data: '', pessoas: '' })
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))
  const valid = f.nome.trim().length > 1 && f.data && Number(f.pessoas) > 0
  const dataBR = f.data ? f.data.split('-').reverse().join('/') : ''
  const href = waLink(`Olá! Gostaria de reservar uma mesa para ${f.pessoas} pessoa(s) no dia ${dataBR}. Me chamo ${f.nome.trim()}.`)

  return (
    <Modal title="Reservar mesa" labelledBy="reserva-title" onClose={onClose}>
      <div className="mb-6 text-center">
        <Calendar className="mx-auto mb-3 text-beer-gold" size={40} />
        <p id="reserva-title" className="font-display text-3xl font-bold uppercase text-white">
          Reserve sua mesa
        </p>
        <p className="text-sm text-zinc-400">Garanta seu lugar no happy hour. A confirmação é feita pelo WhatsApp.</p>
      </div>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <label className="block">
          <span className="label">Seu nome</span>
          <input data-autofocus className="field" placeholder="Ex.: João Silva" value={f.nome} onChange={set('nome')} autoComplete="name" required />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="label">Data</span>
            <input className="field" type="date" value={f.data} onChange={set('data')} min={new Date().toISOString().slice(0, 10)} required />
          </label>
          <label className="block">
            <span className="label">Pessoas</span>
            <input className="field" type="number" inputMode="numeric" min="1" max="60" placeholder="4" value={f.pessoas} onChange={set('pessoas')} required />
          </label>
        </div>
        <a
          href={valid ? href : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!valid}
          onClick={(e) => (valid ? track('reserva_whatsapp') : e.preventDefault())}
          className={`btn-whatsapp mt-2 w-full justify-center py-4 ${valid ? '' : 'pointer-events-none opacity-40'}`}
        >
          <MessageCircle size={18} /> Confirmar no WhatsApp
        </a>
      </form>
    </Modal>
  )
}
