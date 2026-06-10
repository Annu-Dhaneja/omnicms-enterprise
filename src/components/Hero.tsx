import React, { useEffect, useState } from 'react';
import { Sparkles, Calendar, Award, Star, Compass } from 'lucide-react';
import { HeroContent, SiteConfig, SectionOrder } from '../types';

interface HeroProps {
  content: HeroContent;
  site: SiteConfig;
  onOpenBooking: () => void;
  onNavigate: (id: string) => void;
}

export default function Hero({ content, site, onOpenBooking, onNavigate }: HeroProps) {
  const [rotatedAngle, setRotatedAngle] = useState(0);

  // Slowly rotate the zodiac ring over time
  useEffect(() => {
    const timer = setInterval(() => {
      setRotatedAngle(prev => (prev + 0.2) % 360);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  const zodiacSigns = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
  const radius = 175; // radius for positioning around the ring

  return (
    <section id="hero" className="min-height-[100vh] pt-32 pb-20 relative overflow-hidden flex items-center">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_60%_40%,rgba(124,92,252,0.12)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_20%_60%,rgba(201,162,39,0.08)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_80%,rgba(15,184,160,0.06)_0%,transparent_60%)]" />
        
        {/* Celestial Star SVG Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-20 stroke-[#C9A227]/40" xmlns="http://www.w3.org/2000/svg">
          <g strokeWidth="0.5">
            <line x1="200" y1="150" x2="350" y2="200" />
            <line x1="350" y1="200" x2="420" y2="80" />
            <line x1="420" y1="80" x2="550" y2="160" />
            <line x1="800" y1="70" x2="920" y2="140" />
            <line x1="920" y1="140" x2="1000" y2="80" />
            <line x1="1150" y1="230" x2="1250" y2="180" />
            <line x1="250" y1="720" x2="400" y2="670" />
          </g>
          <g fill="#C9A227">
            <circle cx="200" cy="150" r="2.5" />
            <circle cx="350" cy="200" r="2" />
            <circle cx="420" cy="80" r="3" />
            <circle cx="550" cy="160" r="2" />
            <circle cx="800" cy="70" r="3.5" />
            <circle cx="920" cy="140" r="2" />
            <circle cx="1000" cy="80" r="2.5" />
            <circle cx="1150" cy="230" r="2" />
            <circle cx="1250" cy="180" r="3" />
            <circle cx="250" cy="720" r="2" />
            <circle cx="400" cy="670" r="3" />
          </g>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Side Content */}
        <div className="lg:col-span-7 text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 text-xs font-bold text-[#f5d98a] tracking-widest uppercase animate-bounce" style={{ animationDuration: '3s' }}>
            <span className="w-2 h-2 rounded-full bg-[#C9A227] animate-ping" />
            {content.badge}
          </div>
          
          <h1 className="font-serif font-black text-5xl sm:text-6xl lg:text-7xl leading-[1.08] text-transparent bg-clip-text bg-gradient-to-br from-white via-[#f5d98a] to-[#C9A227] whitespace-pre-line drop-shadow-lg">
            {content.title}
          </h1>

          <span className="text-sm sm:text-base font-bold text-[#fafafa] tracking-widest uppercase block border-b border-[#C9A227]/20 pb-4 max-w-lg">
            {content.name}
          </span>
          
          <p className="text-base sm:text-lg text-[#8b96aa] leading-relaxed max-w-2xl font-serif italic">
            "{content.subtitle}"
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={onOpenBooking} 
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] text-sm font-bold shadow-[0_4px_24px_rgba(201,162,39,0.4)] hover:scale-[1.02] transform transition-all"
            >
              📅 {content.cta1}
            </button>
            <button 
              onClick={() => onNavigate('ai-features')} 
              className="px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:border-[#C9A227] hover:text-[#C9A227] text-sm font-bold transition-all text-[#e8eaf0]"
            >
              🔮 {content.cta2}
            </button>
          </div>

          {/* Quick trust row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/10 max-w-2xl">
            <div>
              <div className="font-serif text-3xl font-black bg-gradient-to-r from-[#C9A227] to-[#f5d98a] text-transparent bg-clip-text">1.5L+</div>
              <div className="text-[10px] text-[#596478] font-bold uppercase tracking-wider">Consultations</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-black bg-gradient-to-r from-[#C9A227] to-[#f5d98a] text-transparent bg-clip-text">30+ Yrs</div>
              <div className="text-[10px] text-[#596478] font-bold uppercase tracking-wider">Experience</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-black bg-gradient-to-r from-[#C9A227] to-[#f5d98a] text-transparent bg-clip-text">4.9 ★</div>
              <div className="text-[10px] text-[#596478] font-bold uppercase tracking-wider">Google Rating</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-black bg-gradient-to-r from-[#C9A227] to-[#f5d98a] text-transparent bg-clip-text">60+</div>
              <div className="text-[10px] text-[#596478] font-bold uppercase tracking-wider">Countries</div>
            </div>
          </div>
        </div>

        {/* Right Side Visual Ring */}
        <div className="lg:col-span-5 flex items-center justify-center relative">
          <div className="w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] flex items-center justify-center relative">
            
            {/* Astronomic Concentric Rings */}
            <div className="absolute inset-0 rounded-full border border-[#C9A227]/15 animate-spin" style={{ animationDuration: '60s' }} />
            <div className="absolute inset-8 rounded-full border border-[#7C5CFC]/15 animate-spin" style={{ animationDuration: '45s', animationDirection: 'reverse' }} />
            <div className="absolute inset-16 rounded-full border border-dashed border-[#0FB8A0]/10 animate-spin" style={{ animationDuration: '30s' }} />

            {/* Rotatable Signs */}
            <div className="absolute inset-0" style={{ transform: `rotate(${rotatedAngle}deg)` }}>
              {zodiacSigns.map((s, idx) => {
                const angle = (idx * 30 - 90) * (Math.PI / 180);
                const x = 180 + radius * Math.cos(angle);
                const y = 180 + radius * Math.sin(angle);
                return (
                  <div 
                    key={idx}
                    className="absolute text-xl sm:text-2xl text-[#C9A227]/60 hover:text-[#f0d070] cursor-pointer select-none transition-all active:scale-125"
                    style={{ 
                      left: `${x}px`, 
                      top: `${y}px`, 
                      transform: 'translate(-50%, -50%) rotate(0deg)' 
                    }}
                  >
                    {s}
                  </div>
                );
              })}
            </div>

            {/* Central bio picture card */}
            <div className="absolute inset-20 rounded-full overflow-hidden border-2 border-[#C9A227]/30 bg-gradient-to-br from-[#7C5CFC]/20 to-[#080B12] flex items-end justify-center shadow-[0_0_60px_rgba(201,162,39,0.2),_0_0_120px_rgba(124,92,252,0.1)]">
              <div className="w-full h-full flex flex-col items-center justify-center relative select-none">
                <span className="text-[100px] leading-none mb-10 filter drop-shadow-[0_0_20px_rgba(201,162,39,0.55)]">🧘</span>
                <span className="absolute bottom-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[10px] font-black text-[#1a1000] font-serif shadow-md">
                  Acharya TN Khurana
                </span>
              </div>
            </div>

            {/* Floating indicator widgets */}
            <div className="absolute top-10 right-0 sm:-right-6 bg-[#080B12]/90 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-xl flex items-center gap-2 max-w-[170px] select-none animate-bounce" style={{ animationDuration: '4.5s' }}>
              <span className="text-xl">🏆</span>
              <div>
                <div className="text-xs font-black text-white">Award Winner</div>
                <div className="text-[9px] text-[#596478]">Best Astrologer 2025</div>
              </div>
            </div>

            <div className="absolute bottom-10 -left-6 bg-[#080B12]/90 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-xl flex items-center gap-2 max-w-[170px] select-none animate-bounce" style={{ animationDuration: '6s' }}>
              <span className="text-xl">✨</span>
              <div>
                <div className="text-xs font-black text-white">4.9/5 Rating</div>
                <div className="text-[9px] text-[#596478]">Over 10,000+ Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
