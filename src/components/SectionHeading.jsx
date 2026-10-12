import Reveal from './Reveal'
import SplitReveal from './motion/SplitReveal'

export default function SectionHeading({ eyebrow, title, highlight, children, align = 'center', as = 'h2', light = false, id, className = '' }) {
  const center = align === 'center'
  return (
    <div className={`mb-14 max-w-4xl md:mb-20 ${center ? 'mx-auto text-center' : ''} ${className}`}>
      {eyebrow && (
        <Reveal y={20}>
          <p className={`eyebrow mb-6 ${center ? 'justify-center' : ''} ${light ? '!text-beer-dark' : ''}`}>{eyebrow}</p>
        </Reveal>
      )}
      <SplitReveal as={as} id={id} className={`font-display text-[clamp(2.6rem,6.5vw,5.5rem)] font-bold uppercase leading-[0.92] tracking-tight ${light ? 'text-beer-dark' : 'text-white'}`}>
        {title}{' '}
        {highlight && <span className={`font-serif font-normal normal-case italic ${light ? 'text-white' : 'text-beer-gold'}`}>{highlight}</span>}
      </SplitReveal>
      {children && (
        <Reveal delay={150} y={24}>
          <p className={`mt-6 text-base leading-relaxed md:text-lg ${center ? 'mx-auto max-w-2xl' : 'max-w-2xl'} ${light ? 'text-beer-dark/75' : 'text-zinc-400'}`}>{children}</p>
        </Reveal>
      )}
    </div>
  )
}
