import Modal from './Modal'

export default function AgeGate({ status, onConfirm, onDeny }) {
  if (status === 'pending' || status === 'ok') return null
  const denied = status === 'denied'
  return (
    <Modal dismissible={false} labelledBy="age-title" title="Verificação de idade">
      <div className="text-center">
        <img src="/images/logo-hoog.png" alt="Hoog Bier" width="144" height="96" className="mx-auto mb-6 h-24 w-auto" />
        <p id="age-title" className="mb-2 font-display text-3xl font-bold uppercase text-white">
          {denied ? 'Volte quando completar 18' : 'Bem-vindo à Hoog'}
        </p>
        <p className="mb-8 text-zinc-400">
          {denied ? 'Nosso conteúdo é destinado a maiores de 18 anos. Beba com moderação — e volte em breve!' : 'Este site é destinado a maiores de 18 anos. Você tem 18 anos ou mais?'}
        </p>
        {!denied && (
          <div className="flex flex-col gap-3">
            <button data-autofocus type="button" onClick={onConfirm} className="btn-primary w-full justify-center py-4">
              Sim, tenho 18 anos ou mais
            </button>
            <button type="button" onClick={onDeny} className="w-full rounded-xl border border-white/15 py-4 text-sm uppercase tracking-widest text-zinc-400 transition hover:border-white hover:text-white">
              Não, sou menor
            </button>
          </div>
        )}
        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Beba com moderação. Venda proibida para menores de 18 anos.</p>
      </div>
    </Modal>
  )
}
