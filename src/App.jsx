import React, { useState } from 'react';
import { MapPin, Instagram, Facebook, Phone, Beer, Truck, Menu, X, ShoppingBag, Store, Star, Clock, CheckCircle, ArrowRight } from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // DADOS DAS CERVEJAS
  // Nota: Mudei a ordem para deixar as mais populares (Pilsen/IPA) no topo
  const beers = [
    { 
      id: "pilsen",
      name: "Hoog Pilsen", 
      style: "Premium Lager", 
      tagline: "Leveza e equilíbrio.",
      desc: "Cerveja de baixa fermentação, coloração dourada brilhante e colarinho persistente. O equilíbrio perfeito entre o dulçor do malte e o lúpulo, resultando em altíssima drinkability.",
      abv: "4.5%", 
      ibu: "9",
      temp: "0 - 4ºC",
      pairing: "Churrasco, saladas, queijos frescos e dias quentes.",
      color: "from-yellow-300 to-yellow-500", // Cor do Brilho
      image: "/images/pilsen.jpg"
    },
    { 
      id: "ipa",
      name: "Hoog IPA", 
      style: "American IPA", 
      tagline: "Explosão de lúpulos cítricos.",
      desc: "Uma American IPA clássica. Coloração acobreada, corpo médio e amargor limpo e pronunciado. No aroma, destacam-se notas de frutas tropicais e cítricas provenientes do dry hopping.",
      abv: "6.5%", 
      ibu: "50",
      temp: "4 - 8ºC",
      pairing: "Hambúrgueres, comida mexicana, queijo gorgonzola.",
      color: "from-orange-500 to-amber-600",
      image: "/images/ipa.jpg"
    },
    { 
      id: "california",
      name: "California Common", 
      style: "Steam Beer", 
      tagline: "A híbrida com personalidade.",
      desc: "Estilo histórico californiano e um dos diferenciais da Hoog. Fermentada com levedura Lager em temperatura de Ale, trazendo notas rústicas, tostadas e amadeiradas.",
      abv: "5.0%", 
      ibu: "35",
      temp: "5 - 8ºC",
      pairing: "Carne de porco, grãos e pratos condimentados.",
      color: "from-amber-600 to-amber-800",
      image: "/images/california.jpg"
    },
    { 
      id: "seculo",
      name: "Século XIII", 
      style: "Red Lager", 
      tagline: "Maltada e avermelhada.",
      desc: "Lager de coloração rubi intensa. O destaque vai para a complexidade dos maltes, que trazem notas de caramelo, toffee e leve tostado, com final limpo.",
      abv: "4.8%", 
      ibu: "12",
      temp: "4 - 7ºC",
      pairing: "Carpaccio, massas com molho vermelho, frango assado.",
      color: "from-red-600 to-red-900",
      image: "/images/red.jpg"
    },
    { 
      id: "weiss",
      name: "Hoog Weiss", 
      style: "Hefeweizen", 
      tagline: "Trigo clássico alemão.",
      desc: "Cerveja de trigo não filtrada (turva) com espuma cremosa. A levedura traz os aromas característicos de banana e cravo. Baixo amargor e corpo aveludado.",
      abv: "4.7%", 
      ibu: "10",
      temp: "3 - 6ºC",
      pairing: "Salsichas alemãs, peixes, frutos do mar e sushi.",
      color: "from-yellow-200 to-yellow-400",
      image: "/images/weiss.jpg"
    },
    { 
      id: "paleale",
      name: "Hoog Pale Ale", 
      style: "American Pale Ale", 
      tagline: "Refrescante e aromática.",
      desc: "Versão mais leve e clara que a IPA, mas ainda focada no lúpulo. Traz aromas cítricos e florais com um amargor moderado, ideal para quem busca sabor sem peso.",
      abv: "5.0%", 
      ibu: "25",
      temp: "4 - 7ºC",
      pairing: "Frango grelhado, pizzas variadas e petiscos fritos.",
      color: "from-amber-400 to-orange-500",
      image: "/images/paleale.jpg"
    },
    { 
      id: "stout",
      name: "Hoog Stout", 
      style: "English Stout", 
      tagline: "Café e chocolate amargo.",
      desc: "Cerveja escura, quase preta, produzida com maltes torrados que remetem a café e chocolate. Apesar da cor, possui corpo médio-leve e final seco, fácil de beber.",
      abv: "4.8%", 
      ibu: "20",
      temp: "6 - 10ºC",
      pairing: "Sobremesas à base de chocolate, carnes de panela.",
      color: "from-gray-700 to-gray-900",
      image: "/images/stout.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-beer-dark text-gray-100 font-sans selection:bg-beer-gold selection:text-black">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-50 bg-beer-dark/95 backdrop-blur-md border-b border-gray-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <a href="#" className="flex-shrink-0 py-2 group">
               <img src="/images/logo-oficial.png" alt="Hoog Bier" className="h-20 w-auto transition-transform group-hover:scale-105" />
            </a>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                <a href="#home" className="hover:text-beer-gold text-sm font-bold uppercase tracking-widest transition-colors">Início</a>
                <a href="#cervejas" className="hover:text-beer-gold text-sm font-bold uppercase tracking-widest transition-colors">Cervejas</a>
                <a href="#fabrica" className="hover:text-beer-gold text-sm font-bold uppercase tracking-widest transition-colors">A Fábrica</a>
                <a href="https://wa.me/553125641240" target="_blank" className="bg-beer-gold hover:bg-white text-black px-6 py-3 rounded-md text-sm font-black transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center gap-2 uppercase tracking-wider transform hover:-translate-y-1">
                  <Truck size={18} /> Delivery
                </a>
              </div>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-beer-gold hover:text-white p-2 transition-colors">
                {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
              </button>
            </div>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-b border-gray-800 w-full animate-fade-in shadow-xl">
            <div className="px-4 pt-4 pb-6 space-y-3 text-center">
              <a href="#home" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-bold uppercase hover:bg-gray-800 rounded-lg text-beer-gold">Início</a>
              <a href="#cervejas" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-bold uppercase hover:bg-gray-800 rounded-lg text-beer-gold">Cervejas</a>
              <a href="#fabrica" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-bold uppercase hover:bg-gray-800 rounded-lg text-beer-gold">A Fábrica</a>
              <a href="https://wa.me/553125641240" className="block px-3 py-3 bg-green-600 text-white uppercase tracking-wide rounded-md font-bold mt-4 shadow-lg">WhatsApp</a>
            </div>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img src="/images/hero-bg.jpg" alt="Fábrica Hoog Bier" className="w-full h-full object-cover opacity-60 scale-105 animate-pulse-slow" />
            <div className="absolute inset-0 bg-gradient-to-t from-beer-dark via-beer-dark/40 to-black/60"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-10">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-beer-gold/90 text-black mb-8 shadow-[0_0_20px_rgba(245,158,11,0.3)] transform hover:scale-105 transition-transform cursor-default">
            <Star className="w-4 h-4 fill-black" />
            <span className="text-sm font-bold tracking-widest uppercase">Cervejaria Artesanal em Contagem</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white mb-6 leading-[0.9] uppercase drop-shadow-2xl tracking-tighter">
            Direto <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-beer-gold via-yellow-200 to-beer-gold">Da Fonte</span>
          </h1>
          
          <p className="mt-8 text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-12 leading-relaxed font-medium drop-shadow-lg">
            Produzimos cerveja com alma, sem atalhos. <br className="hidden md:block"/> 
            O frescor do tanque entregue no seu evento.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a href="https://wa.me/553125641240" target="_blank" className="bg-beer-gold text-black font-black py-5 px-12 rounded-lg hover:bg-white transition-all transform hover:-translate-y-1 shadow-[0_10px_30px_rgba(245,158,11,0.4)] flex items-center justify-center gap-3 text-lg uppercase tracking-widest">
              <ShoppingBag size={24} /> Pedir Chopp
            </a>
            <a href="#cervejas" className="group border-2 border-white/30 hover:border-white text-white hover:text-beer-gold font-bold py-5 px-12 rounded-lg transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest bg-black/20 backdrop-blur-md hover:bg-black/40">
              <Beer size={24} className="group-hover:rotate-12 transition-transform" /> Ver Estilos
            </a>
          </div>
        </div>
      </section>

      {/* --- DIFERENCIAIS --- */}
      <section className="py-20 bg-beer-dark border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center p-8 bg-gray-900/40 rounded-2xl border border-gray-800 hover:border-beer-gold/50 hover:bg-gray-900 transition-all duration-500 group">
                    <div className="bg-beer-gold/10 p-5 rounded-full mb-6 group-hover:bg-beer-gold group-hover:text-black transition-all duration-500">
                        <CheckCircle className="text-beer-gold group-hover:text-black w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 uppercase tracking-wide">Puro Malte</h3>
                    <p className="text-gray-400 leading-relaxed">Sem milho, sem arroz. Apenas água, malte, lúpulo e levedura de altíssima qualidade.</p>
                </div>
                <div className="flex flex-col items-center text-center p-8 bg-gray-900/40 rounded-2xl border border-gray-800 hover:border-beer-gold/50 hover:bg-gray-900 transition-all duration-500 group">
                    <div className="bg-beer-gold/10 p-5 rounded-full mb-6 group-hover:bg-beer-gold group-hover:text-black transition-all duration-500">
                        <Clock className="text-beer-gold group-hover:text-black w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 uppercase tracking-wide">Tempo Certo</h3>
                    <p className="text-gray-400 leading-relaxed">Respeitamos o tempo de maturação. Nossas cervejas ficam no tanque até atingirem a perfeição.</p>
                </div>
                <div className="flex flex-col items-center text-center p-8 bg-gray-900/40 rounded-2xl border border-gray-800 hover:border-beer-gold/50 hover:bg-gray-900 transition-all duration-500 group">
                    <div className="bg-beer-gold/10 p-5 rounded-full mb-6 group-hover:bg-beer-gold group-hover:text-black transition-all duration-500">
                        <Truck className="text-beer-gold group-hover:text-black w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 uppercase tracking-wide">Logística Própria</h3>
                    <p className="text-gray-400 leading-relaxed">Entrega rápida e especializada. Seu chopp chega na temperatura ideal para o evento.</p>
                </div>
            </div>
        </div>
      </section>

      {/* --- VITRINE DE CERVEJAS (COM HOLOFOTE) --- */}
      <section id="cervejas" className="py-24 bg-beer-dark relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-32">
            <h2 className="text-beer-gold font-bold tracking-[0.3em] uppercase text-sm mb-4">Nossa Produção</h2>
            <h3 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tight">Catálogo Hoog</h3>
            <div className="w-32 h-1.5 bg-beer-gold mx-auto mt-8 rounded-full"></div>
          </div>

          <div className="space-y-48"> {/* Espaçamento grande para cada cerveja brilhar */}
            {beers.map((beer, index) => (
              <div key={beer.id} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24 group`}>
                
                {/* --- LADO DA FOTO (HOLOFOTE) --- */}
                <div className="w-full lg:w-1/2 relative perspective-1000">
                  {/* Glow colorido atrás da cerveja */}
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-b ${beer.color} opacity-20 blur-[90px] rounded-full group-hover:opacity-30 transition-opacity duration-1000`}></div>
                  
                  {/* Container da Imagem com Animação */}
                  <div className="relative z-10 mx-auto w-full max-w-[400px] aspect-[4/5] flex items-center justify-center transition-transform duration-700 hover:scale-110 motion-safe:animate-float">
                      <img 
                        src={beer.image} 
                        alt={beer.name} 
                        className="max-h-full max-w-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      {/* Fallback caso falte a foto */}
                      <div className="hidden w-[300px] h-[400px] bg-gray-900/80 backdrop-blur-sm border-2 border-dashed border-gray-700 rounded-3xl flex-col items-center justify-center text-center p-8 shadow-2xl">
                           <Beer size={80} className="text-beer-gold mb-6 opacity-80" />
                           <p className="text-white font-bold uppercase text-xl">{beer.name}</p>
                           <p className="text-sm text-gray-500 mt-4">Imagem não encontrada:<br/>{beer.image}</p>
                      </div>
                  </div>
                </div>

                {/* --- LADO DO TEXTO --- */}
                <div className="w-full lg:w-1/2">
                  <div className="flex items-center gap-4 mb-6">
                    <span className={`bg-beer-gold text-black font-black uppercase tracking-widest text-xs py-1.5 px-4 rounded-sm shadow-[0_0_15px_rgba(245,158,11,0.4)]`}>
                      {beer.style}
                    </span>
                  </div>

                  <h3 className="text-5xl lg:text-7xl font-black text-white mb-4 uppercase leading-none tracking-tighter">{beer.name}</h3>
                  <p className="text-2xl text-gray-400 font-serif italic mb-8 border-l-4 border-beer-gold pl-6 py-2">{beer.tagline}</p>
                  
                  <p className="text-gray-300 text-lg leading-loose mb-10 text-justify font-light">
                    {beer.desc}
                  </p>

                  {/* Grid Técnico Moderno */}
                  <div className="grid grid-cols-3 gap-4 border-t border-gray-800 pt-8 mb-8">
                    <div className="bg-gray-900/50 p-4 border border-gray-800 rounded-xl text-center hover:border-beer-gold/30 transition-colors">
                        <span className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">ABV</span>
                        <span className="text-2xl font-bold text-white">{beer.abv}</span>
                    </div>
                    <div className="bg-gray-900/50 p-4 border border-gray-800 rounded-xl text-center hover:border-beer-gold/30 transition-colors">
                        <span className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">IBU</span>
                        <span className="text-2xl font-bold text-white">{beer.ibu}</span>
                    </div>
                    <div className="bg-gray-900/50 p-4 border border-gray-800 rounded-xl text-center hover:border-beer-gold/30 transition-colors">
                        <span className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Temp.</span>
                        <span className="text-2xl font-bold text-white">{beer.temp}</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gray-900 to-transparent p-5 border-l-4 border-gray-700 rounded-r-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Star size={18} className="text-beer-gold fill-beer-gold" />
                        <span className="text-xs text-beer-gold uppercase font-bold tracking-widest">Harmonização</span>
                      </div>
                      <p className="text-base text-gray-300">{beer.pairing}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- A FÁBRICA --- */}
      <section id="fabrica" className="py-24 relative bg-black border-t border-gray-900">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-fixed opacity-10 grayscale"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
                
                <div>
                    <h2 className="text-beer-gold font-bold tracking-widest uppercase mb-4 text-sm">Estrutura</h2>
                    <h3 className="text-5xl font-black text-white mb-8 uppercase tracking-tight">Fábrica & Loja</h3>
                    
                    <p className="text-gray-300 mb-6 text-xl leading-relaxed font-light">
                        A Hoog Bier é um marco da produção artesanal em Contagem. No bairro Riacho das Pedras, nossa planta une tecnologia e tradição.
                    </p>
                    <p className="text-gray-400 mb-12 leading-relaxed">
                        Focamos na distribuição de barris e no atendimento a eventos, mas nossa loja de fábrica está sempre de portas abertas para quem quer levar o frescor para casa.
                    </p>

                    <div className="space-y-8">
                        <div className="flex gap-6 items-start group">
                            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-beer-gold group-hover:bg-beer-gold group-hover:text-black transition-colors"><Truck size={28} /></div>
                            <div>
                                <h4 className="text-xl font-bold text-white uppercase mb-2">Delivery de Chopp</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">Levamos chopeira elétrica e barris (30L/50L) para sua festa. Instalação profissional e recolhimento inclusos.</p>
                            </div>
                        </div>

                        <div className="flex gap-6 items-start group">
                            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-beer-gold group-hover:bg-beer-gold group-hover:text-black transition-colors"><Store size={28} /></div>
                            <div>
                                <h4 className="text-xl font-bold text-white uppercase mb-2">Loja de Fábrica</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">Retirada de Growlers, barris e garrafas diretamente no local de produção. O chopp mais fresco da cidade.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-beer-dark/90 backdrop-blur-xl border border-gray-700 p-10 lg:p-12 shadow-2xl rounded-3xl">
                    <h4 className="text-2xl font-black text-white mb-10 uppercase text-center pb-6 border-b border-gray-800 tracking-wide">Contato & Visita</h4>
                    
                    <div className="space-y-8 text-sm">
                        <div className="flex items-start gap-5">
                            <MapPin className="text-beer-gold shrink-0 mt-1" size={24} />
                            <div>
                                <strong className="block text-white text-base uppercase tracking-wider mb-1">Endereço</strong>
                                <span className="text-gray-400 text-lg">Rua Rio Ural, 200<br/>Riacho das Pedras, Contagem - MG</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-5">
                            <Clock className="text-beer-gold shrink-0 mt-1" size={24} />
                            <div>
                                <strong className="block text-white text-base uppercase tracking-wider mb-1">Horário Comercial</strong>
                                <span className="text-gray-400 text-lg">Seg - Sex: 09h às 18h</span><br/>
                                <span className="text-gray-400 text-lg">Sábado: 09h às 13h</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-5">
                            <Phone className="text-beer-gold shrink-0 mt-1" size={24} />
                            <div>
                                <strong className="block text-white text-base uppercase tracking-wider mb-1">Fale Conosco</strong>
                                <span className="text-gray-400 font-bold text-2xl tracking-wide">(31) 2564-1240</span>
                            </div>
                        </div>
                    </div>

                    <a href="https://wa.me/553125641240" target="_blank" className="mt-10 w-full bg-green-600 hover:bg-green-500 text-white font-black py-5 rounded-xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-sm shadow-xl hover:shadow-green-500/20 transform hover:-translate-y-1">
                        <ShoppingBag size={20} /> Orçamento via WhatsApp
                    </a>
                </div>

            </div>
        </div>
      </section>

      {/* --- RODAPÉ --- */}
      <footer className="bg-black py-16 border-t border-gray-900 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
            <img src="/images/logo-oficial.png" alt="Hoog Bier" className="h-28 w-auto mb-10 opacity-60 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0" />
            
            <div className="flex justify-center gap-8 mb-10">
              <a href="https://instagram.com/cervejariahoogbier" target="_blank" className="p-3 rounded-full bg-gray-900 text-gray-500 hover:text-white hover:bg-pink-600 transition-all transform hover:scale-110"><Instagram size={24} /></a>
              <a href="https://facebook.com/cervejariahoogbier" target="_blank" className="p-3 rounded-full bg-gray-900 text-gray-500 hover:text-white hover:bg-blue-600 transition-all transform hover:scale-110"><Facebook size={24} /></a>
              <a href="https://wa.me/553125641240" target="_blank" className="p-3 rounded-full bg-gray-900 text-gray-500 hover:text-white hover:bg-green-600 transition-all transform hover:scale-110"><Phone size={24} /></a>
            </div>

            <p className="text-gray-500 text-sm font-medium">
             © {new Date().getFullYear()} Cervejaria Hoog Bier Ltda. Todos os direitos reservados.
            </p>
            <p className="text-gray-700 text-[10px] mt-6 uppercase font-bold tracking-[0.2em] border-t border-gray-900 pt-6 w-full max-w-md mx-auto">
                Beba com moderação. Venda proibida para menores de 18 anos.
            </p>
        </div>
      </footer>
    </div>
  );
}

export default App;