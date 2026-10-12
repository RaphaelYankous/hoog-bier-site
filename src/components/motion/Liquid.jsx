// Cerveja: corpo dourado, borda em onda com espuma por cima e bolhas subindo.
// Puro CSS (as ondas e bolhas animam sem JS). As posições das bolhas são determinísticas (SSR-safe).

const wave = (fill) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 80' preserveAspectRatio='none'%3E%3Cpath d='M0 40 C100 5 200 5 300 40 S500 75 600 40 S800 5 900 40 S1100 75 1200 40 V80 H0Z' fill='${fill}'/%3E%3C/svg%3E")`

const BUBBLES = Array.from({ length: 16 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  size: 6 + ((i * 7) % 16),
  duration: 5 + ((i * 13) % 7),
  delay: -((i * 1.7) % 9),
}))

export default function Liquid({ className = '', bubbles = true, foam = true, waveClassName = 'h-16 md:h-24' }) {
  return (
    <div className={`absolute inset-0 ${className}`} aria-hidden="true">
      {foam && (
        <div className={`absolute bottom-full left-0 -mb-[3px] w-full overflow-hidden ${waveClassName}`}>
          <div className="liquid-wave animate-wave bottom-0 opacity-90" style={{ backgroundImage: wave('%23FFF4DC'), height: '100%' }} />
          <div className="liquid-wave animate-wave-fast -bottom-1 [animation-direction:reverse]" style={{ backgroundImage: wave('%23FBBF24'), height: '70%' }} />
        </div>
      )}
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#FBBF24] via-beer-gold to-amber-deep">
        {bubbles &&
          BUBBLES.map((b, i) => (
            <span key={i} className="bubble" style={{ left: b.left, width: b.size, height: b.size, animationDuration: `${b.duration}s`, animationDelay: `${b.delay}s` }} />
          ))}
      </div>
    </div>
  )
}
