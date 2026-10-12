// Ponto único de importação do GSAP: registra os plugins uma vez (apenas no navegador).
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)
  gsap.defaults({ ease: 'expo.out', duration: 1 })
  ScrollTrigger.config({ ignoreMobileResize: true })
}

// Condições usadas em gsap.matchMedia(): animações só para quem não pediu "reduzir movimento".
export const MOTION = '(prefers-reduced-motion: no-preference)'
export const DESKTOP = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'

export { gsap, ScrollTrigger, SplitText, useGSAP }
