import { useCallback, useEffect, useState } from 'react'

const norm = (h) =>
  h
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase()

const readCache = (key) => {
  try {
    return JSON.parse(window.sessionStorage.getItem(key) || 'null')
  } catch {
    return null
  }
}

/**
 * Lê uma planilha publicada do Google Sheets (CSV).
 * - cabeçalhos normalizados (sem acento/maiúsculas)
 * - cache em sessionStorage (mostra na hora e revalida em segundo plano)
 * - descarta linhas vazias, trata erro e permite "tentar de novo"
 */
export function useSheet(url, { requiredField } = {}) {
  const [state, setState] = useState({ rows: [], status: url ? 'loading' : 'ready' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!url) return undefined
    const cacheKey = `hoog:sheet:${url}`
    const cached = readCache(cacheKey)
    if (cached?.length) setState({ rows: cached, status: 'ready' })

    let cancelled = false
    ;(async () => {
      try {
        const { default: Papa } = await import('papaparse')
        const res = await fetch(url, { cache: 'no-cache' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const text = await res.text()
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: 'greedy', transformHeader: norm })
        const rows = parsed.data
          .map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v])))
          .filter((r) => (requiredField ? r[requiredField] : Object.values(r).some(Boolean)))
        if (cancelled) return
        setState({ rows, status: 'ready' })
        try {
          window.sessionStorage.setItem(cacheKey, JSON.stringify(rows))
        } catch {
          /* ignora */
        }
      } catch (err) {
        console.warn('[useSheet]', err)
        if (!cancelled) setState((s) => (s.rows.length ? s : { rows: [], status: 'error' }))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [url, requiredField, attempt])

  const retry = useCallback(() => {
    setState({ rows: [], status: 'loading' })
    setAttempt((n) => n + 1)
  }, [])

  return { ...state, retry }
}
