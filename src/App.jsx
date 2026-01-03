import React, { useState } from 'react';
import { MapPin, Instagram, Facebook, Phone, Beer, Clock, Menu, X } from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Dados das Cervejas (Simulando um banco de dados)
  const beers = [
    { name: "Pilsen Hoog", style: "Puro Malte", desc: "Leve, cristalina e refrescante. O clássico perfeito.", abv: "4.5%" },
    { name: "IPA", style: "India Pale Ale", desc: "Amargor presente e aroma cítrico explosivo.", abv: "6.0%" },
    { name: "Red Lager", style: "Século XIII", desc: "Cor avermelhada e notas de caramelo tostado.", abv: "4.8%" },
    { name: "California", style: "Common", desc: "Híbrida e marcante, fermentada em altas temperaturas.", abv: "5.0%" },
  ];

  return (
    <div className="min-h-screen bg-beer-dark text-gray-100 font-sans selection:bg-beer-gold selection:text-black">
      
      {/* --- NAVBAR (Topo) --- */}
      <nav className="fixed w-full z-50 bg-beer-dark/95 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo (Texto por enquanto) */}
            <div className="flex-shrink-0 font-bold text-2xl text-beer-gold tracking-widest uppercase cursor-pointer">
              Hoog Bier
            </div>
            
            {/* Menu Desktop */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#home" className="hover:text-beer-gold px-3 py-2 rounded-md text-sm font-medium transition-colors">Início</a>
                <a href="#beers" className="hover:text-beer-gold px-3 py-2 rounded-md text-sm font-medium transition-colors">Cervejas</a>
                <a href="#location" className="hover:text-beer-gold px-3 py-2 rounded-md text-sm font-medium transition-colors">Localização</a>
                <a href="https://wa.me/553125641240" target="_blank" className="bg-beer-gold hover:bg-yellow-500 text-black px-5 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105">
                  Pedir Agora
                </a>
              </div>
            </div>

            {/* Botão Menu Mobile */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-beer-gold hover:text-white">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Menu Mobile (Abre e fecha) */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-b border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
              <a href="#home" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium hover:text-beer-gold">Início</a>
              <a href="#beers" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium hover:text-beer-gold">Cervejas</a>
              <a href="#location" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium hover:text-beer-gold">Localização</a>
            </div>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION (Capa) --- */}
      <section id="home" className="relative h-screen flex items-center justify-center pt-16">
        {/* Imagem de Fundo (Escura) */}
        <div className="absolute inset-0 bg-black">
             {/* DICA: Coloque uma foto chamada 'fundo.jpg' na pasta public/images para aparecer aqui */}
            <img src="/images/hero-bg.jpg" alt="Fundo" className="w-full h-full object-cover opacity-40" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h2 className="text-beer-gold font-bold tracking-widest text-lg mb-4 uppercase">Cervejaria Artesanal</h2>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Momentos Que Pedem <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-beer-gold to-yellow-200">Uma Hoog</span>
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Produzida em Contagem com puro malte e paixão. O sabor autêntico do pub direto para o seu copo.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#beers" className="bg-beer-gold text-black font-bold py-4 px-10 rounded-full hover:bg-white transition-all shadow-lg hover:shadow-beer-gold/50">
              Nossos Estilos
            </a>
            <a href="#location" className="border-2 border-white/30 hover:border-white text-white font-bold py-4 px-10 rounded-full hover:bg-white/10 transition-all backdrop-blur-sm">
              Visitar o Pub
            </a>
          </div>
        </div>
      </section>

      {/* --- LISTA DE CERVEJAS --- */}
      <section id="beers" className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">No Tap <span className="text-beer-gold">&</span> Garrafa</h2>
            <div className="w-24 h-1 bg-beer-gold mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beers.map((beer, index) => (
              <div key={index} className="bg-beer-dark rounded-2xl p-8 border border-gray-800 hover:border-beer-gold transition-all duration-300 hover:-translate-y-2 group shadow-xl">
                <div className="h-16 w-16 bg-beer-gold/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-beer-gold transition-colors mx-auto">
                  <Beer className="text-beer-gold group-hover:text-black" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 text-center">{beer.name}</h3>
                <div className="text-center mb-4">
                    <span className="inline-block bg-gray-800 text-beer-gold text-xs px-3 py-1 rounded-full uppercase tracking-wider font-bold border border-gray-700">{beer.style}</span>
                </div>
                <p className="text-gray-400 text-sm text-center mb-6 leading-relaxed">{beer.desc}</p>
                <div className="border-t border-gray-800 pt-4 text-center">
                    <span className="text-beer-gold font-mono font-bold">{beer.abv}</span> <span className="text-gray-500 text-xs">ABV</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- LOCALIZAÇÃO E CONTATO --- */}
      <section id="location" className="py-24 bg-beer-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-beer-gold/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">Onde a Mágica Acontece</h2>
            <p className="text-gray-400 mb-10 text-lg leading-relaxed">
              Nosso Pub é o coração da fábrica. Um ambiente industrial, familiar e com música ao vivo.
              Venha ver os tanques de fermentação enquanto bebe um chopp extraído na hora.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-beer-gold/50 transition-colors">
                <MapPin className="text-beer-gold flex-shrink-0 mt-1" />
                <div>
                    <h4 className="text-white font-bold">Endereço</h4>
                    <span className="text-gray-400 text-sm">Rua Rio Ural, 200 - Riacho das Pedras, Contagem - MG</span>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-beer-gold/50 transition-colors">
                <Clock className="text-beer-gold flex-shrink-0 mt-1" />
                <div>
                    <h4 className="text-white font-bold">Horário de Funcionamento</h4>
                    <span className="text-gray-400 text-sm block">Qua a Sex: 17h - 23h</span>
                    <span className="text-gray-400 text-sm block">Sáb: 12h - 23h</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-6 mt-12">
              <a href="https://www.instagram.com/cervejariahoogbier/" target="_blank" className="text-gray-400 hover:text-pink-600 transition-colors transform hover:scale-110">
                <Instagram size={36} />
              </a>
              <a href="https://www.facebook.com/cervejariahoogbier/" target="_blank" className="text-gray-400 hover:text-blue-600 transition-colors transform hover:scale-110">
                <Facebook size={36} />
              </a>
              <a href="https://wa.me/553125641240" target="_blank" className="text-gray-400 hover:text-green-500 transition-colors transform hover:scale-110">
                <Phone size={36} />
              </a>
            </div>
          </div>
          
          <div className="h-[500px] bg-gray-800 rounded-2xl overflow-hidden border-4 border-gray-800 shadow-2xl relative">
             {/* Mapa do Google incorporado */}
             <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3751.109163773666!2d-44.0538!3d-19.9572!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa6bf8f8f8f8f8f%3A0x0!2sRua%20Rio%20Ural%2C%20200%20-%20Riacho%20das%20Pedras%2C%20Contagem%20-%20MG!5e0!3m2!1spt-BR!2sbr!4v1600000000000!5m2!1spt-BR!2sbr" 
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen="" 
                loading="lazy"
                className="grayscale hover:grayscale-0 transition-all duration-700"
              ></iframe>
          </div>
        </div>
      </section>

      {/* --- RODAPÉ --- */}
      <footer className="bg-black py-10 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-beer-gold tracking-widest uppercase mb-4">Hoog Bier</h2>
          <p className="text-gray-500 text-sm mb-6">
            © {new Date().getFullYear()} Todos os direitos reservados.
          </p>
          <div className="inline-block bg-gray-900 px-4 py-2 rounded-lg border border-gray-800">
             <p className="text-gray-400 text-xs">Desenvolvido por <a href="https://www.yankousdevweb.com.br/" className="text-beer-gold hover:underline font-bold">Yankous Dev</a></p>
          </div>
          <p className="text-gray-600 text-[10px] mt-8 uppercase tracking-widest">Beba com moderação. Se beber, não dirija.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;