import { SITE, fullAddress } from '../config/site'
import { BEERS } from '../data/beers'
import { FAQS } from '../data/faqs'

const DAY = { 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 0: 'Sunday' }

// Dados estruturados (schema.org) gerados a partir dos mesmos dados que alimentam o site.
export function buildJsonLd() {
  const abs = (p) => `${SITE.url}${p}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Brewery', 'LocalBusiness'],
        '@id': abs('/#business'),
        name: SITE.name,
        legalName: SITE.legalName,
        url: abs('/'),
        image: abs('/images/og-image.jpg'),
        logo: abs('/images/icon-512.png'),
        description: 'Cervejaria artesanal em Contagem-MG. Chopp e cervejas puro malte, delivery e chopeira para eventos.',
        telephone: `+${SITE.whatsapp}`,
        foundingDate: String(SITE.foundedYear),
        slogan: 'O melhor chopp puro malte',
        servesCuisine: 'Cerveja artesanal',
        address: {
          '@type': 'PostalAddress',
          streetAddress: SITE.address.street,
          addressLocality: SITE.address.city,
          addressRegion: SITE.address.state,
          addressCountry: SITE.address.country,
        },
        areaServed: ['Contagem', 'Belo Horizonte', 'Betim'].map((name) => ({ '@type': 'City', name })),
        openingHoursSpecification: SITE.hours.map((h) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: h.days.map((d) => DAY[d]),
          opens: h.open,
          closes: h.close,
        })),
        hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress())}`,
        sameAs: [SITE.social.instagram, SITE.social.facebook],
        contactPoint: { '@type': 'ContactPoint', telephone: `+${SITE.whatsapp}`, contactType: 'customer service', availableLanguage: 'pt-BR' },
      },
      {
        '@type': 'WebSite',
        '@id': abs('/#website'),
        url: abs('/'),
        name: 'Cervejaria Hoog Bier',
        inLanguage: 'pt-BR',
        publisher: { '@id': abs('/#business') },
      },
      {
        '@type': 'ItemList',
        name: 'Cervejas Hoog Bier',
        itemListElement: BEERS.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Product',
            name: `${b.name} — ${b.style}`,
            description: b.desc,
            image: abs(`/images/beers/${b.id}-poster.webp`),
            brand: { '@type': 'Brand', name: SITE.name },
            category: 'Cerveja artesanal',
          },
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  }
}
