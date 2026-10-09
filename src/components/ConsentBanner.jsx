import { useEffect, useState } from 'react'
import { store } from '../lib/storage'
import { enableAnalytics } from '../lib/analytics'
import { GA_ID } from '../config/site'

const KEY = 'hoog:consent:v1'

export default function ConsentBanner({ enabled, onOpenPrivacy }) {
  const [choice, setChoice] = useState('pending') // pending | yes | no

  useEffect(() => {
    const saved = store.get(KEY)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lê preferência salva após montar (SSR-safe)
    setChoice(saved ?? 'unset')
    if (saved === 'yes') enableAnalytics()
  }, [])

  const decide = (v) => {
    store.set(KEY, v)
    setChoice(v)
    if (v === 'yes') enableAnalytics()
  }

  if (!enabled || choice !== 'unset') return null
  return (
    <div role="region" aria-label="Aviso de privacidade" className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-3xl animate-fade-in-up rounded-2xl border border-white/10 bg-zinc-900/95 p-4 shadow-2xl backdrop-blur-xl md:bottom-5 md:flex md:items-center md:justify-between md:gap-6 md:p-5">
      <p className="mb-3 text-xs leading-relaxed text-zinc-300 md:mb-0">
        {GA_ID ? 'Usamos cookies de medição para entender como o site é usado e melhorá-lo. ' : 'Guardamos no seu navegador apenas sua confirmação de idade e o seu pedido em andamento. '}
        <button type="button" onClick={onOpenPrivacy} className="font-bold text-beer-gold underline underline-offset-2">
          Política de privacidade
        </button>
      </p>
      <div className="flex shrink-0 gap-2">
        {GA_ID && (
          <button type="button" onClick={() => decide('no')} className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-zinc-300 transition hover:border-white hover:text-white">
            Recusar
          </button>
        )}
        <button type="button" onClick={() => decide('yes')} className="rounded-full bg-beer-gold px-5 py-2 text-xs font-bold text-black transition hover:bg-white">
          {GA_ID ? 'Aceitar' : 'Entendi'}
        </button>
      </div>
    </div>
  )
}
