// Cálculo de chopp para eventos: ~0,45 L por pessoa/hora, com consumo decrescente
// após as 2 primeiras horas (as primeiras horas concentram o maior consumo).
export function calcChopp(guests, hours) {
  const effectiveHours = hours <= 2 ? hours : 2 + (hours - 2) * 0.7
  return Math.max(10, Math.ceil(guests * 0.45 * effectiveHours))
}

// Sugere a combinação de barris (30L / 50L) que cobre o volume com pouca sobra.
export function suggestKegs(liters) {
  let best = null
  for (let k50 = 0; k50 <= Math.ceil(liters / 50); k50++) {
    for (let k30 = 0; k30 <= Math.ceil(liters / 30); k30++) {
      const total = k50 * 50 + k30 * 30
      if (total < liters) continue
      const waste = total - liters
      const count = k50 + k30
      if (!best || waste < best.waste - 4 || (Math.abs(waste - best.waste) <= 4 && count < best.count)) {
        best = { k30, k50, total, waste, count }
      }
    }
  }
  return best
}
