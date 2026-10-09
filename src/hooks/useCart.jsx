import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { store } from '../lib/storage'
import { BEERS, FORMATS } from '../data/beers'
import { waLink } from '../lib/whatsapp'

const CartContext = createContext(null)
const KEY = 'hoog:cart:v1'

const validLine = (l) =>
  l && BEERS.some((b) => b.id === l.beerId) && FORMATS.some((f) => f.id === l.format) && Number.isInteger(l.qty) && l.qty > 0

export function CartProvider({ children }) {
  const [lines, setLines] = useState([])
  const [hydrated, setHydrated] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = store.get(KEY, [])
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hidrata do localStorage após montar (SSR-safe)
    setLines(Array.isArray(saved) ? saved.filter(validLine) : [])
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) store.set(KEY, lines)
  }, [lines, hydrated])

  const add = useCallback((beerId, format, qty = 1) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.beerId === beerId && l.format === format)
      if (i === -1) return [...prev, { beerId, format, qty }]
      return prev.map((l, idx) => (idx === i ? { ...l, qty: Math.min(99, l.qty + qty) } : l))
    })
  }, [])

  const setQty = useCallback((beerId, format, qty) => {
    setLines((prev) =>
      prev.flatMap((l) => (l.beerId === beerId && l.format === format ? (qty > 0 ? [{ ...l, qty: Math.min(99, qty) }] : []) : [l])),
    )
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const value = useMemo(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0)
    return { lines, count, add, setQty, clear, open, setOpen }
  }, [lines, add, setQty, clear, open])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)

export function buildOrderMessage(lines, { nome, endereco, data } = {}) {
  const items = lines.map((l) => {
    const beer = BEERS.find((b) => b.id === l.beerId)
    const fmt = FORMATS.find((f) => f.id === l.format)
    return `• ${l.qty}x ${beer.name} — ${fmt.label}`
  })
  return [
    'Olá! Gostaria de fazer um pedido pelo site:',
    '',
    ...items,
    '',
    nome ? `Nome: ${nome}` : null,
    endereco ? `Endereço de entrega: ${endereco}` : null,
    data ? `Para o dia: ${data}` : null,
    'Pode me passar valores e prazo de entrega?',
  ]
    .filter((x) => x !== null)
    .join('\n')
}

export const orderLink = (lines, extra) => waLink(buildOrderMessage(lines, extra))
