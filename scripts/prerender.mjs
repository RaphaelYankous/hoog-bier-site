// Pré-renderiza o app para HTML estático (SEO + primeiro paint) e gera sitemap/robots.
// Rodado automaticamente por `npm run build`.
import { readFile, writeFile, rm } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
import { loadEnv } from 'vite'

const root = process.cwd()
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')
const env = loadEnv('production', root, 'VITE_')
const siteUrl = (env.VITE_SITE_URL || 'https://www.hoogbier.com.br').replace(/\/$/, '')

const { render, jsonLd } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)

let html = await readFile(path.join(dist, 'index.html'), 'utf8')
if (!html.includes('<!--app-html-->')) throw new Error('Placeholder <!--app-html--> não encontrado em dist/index.html')

html = html
  .replace('<!--app-html-->', render())
  .replace('<!--jsonld-->', `<script type="application/ld+json">${jsonLd().replace(/</g, '\\u003c')}</script>`)
await writeFile(path.join(dist, 'index.html'), html)

const today = new Date().toISOString().slice(0, 10)
await writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n  <url>\n    <loc>${siteUrl}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n    <image:image><image:loc>${siteUrl}/images/og-image.jpg</image:loc></image:image>\n  </url>\n</urlset>\n`,
)
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`)

await rm(ssrDir, { recursive: true, force: true })
console.log(`✓ Pré-renderizado (${(html.length / 1024).toFixed(1)} kB) · sitemap/robots gerados para ${siteUrl}`)
