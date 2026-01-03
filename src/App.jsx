import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Instagram, Facebook, Phone, Beer, Truck, Menu, X, ShoppingBag, Store, Star, Clock, CheckCircle, Package, ArrowRight, MessageCircle, ChevronDown } from 'lucide-react';

// --- COMPONENTE DE ANIMAÇÃO (REVEAL ON SCROLL) ---
const Reveal = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`reveal ${isVisible ? 'active' : ''}`}>
      {children}
    </div>
  );
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const beers = [
    { 
      id: "pilsen", name: "Hoog Pilsen", style: "Premium Lager", tagline: "Leveza, equilíbrio e refrescância pura.",
      desc: "Nossa interpretação da paixão nacional. Uma cerveja de baixa fermentação, coloração dourada brilhante e colarinho branco persistente. O equilíbrio perfeito entre o dulçor suave do malte e o lúpulo nobre.",
      abv: "4.5%", ibu: "9", temp: "0 - 4ºC", pairing: "Churrasco, saladas e dias de sol.",
      color: "from-yellow-300 to-yellow-500", image: "/images/pilsen.jpg",
      formats: { longNeck: true, growler: true, keg30: true, keg50: true }
    },
    { 
      id: "ipa", name: "Hoog IPA", style: "American IPA", tagline: "Explosão de aromas e lúpulos cítricos.",
      desc: "Uma American IPA de respeito. Apresenta coloração acobreada, corpo médio e um amargor limpo. No aroma, o dry hopping generoso libera notas intensas de frutas tropicais e maracujá.",
      abv: "6.5%", ibu: "50", temp: "4 - 8ºC", pairing: "Hambúrgueres e queijo gorgonzola.",
      color: "from-orange-500 to-amber-600", image: "/images/ipa.jpg",
      formats: { longNeck: true, growler: true, keg30: true, keg50: true }
    },
    { 
      id: "california", name: "California Common", style: "Steam Beer", tagline: "A híbrida histórica com personalidade.",
      desc: "Um diferencial da Hoog. Estilo histórico fermentado com levedura Lager em temperaturas de Ale. Resulta em notas tostadas, amadeiradas e um perfil maltado rústico.",
      abv: "5.0%", ibu: "35", temp: "5 - 8ºC", pairing: "Carne de porco e feijoada.",
      color: "from-amber-600 to-amber-800", image: "/images/california.jpg",
      formats: { longNeck: true, growler: true, keg30: true, keg50: true }
    },
    { 
      id: "seculo", name: "Século XIII", style: "Red Lager", tagline: "A tradição maltada de cor avermelhada.",
      desc: "De coloração rubi intensa, foca na complexidade dos maltes especiais, trazendo notas de caramelo e toffee. Mantém o final limpo típico das Lagers.",
      abv: "4.8%", ibu: "12", temp: "4 - 7ºC", pairing: "Carpaccio e massas.",
      color: "from-red-600 to-red-900", image: "/images/red.jpg",
      formats: { longNeck: true, growler: true, keg30: true, keg50: false }
    },
    { 
      id: "weiss", name: "Hoog Weiss", style: "Hefeweizen", tagline: "O clássico trigo alemão aveludado.",
      desc: "Cerveja de trigo não filtrada, com espuma densa. A levedura traz aromas de banana e cravo. Baixo amargor, corpo aveludado e muito nutritiva.",
      abv: "4.7%", ibu: "10", temp: "3 - 6ºC", pairing: "Salsichas alemãs e peixes.",
      color: "from-yellow-200 to-yellow-400", image: "/images/weiss.jpg",
      formats: { longNeck: true, growler: true, keg30: true, keg50: true }
    },
    { 
      id: "paleale", name: "Hoog Pale Ale", style: "American Pale Ale", tagline: "Refrescante, aromática e fácil de beber.",
      desc: "Mais leve que a IPA, traz notas cítricas e florais com um amargor moderado. Ideal para quem busca sabor intenso sem peso.",
      abv: "5.0%", ibu: "25", temp: "4 - 7ºC", pairing: "Pizzas e petiscos fritos.",
      color: "from-amber-400 to-orange-500", image: "/images/paleale.jpg",
      formats: { longNeck: true, growler: true, keg30: true, keg50: true }
    },
    { 
      id: "stout", name: "Hoog Stout", style: "English Stout", tagline: "Notas intensas de café e chocolate.",
      desc: "Cerveja escura com maltes torrados que remetem a café expresso e chocolate amargo. Possui corpo médio-leve e final seco.",
      abv: "4.8%", ibu: "20", temp: "6 - 10ºC", pairing: "Sobremesas de chocolate.",
      color: "from-gray-700 to-gray-900", image: "/images/stout.jpg",
      formats: { longNeck: true, growler: true, keg30: true, keg50: false }
    }
  ];

  return (
    <div className="min-h-screen bg-beer-dark text-gray-100 font-sans selection:bg-beer-gold selection:text-black overflow-x-hidden">
      
      {/* WhatsApp Flutuante com Pulso */}
      <a href="https://wa.me/553125641240" target="_blank" className="fixed bottom-6 right-6 z-[60] group">
        <span className="absolute inset-0 rounded-full bg-green-500 opacity-70 animate-ping"></span>
        <div className="relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-transform transform group-hover:scale-110 flex items-center justify-center">
            <MessageCircle size={32} fill="white" />
        </div>
      </a>

      {/* NAVBAR */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-beer-dark/80 backdrop-blur-xl border-b border-white/5 py-2' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="#" className="flex-shrink-0 group relative">
               <div className="absolute inset-0 bg-beer-gold blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
               <img src="/images/logo-oficial.png" alt="Hoog Bier" className="h-16 md:h-20 w-auto relative z-10 drop-shadow-lg transition-transform duration-300 group-hover:scale-105" />
            </a>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                {['Início', 'Cervejas', 'A Fábrica'].map((item, i) => (
                    <a key={i} href={`#${item.toLowerCase().replace(' ', '')}`} className="relative text-sm font-bold uppercase tracking-widest text-gray-300 hover:text-white transition-colors group">
                        {item}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-beer-gold transition-all duration-300 group-hover:w-full"></span>
                    </a>
                ))}
                <a href="https://wa.me/553125641240" target="_blank" className="bg-gradient-to-r from-beer-gold to-yellow-400 hover:to-yellow-300 text-black px-8 py-3 rounded-full text-xs font-black transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] flex items-center gap-2 uppercase tracking-wider hover:-translate-y-1">
                  <Truck size={16} /> Pedir Agora
                </a>
              </div>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2 backdrop-blur-md bg-white/10 rounded-lg border border-white/10">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 w-full absolute top-full left-0 animate-fade-in">
            <div className="px-4 pt-4 pb-8 space-y-2 text-center">
              <a href="#home" onClick={() => setIsMenuOpen(false)} className="block py-4 text-beer-gold font-bold uppercase tracking-widest border-b border-white/5">Início</a>
              <a href="#cervejas" onClick={() => setIsMenuOpen(false)} className="block py-4 text-beer-gold font-bold uppercase tracking-widest border-b border-white/5">Cervejas</a>
              <a href="#fabrica" onClick={() => setIsMenuOpen(false)} className="block py-4 text-beer-gold font-bold uppercase tracking-widest border-b border-white/5">A Fábrica</a>
            </div>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center bg-fixed opacity-100 scale-105"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-beer-dark/30 via-beer-dark/60 to-beer-dark"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto pt-20">
          <Reveal>
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-black/40 backdrop-blur-md border border-beer-gold/30 mb-8 hover:border-beer-gold/60 transition-colors cursor-default">
                <Star className="w-3 h-3 text-beer-gold fill-beer-gold animate-pulse" />
                <span className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-gray-200">Desde 2018 em Contagem-MG</span>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-black text-white mb-6 leading-[0.95] uppercase tracking-tighter drop-shadow-2xl">
                O Melhor Chope <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-beer-gold via-yellow-200 to-beer-gold animate-gradient-x">Puro Malte</span>
                <span className="block text-2xl md:text-4xl lg:text-5xl mt-6 text-gray-200 font-bold tracking-normal font-serif italic">Para o seu evento</span>
            </h1>
          </Reveal>
          
          <Reveal delay={400}>
            <p className="mt-8 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                Barris, Long Necks e Growlers com o frescor da fábrica. <br/>
                <strong className="text-white">Qualidade que transforma a sua festa.</strong>
            </p>
          </Reveal>
          
          <Reveal delay={600}>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
                <a href="https://wa.me/553125641240" target="_blank" className="bg-beer-gold text-black font-black py-5 px-10 rounded-xl hover:bg-white transition-all transform hover:-translate-y-1 shadow-[0_0_40px_rgba(245,158,11,0.4)] flex items-center justify-center gap-3 text-base uppercase tracking-widest relative overflow-hidden group">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                    <ShoppingBag size={20} /> Fazer Pedido
                </a>
                <a href="#cervejas" className="border border-white/20 hover:border-white/50 text-white font-bold py-5 px-10 rounded-xl transition-all flex items-center justify-center gap-3 text-base uppercase tracking-widest bg-white/5 backdrop-blur-sm hover:bg-white/10">
                    <Beer size={20} /> Ver Catálogo
                </a>
            </div>
          </Reveal>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 animate-bounce">
            <ChevronDown size={32} />
          </div>
        </div>
      </section>

      {/* --- DIFERENCIAIS --- */}
      <section className="py-24 bg-beer-dark border-b border-white/5 bg-noise">
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: CheckCircle, title: "Puro Malte", desc: "Sem milho ou arroz. Apenas insumos nobres importados." },
                    { icon: Clock, title: "Maturação Lenta", desc: "Respeitamos o tempo da natureza. Sem aceleradores químicos." },
                    { icon: Truck, title: "Logística Própria", desc: "Entrega rápida e refrigerada para toda região de Contagem e Bh." }
                ].map((item, idx) => (
                    <Reveal key={idx} delay={idx * 200}>
                        <div className="flex flex-col items-center text-center p-10 rounded-3xl border border-white/5 bg-gradient-to-b from-gray-900 to-transparent hover:border-beer-gold/30 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] transition-all duration-500 group">
                            <div className="bg-gray-800/50 p-5 rounded-2xl mb-6 group-hover:bg-beer-gold group-hover:text-black transition-all duration-500 shadow-lg">
                                <item.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">{item.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
      </section>

      {/* --- VITRINE DE CERVEJAS --- */}
      <section id="cervejas" className="py-24 bg-beer-dark relative overflow-hidden bg-noise">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal>
            <div className="text-center mb-32">
                <span className="text-beer-gold font-bold tracking-[0.4em] uppercase text-xs mb-4 block">Nossa Alma</span>
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">Catálogo <span className="text-beer-gold">Hoog</span></h2>
            </div>
          </Reveal>

          <div className="space-y-40"> 
            {beers.map((beer, index) => (
              <div key={beer.id} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-32 group`}>
                
                {/* --- FOTO --- */}
                <div className="w-full lg:w-1/2 relative perspective-1000">
                  <Reveal delay={200}>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-b ${beer.color} opacity-20 blur-[100px] rounded-full group-hover:opacity-30 transition-opacity duration-1000`}></div>
                    
                    <div className="relative z-10 mx-auto w-full max-w-[350px] aspect-[4/5] flex items-center justify-center animate-float hover:scale-105 transition-transform duration-700 cursor-pointer">
                        <img 
                            src={beer.image} 
                            alt={beer.name} 
                            className="max-h-full max-w-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]" 
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                        <div className="hidden w-[300px] h-[400px] bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl flex-col items-center justify-center text-center p-8">
                            <Beer size={60} className="text-beer-gold mb-4 opacity-50" />
                            <p className="text-white font-bold uppercase">{beer.name}</p>
                        </div>
                    </div>
                  </Reveal>
                </div>

                {/* --- TEXTO --- */}
                <div className="w-full lg:w-1/2">
                  <Reveal>
                    <div className="flex items-center gap-4 mb-6">
                        <span className={`bg-beer-gold text-black font-black uppercase tracking-widest text-[10px] py-1.5 px-4 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.4)]`}>
                        {beer.style}
                        </span>
                        <div className="h-px bg-white/10 flex-1"></div>
                    </div>

                    <h3 className="text-5xl lg:text-7xl font-black text-white mb-4 uppercase leading-none tracking-tighter">{beer.name}</h3>
                    <p className="text-2xl text-gray-500 font-serif italic mb-8">{beer.tagline}</p>
                    
                    <p className="text-gray-300 text-lg leading-loose mb-10 font-light text-justify border-l-2 border-white/10 pl-6">
                        {beer.desc}
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[{ l: 'ABV', v: beer.abv }, { l: 'IBU', v: beer.ibu }, { l: 'TEMP', v: beer.temp }].map((stat, i) => (
                            <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 text-center hover:bg-white/10 transition-colors">
                                <span className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">{stat.l}</span>
                                <span className="text-xl font-bold text-white">{stat.v}</span>
                            </div>
                        ))}
                    </div>

                    <div className="bg-black/30 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm">
                        <h4 className="text-[10px] text-beer-gold font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Package size={14} /> Disponibilidade
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            {beer.formats.longNeck && <div className="flex items-center gap-3 text-gray-400"><div className="w-1.5 h-1.5 rounded-full bg-beer-gold"></div> Long Neck 355ml</div>}
                            {beer.formats.growler && <div className="flex items-center gap-3 text-gray-400"><div className="w-1.5 h-1.5 rounded-full bg-beer-gold"></div> Growler PET</div>}
                            {beer.formats.keg30 && <div className="flex items-center gap-3 text-gray-400"><div className="w-1.5 h-1.5 rounded-full bg-beer-gold"></div> Barril 30L</div>}
                            {beer.formats.keg50 && <div className="flex items-center gap-3 text-gray-400"><div className="w-1.5 h-1.5 rounded-full bg-beer-gold"></div> Barril 50L</div>}
                        </div>
                    </div>
                    
                    <a href="https://wa.me/553125641240" className="inline-flex items-center gap-2 text-beer-gold hover:text-white font-bold uppercase tracking-widest text-xs transition-colors group/link">
                        Pedir este estilo <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform"/>
                    </a>
                  </Reveal>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- A FÁBRICA --- */}
      <section id="fabrica" className="py-24 relative bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
            <Reveal>
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    
                    <div>
                        <span className="text-beer-gold font-bold tracking-widest uppercase text-xs mb-4 block">Nossa Casa</span>
                        <h3 className="text-5xl font-black text-white mb-8 uppercase tracking-tight">Fábrica & Loja</h3>
                        
                        <p className="text-gray-300 mb-8 text-xl leading-relaxed font-light">
                            A Hoog Bier é um marco da produção artesanal em Contagem. Unimos tecnologia e tradição para entregar o chope mais fresco da cidade.
                        </p>

                        <div className="space-y-6">
                            <div className="flex gap-5 items-center p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-beer-gold/30 transition-colors">
                                <Truck className="text-beer-gold" size={32} />
                                <div>
                                    <h4 className="text-lg font-bold text-white uppercase mb-1">Delivery de Chopp</h4>
                                    <p className="text-gray-400 text-sm">Levamos a chopeira e instalamos no seu evento.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-black p-10 lg:p-12 border border-white/10 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-beer-gold blur-[80px] opacity-20"></div>
                        
                        <h4 className="text-2xl font-black text-white mb-8 uppercase">Visite-nos</h4>
                        
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <MapPin className="text-beer-gold shrink-0" />
                                <div>
                                    <strong className="block text-white uppercase text-sm tracking-wider mb-1">Localização</strong>
                                    <span className="text-gray-400">Rua Rio Ural, 200 - Riacho das Pedras, Contagem</span>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Clock className="text-beer-gold shrink-0" />
                                <div>
                                    <strong className="block text-white uppercase text-sm tracking-wider mb-1">Horários</strong>
                                    <span className="text-gray-400">Seg-Sex: 09h-18h | Sáb: 09h-13h</span>
                                </div>
                            </div>
                        </div>

                        <a href="https://wa.me/553125641240" target="_blank" className="mt-10 w-full bg-green-600 hover:bg-green-500 text-white font-black py-5 rounded-xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-sm shadow-xl">
                            <ShoppingBag size={20} /> Orçamento Rápido
                        </a>
                    </div>

                </div>
            </Reveal>
        </div>
      </section>

      {/* --- RODAPÉ CLÁSSICO --- */}
      <footer className="bg-black py-12 border-t border-gray-900 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
            {/* Logo */}
            <img src="/images/logo-oficial.png" alt="Hoog Bier" className="h-24 w-auto mb-8 opacity-90" />

            {/* Socials */}
            <div className="flex justify-center gap-6 mb-8">
              <a href="https://instagram.com/cervejariahoogbier" target="_blank" className="text-gray-500 hover:text-white transition-colors"><Instagram size={24} /></a>
              <a href="https://facebook.com/cervejariahoogbier" target="_blank" className="text-gray-500 hover:text-white transition-colors"><Facebook size={24} /></a>
              <a href="https://wa.me/553125641240" target="_blank" className="text-gray-500 hover:text-white transition-colors"><Phone size={24} /></a>
            </div>

            {/* Copyright & Dev */}
            <div className="space-y-2">
                <p className="text-gray-500 text-sm">
                 © {new Date().getFullYear()} Cervejaria Hoog Bier Ltda. Todos os direitos reservados.
                </p>
                <p className="text-gray-500 text-sm">
                  Desenvolvido por <a href="https://www.yankousdevweb.com.br/" target="_blank" className="text-beer-gold hover:underline font-bold">Yankous Dev</a>
                </p>
            </div>

            <p className="text-gray-800 text-[10px] mt-8 uppercase font-bold tracking-[0.2em]">
                Beba com moderação. Venda proibida para menores de 18 anos.
            </p>
        </div>
      </footer>
    </div>
  );
}

export default App;