import { gsap, useGSAP, MOTION } from '../lib/gsap'

/**
 * useGSAP + matchMedia: a animação só é criada para quem não pediu "reduzir movimento"
 * e é revertida por completo ao desmontar (ou quando as dependências mudam).
 * `query` aceita uma string ou um objeto de condições do gsap.matchMedia().
 */
export function useMotion(setup, { scope, dependencies = [], query } = {}) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia(scope?.current)
      mm.add(query || MOTION, (ctx) => setup(ctx))
      return () => mm.revert()
    },
    { scope, dependencies, revertOnUpdate: true },
  )
}
