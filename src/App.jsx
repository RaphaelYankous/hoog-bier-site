import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse'; 
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  MapPin, Instagram, Facebook, Phone, Beer, Truck, Menu, X, 
  ShoppingBag, Store, Star, Clock, CheckCircle, Package, ArrowRight, 
  MessageCircle, ChevronDown, Utensils, Calculator, Users, Music, Calendar,
  HelpCircle, Plus, Minus, Mail, Droplets, Thermometer, Activity, Search
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- CONFIGURAÇÃO (MANTIDA) ---
const SHEET_URL_AGENDA = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4dXo5Iu4D0vOcvkdUnIBmyqGqcaVdOJ5EDqHIgYfm0oSf_4ZinVhk7qllVwyPuFENL0MGv4yuBT9L/pub?gid=0&single=true&output=csv"; 
const SHEET_PARCEIROS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4dXo5Iu4D0vOcvkdUnIBmyqGqcaVdOJ5EDqHIgYfm0oSf_4ZinVhk7qllVwyPuFENL0MGv4yuBT9L/pub?gid=571179422&single=true&output=csv";
const BEHOLD_URL = ""; 

// --- COMPONENTES VISUAIS ---

const Section = ({ children, id, className = "", theme = "dark" }) => {
  const bgColors = {
    dark: "bg-beer-dark text-beer-cream",
    light: "bg-beer-cream text-beer-stone",
    gold: "bg-beer-gold text-beer-stone"
  };

  return (
    <section id={id} className={`relative py-24 px-4 overflow-hidden ${bgColors[theme]} ${className}`}>
      {children}
    </section>
  );
};

const Reveal = ({ children, delay = 0, y = 50 }) => {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(ref.current, 
      { y: y, opacity: 0 },
      { 
        y: 0, opacity: 1, duration: 1.2, delay: delay / 1000, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" }
      }
    );
  }, [delay, y]);
  return <div ref={ref}>{children}</div>;
};

const FlavorRadar = ({ data, theme = "dark" }) => {
  if (!data) return null;
  const strokeColor = theme === "light" ? "#3E2723" : "#F59E0B"; 
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
        <polygon points="50,10 90,40 80,90 20,90 10,40" fill="none" stroke={strokeColor} strokeWidth="0.5" />
        <polygon points="50,30 70,45 65,70 35,70 30,45" fill="none" stroke={strokeColor} strokeWidth="0.5" />
        <text x="50" y="5" fontSize="4" fill={strokeColor} textAnchor="middle" className="font-serif tracking-widest uppercase shadow-black drop-shadow-md">Amargor</text>
        <text x="95" y="40" fontSize="4" fill={strokeColor} textAnchor="start" className="font-serif tracking-widest uppercase shadow-black drop-shadow-md">Álcool</text>
        <text x="85" y="98" fontSize="4" fill={strokeColor} textAnchor="start" className="font-serif tracking-widest uppercase shadow-black drop-shadow-md">Doçura</text>
        <text x="15" y="98" fontSize="4" fill={strokeColor} textAnchor="end" className="font-serif tracking-widest uppercase shadow-black drop-shadow-md">Corpo</text>
        <text x="5" y="40" fontSize="4" fill={strokeColor} textAnchor="end" className="font-serif tracking-widest uppercase shadow-black drop-shadow-md">Aroma</text>
        <polygon points={polyPoints} fill={theme === "light" ? "rgba(62, 39, 35, 0.2)" : "rgba(245, 158, 11, 0.5)"} stroke={strokeColor} strokeWidth="2" />
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
  const [showCalculator, setShowCalculator] = useState(false);
  const [showReserva, setShowReserva] = useState(false);
  const [calcGuests, setCalcGuests] = useState(20);
  const [calcHours, setCalcHours] = useState(4);
  const [calcResult, setCalcResult] = useState(0);
  const [reservaData, setReservaData] = useState({ nome: '', data: '', pessoas: '' });
  const [agenda, setAgenda] = useState([]);
  const [parceiros, setParceiros] = useState([]);
  const [instaFeed, setInstaFeed] = useState([]); 
  const [loadingAgenda, setLoadingAgenda] = useState(true);

  const heroRef = useRef(null);
  const heroImgRef = useRef(null);
  const heroTextRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      gsap.to(heroImgRef.current, { yPercent: 30, ease: "none", scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true } });
      gsap.from(heroTextRef.current, { y: 100, opacity: 0, duration: 1.5, ease: "power4.out", delay: 0.5 });
    }, heroRef);

    const timer = setTimeout(() => setLoading(false), 2000);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    calculateChopp(20, 4);

    const fetchAgenda = () => {
      if (SHEET_URL_AGENDA.includes("COLE_AQUI")) { setLoadingAgenda(false); return; }
      Papa.parse(SHEET_URL_AGENDA, { download: true, header: true, complete: (results) => { setAgenda(results.data); setLoadingAgenda(false); }, error: (err) => { console.error("Erro Agenda:", err); setLoadingAgenda(false); } });
    };
    fetchAgenda();

    const fetchParceiros = () => {
      if (SHEET_PARCEIROS_URL.includes("COLE_AQUI")) return;
      Papa.parse(SHEET_PARCEIROS_URL, { download: true, header: true, complete: (results) => setParceiros(results.data), error: (err) => console.error("Erro Parceiros:", err) });
    };
    fetchParceiros();

    const fetchInstagram = async () => {
      if (!BEHOLD_URL) return; 
      try { const res = await fetch(BEHOLD_URL); const data = await res.json(); setInstaFeed(data.slice(0, 6).map(post => ({ media_url: post.mediaUrl || post.thumbnailUrl, permalink: post.permalink }))); } catch (error) { console.error("Erro Instagram:", error); }
    };
    fetchInstagram();

    return () => { window.removeEventListener('scroll', handleScroll); clearTimeout(timer); lenis.destroy(); ctx.revert(); };
  }, []);

  const handleAgeConfirm = (isOver18) => isOver18 ? setAgeVerified(true) : window.location.href = "https://www.google.com";
  const calculateChopp = (guests, hours) => { const liters = Math.ceil((guests * 0.7) * (hours * 0.4)); setCalcResult(liters < 10 ? 10 : liters); setCalcGuests(guests); setCalcHours(hours); };
  
  const getEventIcon = (cat) => {
    const c = cat ? cat.toLowerCase().trim() : '';
    if(c.includes('musica')) return <Music size={20} />;
    if(c.includes('comida')) return <Truck size={20} />;
    if(c.includes('promocao')) return <Beer size={20} />;
    return <Calendar size={20} />;
  };

  const beers = [
    { id: "pilsen", name: "Hoog Pilsen", style: "Premium Lager", tagline: "Leveza e Equilíbrio", desc: "Nossa interpretação da paixão nacional. Dourada, brilhante e com colarinho persistente.", pairing: "Petiscos fritos, saladas.", abv: "4.5%", ibu: "9", temp: "0-4ºC", color: "from-yellow-300 to-yellow-500", image: "/images/pilsen.jpg", formats: { longNeck: true, growler: true, keg30: true, keg50: true }, flavor: { amargor: 2, docura: 4, alcool: 3, aroma: 3, corpo: 3 } },
    { id: "ipa", name: "Hoog IPA", style: "American IPA", tagline: "Explosão Cítrica", desc: "Para paladares exigentes. Acobreada, corpo médio e amargor limpo.", pairing: "Hambúrguer, carnes.", abv: "6.5%", ibu: "50", temp: "4-8ºC", color: "from-orange-500 to-amber-600", image: "/images/ipa.jpg", formats: { longNeck: true, growler: true, keg30: true, keg50: true }, flavor: { amargor: 8, docura: 3, alcool: 7, aroma: 9, corpo: 6 } },
    { id: "california", name: "California Common", style: "Steam Beer", tagline: "Híbrida e Rústica", desc: "Levedura Lager fermentada em temperatura de Ale. Notas tostadas.", pairing: "Carne de porco.", abv: "5.0%", ibu: "35", temp: "5-8ºC", color: "from-amber-600 to-amber-800", image: "/images/california.jpg", formats: { longNeck: true, growler: true, keg30: true, keg50: true }, flavor: { amargor: 5, docura: 4, alcool: 5, aroma: 6, corpo: 5 } },
    { id: "seculo", name: "Século XIII", style: "Red Lager", tagline: "Tradição Avermelhada", desc: "Coloração rubi intensa e complexidade de maltes especiais.", pairing: "Massas, frango.", abv: "4.8%", ibu: "12", temp: "4-7ºC", color: "from-red-600 to-red-900", image: "/images/red.jpg", formats: { longNeck: true, growler: true, keg30: true, keg50: false }, flavor: { amargor: 3, docura: 7, alcool: 4, aroma: 5, corpo: 5 } },
    { id: "weiss", name: "Hoog Weiss", style: "Hefeweizen", tagline: "Trigo Aveludado", desc: "Não filtrada e com espuma cremosa. Aromas clássicos de banana.", pairing: "Salsichas, peixes.", abv: "4.7%", ibu: "10", temp: "3-6ºC", color: "from-yellow-200 to-yellow-400", image: "/images/weiss.jpg", formats: { longNeck: true, growler: true, keg30: true, keg50: true }, flavor: { amargor: 2, docura: 6, alcool: 4, aroma: 8, corpo: 7 } },
    { id: "paleale", name: "Hoog Pale Ale", style: "American Pale Ale", tagline: "Refrescante e Aromática", desc: "A porta de entrada para os lúpulos. Mais leve que a IPA.", pairing: "Pizzas, queijos.", abv: "5.0%", ibu: "25", temp: "4-7ºC", color: "from-amber-400 to-orange-500", image: "/images/paleale.jpg", formats: { longNeck: true, growler: true, keg30: true, keg50: true }, flavor: { amargor: 5, docura: 4, alcool: 5, aroma: 7, corpo: 4 } },
    { id: "stout", name: "Hoog Stout", style: "English Stout", tagline: "Café e Chocolate", desc: "Escura com maltes torrados que remetem a café e chocolate.", pairing: "Sobremesas, gorgonzola.", abv: "4.8%", ibu: "20", temp: "6-10ºC", color: "from-neutral-700 to-neutral-900", image: "/images/stout.jpg", formats: { longNeck: true, growler: true, keg30: true, keg50: false }, flavor: { amargor: 4, docura: 5, alcool: 4, aroma: 6, corpo: 6 } }
  ];

  const faqs = [
    { p: "Entregam onde?", r: "Contagem, BH e Betim. Taxa a consultar." },
    { p: "Chopeira 220v?", r: "Não! Nossas elétricas são bivolt." },
    { p: "Durabilidade do barril?", r: "24 horas após aberto e instalado." },
    { p: "Preciso de gelo?", r: "Só para chopeira a gelo (naja). Elétrica não precisa." },
    { p: "Pagamento?", r: "PIX, Crédito e Débito na entrega." }
  ];

  return (
    <div className={`min-h-screen bg-beer-dark text-beer-cream font-sans selection:bg-beer-gold selection:text-black overflow-x-hidden ${!ageVerified ? 'h-screen overflow-hidden' : ''}`}>
      
      {/* 1. LOADING */}
      {loading && (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center pointer-events-none">
           <div className="text-center">
              <img src="/images/logo-oficial.png" alt="Loading" className="h-32 animate-pulse-gold mb-4" />
              <div className="w-48 h-1 bg-stone-800 rounded-full mx-auto overflow-hidden"><div className="h-full bg-beer-gold animate-[width_2s_ease-out_forwards]" style={{width: '0%'}}></div></div>
           </div>
        </div>
      )}

      {/* 2. AGE GATE */}
      {!ageVerified && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-4 bg-black/80 backdrop-blur-md">
            <div className="relative z-10 w-full max-w-md bg-stone-900 border border-beer-gold/30 p-10 rounded-3xl text-center shadow-2xl animate-fade-in-up">
                <img src="/images/logo-oficial.png" alt="Hoog" className="h-24 mx-auto mb-8" />
                <h2 className="text-3xl font-serif font-bold text-white mb-2 uppercase tracking-wide">Bem-vindo</h2>
                <p className="text-stone-400 mb-10 font-light">Você tem 18 anos ou mais?</p>
                <div className="flex flex-col gap-4">
                    <button onClick={() => handleAgeConfirm(true)} className="w-full bg-beer-gold text-black font-black py-4 rounded-xl uppercase hover:bg-white transition-all shadow-lg">Sim, tenho +18</button>
                    <button onClick={() => handleAgeConfirm(false)} className="w-full border border-white/10 text-stone-500 py-4 rounded-xl uppercase hover:border-white hover:text-white transition-all">Não, sou menor</button>
                </div>
            </div>
        </div>
      )}

      {/* WHATSAPP */}
      <a href="https://wa.me/553125641240" target="_blank" className="fixed bottom-8 right-8 z-[60] group"><div className="absolute inset-0 rounded-full bg-green-600 opacity-70 animate-ping"></div><div className="relative bg-green-600 hover:bg-green-500 text-white p-4 rounded-full shadow-2xl transition-transform transform group-hover:scale-110 flex items-center justify-center"><MessageCircle size={32} fill="white" /></div></a>

      {/* COOKIES */}
      {!cookiesAccepted && (
        <div className="fixed bottom-0 left-0 w-full bg-beer-dark/95 backdrop-blur-md border-t border-white/10 p-4 z-[80] flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in-up">
           <p className="text-xs text-stone-300 text-center md:text-left">🍪 Usamos cookies para melhorar sua experiência.</p>
           <button onClick={() => setCookiesAccepted(true)} className="bg-beer-gold text-black text-xs font-bold px-6 py-2 rounded-full hover:bg-white transition-colors uppercase tracking-wider">Aceitar</button>
        </div>
      )}

      {/* NAVBAR */}
      <nav className={`fixed w-full z-50 transition-all duration-500 px-6 py-6 text-white ${scrolled ? 'bg-black/95 backdrop-blur-xl py-3 shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center h-20">
            <a href="#" className="flex-shrink-0">
                <img src="/images/logo-oficial.png" alt="Hoog Bier" className="h-16 md:h-20 w-auto" />
            </a>
            <div className="hidden md:flex items-center space-x-10">
              {['Início', 'Cervejas', 'Agenda', 'Fábrica'].map((item, i) => (<a key={i} href={`#${item.toLowerCase().replace('á', 'a')}`} className="text-xs font-bold uppercase tracking-[0.2em] text-stone-300 hover:text-beer-gold transition-colors drop-shadow-sm">{item}</a>))}
              <button onClick={() => setShowCalculator(true)} className="text-xs font-bold uppercase tracking-[0.2em] text-beer-gold hover:text-white transition-colors flex items-center gap-2 drop-shadow-sm"><Calculator size={14}/> Calc</button>
            </div>
            <div className="md:hidden"><button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2">{isMenuOpen ? <X size={28} /> : <Menu size={28} />}</button></div>
        </div>
        {isMenuOpen && (<div className="md:hidden bg-stone-900/95 backdrop-blur-xl absolute top-full left-0 w-full border-b border-white/10 animate-fade-in text-center py-8"><div className="flex flex-col gap-6"><a href="#home" onClick={() => setIsMenuOpen(false)} className="text-beer-gold font-bold uppercase tracking-widest">Início</a><a href="#cervejas" onClick={() => setIsMenuOpen(false)} className="text-beer-gold font-bold uppercase tracking-widest">Cervejas</a><button onClick={() => {setShowCalculator(true); setIsMenuOpen(false)}} className="text-beer-gold font-bold uppercase tracking-widest flex items-center justify-center gap-2"><Calculator size={16}/> Calculadora</button></div></div>)}
      </nav>

      {/* 1. HERO (ESCURO - PRETO) */}
      <section ref={heroRef} id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-black text-white">
        <div className="absolute inset-0 z-0 opacity-40">
           <img ref={heroImgRef} src="/images/hero-bg.jpg" className="w-full h-[120%] object-cover" alt="Background"/>
        </div>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black"></div>
        
        <div ref={heroTextRef} className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-10">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/20 mb-8 backdrop-blur-sm bg-black/30">
             <Star className="w-3 h-3 text-beer-gold fill-beer-gold" />
             <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-white drop-shadow-md">Desde 2018 em Contagem-MG</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-serif font-bold text-white mb-6 leading-none uppercase drop-shadow-xl">
             hoog bier <br/>
             <span className="text-beer-gold font-light italic tracking-normal lowercase text-[0.4em] block mt-2 drop-shadow-md">cervejaria artesanal</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-12 font-light leading-relaxed drop-shadow-md">
             O melhor Chope Puro Malte para seu evento!.
          </p>
          <a href="https://wa.me/553125641240" target="_blank" className="bg-beer-gold text-black font-black py-4 px-10 rounded-full hover:bg-white transition-all transform hover:-translate-y-1 text-xs uppercase tracking-[0.2em] shadow-lg shadow-beer-gold/20">
             Fazer Pedido
          </a>
        </div>
      </section>

      {/* 2. MARQUEE */}
      <div className="bg-beer-gold text-black py-4 border-y-4 border-black relative z-20 overflow-hidden flex">
         <div className="animate-marquee whitespace-nowrap flex-shrink-0 min-w-full flex justify-around gap-8 px-4 font-black uppercase text-sm tracking-[0.2em]"><span>🍺 PILSEN • IPA • RED LAGER • STOUT • CALIFORNIA COMMON • ENTREGA RÁPIDA 🍺</span></div>
         <div className="animate-marquee whitespace-nowrap flex-shrink-0 min-w-full flex justify-around gap-8 px-4 font-black uppercase text-sm tracking-[0.2em]" aria-hidden="true"><span>🍺 PILSEN • IPA • RED LAGER • STOUT • CALIFORNIA COMMON • ENTREGA RÁPIDA 🍺</span></div>
      </div>
            
      {/* 3. DIFERENCIAIS (CLARO - CREME) */}
      <Section id="sobre" theme="light" className="bg-paper-texture">
        <div className="max-w-7xl mx-auto px-4">
            <Reveal>
              <div className="text-center mb-16">
                 <span className="text-beer-brown font-bold tracking-[0.2em] text-xs uppercase mb-2 block">Nossa Filosofia</span>
                 <h2 className="text-4xl md:text-5xl font-serif text-beer-stone uppercase">Sem <span className="text-beer-gold italic lowercase">atalhos</span></h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                    { icon: CheckCircle, title: "Puro Malte", desc: "Sem milho ou arroz. Apenas insumos nobres importados." },
                    { icon: Clock, title: "Maturação Lenta", desc: "Respeitamos o tempo da natureza. Sem aceleradores químicos." },
                    { icon: Truck, title: "Logística Própria", desc: "Entrega rápida e refrigerada para toda região de Contagem." }
                ].map((item, idx) => (
                    <Reveal key={idx} delay={idx * 200}>
                        <div className="flex flex-col items-center text-center p-10 border border-stone-200 hover:border-beer-gold transition-all duration-700 group bg-white rounded-2xl shadow-sm hover:shadow-xl">
                            <item.icon className="w-10 h-10 text-beer-gold mb-6 opacity-80 group-hover:scale-110 transition-transform" strokeWidth={1} />
                            <h3 className="text-xl font-serif font-bold text-stone-900 mb-4 uppercase tracking-widest">{item.title}</h3>
                            <p className="text-stone-600 text-sm leading-relaxed font-light">{item.desc}</p>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
      </Section>

      {/* 4. DO GRÃO AO COPO (ESCURO - PRETO/PEDRA) */}
      <Section theme="dark" className="border-t border-white/5 bg-noise bg-stone-950">
         <div className="max-w-7xl mx-auto px-4">
            <Reveal><h3 className="text-center text-4xl font-serif font-bold text-white uppercase mb-24 tracking-widest">Processo <span className="text-beer-gold italic lowercase">artesanal</span></h3></Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
               {[ {i: Package, t:"Moagem", d:"Maltes selecionados"}, {i: Thermometer, t:"Mostura", d:"Controle preciso"}, {i: Activity, t:"Fermentação", d:"Leveduras vivas"}, {i: Beer, t:"Maturação", d:"Descanso a frio"} ].map((step, idx) => (
                  <Reveal key={idx} delay={idx*150}>
                     <div className="group flex flex-col items-center">
                        <div className="w-24 h-24 bg-black border border-white/10 rounded-full flex items-center justify-center text-beer-gold mb-6 group-hover:border-beer-gold transition-colors duration-500"><step.i size={32} strokeWidth={1}/></div>
                        <h4 className="font-bold text-white uppercase tracking-widest text-sm mb-2">{step.t}</h4>
                        <p className="text-xs text-stone-500 uppercase tracking-wider">{step.d}</p>
                     </div>
                  </Reveal>
               ))}
            </div>
         </div>
      </Section>

      {/* 5. CATÁLOGO (ESCURO - STONE 950) */}
      <Section id="cervejas" theme="dark" className="bg-stone-950">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-32">
                <span className="text-beer-gold font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">Nossa Alma</span>
                <h2 className="text-5xl md:text-7xl font-serif font-bold text-white uppercase">Nossas <span className="text-beer-gold italic font-light">Jóias</span></h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-32"> 
            {beers.map((beer, index) => {
              const isActive = activeBeerId === beer.id;
              return (
              <Reveal key={beer.id} delay={index * 100}>
                <div className="relative group perspective-1000 h-[650px]">
                    <button onClick={() => setActiveBeerId(isActive ? null : beer.id)} className="absolute top-0 right-0 z-30 text-[10px] font-bold uppercase text-beer-gold border border-beer-gold/30 px-4 py-2 rounded-full hover:bg-beer-gold hover:text-black transition-all flex items-center gap-2 tracking-widest">
                       {isActive ? <X size={12}/> : <Activity size={12}/>} {isActive ? 'Voltar' : 'Sensorial'}
                    </button>

                    <div className={`relative h-full flex flex-col bg-white/5 border border-white/5 p-8 rounded-[2rem] transition-all duration-700 hover:bg-white/10 ${isActive ? 'invisible opacity-0' : 'visible opacity-100'}`}>
                        <div className="relative flex justify-center items-center h-64 mb-8 -mt-12">
                            <div className={`absolute w-40 h-40 bg-gradient-to-b ${beer.color} opacity-20 blur-[80px] rounded-full`}></div>
                            <img src={beer.image} alt={beer.name} className="h-full w-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                            <div className="hidden h-64 w-32 bg-stone-800 rounded-lg flex-col items-center justify-center text-stone-500"><Beer/></div>
                        </div>
                        
                        <div className="flex-1 flex flex-col text-center">
                            <span className="text-beer-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-3">{beer.style}</span>
                            <h3 className="text-3xl font-serif text-white mb-2">{beer.name}</h3>
                            <p className="text-stone-500 text-xs italic font-serif mb-6">"{beer.tagline}"</p>
                            <p className="text-stone-300 text-sm leading-relaxed mb-8 font-light line-clamp-3 hover:line-clamp-none transition-all">{beer.desc}</p>
                            
                            <div className="mt-auto border-t border-white/5 pt-6 grid grid-cols-3 gap-4 text-center">
                               <div><span className="block text-[10px] text-stone-600 uppercase tracking-widest">ABV</span><span className="text-white font-serif">{beer.abv}</span></div>
                               <div><span className="block text-[10px] text-stone-600 uppercase tracking-widest">IBU</span><span className="text-white font-serif">{beer.ibu}</span></div>
                               <div><span className="block text-[10px] text-stone-600 uppercase tracking-widest">Temp</span><span className="text-white font-serif">{beer.temp}</span></div>
                            </div>
                            
                            <a href={`https://wa.me/553125641240?text=Olá, gostaria de pedir a cerveja ${beer.name}`} target="_blank" className="mt-8 w-full py-4 border border-white/10 hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
                               Comprar <ArrowRight size={14}/>
                            </a>
                        </div>
                    </div>

                    {isActive && (
                        <div className="absolute inset-0 bg-stone-950/95 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 flex flex-col items-center justify-center animate-fade-in z-20">
                            <h4 className="text-2xl font-serif text-white uppercase mb-8">Perfil Sensorial</h4>
                            <FlavorRadar data={beer.flavor} theme="dark" />
                            <div className="mt-12 w-full text-center">
                                <p className="text-sm text-stone-300 mb-4 font-light italic">Harmoniza com: <br/>{beer.pairing}</p>
                                <div className="flex justify-center gap-4 text-stone-500 mt-6">
                                   {beer.formats.longNeck && <div className="flex flex-col items-center gap-1"><Beer size={16}/><span className="text-[9px] uppercase">LN</span></div>}
                                   {beer.formats.growler && <div className="flex flex-col items-center gap-1"><Store size={16}/><span className="text-[9px] uppercase">Growler</span></div>}
                                   {beer.formats.keg30 && <div className="flex flex-col items-center gap-1"><Package size={16}/><span className="text-[9px] uppercase">Barril</span></div>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
              </Reveal>
            );})}
          </div>
        </div>
      </Section>

      {/* 6. GASTRONOMIA (CLARO) - COM VÍDEO CORRIGIDO (SEM ZOOM/CORTES) */}
      <Section theme="light" className="bg-paper-texture">
         <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
               <Reveal>
                  <span className="text-beer-brown font-bold tracking-[0.2em] text-xs uppercase mb-2 block">Gastronomia</span>
                  <h3 className="text-5xl font-serif text-stone-900 mb-6">Harmonização <span className="italic text-beer-gold">Perfeita</span></h3>
                  <p className="text-stone-600 text-lg leading-relaxed font-light mb-8">
                     Acreditamos que uma boa cerveja merece uma boa comida. Nossas receitas são pensadas para harmonizar com momentos especiais.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm hover:shadow-lg transition-all">
                        <span className="text-3xl block mb-2">🍔</span>
                        <strong className="block text-stone-900 uppercase text-sm mb-1">Burgers & IPA</strong>
                        <p className="text-xs text-stone-500">O amargor corta a gordura.</p>
                     </div>
                     <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm hover:shadow-lg transition-all">
                        <span className="text-3xl block mb-2">🥨</span>
                        <strong className="block text-stone-900 uppercase text-sm mb-1">Petiscos & Pilsen</strong>
                        <p className="text-xs text-stone-500">Leveza para acompanhar.</p>
                     </div>
                  </div>
               </Reveal>
            </div>
{/* ... dentro da seção Gastronomia ... */}
<div className="md:w-1/2 relative flex justify-center"> {/* Adicionado flex justify-center para centralizar */}
   <Reveal delay={200}>
      {/* MUDANÇA: 'w-fit' para a borda abraçar o vídeo e 'mx-auto' para centralizar */}
      <div className="relative rounded-[3rem] shadow-2xl transition-all duration-700 rotate-2 hover:rotate-0 overflow-hidden border-4 border-white w-fit mx-auto">
          <video 
            src="/videos/gastronomia.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            // MUDANÇA: h-[500px] fixo, mas w-auto. Sem object-fit.
            className="h-[500px] w-auto block" 
          />
      </div>
   </Reveal>
    </div>
     </div>
      </Section>

      {/* 7. AGENDA (ESCURO - PRETO) */}
      <Section id="agenda" theme="dark" className="bg-black">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-6 border-b border-white/10 pb-8">
              <div>
                <span className="text-beer-gold font-bold tracking-widest uppercase text-xs mb-4 block">Happy Hour & Eventos</span>
                <h3 className="text-5xl font-serif text-white uppercase">Agenda <span className="italic font-light text-stone-500">Semanal</span></h3>
              </div>
              <button onClick={() => setShowReserva(true)} className="px-8 py-3 bg-white/5 hover:bg-beer-gold hover:text-black text-white rounded-full font-bold uppercase text-xs tracking-widest transition-all flex items-center gap-2">
                 <Calendar size={14} /> Reservar Mesa
              </button>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loadingAgenda && <div className="col-span-2 text-center text-stone-500 py-12">Carregando programação...</div>}
            
            {!loadingAgenda && agenda.length === 0 && (
              <div className="col-span-2 text-center py-24 border border-white/5 bg-stone-900/50">
                 <p className="text-stone-400 font-light">Nenhum evento público esta semana.</p>
              </div>
            )}

            {!loadingAgenda && agenda.map((evento, index) => {
              if(!evento.titulo) return null;
              const isDestaque = evento.destaque && evento.destaque.toLowerCase().includes('sim');
              
              return (
                <Reveal key={index} delay={index * 100}>
                   <div className={`h-full p-8 transition-all group flex flex-col border rounded-3xl ${
                      isDestaque ? 'bg-stone-900 border-beer-gold' : 'bg-transparent border-white/10 hover:border-white/30'
                    }`}>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                         <div className="bg-beer-gold text-black w-16 h-16 rounded-full flex flex-col items-center justify-center font-black text-xl leading-none">
                            {evento.dia ? evento.dia.substring(0,3) : ''}
                         </div>
                         <div>
                            <h4 className="text-xl font-bold text-white uppercase tracking-wide group-hover:text-beer-gold transition-colors">{evento.titulo}</h4>
                            <span className="text-xs font-sans text-stone-500 tracking-widest uppercase block mt-1">{evento.horario}</span>
                         </div>
                      </div>
                      <div className="bg-white/5 p-2 rounded-full text-white">{getEventIcon(evento.categoria)}</div>
                    </div>
                    <p className="text-stone-400 text-sm font-light leading-relaxed mb-4 pl-20">{evento.descricao}</p>
                    {isDestaque && <div className="text-[10px] font-bold text-beer-gold uppercase tracking-[0.2em] border-t border-white/10 pt-4 mt-auto text-right">Evento Destaque</div>}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Section>

      {/* 8. FAQ (ESCURO - PRETO) */}
      <Section theme="dark" className="bg-stone-950">
        <div className="max-w-3xl mx-auto px-4">
          <Reveal>
            <h3 className="text-center text-3xl font-serif text-white mb-16 uppercase">Dúvidas Frequentes</h3>
            <div className="space-y-4">
            {faqs.map((faq, index) => (
                <details key={index} className="group bg-black/40 border border-white/5 open:border-beer-gold/30 transition-all duration-500 rounded-xl">
                  <summary className="flex justify-between items-center p-6 cursor-pointer select-none">
                    <span className="font-bold text-white uppercase text-xs tracking-widest flex items-center gap-3"><HelpCircle size={16} className="text-beer-gold"/> {faq.p}</span>
                    <Plus size={16} className="text-stone-500 group-open:hidden" />
                    <Minus size={16} className="text-beer-gold hidden group-open:block" />
                  </summary>
                  <div className="px-6 pb-6 text-stone-400 text-sm font-light leading-relaxed animate-fade-in pl-11">
                    {faq.r}
                  </div>
                </details>
            ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 9. FÁBRICA & PARCEIROS (CLARO) */}
      <Section id="fabrica" theme="light" className="bg-paper-texture">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-20">
            <Reveal>
                <span className="text-beer-brown font-bold tracking-[0.3em] uppercase text-xs mb-6 block">Nossa Casa</span>
                <h3 className="text-4xl font-serif text-stone-900 mb-8">FÁBRICA & LOJA</h3>
                <p className="text-stone-600 mb-10 text-lg leading-relaxed font-light">
                    Visite nossa fábrica em Contagem e conheça o processo de perto.
                </p>
                <div className="flex flex-col gap-6">
                    <div className="flex gap-6 items-start">
                        <MapPin className="text-beer-gold mt-1" />
                        <div>
                            <strong className="block text-stone-900 uppercase text-xs tracking-widest mb-2">Visite-nos</strong>
                            <span className="text-stone-600 font-light">Rua Rio Ural, 200 - Riacho das Pedras, Contagem</span>
                        </div>
                    </div>
                </div>
            </Reveal>

            <Reveal delay={200}>
                <div className="bg-white p-10 rounded-3xl border border-stone-200 shadow-xl relative overflow-hidden">
                   <h4 className="text-2xl font-serif text-stone-900 uppercase mb-8">Parceiros</h4>
                   <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
                      {parceiros.length === 0 && <p className="text-stone-400 text-xs uppercase">Carregando parceiros...</p>}
                      {parceiros.map((p, i) => (
                         <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
                            <strong className="block text-stone-900 text-sm uppercase tracking-wider">{p.nome}</strong>
                            <span className="text-stone-500 text-xs">{p.endereco}</span>
                         </div>
                      ))}
                   </div>
                </div>
            </Reveal>
        </div>
      </Section>

      {/* 10. INSTAGRAM & FOOTER */}
      <Section theme="dark" className="!p-0 !py-0 bg-black">
         <div className="grid grid-cols-6 gap-0.5 opacity-60 hover:opacity-100 transition-opacity duration-700">
            {(instaFeed.length > 0 ? instaFeed : [1,2,3,4,5,6]).map((item, index) => {
               const imgSrc = item.media_url || `https://picsum.photos/400/400?random=${index+20}`;
               const link = item.permalink || "https://instagram.com/cervejariahoogbier";
               return (
                 <a key={index} href={link} target="_blank" rel="noreferrer" className="aspect-square bg-stone-900 relative group overflow-hidden block">
                    <img src={imgSrc} alt="Insta" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"/>
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"><Instagram className="text-white"/></div>
                 </a>
               );
            })}
         </div>
         <footer className="bg-stone-950 py-16 border-t border-white/5 text-center text-white">
            <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
                <img src="/images/logo-oficial.png" alt="Hoog Bier" className="h-16 w-auto mb-10 opacity-50 transition-all" />
                <div className="flex justify-center gap-8 mb-10">
                  <a href="https://instagram.com/cervejariahoogbier" target="_blank" className="text-stone-600 hover:text-white transition-colors"><Instagram size={20} /></a>
                  <a href="https://facebook.com/cervejariahoogbier" target="_blank" className="text-stone-600 hover:text-white transition-colors"><Facebook size={20} /></a>
                </div>
                <p className="text-stone-600 text-[10px] uppercase tracking-[0.2em]">Beba com moderação.</p>
                <p className="text-stone-700 text-[10px] mt-4">© {new Date().getFullYear()} Hoog Bier.</p>
            </div>
         </footer>
      </Section>

      {/* Modais da Calculadora e Reserva... (Mesmo padrão visual: bg-beer-cream text-beer-stone) */}
      {showCalculator && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-beer-cream text-stone-900 p-8 rounded-2xl max-w-md w-full relative shadow-2xl">
            <button onClick={() => setShowCalculator(false)} className="absolute top-4 right-4 text-stone-500 hover:text-black"><X /></button>
            <h3 className="text-2xl font-serif font-bold uppercase text-center mb-6">Calculadora</h3>
            <div className="space-y-6">
              <div><label className="flex items-center gap-2 text-sm font-bold uppercase text-beer-brown mb-2"><Users size={16}/> Pessoas: {calcGuests}</label><input type="range" min="5" max="200" step="5" value={calcGuests} onChange={(e) => calculateChopp(parseInt(e.target.value), calcHours)} className="w-full accent-beer-gold h-2 bg-stone-300 rounded-lg cursor-pointer"/></div>
              <div><label className="flex items-center gap-2 text-sm font-bold uppercase text-beer-brown mb-2"><Clock size={16}/> Duração: {calcHours}h</label><input type="range" min="1" max="12" step="1" value={calcHours} onChange={(e) => calculateChopp(calcGuests, parseInt(e.target.value))} className="w-full accent-beer-gold h-2 bg-stone-300 rounded-lg cursor-pointer"/></div>
              <div className="bg-white p-6 rounded-xl text-center border border-stone-200"><span className="block text-stone-400 text-xs uppercase tracking-wider mb-2">Recomendação</span><span className="text-5xl font-serif font-bold text-beer-gold">{calcResult} Litros</span></div>
              <a href={`https://wa.me/553125641240?text=Olá! Fiz um cálculo no site. Preciso de aproximadamente ${calcResult} litros de chopp para ${calcGuests} pessoas.`} target="_blank" className="block w-full bg-green-700 hover:bg-green-600 text-white font-bold py-4 rounded-xl text-center uppercase tracking-widest transition-colors">Solicitar Orçamento</a>
            </div>
          </div>
        </div>
      )}

      {showReserva && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-beer-cream text-stone-900 p-8 rounded-2xl max-w-md w-full relative shadow-2xl">
            <button onClick={() => setShowReserva(false)} className="absolute top-4 right-4 text-stone-500 hover:text-black"><X /></button>
            <h3 className="text-2xl font-serif font-bold uppercase text-center mb-6">Reservas</h3>
            <input type="text" className="w-full bg-white border border-stone-200 rounded-lg p-3 mb-4 focus:border-beer-gold outline-none" placeholder="Nome" onChange={(e) => setReservaData({...reservaData, nome: e.target.value})} />
            <div className="grid grid-cols-2 gap-4 mb-4">
                 <input type="date" className="w-full bg-white border border-stone-200 rounded-lg p-3 focus:border-beer-gold outline-none" onChange={(e) => setReservaData({...reservaData, data: e.target.value})} />
                 <input type="number" className="w-full bg-white border border-stone-200 rounded-lg p-3 focus:border-beer-gold outline-none" placeholder="Pessoas" onChange={(e) => setReservaData({...reservaData, pessoas: e.target.value})} />
            </div>
            <a href={`https://wa.me/553125641240?text=Reserva: ${reservaData.nome}, Data: ${reservaData.data}, Pessoas: ${reservaData.pessoas}`} target="_blank" className="block w-full bg-green-700 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-center uppercase tracking-widest">Confirmar</a>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;