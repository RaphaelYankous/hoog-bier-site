import { useEffect, useState } from 'react'
import { Instagram } from 'lucide-react'
import { SHEETS, SITE } from '../config/site'
import { BEERS } from '../data/beers'

// Sem feed configurado, usamos as próprias artes da marca (nada de fotos genéricas).
const FALLBACK = [
  ...BEERS.slice(0, 5).map((b) => ({ src: `/images/beers/${b.id}-poster.webp`, alt: `Arte da ${b.name}` })),
  { src: '/images/hero-glasses.webp', alt: 'Copos de chopp Hoog Bier' },
]

export default function InstagramFeed() {
  const [feed, setFeed] = useState([])

  useEffect(() => {
    if (!SHEETS.instagram) return undefined
    const ctrl = new AbortController()
    fetch(SHEETS.instagram, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then((data) => {
        const posts = (Array.isArray(data) ? data : data.posts || []).slice(0, 6)
        setFeed(posts.map((p) => ({ src: p.mediaUrl || p.thumbnailUrl, href: p.permalink, alt: p.caption?.slice(0, 80) || 'Post do Instagram da Hoog Bier' })).filter((p) => p.src))
      })
      .catch((e) => e.name !== 'AbortError' && console.warn('[instagram]', e))
    return () => ctrl.abort()
  }, [])

  const items = feed.length ? feed : FALLBACK

  return (
    <section aria-labelledby="insta-title" className="bg-beer-dark">
      <h2 id="insta-title" className="sr-only">
        Instagram da Hoog Bier
      </h2>
      <ul className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-6">
        {items.map((it, i) => (
          <li key={it.src + i} className="group relative aspect-square overflow-hidden bg-zinc-900">
            <a href={it.href || SITE.social.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${it.alt} — abrir no Instagram`}>
              <img src={it.src} alt={it.alt} loading="lazy" decoding="async" width="400" height="400" className="h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-110 group-hover:opacity-100" />
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Instagram className="text-white" aria-hidden="true" />
              </span>
            </a>
          </li>
        ))}
      </ul>
      <div className="bg-black py-8 text-center">
        <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-display text-lg uppercase tracking-widest text-beer-gold transition hover:text-white">
          <Instagram size={18} aria-hidden="true" /> Siga {SITE.social.instagramHandle}
        </a>
      </div>
    </section>
  )
}
