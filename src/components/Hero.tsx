import React from 'react';
import { Sparkles, Trophy, ShoppingBag, ShieldCheck, Zap, ArrowRight, Activity } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
}

export default function Hero({ onExplore }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-zinc-950 py-20 lg:py-32" id="hero-section">
      {/* Immersive radial glows */}
      <div className="absolute top-1/4 -left-20 h-[450px] w-[450px] rounded-full bg-[#ccff00]/6 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 right-10 h-[400px] w-[400px] rounded-full bg-lime-500/5 blur-[100px] pointer-events-none" />
      
      {/* Decorative clean line guides */}
      <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-zinc-800/40 to-transparent left-12 lg:left-24" />
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-zinc-800/40 to-transparent right-12 lg:right-24" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          
          {/* Left Column: Slogan and Brand Pitch text */}
          <div className="text-left sm:text-center lg:text-left lg:col-span-7">
            <span className="inline-flex items-center space-x-2 rounded-full glass-panel px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase text-zinc-300 tracking-wider">
              <Activity className="h-3.5 w-3.5 text-[#ccff00] animate-pulse" />
              <span>| SUPLEMENTAÇÃO DE SUPREMA PERFORMANCE</span>
            </span>
            
            <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05] font-display uppercase">
              REDEFINE O TEU <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-150 to-[#ccff00] text-glow">
                POTENCIAL
              </span>.
            </h1>
            
            <p className="mt-6 text-sm sm:text-base text-zinc-400 font-sans leading-relaxed max-w-xl sm:mx-auto lg:mx-0">
              Na <strong className="text-white font-semibold">FitForce</strong>, não fazemos cedências. Desenvolvemos com matérias-primas puras e tecnologia de ponta para atletas obcecados com a excelência absoluta.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-start sm:justify-center lg:justify-start items-stretch sm:items-center">
              <button
                onClick={onExplore}
                className="glass-button-primary flex items-center justify-center space-x-2.5 rounded-full px-8 py-4 text-xs font-black uppercase tracking-widest active:scale-[0.97]"
              >
                <ShoppingBag className="h-4.5 w-4.5 stroke-[2.2]" />
                <span>EXPERIMENTAR AGORA</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              
              <div className="flex items-center space-x-3 px-5 py-3 rounded-full glass-panel">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-[#ccff00]">
                  <Trophy className="h-3.5 w-3.5" />
                </span>
                <div className="text-left">
                  <p className="font-mono text-[9px] font-bold text-zinc-500 uppercase leading-none">Matéria-prima</p>
                  <p className="text-xs font-black text-white uppercase tracking-tight">100% Certificada</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Glassmorphism visual card mockup */}
          <div className="relative mt-16 lg:mt-0 lg:col-span-5 flex justify-center animate-float">
            <div className="relative w-full max-w-sm">
              
              {/* Outer decorative orbit ring */}
              <div className="absolute -inset-4 rounded-[2.5rem] border border-zinc-800/40 pointer-events-none" />
              
              {/* Glass Card Container */}
              <div className="rounded-3xl glass-panel-heavy p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 h-28 w-28 rounded-full bg-[#ccff00]/10 blur-2xl pointer-events-none" />
                
                {/* Visual Image container */}
                <div className="relative rounded-2xl overflow-hidden aspect-square flex items-end">
                  <div 
                    className="absolute inset-0 bg-cover bg-center mix-blend-luminosity brightness-75 hover:scale-105 transition-transform duration-700" 
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop')` }} 
                  />
                  {/* Glass bottom gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  
                  {/* Card Content Overlay */}
                  <div className="relative z-10 p-5 text-left w-full">
                    <span className="font-mono text-[9px] font-bold text-[#ccff00] tracking-widest uppercase bg-zinc-950/85 px-2.5 py-1 rounded-full border border-zinc-850">
                      PURE LAB ISOLATE
                    </span>
                    <h3 className="text-lg font-black text-white mt-3 uppercase tracking-tight leading-none font-display">
                      Fórmula Ultra-Filtrada
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                      Zero aditivos, digestibilidade avançada e sabor premium incomparável.
                    </p>
                  </div>
                </div>

                {/* Performance stats bar */}
                <div className="mt-5 pt-4 border-t border-zinc-900 grid grid-cols-2 gap-4 text-left">
                  <div>
                    <span className="text-2xl font-mono font-black text-[#ccff00] text-glow">24H</span>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Envio Expresso</p>
                  </div>
                  <div>
                    <span className="text-2xl font-mono font-black text-[#ccff00] text-glow">100%</span>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Pureza Garantida</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Dynamic features row, glass finished */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto border-t border-zinc-900/60 pt-10">
          {[
            { icon: ShieldCheck, title: "Qualidade de Elite", desc: "Testes laboratoriais independentes em Portugal." },
            { icon: Zap, title: "Envio Gratuito", desc: "Grátis em compras superiores a 40 €." },
            { icon: Trophy, title: "Formulado na UE", desc: "Produção segura sob padrões farmacêuticos." },
            { icon: Sparkles, title: "Comunidade VIP", desc: "Acesso a equipa de aconselhamento gratuito." }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center space-x-3.5 p-4 rounded-2xl bg-zinc-900/10 border border-zinc-900/30">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl glass-panel text-[#ccff00]">
                <item.icon className="h-5 w-5" />
              </span>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white uppercase tracking-tight font-display">{item.title}</h4>
                <p className="text-[11px] text-zinc-500 leading-normal mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
