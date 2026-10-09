import { useEffect, useState } from 'react'
import { store } from '../lib/storage'

const KEY = 'hoog:age:v1'
const DAYS = 30

// Verificação de maioridade: lembra a confirmação por 30 dias.
export function useAgeGate() {
  const [status, setStatus] = useState('pending') // pending | ask | ok | denied
  useEffect(() => {
    const saved = store.get(KEY)
    const valid = saved && Date.now() - saved < DAYS * 864e5
    // eslint-disable-next-line react-hooks/set-state-in-effect -- precisa ler o localStorage após montar (SSR-safe)
    setStatus(valid ? 'ok' : 'ask')
  }, [])
  const confirm = () => {
    store.set(KEY, Date.now())
    setStatus('ok')
  }
  return { status, confirm, deny: () => setStatus('denied') }
}
