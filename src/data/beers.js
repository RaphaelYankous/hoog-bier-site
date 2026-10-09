// Dados conferidos com os rótulos/fichas técnicas oficiais (design/source).
export const FORMATS = [
  { id: 'longNeck', label: 'Long Neck' },
  { id: 'growler', label: 'Growler' },
  { id: 'keg30', label: 'Barril 30L' },
  { id: 'keg50', label: 'Barril 50L' },
]

export const CATEGORIES = [
  { id: 'all', label: 'Todas' },
  { id: 'leve', label: 'Leves & Refrescantes' },
  { id: 'lupulada', label: 'Lupuladas' },
  { id: 'maltada', label: 'Maltadas & Escuras' },
]

const all = { longNeck: true, growler: true, keg30: true, keg50: true }
const noKeg50 = { ...all, keg50: false }

export const BEERS = [
  {
    id: 'pilsen', name: 'Hoog Pilsen', style: 'Pilsen Puro Malte', category: 'leve',
    tagline: 'Leveza e equilíbrio',
    desc: 'Perfeitamente equilibrada, segue a Lei da Pureza Alemã: apenas água, malte, lúpulo e levedura. Clara, suave e refrescante, com maltes e lúpulos nobres.',
    ingredients: 'Água, malte, lúpulo e levedura',
    pairing: 'Petiscos, queijos frescos, saladas leves e grelhados.',
    abv: 4.5, ibu: 9, ebc: 5.1, temp: '4–6 ºC',
    color: 'from-teal-300 to-emerald-500', glow: '#14b8a6', formats: all,
    flavor: { amargor: 2, docura: 4, alcool: 3, aroma: 3, corpo: 3 },
  },
  {
    id: 'ipa', name: 'Hoog IPA', style: 'American IPA', category: 'lupulada',
    tagline: 'Para quem gosta de lúpulo',
    desc: 'Cerveja bem lupulada e, consequentemente, mais amarga. Muito aromática e refrescante, perfeita para quem gosta de uma dose a mais de amargor e aromas.',
    ingredients: 'Água, malte, lúpulo e levedura',
    pairing: 'Carnes, comidas apimentadas e costelinha suína com barbecue.',
    abv: 6.2, ibu: null, ebc: null, temp: '4–6 ºC',
    color: 'from-orange-400 to-amber-600', glow: '#f97316', formats: all,
    flavor: { amargor: 8, docura: 3, alcool: 7, aroma: 9, corpo: 6 },
  },
  {
    id: 'california', name: 'California Common', style: 'Golden State · Lager extra escura', category: 'maltada',
    tagline: 'Híbrida e rústica',
    desc: 'Inspirada na Costa Oeste dos EUA, combina o corpo maltado de uma lager com a complexidade de uma ale. Notas de caramelo, tostado e leve toque amadeirado, corpo médio e final seco.',
    ingredients: 'Água, malte, lúpulo e levedura',
    pairing: 'Carnes grelhadas, hambúrgueres intensos, frutos do mar robustos e queijos semiduros.',
    abv: 5.0, ibu: 38, ebc: null, temp: '4–6 ºC',
    color: 'from-amber-400 to-orange-700', glow: '#d97706', formats: all,
    flavor: { amargor: 5, docura: 4, alcool: 5, aroma: 6, corpo: 5 },
  },
  {
    id: 'seculo', name: 'Século XIII', style: 'Amber Lager', category: 'maltada',
    tagline: 'Tradição avermelhada',
    desc: 'Cerveja de cor âmbar, elaborada com maltes especiais que lhe conferem um sabor levemente maltado, equilibrado com o amargor do lúpulo.',
    ingredients: 'Água, malte, lúpulo e levedura',
    pairing: 'Frango assado, grelhados, guacamole e hambúrguer — tudo que vai ao forno ou à grelha.',
    abv: 4.8, ibu: 11.7, ebc: 14, temp: '4–6 ºC',
    color: 'from-red-500 to-red-800', glow: '#dc2626', formats: noKeg50,
    flavor: { amargor: 3, docura: 7, alcool: 4, aroma: 5, corpo: 5 },
  },
  {
    id: 'weiss', name: 'Hoog Weiss', style: 'Weiss (Trigo)', category: 'leve',
    tagline: 'Você salvou um trigo',
    desc: 'Cor clara e turbidez natural. Leve, com baixo amargor e pouca acidez, é muito refrescante. A levedura proporciona aroma de frutas e especiarias.',
    ingredients: 'Água, malte, lúpulo, trigo e levedura',
    pairing: 'Peixes, frutos do mar, saladas, ovos com bacon, quiche de queijo e comida japonesa.',
    abv: 4.8, ibu: 9.6, ebc: 7.5, temp: '4–6 ºC',
    color: 'from-yellow-200 to-yellow-500', glow: '#eab308', formats: all,
    flavor: { amargor: 2, docura: 6, alcool: 4, aroma: 8, corpo: 7 },
  },
  {
    id: 'paleale', name: 'Hoog Pale Ale', style: 'American Pale Ale', category: 'lupulada',
    tagline: 'Refrescante e aromática',
    desc: 'Cor alaranjada e espuma cremosa. Aroma cítrico que remete a maracujá e pinho. No sabor, mescla de dulçor, amargor e criticidade — refrescante e intensa.',
    ingredients: 'Água, malte, lúpulo e levedura',
    pairing: 'Carnes, comidas apimentadas e hambúrguer.',
    abv: 5.0, ibu: 21, ebc: 12, temp: '4–6 ºC',
    color: 'from-orange-400 to-orange-600', glow: '#ea580c', formats: all,
    flavor: { amargor: 5, docura: 4, alcool: 5, aroma: 7, corpo: 4 },
  },
  {
    id: 'stout', name: 'Hoog Dry Stout', style: 'Dry Stout (Irlandesa)', category: 'maltada',
    tagline: 'Café torrado e final seco',
    desc: 'Estilo irlandês com sabor de cereal torrado que lembra café. Amargor assertivo e final seco; apesar dos grãos torrados, não é áspera. Sensação aveludada e espuma conferidas pela aveia.',
    ingredients: 'Água, malte, lúpulo e levedura',
    pairing: 'Carnes, petit gâteau e queijos.',
    abv: 4.5, ibu: 25, ebc: 60, temp: '4–6 ºC',
    color: 'from-zinc-300 to-zinc-600', glow: '#a1a1aa', formats: noKeg50,
    flavor: { amargor: 4, docura: 5, alcool: 4, aroma: 6, corpo: 6 },
  },
]

export const beerById = (id) => BEERS.find((b) => b.id === id)

export const fmtNumber = (n) => String(n).replace('.', ',')
