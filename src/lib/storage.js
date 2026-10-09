// Acesso seguro ao localStorage (SSR, modo privado e bloqueios não quebram o site).
export const store = {
  get(key, fallback = null) {
    try {
      const raw = window.localStorage.getItem(key)
      return raw === null ? fallback : JSON.parse(raw)
    } catch {
      return fallback
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* ignora */
    }
  },
  remove(key) {
    try {
      window.localStorage.removeItem(key)
    } catch {
      /* ignora */
    }
  },
}
