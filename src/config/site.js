// Fonte única de verdade para dados do negócio. Altere aqui, reflete no site inteiro.
export const SITE = {
  name: 'Hoog Bier',
  legalName: 'Cervejaria Hoog Bier Ltda.',
  url: (import.meta.env.VITE_SITE_URL || 'https://www.hoogbier.com.br').replace(/\/$/, ''),
  foundedYear: 2018,
  whatsapp: '553125641240',
  phoneDisplay: '(31) 2564-1240',
  address: {
    street: 'Rua Rio Ural, 200',
    district: 'Riacho das Pedras',
    city: 'Contagem',
    state: 'MG',
    country: 'BR',
  },
  hours: [
    { label: 'Segunda a sexta', short: 'Seg-Sex', days: [1, 2, 3, 4, 5], open: '09:00', close: '18:00' },
    { label: 'Sábado', short: 'Sáb', days: [6], open: '09:00', close: '13:00' },
  ],
  social: {
    instagram: 'https://instagram.com/cervejariahoogbier',
    instagramHandle: '@cervejariahoogbier',
    facebook: 'https://facebook.com/cervejariahoogbier',
  },
  developer: { name: 'Yankous Dev', url: 'https://www.yankousdevweb.com.br/' },
}

export const SHEETS = {
  agenda:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vR4dXo5Iu4D0vOcvkdUnIBmyqGqcaVdOJ5EDqHIgYfm0oSf_4ZinVhk7qllVwyPuFENL0MGv4yuBT9L/pub?gid=0&single=true&output=csv',
  parceiros:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vR4dXo5Iu4D0vOcvkdUnIBmyqGqcaVdOJ5EDqHIgYfm0oSf_4ZinVhk7qllVwyPuFENL0MGv4yuBT9L/pub?gid=571179422&single=true&output=csv',
  instagram: import.meta.env.VITE_BEHOLD_URL || '',
}

export const GA_ID = import.meta.env.VITE_GA_ID || ''

export const fullAddress = () => {
  const a = SITE.address
  return `${a.street} - ${a.district}, ${a.city}/${a.state}`
}

export const mapsQuery = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
export const mapsEmbed = (q) => `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`

// Itens exibidos no letreiro "Hoje nas torneiras".
export const TAPLIST = ['Pilsen', 'IPA', 'Século XIII Amber Lager', 'Dry Stout', 'California Common', 'Pale Ale', 'Weiss']

export const NAV = [
  { id: 'inicio', label: 'Início' },
  { id: 'cervejas', label: 'Cervejas' },
  { id: 'eventos', label: 'Eventos' },
  { id: 'agenda', label: 'Agenda' },
  { id: 'fabrica', label: 'A Fábrica' },
  { id: 'faq', label: 'Dúvidas' },
]
