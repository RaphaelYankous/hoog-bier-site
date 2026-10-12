import { useEffect, useState } from 'react'
import { Instagram } from 'lucide-react'
import { SHEETS, SITE } from '../config/site'
import { BEERS } from '../data/beers'
import VelocityMarquee from '../components/motion/VelocityMarquee'

// Sem feed configurado, usamos as próprias artes da marca (nada de fotos genéricas).
const FALLBACK = [
  ...BEERS.map((b) => ({ src: `/images/beers/${b.id}-poster.webp`, alt: `Arte da ${b.name}` })),
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
        const posts = (Array.isArray(data) ? data : data.posts || []).slice(0, 8)
        setFeed(posts.map((p) => ({ src: p.mediaUrl || p.thumbnailUrl, href: p.permalink, alt: p.caption?.slice(0, 80) || 'Post do Instagram da Hoog Bier' })).filter((p) => p.src))
      })
      .catch((e) => e.name !== 'AbortError' && console.warn('[instagram]', e))
    return () => ctrl.abort()
  }, [])

  const items = feed.length ? feed : FALLBACK

  return (
    <section aria-labelledby="insta-title" className="overflow-hidden bg-black pb-8 pt-8">
      <div className="mx-auto mb-10 flex max-w-7xl flex-wrap items-end justify-between gap-4 px-4">
        <h2 id="insta-title" className="font-display text-[clamp(2.4rem,5vw,4rem)] font-bold uppercase leading-none tracking-tight text-white">
          Siga a <span className="font-serif font-normal normal-case italic text-beer-gold">Hoog</span>
        </h2>
        <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className="btn-ghost">
          <Instagram size={18} aria-hidden="true" /> {SITE.social.instagramHandle}
        </a>
      </div>

      <VelocityMarquee speed={35} skew={false}>
        {items.map((it, i) => (
          <a
            key={it.src + i}
            href={it.href || SITE.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="Abrir"
            aria-label={`${it.alt} — abrir no Instagram`}
            className="group relative mr-4 block aspect-square w-56 shrink-0 overflow-hidden rounded-[1.5rem] bg-zinc-900 md:w-72"
          >
            <img src={it.src} alt={it.alt} loading="lazy" decoding="async" width="400" height="400" className="h-full w-full object-cover transition duration-1000 ease-expo group-hover:scale-110" />
            <span className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <Instagram className="text-white" aria-hidden="true" />
            </span>
          </a>
        ))}
      </VelocityMarquee>
    </section>
  )
}
