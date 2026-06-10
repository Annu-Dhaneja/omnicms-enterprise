import React from 'react';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';
import { Service } from '../types';

interface ServicesProps {
  services: Service[];
  onOpenBooking: (serviceName?: string) => void;
}

export default function Services({ services, onOpenBooking }: ServicesProps) {
  const activeServices = services.filter(s => s.active);

  return (
    <section id="services" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 text-xs font-bold text-[#f5d98a] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            ✦ Divine Expertise
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold leading-tight">
            Sacred <span className="text-[#C9A227]">Services</span> We Offer
          </h2>
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 bg-gradient-to-r from-[#C9A227] to-[#f0d070]" />
            <span className="text-[#C9A227] text-md">✦</span>
            <span className="h-[1px] w-12 bg-gradient-to-l from-[#C9A227] to-[#f0d070]" />
          </div>
          <p className="text-base text-[#8b96aa]">
            From birth chart analysis to marriage matchings and strategic home Vastu, explore our full suite of precision Vedic astrological services.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeServices.map(s => (
            <div 
              key={s.id} 
              onClick={() => onOpenBooking(s.name)}
              className="group rounded-2xl p-6 bg-white/[0.02] border border-white/5 transition-all duration-300 hover:translate-y-[-8px] hover:border-[#C9A227]/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4),_0_0_30px_rgba(201,162,39,0.1)] relative overflow-hidden cursor-pointer"
            >
              {/* Top Accent Gradient */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_20%,rgba(201,162,39,0.08),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="w-14 h-14 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center text-3xl mx-auto mb-6 group-hover:bg-[#C9A227]/20 group-hover:shadow-[0_0_24px_rgba(201,162,39,0.35)] transition-all duration-300">
                {s.icon}
              </div>
              <h3 className="font-serif text-lg font-bold text-center mb-2 group-hover:text-[#f0d070] transition-colors">{s.name}</h3>
              <p className="text-xs text-[#596478] text-center mb-4 line-clamp-3 leading-relaxed">{s.desc}</p>
              
              <div className="text-center font-serif text-base font-bold text-[#f5d98a] mb-4">
                {s.price} <span className="text-[10px] text-[#596478] font-sans font-normal">/ {s.duration}</span>
              </div>
              
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#C9A227] transition-all group-hover:gap-2.5">
                Book Consultation <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={() => onOpenBooking()} 
            className="px-8 py-3.5 rounded-full border border-[#C9A227] text-sm font-bold text-[#C9A227] hover:bg-[#C9A227]/10 transition-all active:scale-95"
          >
            View All Services & Remedies →
          </button>
        </div>

      </div>
    </section>
  );
}
