# Hoog Bier — site oficial

Site da Cervejaria Hoog Bier (Contagem-MG): catálogo, pedido por WhatsApp, calculadora de chopp para eventos, agenda e pontos de venda.
Stack: **React 19 + Vite 7 + Tailwind 3**, pré-renderizado no build (SEO). Motion design com **GSAP 3 (ScrollTrigger + SplitText)** e **Lenis** (smooth scroll).

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build + pré-renderização (HTML estático) + `sitemap.xml` e `robots.txt` |
| `npm run preview` | Serve o build em `localhost:4173` |
| `npm run lint` | ESLint |
| `npm run images` | Regenera `public/images` a partir de `design/source` |

## Configuração (`.env`)

- `VITE_SITE_URL` — **domínio real** (canonical, Open Graph, sitemap, JSON-LD).
- `VITE_GA_ID` — opcional, Google Analytics 4 (só carrega após aceite do visitante).
- `VITE_BEHOLD_URL` — opcional, feed do Instagram via Behold.so.

## Onde editar o conteúdo

- `src/config/site.js` — telefone/WhatsApp, endereço, horários, redes sociais, links das planilhas, letreiro "Hoje nas torneiras".
- `src/data/beers.js` — cervejas (dados conferidos com os rótulos), formatos e categorias.
- `src/data/faqs.js` — perguntas frequentes (também geram o schema `FAQPage`).
- **Planilhas Google** — Agenda (`titulo, dia, horario, descricao, categoria, destaque`) e Parceiros (`nome, endereco`) atualizam o site sem novo deploy.

## Estrutura

```
src/
  config/      dados do negócio
  data/        cervejas, FAQ, quiz
  lib/         whatsapp, calculadora, horário, SEO (JSON-LD), analytics, gsap/motion (Lenis, trava de scroll, intro)
  hooks/       useSheet, useCart, useAgeGate, useMotion, scroll-spy...
  components/  navbar, footer, modais, drawer do pedido, age gate, consentimento
    motion/    SplitReveal, ScrubText, VelocityMarquee, Magnetic, Cursor, Counter, Liquid, Bubbles
  sections/    Hero, Manifesto, Processo, Catálogo (palco), Eventos, Harmonização, Agenda, FAQ...
scripts/       otimização de imagens e pré-renderização
design/source  imagens originais (fora do bundle)
```

## Motion design

Visual escuro com detalhes em dourado. No desktop, o hero fica fixo e o catálogo sobe por cima dele como uma folha; a cerveja "enchendo" aparece como detalhe no logo da abertura e no botão do Clube VIP.

- **Animações só via JS.** Nada é escondido por CSS: sem JS, o HTML pré-renderizado aparece inteiro.
- **`useMotion`** (`src/hooks/useMotion.js`) cria as animações dentro de `gsap.matchMedia()` — quem ativa "reduzir movimento" no sistema recebe o site estático (sem Lenis, sem pins).
- **Intro:** o hero só anima depois que a tela de abertura sai **e** a idade foi confirmada (`whenIntro()` em `src/lib/motion.js`).
- **Scroll travado** (modais, menu): use `lockScroll()` / `unlockScroll()`, que funcionam com o Lenis.
- **Âncoras:** o Lenis respeita o `scroll-padding-top` do CSS (espaço da navbar) — não some offset manual.
- **Links `#cerveja-<id>`** em qualquer lugar abrem a cerveja no palco do catálogo.
- **Rótulo do cursor:** adicione `data-cursor="Texto"` a um elemento.
