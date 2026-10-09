// Gera os assets otimizados (public/images) a partir de design/source.
// Uso: npm run images
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const SRC = 'design/source'
const OUT = 'public/images'
await mkdir(`${OUT}/beers`, { recursive: true })

import { bottles, bottlePath } from './bottles.mjs'

for (const [id, b] of Object.entries(bottles)) {
  const input = path.join(SRC, b.file)
  const meta = await sharp(input).metadata()
  const pad = 14
  const left = Math.max(0, Math.round(b.cx - b.body[0] / 2 - pad))
  const top = Math.max(0, b.cap[0] - pad)
  const width = Math.min(meta.width - left, Math.round(b.body[0] + pad * 2))
  const height = Math.min(meta.height - top, b.bottom - top + pad)
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${meta.width}" height="${meta.height}"><path d="${bottlePath(b)}" fill="#fff"/></svg>`,
  )
  const maskPng = await sharp(mask).resize(meta.width, meta.height).blur(1.4).png().toBuffer()
  const cutout = await sharp(input)
    .ensureAlpha()
    .composite([{ input: maskPng, blend: 'dest-in' }])
    .png()
    .toBuffer()
  const rgba = await sharp(cutout)
    .extract({ left, top, width, height })
    .resize({ height: 760, withoutEnlargement: false })
    .webp({ quality: 86, alphaQuality: 90 })
    .toFile(`${OUT}/beers/${id}.webp`)
  // poster completo (ficha técnica)
  await sharp(input).resize({ width: 900, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`${OUT}/beers/${id}-poster.webp`)
  console.log(id, rgba.width + 'x' + rgba.height)
}

// Hero: copos (recorta o texto do poster)
await sharp(`${SRC}/hero-bg.jpg`)
  .extract({ left: 312, top: 20, width: 558, height: 700 })
  .resize({ width: 720 })
  .webp({ quality: 78 })
  .toFile(`${OUT}/hero-glasses.webp`)

// Logo branca com transparência (preto -> branco, branco -> transparente)
const logoRaw = await sharp(`${SRC}/logo-oficial.png`).resize({ width: 600, kernel: 'lanczos3' }).removeAlpha().raw().toBuffer({ resolveWithObject: true })
const { data, info } = logoRaw
const out = Buffer.alloc(info.width * info.height * 4)
for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
  const lum = Math.min(data[i], data[i + 1], data[i + 2]) // verde do contorno conta como "tinta"
  const a = Math.max(0, Math.min(255, Math.round((1 - (lum - 40) / 170) * 255)))
  out[j] = 255; out[j + 1] = 255; out[j + 2] = 255; out[j + 3] = a
}
await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).trim().png({ compressionLevel: 9 }).toFile(`${OUT}/logo-hoog.png`)
console.log('ok')

// Logo menor (nav/footer) + ícones + imagem social (OG)
const logo = await sharp(`${OUT}/logo-hoog.png`).toBuffer()
await sharp(logo).resize({ width: 240 }).png({ compressionLevel: 9, palette: false }).toFile(`${OUT}/logo-hoog.png.tmp`)
await sharp(`${OUT}/logo-hoog.png.tmp`).toFile(`${OUT}/logo-hoog.png`).catch(() => {})
const { unlink } = await import('node:fs/promises')
await unlink(`${OUT}/logo-hoog.png.tmp`).catch(() => {})

const goldLogo = await sharp(logo).tint('#F59E0B').toBuffer()
for (const size of [32, 180, 192, 512]) {
  const inner = await sharp(goldLogo).resize({ width: Math.round(size * 0.72), height: Math.round(size * 0.72), fit: 'inside' }).toBuffer()
  await sharp({ create: { width: size, height: size, channels: 4, background: '#0f0e0c' } })
    .composite([{ input: inner, gravity: 'center' }])
    .png()
    .toFile(`${OUT}/icon-${size}.png`)
}

const glasses = await sharp(`${OUT}/hero-glasses.webp`).resize({ height: 630 }).jpeg({ quality: 88 }).toBuffer()
const gm = await sharp(glasses).metadata()
const ogLogo = await sharp(logo).resize({ width: 300 }).toBuffer()
const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#0f0e0c"/><stop offset="0.4" stop-color="#0f0e0c" stop-opacity="0"/></linearGradient></defs>
  <rect x="${1200 - gm.width}" width="${gm.width}" height="630" fill="url(#g)" transform="translate(0 0)"/>
  <text x="70" y="360" font-family="Impact, Arial Black, sans-serif" font-size="92" fill="#fff">CHOPP ARTESANAL</text>
  <text x="70" y="450" font-family="Impact, Arial Black, sans-serif" font-size="92" fill="#F59E0B">PURO MALTE</text>
  <text x="72" y="520" font-family="Arial, sans-serif" font-size="30" fill="#d4d4d8">Delivery e chopeiras para eventos · Contagem-MG</text>
</svg>`)
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#0f0e0c' } })
  .composite([
    { input: glasses, left: 1200 - gm.width, top: 0 },
    { input: await sharp(svg).png().toBuffer(), left: 0, top: 0 },
    { input: ogLogo, left: 70, top: 70 },
  ])
  .jpeg({ quality: 88 })
  .toFile(`${OUT}/og-image.jpg`)
console.log('icons + og ok')
