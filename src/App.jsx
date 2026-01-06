import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse'; 
import { 
  MapPin, Instagram, Facebook, Phone, Beer, Truck, Menu, X, 
  ShoppingBag, Store, Star, Clock, CheckCircle, Package, ArrowRight, 
  MessageCircle, ChevronDown, Utensils, Calculator, Users, Music, Calendar,
  HelpCircle, Plus, Minus, Mail, Droplets, Thermometer, Activity, Search
} from 'lucide-react';

// --- CONFIGURAÇÃO DAS PLANILHAS ---
// Link 1: Agenda (Sua planilha de eventos)
const SHEET_URL_AGENDA = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4dXo5Iu4D0vOcvkdUnIBmyqGqcaVdOJ5EDqHIgYfm0oSf_4ZinVhk7qllVwyPuFENL0MGv4yuBT9L/pub?gid=0&single=true&output=csv"; 

// Link 2: Parceiros (Nova aba 'Parceiros' com colunas: nome, endereco)
const SHEET_PARCEIROS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4dXo5Iu4D0vOcvkdUnIBmyqGqcaVdOJ5EDqHIgYfm0oSf_4ZinVhk7qllVwyPuFENL0MGv4yuBT9L/pub?gid=571179422&single=true&output=csv";

// Link 3: Instagram (Opcional - Behold.so)
const BEHOLD_URL = ""; 

// --- COMPONENTE DE ANIMAÇÃO ---
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

// --- GRÁFICO DE SABOR ---
const FlavorRadar = ({ data }) => {
  if (!data) return null;
  const polyPoints = `
    50,${50 - data.amargor * 4} 
    ${50 + data.alcool * 3.8},${50 - data.alcool * 1.2} 
    ${50 + data.docura * 2.5},${50 + data.docura * 4} 
    ${50 - data.corpo * 2.5},${50 + data.corpo * 4} 
    ${50 - data.aroma * 3.8},${50 - data.aroma * 1.2}
  `;

  return (
    <div className="w-full h-48 relative flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <polygon points="50,10 90,40 80,90 20,90 10,40" fill="none" stroke="#333" strokeWidth="0.5" />
        <polygon points="50,30 70,45 65,70 35,70 30,45" fill="none" stroke="#333" strokeWidth="0.5" />
        <text x="50" y="5" fontSize="4" fill="#F59E0B" textAnchor="middle">Amargor</text>
        <text x="95" y="40" fontSize="4" fill="#F59E0B" textAnchor="start">Álcool</text>
        <text x="85" y="98" fontSize="4" fill="#F59E0B" textAnchor="start">Doçura</text>
        <text x="15" y="98" fontSize="4" fill="#F59E0B" textAnchor="end">Corpo</text>
        <text x="5" y="40" fontSize="4" fill="#F59E0B" textAnchor="end">Aroma</text>
        <polygon points={polyPoints} fill="rgba(245, 158, 11, 0.5)" stroke="#F59E0B" strokeWidth="2" />
      </svg>
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false); 
  const [activeBeerId, setActiveBeerId] = useState(null); 
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  
  // Calculadora & Reserva
  const [showCalculator, setShowCalculator] = useState(false);
  const [showReserva, setShowReserva] = useState(false);
  const [calcGuests, setCalcGuests] = useState(20);
  const [calcHours, setCalcHours] = useState(4);
  const [calcResult, setCalcResult] = useState(0);
  const [reservaData, setReservaData] = useState({ nome: '', data: '', pessoas: '' });

  // Dados Dinâmicos
  const [agenda, setAgenda] = useState([]);
  const [parceiros, setParceiros] = useState([]); // NOVO ESTADO
  const [instaFeed, setInstaFeed] = useState([]); 
  const [loadingAgenda, setLoadingAgenda] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    calculateChopp(20, 4);

    // 1. Agenda (Google Sheets)
    const fetchAgenda = () => {
      if (SHEET_URL_AGENDA.includes("COLE_AQUI")) { setLoadingAgenda(false); return; }
      Papa.parse(SHEET_URL_AGENDA, {
        download: true, header: true,
        complete: (results) => { setAgenda(results.data); setLoadingAgenda(false); },
        error: (err) => { console.error("Erro Agenda:", err); setLoadingAgenda(false); }
      });
    };
    fetchAgenda();

    // 2. Parceiros (Google Sheets) - NOVA FUNCIONALIDADE
    const fetchParceiros = () => {
      if (SHEET_PARCEIROS_URL.includes("COLE_AQUI")) return;
      Papa.parse(SHEET_PARCEIROS_URL, {
        download: true, header: true,
        complete: (results) => setParceiros(results.data),
        error: (err) => console.error("Erro Parceiros:", err)
      });
    };
    fetchParceiros();

    // 3. Instagram (Behold ou Manual)
    const fetchInstagram = async () => {
      if (!BEHOLD_URL) return; 
      try {
        const res = await fetch(BEHOLD_URL);
        const data = await res.json();
        const fotos = data.slice(0, 6).map(post => ({
          media_url: post.mediaUrl || post.thumbnailUrl, 
          permalink: post.permalink
        }));
        setInstaFeed(fotos);
      } catch (error) {
        console.error("Erro Instagram:", error);
      }
    };
    fetchInstagram();

    return () => { window.removeEventListener('scroll', handleScroll); clearTimeout(timer); };
  }, []);

  const handleAgeConfirm = (isOver18) => isOver18 ? setAgeVerified(true) : window.location.href = "https://www.google.com";
  
  const calculateChopp = (guests, hours) => {
      const liters = Math.ceil((guests * 0.7) * (hours * 0.4)); 
      setCalcResult(liters < 10 ? 10 : liters); setCalcGuests(guests); setCalcHours(hours);
  };

  const getEventIcon = (cat) => {
    const c = cat ? cat.toLowerCase().trim() : '';
    if(c.includes('musica')) return <Music size={24} className="text-gray-600 group-hover:text-beer-gold transition-colors" />;
    if(c.includes('comida')) return <Truck size={24} className="text-gray-600 group-hover:text-beer-gold transition-colors" />;
    if(c.includes('promocao')) return <Beer size={24} className="text-white" />;
    return <Calendar size={24} className="text-gray-600" />;
  };

  // --- DADOS ESTÁTICOS ---
  const beers = [
    { id: "pilsen", name: "Hoog Pilsen", style: "Premium Lager", tagline: "Leveza e Equilíbrio", desc: "Nossa interpretação da paixão nacional. Dourada, brilhante e com colarinho persistente. Equilíbrio perfeito entre malte e lúpulo.", pairing: "Petiscos fritos, saladas leves, frango a passarinho.", abv: "4.5%", ibu: "9", temp: "0-4ºC", color: "from-yellow-300 to-yellow-500", image: "/images/pilsen.jpg", formats: { longNeck: true, growler: true, keg30: true, keg50: true }, flavor: { amargor: 2, docura: 4, alcool: 3, aroma: 3, corpo: 3 } },
    { id: "ipa", name: "Hoog IPA", style: "American IPA", tagline: "Explosão Cítrica", desc: "Para paladares exigentes. Acobreada, corpo médio e amargor limpo. Dry hopping generoso com notas de frutas tropicais.", pairing: "Hambúrguer artesanal, carnes gordurosas, comida mexicana.", abv: "6.5%", ibu: "50", temp: "4-8ºC", color: "from-orange-500 to-amber-600", image: "/images/ipa.jpg", formats: { longNeck: true, growler: true, keg30: true, keg50: true }, flavor: { amargor: 8, docura: 3, alcool: 7, aroma: 9, corpo: 6 } },
    { id: "california", name: "California Common", style: "Steam Beer", tagline: "Híbrida e Rústica", desc: "Um diferencial da Hoog. Levedura Lager fermentada em temperatura de Ale. Notas tostadas e amadeiradas únicas.", pairing: "Carne de porco assada, queijos curados.", abv: "5.0%", ibu: "35", temp: "5-8ºC", color: "from-amber-600 to-amber-800", image: "/images/california.jpg", formats: { longNeck: true, growler: true, keg30: true, keg50: true }, flavor: { amargor: 5, docura: 4, alcool: 5, aroma: 6, corpo: 5 } },
    { id: "seculo", name: "Século XIII", style: "Red Lager", tagline: "Tradição Avermelhada", desc: "Coloração rubi intensa e complexidade de maltes especiais. Notas evidentes de caramelo e toffee com final limpo.", pairing: "Carpaccio, massas com molho vermelho, frango assado.", abv: "4.8%", ibu: "12", temp: "4-7ºC", color: "from-red-600 to-red-900", image: "/images/red.jpg", formats: { longNeck: true, growler: true, keg30: true, keg50: false }, flavor: { amargor: 3, docura: 7, alcool: 4, aroma: 5, corpo: 5 } },
    { id: "weiss", name: "Hoog Weiss", style: "Hefeweizen", tagline: "Trigo Aveludado", desc: "Não filtrada e com espuma cremosa. Aromas clássicos de banana e cravo provenientes da fermentação.", pairing: "Salsichas alemãs, peixes, sushi e saladas.", abv: "4.7%", ibu: "10", temp: "3-6ºC", color: "from-yellow-200 to-yellow-400", image: "/images/weiss.jpg", formats: { longNeck: true, growler: true, keg30: true, keg50: true }, flavor: { amargor: 2, docura: 6, alcool: 4, aroma: 8, corpo: 7 } },
    { id: "paleale", name: "Hoog Pale Ale", style: "American Pale Ale", tagline: "Refrescante e Aromática", desc: "A porta de entrada para os lúpulos. Mais leve que a IPA, traz notas cítricas e florais com amargor moderado.", pairing: "Pizzas variadas, queijo cheddar, empanadas.", abv: "5.0%", ibu: "25", temp: "4-7ºC", color: "from-amber-400 to-orange-500", image: "/images/paleale.jpg", formats: { longNeck: true, growler: true, keg30: true, keg50: true }, flavor: { amargor: 5, docura: 4, alcool: 5, aroma: 7, corpo: 4 } },
    { id: "stout", name: "Hoog Stout", style: "English Stout", tagline: "Café e Chocolate", desc: "Escura com maltes torrados que remetem a café expresso e chocolate amargo. Corpo médio-leve e final seco.", pairing: "Sobremesas de chocolate, sorvete de creme, gorgonzola.", abv: "4.8%", ibu: "20", temp: "6-10ºC", color: "from-gray-700 to-gray-900", image: "/images/stout.jpg", formats: { longNeck: true, growler: true, keg30: true, keg50: false }, flavor: { amargor: 4, docura: 5, alcool: 4, aroma: 6, corpo: 6 } }
  ];

  const faqs = [
    { p: "Vocês entregam em quais bairros?", r: "Entregamos em toda a região de Contagem e alguns bairros de BH e Betim. Consulte a taxa de entrega pelo WhatsApp." },
    { p: "A chopeira elétrica precisa de tomada 220v?", r: "Não! Nossas chopeiras são 110v ou 220v (bivolt). Levamos a extensão e instalamos tudo para você." },
    { p: "Quanto tempo o chopp dura no barril?", r: "Após aberto e instalado na chopeira, recomendamos o consumo em até 24 horas para manter o frescor e o gás." },
    { p: "Preciso comprar gelo?", r: "Para barris com chopeira elétrica, NÃO precisa de gelo. A máquina gela o chopp em 5 minutos. Apenas para a chopeira a gelo (naja) é necessário." },
    { p: "Aceitam quais formas de pagamento?", r: "Aceitamos PIX, Cartão de Crédito e Débito no momento da entrega." }
  ];

  return (
    <div className={`min-h-screen bg-beer-dark text-gray-100 font-sans selection:bg-beer-gold selection:text-black overflow-x-hidden ${!ageVerified ? 'h-screen overflow-hidden' : ''}`}>
      
      {/* 1. PRELOADER */}
      {loading && (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center preloader-exit pointer-events-none">
           <div className="text-center">
              <img src="/images/logo-oficial.png" alt="Loading" className="h-32 animate-pulse-gold mb-4" />
              <div className="w-48 h-1 bg-gray-800 rounded-full mx-auto overflow-hidden"><div className="h-full bg-beer-gold animate-[width_2s_ease-out_forwards]" style={{width: '0%'}}></div></div>
           </div>
        </div>
      )}

      {/* 2. AGE GATE */}
      {!ageVerified && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-black/95 backdrop-blur-xl">
            <div className="relative z-10 w-full max-w-md bg-zinc-900 border border-beer-gold/30 p-8 rounded-3xl text-center shadow-2xl animate-fade-in-up">
                <img src="/images/logo-oficial.png" alt="Hoog" className="h-24 mx-auto mb-6" />
                <h2 className="text-2xl font-black text-white mb-2 uppercase">Bem-vindo</h2>
                <p className="text-gray-400 mb-8">Você tem 18 anos ou mais?</p>
                <div className="flex flex-col gap-3">
                    <button onClick={() => handleAgeConfirm(true)} className="w-full bg-beer-gold text-black font-black py-4 rounded-xl uppercase hover:bg-white transition-colors">Sim, tenho +18</button>
                    <button onClick={() => handleAgeConfirm(false)} className="w-full border border-white/20 text-gray-500 py-4 rounded-xl uppercase hover:border-white hover:text-white transition-colors">Não, sou menor</button>
                </div>
                <p className="text-[10px] text-gray-600 mt-6 uppercase font-bold tracking-[0.2em] opacity-50">Beba com moderação.</p>
            </div>
        </div>
      )}

      {/* 3. MODAL CALCULADORA */}
      {showCalculator && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gray-900 border border-beer-gold/30 rounded-2xl p-8 max-w-md w-full relative">
            <button onClick={() => setShowCalculator(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X /></button>
            <div className="text-center mb-8"><Calculator className="mx-auto text-beer-gold mb-3" size={40} /><h3 className="text-2xl font-black uppercase text-white">Calculadora de Chopp</h3><p className="text-gray-400 text-sm">Planeje sua festa sem desperdício</p></div>
            <div className="space-y-6">
              <div><label className="flex items-center gap-2 text-sm font-bold uppercase text-beer-gold mb-2"><Users size={16}/> Pessoas: {calcGuests}</label><input type="range" min="5" max="200" step="5" value={calcGuests} onChange={(e) => calculateChopp(parseInt(e.target.value), calcHours)} className="w-full accent-beer-gold h-2 bg-gray-700 rounded-lg cursor-pointer"/></div>
              <div><label className="flex items-center gap-2 text-sm font-bold uppercase text-beer-gold mb-2"><Clock size={16}/> Duração: {calcHours}h</label><input type="range" min="1" max="12" step="1" value={calcHours} onChange={(e) => calculateChopp(calcGuests, parseInt(e.target.value))} className="w-full accent-beer-gold h-2 bg-gray-700 rounded-lg cursor-pointer"/></div>
              <div className="bg-white/10 p-4 rounded-xl text-center border border-white/10"><span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Recomendação Aproximada</span><span className="text-4xl font-black text-beer-gold">{calcResult} Litros</span></div>
              <a href={`https://wa.me/553125641240?text=Olá! Fiz um cálculo no site. Preciso de aproximadamente ${calcResult} litros de chopp para ${calcGuests} pessoas.`} target="_blank" className="block w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl text-center uppercase tracking-widest transition-colors">Solicitar Orçamento</a>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL RESERVA */}
      {showReserva && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gray-900 border border-beer-gold/30 rounded-2xl p-8 max-w-md w-full relative">
            <button onClick={() => setShowReserva(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X /></button>
            <div className="text-center mb-6"><Calendar className="mx-auto text-beer-gold mb-3" size={40} /><h3 className="text-2xl font-black uppercase text-white">Reservas pelo WhatsApp </h3><p className="text-gray-400 text-sm">Garanta seu lugar no Happy Hour</p></div>
            <div className="space-y-4">
              <div><label className="block text-xs font-bold uppercase text-beer-gold mb-1">Seu Nome</label><input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-beer-gold outline-none" placeholder="Ex: João Silva" onChange={(e) => setReservaData({...reservaData, nome: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                 <div><label className="block text-xs font-bold uppercase text-beer-gold mb-1">Data</label><input type="date" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-beer-gold outline-none" onChange={(e) => setReservaData({...reservaData, data: e.target.value})} /></div>
                 <div><label className="block text-xs font-bold uppercase text-beer-gold mb-1">Pessoas</label><input type="number" min="1" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-beer-gold outline-none" placeholder="Ex: 4" onChange={(e) => setReservaData({...reservaData, pessoas: e.target.value})} /></div>
              </div>
              <a href={`https://wa.me/553125641240?text=Olá, gostaria de reservar uma mesa para ${reservaData.pessoas} pessoas no dia ${reservaData.data}. Me chamo ${reservaData.nome}.`} target="_blank" className="block w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl text-center uppercase tracking-widest transition-colors mt-4">Confirmar no WhatsApp</a>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP FLOAT */}
      <a href="https://wa.me/553125641240" target="_blank" className="fixed bottom-6 right-6 z-[60] group"><div className="absolute inset-0 rounded-full bg-green-500 opacity-70 animate-ping"></div><div className="relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-transform transform group-hover:scale-110 flex items-center justify-center"><MessageCircle size={32} fill="white" /></div></a>

      {/* COOKIES (LGPD) */}
      {!cookiesAccepted && (
        <div className="fixed bottom-0 left-0 w-full bg-white/10 backdrop-blur-md border-t border-white/10 p-4 z-[80] flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in-up">
           <p className="text-xs text-gray-300 text-center md:text-left">🍪 Usamos cookies para melhorar sua experiência. Ao continuar, você concorda com nossa política.</p>
           <button onClick={() => setCookiesAccepted(true)} className="bg-beer-gold text-black text-xs font-bold px-6 py-2 rounded-full hover:bg-white transition-colors">Aceitar e Fechar</button>
        </div>
      )}

      {/* NAVBAR */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-beer-dark/90 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-20">
            <a href="#" className="flex-shrink-0"><img src="/images/logo-oficial.png" alt="Hoog Bier" className="h-16 md:h-20 w-auto drop-shadow-lg" /></a>
            <div className="hidden md:flex items-center space-x-8">
              {['Início', 'Cervejas', 'A Fábrica'].map((item, i) => (<a key={i} href={`#${item.toLowerCase().replace(' ', '').replace('á', 'a')}`} className="text-sm font-bold uppercase tracking-widest text-gray-300 hover:text-white transition-colors group relative">{item}<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-beer-gold transition-all duration-300 group-hover:w-full"></span></a>))}
              <button onClick={() => setShowCalculator(true)} className="text-sm font-bold uppercase tracking-widest text-beer-gold hover:text-white transition-colors flex items-center gap-1"><Calculator size={16}/> Calc. Chopp</button>
              <a href="https://wa.me/553125641240" target="_blank" className="bg-gradient-to-r from-beer-gold to-yellow-400 hover:to-yellow-300 text-black px-8 py-3 rounded-full text-xs font-black transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] flex items-center gap-2 uppercase tracking-wider hover:-translate-y-1"><Truck size={16} /> Pedir Agora</a>
            </div>
            <div className="md:hidden"><button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2 backdrop-blur-md bg-white/10 rounded-lg border border-white/10">{isMenuOpen ? <X size={28} /> : <Menu size={28} />}</button></div>
        </div>
        {isMenuOpen && (<div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 w-full absolute top-full left-0 animate-fade-in"><div className="px-4 pt-4 pb-8 space-y-2 text-center"><a href="#home" onClick={() => setIsMenuOpen(false)} className="block py-4 text-beer-gold font-bold uppercase tracking-widest border-b border-white/5">Início</a><a href="#cervejas" onClick={() => setIsMenuOpen(false)} className="block py-4 text-beer-gold font-bold uppercase tracking-widest border-b border-white/5">Cervejas</a><button onClick={() => {setShowCalculator(true); setIsMenuOpen(false)}} className="w-full py-4 text-beer-gold font-bold uppercase tracking-widest border-b border-white/5 flex items-center justify-center gap-2"><Calculator size={16}/> Calculadora</button><a href="#afabrica" onClick={() => setIsMenuOpen(false)} className="block py-4 text-beer-gold font-bold uppercase tracking-widest border-b border-white/5">A Fábrica</a></div></div>)}
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center bg-fixed opacity-80 scale-105"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-beer-dark/30 via-beer-dark/70 to-beer-dark"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        
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
            </div>
          </Reveal>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 animate-bounce"><ChevronDown size={32} /></div>
        </div>
      </section>

      {/* --- TAP LIST --- */}
      <div className="bg-beer-gold text-black py-3 overflow-hidden whitespace-nowrap border-y-4 border-black relative z-20">
         <div className="inline-block animate-[marquee_20s_linear_infinite] font-black uppercase text-sm tracking-widest">
            🍺 HOJE NAS TORNEIRAS: PILSEN • IPA • RED LAGER • STOUT • CALIFORNIA COMMON • CORRA ANTES QUE ACABE • DELIVERY RÁPIDO 🍺 HOJE NAS TORNEIRAS: PILSEN • IPA • RED LAGER • STOUT • CALIFORNIA COMMON
         </div>
      </div>

      {/* DIFERENCIAIS */}
      <section className="py-24 bg-beer-dark border-b border-white/5 bg-noise relative z-20">
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: CheckCircle, title: "Puro Malte", desc: "Sem milho ou arroz. Apenas insumos nobres importados." },
                    { icon: Clock, title: "Maturação Lenta", desc: "Respeitamos o tempo da natureza. Sem aceleradores químicos." },
                    { icon: Truck, title: "Logística Própria", desc: "Entrega rápida e refrigerada para toda região de Contagem." }
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

      {/* --- PROCESSO PRODUTIVO --- */}
      <section className="py-20 bg-zinc-900 border-b border-white/5">
         <div className="max-w-7xl mx-auto px-4">
            <Reveal><h3 className="text-center text-3xl font-black text-white uppercase mb-16">Do Grão ao Copo</h3></Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
               {[ {i: Package, t:"Moagem", d:"Maltes selecionados"}, {i: Thermometer, t:"Mostura", d:"Controle de temperatura"}, {i: Activity, t:"Fermentação", d:"Leveduras trabalhando"}, {i: Beer, t:"Maturação", d:"Descanso a frio"} ].map((step, idx) => (
                  <Reveal key={idx} delay={idx*150}><div className="group"><div className="w-20 h-20 mx-auto bg-black border border-beer-gold/30 rounded-full flex items-center justify-center text-beer-gold mb-4 group-hover:bg-beer-gold group-hover:text-black transition-all"><step.i size={32}/></div><h4 className="font-bold text-white uppercase">{step.t}</h4><p className="text-xs text-gray-500">{step.d}</p></div></Reveal>
               ))}
            </div>
         </div>
      </section>

      {/* --- CATÁLOGO --- */}
      <section id="cervejas" className="py-32 bg-beer-dark relative overflow-hidden bg-noise pb-48">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Reveal>
            <div className="text-center mb-24">
                <span className="text-beer-gold font-bold tracking-[0.4em] uppercase text-xs mb-4 block">Nossa Alma</span>
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">Catálogo <span className="text-beer-gold">Hoog</span></h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24"> 
            {beers.map((beer, index) => {
              const isActive = activeBeerId === beer.id;
              return (
              <Reveal key={beer.id} delay={index * 100}>
                <div className="relative group perspective-1000 h-full">
                    
                    {/* Botão de Virar Card */}
                    <button onClick={() => setActiveBeerId(isActive ? null : beer.id)} className="absolute top-4 right-4 z-30 text-xs font-bold uppercase text-beer-gold border border-beer-gold/30 px-3 py-1 rounded-full hover:bg-beer-gold hover:text-black transition-all flex items-center gap-1">
                       {isActive ? <X size={12}/> : <Activity size={12}/>} {isActive ? 'Voltar' : 'Sabor'}
                    </button>

                    {/* Card Frente */}
                    <div className={`relative bg-white/5 border border-white/10 rounded-[2rem] p-6 pt-0 hover:border-beer-gold/50 transition-all duration-500 hover:bg-white/10 flex flex-col h-full hover:shadow-[0_0_50px_-10px_rgba(245,158,11,0.2)] hover:-translate-y-2 ${isActive ? 'invisible' : 'visible'}`}>
                        <div className="relative -mt-20 mb-6 flex justify-center perspective-1000">
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-b ${beer.color} opacity-30 blur-[60px] rounded-full group-hover:opacity-50 transition-opacity duration-700`}></div>
                            <img src={beer.image} alt={beer.name} className="h-64 w-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] transform group-hover:scale-110 transition-all duration-500 z-10" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                            <div className="hidden h-64 w-48 bg-gray-800/80 rounded-2xl flex-col items-center justify-center text-center border border-gray-700 z-10"><Beer size={40} className="text-beer-gold mb-2" /><span className="text-xs text-gray-400">Sem Foto</span></div>
                        </div>
                        <div className="flex-1 flex flex-col text-center">
                            <span className={`inline-block mx-auto mb-2 py-1 px-3 rounded-md bg-gradient-to-r ${beer.color} text-black text-[10px] font-black uppercase tracking-widest`}>{beer.style}</span>
                            <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tight leading-none group-hover:text-beer-gold transition-colors">{beer.name}</h3>
                            <p className="text-sm text-gray-400 font-serif italic mb-4">"{beer.tagline}"</p>
                            <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3 group-hover:line-clamp-none transition-all">{beer.desc}</p>
                            <div className="bg-black/40 rounded-lg p-3 mb-4 text-xs text-gray-400 flex flex-col items-center gap-2 border border-white/5"><div className="flex items-center gap-1 font-bold uppercase text-beer-gold tracking-wider"><Utensils size={12} /> Combina com:</div><span>{beer.pairing}</span></div>
                            <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4 mb-4 mt-auto"><div className="flex flex-col items-center"><span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">ABV</span><span className="text-white font-bold">{beer.abv}</span></div><div className="flex flex-col items-center border-l border-white/5"><span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">IBU</span><span className="text-white font-bold">{beer.ibu}</span></div><div className="flex flex-col items-center border-l border-white/5"><span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Temp</span><span className="text-white font-bold">{beer.temp}</span></div></div>
                            <div className="bg-black/20 rounded-xl p-3 flex justify-center gap-4 text-gray-500">{beer.formats.longNeck && <div className="tooltip group/icon relative"><Beer size={18} className="hover:text-beer-gold transition-colors" /></div>}{beer.formats.growler && <div className="tooltip group/icon relative"><Store size={18} className="hover:text-beer-gold transition-colors" /></div>}{beer.formats.keg30 && <div className="tooltip group/icon relative"><Package size={18} className="hover:text-beer-gold transition-colors" /></div>}</div>
                            <a href={`https://wa.me/553125641240?text=Olá, gostaria de pedir a cerveja ${beer.name}`} target="_blank" className="mt-6 w-full py-3 rounded-xl border border-white/10 hover:border-beer-gold hover:bg-beer-gold hover:text-black text-white text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn">Pedir Agora <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" /></a>
                        </div>
                    </div>

                    {/* Card Verso (Gráfico) */}
                    {isActive && (
                        <div className="absolute inset-0 bg-gray-900 border border-beer-gold/50 rounded-[2rem] p-6 flex flex-col items-center justify-center z-20 animate-fade-in">
                            <h4 className="text-xl font-black text-white uppercase mb-6">Perfil Sensorial</h4>
                            <FlavorRadar data={beer.flavor} />
                            <p className="text-xs text-gray-500 mt-6 text-center max-w-[200px]">Gráfico indicativo de percepção sensorial.</p>
                        </div>
                    )}
                </div>
              </Reveal>
            );})}
          </div>
        </div>

        {/* Divisor Onda Inferior */}
        <div className="custom-shape-divider-bottom-1">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
            </svg>
        </div>
      </section>

      {/* --- EXPERIÊNCIA GASTRONÔMICA --- */}
      <section className="py-20 bg-beer-gold text-beer-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none"><Beer size={400} className="absolute -right-20 -bottom-20 rotate-12" /></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12 pt-10">
          <div className="md:w-1/2">
            <Reveal>
              <h3 className="text-4xl md:text-5xl font-display font-black uppercase leading-tight mb-4">
                Mais que Cerveja,<br/> Uma Experiência
              </h3>
              <p className="text-lg font-medium mb-6 leading-relaxed opacity-90">
                Acreditamos que uma boa cerveja merece uma boa comida. Nossas receitas são pensadas para harmonizar com momentos especiais, desde o churrasco de domingo até aquele jantar sofisticado.
              </p>
              <a href="https://instagram.com/cervejariahoogbier" target="_blank" className="inline-flex items-center gap-2 border-b-2 border-black pb-1 font-bold hover:text-white hover:border-white transition-colors">
                Ver Dicas no Instagram <Instagram size={18} />
              </a>
            </Reveal>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-4">
             <Reveal delay={200}>
               <div className="bg-black/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-black/20 transition-colors border border-black/5">
                  <span className="text-4xl block mb-2">🍔</span>
                  <p className="font-bold text-lg uppercase tracking-tight">Burgers & IPAs</p>
                  <p className="text-sm opacity-75">O amargor corta a gordura e limpa o paladar.</p>
               </div>
             </Reveal>
             <Reveal delay={300}>
               <div className="bg-black/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-black/20 transition-colors border border-black/5">
                  <span className="text-4xl block mb-2">🥨</span>
                  <p className="font-bold text-lg uppercase tracking-tight">Petiscos & Lager</p>
                  <p className="text-sm opacity-75">Leveza e frescor para acompanhar frituras.</p>
               </div>
             </Reveal>
          </div>
        </div>
      </section>

      {/* --- AGENDA (COM DIVISOR ONDA NO TOPO) --- */}
      <section className="py-32 bg-zinc-900 relative overflow-hidden">
        {/* Divisor Onda Superior */}
        <div className="custom-shape-divider-top-1">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
            </svg>
        </div>

        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 pt-10">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <span className="text-beer-gold font-bold tracking-widest uppercase text-xs mb-4 block">Happy Hour & Eventos</span>
                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                  Agenda <span className="text-transparent bg-clip-text bg-gradient-to-r from-beer-gold to-yellow-200">Hoog</span>
                </h3>
              </div>
              <button onClick={() => setShowReserva(true)} className="bg-white/5 hover:bg-beer-gold hover:text-black border border-white/10 text-white px-6 py-3 rounded-full font-bold uppercase text-xs tracking-widest transition-all flex items-center gap-2">
                 <Calendar size={16} /> Reservas pelo WhatsApp
              </button>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Loading */}
            {loadingAgenda && (
              <div className="col-span-3 text-center py-12">
                 <div className="animate-spin inline-block w-8 h-8 border-4 border-beer-gold border-t-transparent rounded-full mb-4"></div>
                 <p className="text-gray-400">Carregando programação...</p>
                 {SHEET_URL_AGENDA.includes("COLE_AQUI") && <p className="text-red-400 text-xs mt-2">Você precisa colocar o Link CSV da Agenda!</p>}
              </div>
            )}

            {/* Lista Agenda */}
            {!loadingAgenda && agenda.length === 0 && (
              <div className="col-span-3 text-center py-12 border border-white/5 rounded-3xl bg-white/5">
                 <p className="text-gray-400">Nenhum evento programado para esta semana.</p>
                 <p className="text-beer-gold text-sm mt-2 font-bold">Acompanhe no Instagram!</p>
              </div>
            )}

            {!loadingAgenda && agenda.map((evento, index) => {
              if(!evento.titulo) return null;
              const isDestaque = evento.destaque && evento.destaque.toLowerCase().includes('sim');
              
              return (
                <Reveal key={index} delay={index * 100}>
                   <div className={`h-full border p-8 rounded-3xl transition-all group hover:-translate-y-2 relative overflow-hidden flex flex-col ${
                      isDestaque 
                      ? 'bg-gradient-to-br from-beer-gold/20 to-black/40 border-beer-gold/30 hover:border-beer-gold' 
                      : 'bg-black/40 border-white/10 hover:border-beer-gold/50'
                    }`}>
                    
                    {isDestaque && (
                       <div className="absolute top-0 right-0 bg-beer-gold text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase z-20">Destaque</div>
                    )}

                    <div className="flex justify-between items-start mb-6">
                      <div className={`px-4 py-2 rounded-lg font-black text-xl text-center border transition-colors ${
                          isDestaque
                          ? 'bg-beer-gold text-black border-beer-gold'
                          : 'bg-beer-gold/10 text-beer-gold border-beer-gold/20 group-hover:bg-beer-gold group-hover:text-black'
                      }`}>
                        {evento.dia} <br/> <span className="text-sm font-medium">{evento.horario}</span>
                      </div>
                      <div className="bg-white/5 p-3 rounded-full">
                        {getEventIcon(evento.categoria)}
                      </div>
                    </div>
                    
                    <h4 className="text-2xl font-bold text-white mb-2 leading-tight">{evento.titulo}</h4>
                    <p className="text-gray-400 text-sm mb-4 flex-1">{evento.descricao}</p>
                    
                    {isDestaque && (
                        <div className="flex items-center gap-2 text-xs font-bold text-beer-gold uppercase tracking-wider mt-auto pt-4 border-t border-white/10">
                            <span className="w-2 h-2 rounded-full bg-beer-gold animate-ping"></span> Imperdível
                        </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- 11. FAQ --- */}
      <section className="py-24 bg-beer-dark relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-beer-gold font-bold tracking-widest uppercase text-xs mb-4 block">Tira-Dúvidas</span>
              <h3 className="text-4xl font-black text-white uppercase tracking-tighter">
                Perguntas <span className="text-beer-gold">Frequentes</span>
              </h3>
            </div>
          </Reveal>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Reveal key={index} delay={index * 100}>
                <details className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-beer-gold/30 transition-all">
                  <summary className="flex justify-between items-center p-6 font-bold text-white uppercase tracking-wide select-none">
                    <span className="flex items-center gap-3">
                      <HelpCircle className="text-beer-gold" size={20} />
                      {faq.p}
                    </span>
                    <span className="bg-white/10 p-1 rounded-full group-open:bg-beer-gold group-open:text-black transition-colors">
                      <Plus size={16} className="group-open:hidden" />
                      <Minus size={16} className="hidden group-open:block" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4 bg-black/20">
                    {faq.r}
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
          <div className="text-center mt-12">
             <p className="text-gray-500 text-sm mb-4">Ainda tem dúvidas?</p>
             <a href="https://wa.me/553125641240" target="_blank" className="text-beer-gold font-bold underline hover:text-white transition-colors">Fale com nosso Mestre Cervejeiro no WhatsApp</a>
          </div>
        </div>
      </section>

      {/* --- 12. A FÁBRICA --- */}
      <section id="afabrica" className="py-24 relative bg-black">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center bg-fixed opacity-20 grayscale"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        
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
                            <div className="flex gap-5 items-center p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-beer-gold/30 transition-colors backdrop-blur-md">
                                <Truck className="text-beer-gold" size={32} />
                                <div>
                                    <h4 className="text-lg font-bold text-white uppercase mb-1">Delivery de Chopp</h4>
                                    <p className="text-gray-400 text-sm">Levamos a chopeira e instalamos no seu evento.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-900/90 to-black/90 p-10 lg:p-12 border border-white/10 rounded-3xl relative overflow-hidden backdrop-blur-md shadow-2xl">
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
                        <a href="https://wa.me/553125641240" target="_blank" className="mt-10 w-full bg-green-600 hover:bg-green-500 text-white font-black py-5 rounded-xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-sm shadow-xl hover:-translate-y-1">
                            <ShoppingBag size={20} /> Orçamento Rápido
                        </a>
                    </div>
                </div>
            </Reveal>
        </div>
      </section>

      {/* --- 13. ONDE ENCONTRAR (PARCEIROS - DINÂMICO) --- */}
      <section className="py-20 bg-black border-t border-white/5">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <Reveal>
               <h3 className="text-3xl font-black text-white uppercase mb-12">Onde Encontrar <span className="text-beer-gold">Hoog</span></h3>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Fallback se não tiver carregado ainda */}
                {parceiros.length === 0 && (
                   <p className="text-gray-500 col-span-3 text-sm">
                      {SHEET_PARCEIROS_URL.includes("COLE_AQUI") ? "Configure a planilha de Parceiros para ver a lista." : "Carregando parceiros..."}
                   </p>
                )}

                {/* Lista dinâmica da planilha */}
                {parceiros.map((p, i) => (
                   <Reveal key={i} delay={i*100}>
                      <div className="p-6 border border-white/10 rounded-xl hover:border-beer-gold transition-colors">
                         <div className="flex justify-center mb-4 text-beer-gold"><MapPin/></div>
                         <h4 className="font-bold text-white text-lg">{p.nome}</h4>
                         <p className="text-gray-500 text-sm">{p.endereco}</p>
                      </div>
                   </Reveal>
                ))}
            </div>
         </div>
      </section>

      {/* --- 14. INSTAGRAM FEED (AUTOMÁTICO VIA PLANILHA) --- */}
      <section className="py-2 bg-beer-dark overflow-hidden">
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1 opacity-50 hover:opacity-100 transition-opacity">
            {/* Se tiver fotos na planilha (ou behold), usa elas. Senão, usa placeholder */}
            {(instaFeed.length > 0 ? instaFeed : [1,2,3,4,5,6]).map((item, index) => {
               const imgSrc = item.media_url || `https://picsum.photos/400/400?random=${index+10}`;
               const link = item.permalink || "https://instagram.com/cervejariahoogbier";
               return (
                 <div key={index} className="aspect-square bg-gray-800 relative group cursor-pointer overflow-hidden">
                    <a href={link} target="_blank" rel="noreferrer">
                      <img src={imgSrc} alt="Insta" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Instagram className="text-white"/></div>
                    </a>
                 </div>
               );
            })}
         </div>
         <div className="text-center py-8 bg-black">
            <a href="https://instagram.com/cervejariahoogbier" target="_blank" className="text-beer-gold font-bold uppercase tracking-widest text-sm hover:text-white transition-colors">Siga @cervejariahoogbier</a>
         </div>
      </section>

      {/* --- 15. CLUBE VIP (NEWSLETTER) --- */}
      <section className="py-20 bg-gradient-to-r from-beer-gold to-yellow-500 text-black">
         <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
               <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 flex items-center gap-2">
                 <Mail className="border-2 border-black rounded-full p-1" size={32} /> Clube Hoog VIP
               </h3>
               <p className="font-medium text-black/80">
                 Entre para nossa lista exclusiva no WhatsApp e receba promoções relâmpago, convites para eventos e lançamentos antes de todo mundo.
               </p>
            </div>
            <a href="https://wa.me/553125641240?text=Quero%20entrar%20para%20o%20Clube%20VIP" target="_blank" className="bg-black text-beer-gold hover:text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2">
               Quero Entrar Grátis <ArrowRight size={18} />
            </a>
         </div>
      </section>

      {/* --- 16. RODAPÉ --- */}
      <footer className="bg-black py-12 border-t border-gray-900 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
            <img src="/images/logo-oficial.png" alt="Hoog Bier" className="h-24 w-auto mb-8 opacity-90" />
            <div className="flex justify-center gap-6 mb-8">
              <a href="https://instagram.com/cervejariahoogbier" target="_blank" className="text-gray-500 hover:text-white transition-colors"><Instagram size={24} /></a>
              <a href="https://facebook.com/cervejariahoogbier" target="_blank" className="text-gray-500 hover:text-white transition-colors"><Facebook size={24} /></a>
              <a href="https://wa.me/553125641240" target="_blank" className="text-gray-500 hover:text-white transition-colors"><Phone size={24} /></a>
            </div>
            <div className="space-y-2">
                <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Cervejaria Hoog Bier Ltda. Todos os direitos reservados.</p>
                <p className="text-gray-500 text-sm">Desenvolvido por <a href="https://www.yankousdevweb.com.br/" target="_blank" className="text-beer-gold hover:underline font-bold">Yankous Dev</a></p>
            </div>
            <p className="text-gray-800 text-[10px] mt-8 uppercase font-bold tracking-[0.2em]">Beba com moderação. Venda proibida para menores de 18 anos.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;