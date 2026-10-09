import { MessageCircle } from 'lucide-react'
import { MSG, waLink } from '../lib/whatsapp'
import { track } from '../lib/analytics'

export default function WhatsAppFloat() {
  return (
    <a
      href={waLink(MSG.generic)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Hoog Bier no WhatsApp"
      onClick={() => track('whatsapp_click', { location: 'float' })}
      className="group fixed bottom-5 right-4 z-[60] md:bottom-6 md:right-6"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-green-500/60 motion-reduce:hidden" />
      <span className="relative flex items-center gap-2 rounded-full bg-green-500 p-4 text-white shadow-2xl transition group-hover:scale-105 group-hover:bg-green-400">
        <MessageCircle size={28} fill="white" />
        <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-300 group-hover:max-w-40 group-hover:pr-2 md:inline">Pedir no WhatsApp</span>
      </span>
    </a>
  )
}
