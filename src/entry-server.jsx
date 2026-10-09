import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import { buildJsonLd } from './lib/seo'

// Usado apenas no build (scripts/prerender.mjs) para gerar o HTML estático.
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

export const jsonLd = () => JSON.stringify(buildJsonLd())
