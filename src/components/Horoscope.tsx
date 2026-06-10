import React, { useState } from 'react';
import { Sparkles, CheckCircle2, X } from 'lucide-react';
import { ZodiacForecast } from '../types';

interface HoroscopeProps {
  zodiac: ZodiacForecast[];
  onOpenBooking: (serviceName?: string) => void;
}

export default function Horoscope({ zodiac, onOpenBooking }: HoroscopeProps) {
  const [selectedSign, setSelectedSign] = useState<ZodiacForecast | null>(null);

  const handleCardClick = (sign: ZodiacForecast) => {
    setSelectedSign(sign);
  };

  return (
    <section id="horoscope" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 text-xs font-bold text-[#f5d98a] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            ✦ Daily Alignments
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold leading-tight">
            Today's <span className="text-[#C9A227]">Zodiac</span> Readings
          </h2>
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 bg-gradient-to-r from-[#C9A227] to-[#f0d070]" />
            <span className="text-[#C9A227] text-md">✦</span>
            <span className="h-[1px] w-12 bg-gradient-to-l from-[#C9A227] to-[#f0d070]" />
          </div>
          <p className="text-base text-[#8b96aa]">
            Select your moon sign or sun sign below to reveal your daily transit guidance, stellar warnings, and focus metrics.
          </p>
        </div>

        {/* Zodiac Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {zodiac.map((z, idx) => (
            <div 
              key={idx} 
              onClick={() => handleCardClick(z)}
              className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 cursor-pointer text-center transition-all duration-300 hover:bg-[#C9A227]/5 hover:border-[#C9A227]/25 hover:translate-y-[-4px]"
            >
              <span className="text-4xl mb-2.5 block filter drop-shadow-[0_0_8px_rgba(201,162,39,0.3)]">{z.sign}</span>
              <div className="font-serif text-sm font-bold text-white mb-1">{z.name}</div>
              <div className="text-[10px] text-[#596478] font-medium">{z.dates}</div>
              <div className="text-xs text-[#C9A227] font-semibold mt-2">{z.rating}</div>
            </div>
          ))}
        </div>

        {/* Zodiac Dialog Modal */}
        {selectedSign && (
          <div className="fixed inset-0 bg-[#080B12]/80 backdrop-blur-md z-[3000] flex items-center justify-center p-6 transition-opacity duration-300">
            <div className="bg-[#0f1425] border border-white/10 rounded-[24px] p-8 max-w-[500px] w-full relative shadow-2xl transition-transform duration-300 scale-100">
              
              <button 
                onClick={() => setSelectedSign(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[#8b96aa] hover:bg-white/10 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6">
                <div className="text-6xl mb-3 filter drop-shadow-[0_0_16px_rgba(201,162,39,0.3)]">{selectedSign.sign}</div>
                <h3 className="font-serif text-2xl font-bold text-[#f5d98a] mb-1">{selectedSign.name}</h3>
                <div className="text-xs text-[#596478]">{selectedSign.dates}</div>
              </div>

              <div className="font-serif italic text-sm leading-relaxed text-[#8b96aa] text-center mb-6">
                "{selectedSign.reading}"
              </div>

              {/* Specific Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {selectedSign.ratings.map((r, i) => (
                  <div key={i} className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-[10px] text-[#596478] font-semibold uppercase tracking-wider mb-1.5">{r.label}</div>
                    <div className="font-serif text-xl font-bold text-[#f5d98a]">{r.val}%</div>
                    {/* Tiny gauge */}
                    <div className="h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#C9A227] to-[#f0d070] rounded-full" style={{ width: `${r.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Action */}
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => { setSelectedSign(null); onOpenBooking('Kundli Reading'); }} 
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] text-sm font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-1.5"
                >
                  📅 Detailed Personal Reading
                </button>
                <button 
                  onClick={() => setSelectedSign(null)} 
                  className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-sm font-bold text-[#e8eaf0] transition-all"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
