import React from 'react';
import { Sparkles, Sun, Moon, Calendar, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PanchangData } from '../types';

interface PanchangProps {
  panchang: PanchangData;
}

export default function Panchang({ panchang }: PanchangProps) {
  const now = new Date();
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  const items = [
    { icon: <Moon className="w-4 h-4 text-[#C9A227]" />, label: "Nakshatra", value: panchang.nakshatra, sub: `Lord: ${panchang.nakshatraLord}` },
    { icon: <Zap className="w-4 h-4 text-[#C9A227]" />, label: "Yoga", value: panchang.yoga, sub: "" },
    { icon: <Compass className="w-4 h-4 text-[#C9A227]" />, label: "Karana", value: panchang.karana, sub: "" },
    { icon: <Sun className="w-4 h-4 text-[#C9A227]" />, label: "Sunrise", value: panchang.sunrise, sub: "" },
    { icon: <Sun className="w-4 h-4 text-[#C9A227]" />, label: "Sunset", value: panchang.sunset, sub: "" },
    { icon: <Moon className="w-4 h-4 text-[#C9A227]" />, label: "Moon Sign", value: panchang.moonSign, sub: "" },
    { icon: <AlertTriangle className="w-4 h-4 text-rose-400" />, label: "Rahu Kalam", value: panchang.rahukalam, sub: "Avoid subha projects" },
    { icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, label: "Auspicious Time", value: panchang.auspicious, sub: "Best for ceremonies" }
  ];

  function Compass({ className }: { className?: string }) {
    return <span className={className}>☄</span>;
  }

  return (
    <section id="panchang" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 text-xs font-bold text-[#f5d98a] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            ✦ Astro Calendar
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold leading-tight">
            Today's <span className="text-[#C9A227]">Hindu Panchang</span>
          </h2>
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 bg-gradient-to-r from-[#C9A227] to-[#f0d070]" />
            <span className="text-[#C9A227] text-md">✦</span>
            <span className="h-[1px] w-12 bg-gradient-to-l from-[#C9A227] to-[#f0d070]" />
          </div>
          <p className="text-base text-[#8b96aa]">
            Plan your auspicious starts, business launches, and spiritual practices using the exact daily cosmic and solar variables.
          </p>
        </div>

        {/* Panchang Card Display */}
        <div className="rounded-3xl overflow-hidden bg-white/[0.01] border border-white/5 shadow-2xl">
          <div className="p-8 sm:p-10 bg-gradient-to-br from-[#C9A227]/10 to-[#7C5CFC]/5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Left Big Date Display */}
            <div className="flex items-baseline gap-4 text-left">
              <div className="font-serif text-6xl md:text-7xl font-bold text-[#f5d98a] leading-none">
                {now.getDate()}
              </div>
              <div className="leading-tight">
                <div className="font-serif text-xl sm:text-2xl font-bold text-white">
                  {months[now.getMonth()]}
                </div>
                <div className="text-xs sm:text-sm text-[#596478] font-semibold mt-1">
                  {days[now.getDay()]}, {now.getFullYear()}
                </div>
              </div>
            </div>

            {/* Right Tithi/Samvat metadata */}
            <div className="text-left md:text-right space-y-1">
              <div className="font-serif text-lg md:text-xl font-bold text-[#f5d98a]">
                {panchang.tithi}
              </div>
              <div className="text-xs text-[#596478] font-bold uppercase tracking-wider">
                {panchang.samvat}
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                  ✓ Auspicious Tithi
                </span>
              </div>
            </div>
          </div>

          {/* Grid Information */}
          <div className="p-8 sm:p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-left">
            {items.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] text-[#596478] font-black uppercase tracking-widest">
                  {item.icon}
                  {item.label}
                </div>
                <div className="font-serif text-base font-bold text-[#f5d98a]">
                  {item.value}
                </div>
                {item.sub && (
                  <div className="text-[11px] text-[#596478] font-medium">
                    {item.sub}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
