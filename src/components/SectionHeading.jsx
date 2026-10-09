import Reveal from './Reveal'

export default function SectionHeading({ eyebrow, title, highlight, children, align = 'center', as: Tag = 'h2', light = false, id }) {
  return (
    <Reveal className={`mb-14 md:mb-20 ${align === 'center' ? 'text-center mx-auto' : ''} max-w-3xl ${align === 'center' ? '' : ''}`}>
      {eyebrow && (
        <span className={`mb-4 block font-display text-xs font-medium uppercase tracking-[0.4em] ${light ? 'text-black/70' : 'text-beer-gold'}`}>{eyebrow}</span>
      )}
      <Tag id={id} className={`font-display text-4xl font-bold uppercase leading-[1.02] tracking-tight md:text-6xl ${light ? 'text-black' : 'text-white'}`}>
        {title} {highlight && <span className={light ? 'text-white' : 'text-gradient-gold'}>{highlight}</span>}
      </Tag>
      {children && <p className={`mt-5 text-base leading-relaxed md:text-lg ${light ? 'text-black/75' : 'text-zinc-400'}`}>{children}</p>}
    </Reveal>
  )
}
