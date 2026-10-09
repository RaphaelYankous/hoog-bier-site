const AXES = [
  { key: 'amargor', label: 'Amargor' },
  { key: 'alcool', label: 'Álcool' },
  { key: 'docura', label: 'Doçura' },
  { key: 'corpo', label: 'Corpo' },
  { key: 'aroma', label: 'Aroma' },
]

const CX = 100
const CY = 100
const R = 70

const point = (i, value) => {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / AXES.length
  const r = (value / 10) * R
  return [CX + r * Math.cos(angle), CY + r * Math.sin(angle)]
}
const poly = (values) => values.map((v, i) => point(i, v).join(',')).join(' ')

export default function FlavorRadar({ data, color = '#F59E0B', title }) {
  const values = AXES.map((a) => data[a.key])
  const summary = AXES.map((a) => `${a.label} ${data[a.key]} de 10`).join(', ')
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={`${title ?? 'Perfil sensorial'}: ${summary}`} className="h-full w-full overflow-visible">
      {[2, 4, 6, 8, 10].map((level) => (
        <polygon key={level} points={poly(AXES.map(() => level))} fill="none" stroke="#fff" strokeOpacity={level === 10 ? 0.25 : 0.1} strokeWidth="0.6" />
      ))}
      {AXES.map((a, i) => {
        const [x, y] = point(i, 10)
        const [lx, ly] = point(i, 12.6)
        return (
          <g key={a.key}>
            <line x1={CX} y1={CY} x2={x} y2={y} stroke="#fff" strokeOpacity="0.12" strokeWidth="0.6" />
            <text x={lx} y={ly} fontSize="9" fontWeight="600" fill="#d4d4d8" textAnchor="middle" dominantBaseline="middle">
              {a.label}
            </text>
          </g>
        )
      })}
      <polygon points={poly(values)} fill={color} fillOpacity="0.35" stroke={color} strokeWidth="2" strokeLinejoin="round" className="radar-shape" />
      {values.map((v, i) => {
        const [x, y] = point(i, v)
        return <circle key={AXES[i].key} cx={x} cy={y} r="3" fill={color} />
      })}
    </svg>
  )
}
