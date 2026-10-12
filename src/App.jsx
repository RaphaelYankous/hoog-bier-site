import { useState } from 'react'
import { CartProvider } from './hooks/useCart'
import AgeGate from './components/AgeGate'
import { useAgeGate } from './hooks/useAgeGate'
import ConsentBanner from './components/ConsentBanner'
import CartDrawer from './components/CartDrawer'
import ReservaModal from './components/ReservaModal'
import PrivacyModal from './components/PrivacyModal'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import Cursor from './components/motion/Cursor'
import Hero from './sections/Hero'
import Manifesto from './sections/Manifesto'
import Marquee from './sections/Marquee'
import Process from './sections/Process'
import Catalog from './sections/Catalog'
import Events from './sections/Events'
import Experience from './sections/Experience'
import Agenda from './sections/Agenda'
import Faq from './sections/Faq'
import Factory from './sections/Factory'
import Partners from './sections/Partners'
import InstagramFeed from './sections/InstagramFeed'
import Club from './sections/Club'

export default function App() {
  const age = useAgeGate()
  const [reserva, setReserva] = useState(false)
  const [privacy, setPrivacy] = useState(false)

  return (
    <CartProvider>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo">
        {/* Narrativa: hero → as cervejas (sobem por cima do hero) → manifesto → do grão ao copo → serviço → comunidade */}
        <Hero />
        <Catalog />
        <Marquee />
        <Manifesto />
        <Process />
        <Events />
        <Experience />
        <Agenda onReserve={() => setReserva(true)} />
        <Faq />
        <Factory />
        <Partners />
        <InstagramFeed />
        <Club />
      </main>
      <Footer onOpenPrivacy={() => setPrivacy(true)} />

      <WhatsAppFloat />
      <CartDrawer />
      {reserva && <ReservaModal onClose={() => setReserva(false)} />}
      {privacy && <PrivacyModal onClose={() => setPrivacy(false)} />}
      <ConsentBanner enabled={age.status === 'ok'} onOpenPrivacy={() => setPrivacy(true)} />
      <AgeGate status={age.status} onConfirm={age.confirm} onDeny={age.deny} />
      <Cursor />
      <div className="grain" aria-hidden="true" />
    </CartProvider>
  )
}
