import React from 'react';
import { Sparkles, Star } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialProps) {
  return (
    <section id="testimonials" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 text-xs font-bold text-[#f5d98a] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            ✦ Divine Experiences
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold leading-tight">
            Words From Our <span className="text-[#C9A227]">Seekers</span>
          </h2>
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 bg-gradient-to-r from-[#C9A227] to-[#f0d070]" />
            <span className="text-[#C9A227] text-md">✦</span>
            <span className="h-[1px] w-12 bg-gradient-to-l from-[#C9A227] to-[#f0d070]" />
          </div>
          <p className="text-base text-[#8b96aa]">
            Thousands of lives transformed through precise cosmic predicted paths, simple dasha remedies, and clear spiritual counseling.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map(t => (
            <div 
              key={t.id} 
              className="p-8 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-[#C9A227]/25 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
            >
              <div className="font-serif text-5xl text-[#C9A227] opacity-40 leading-none mb-3">
                “
              </div>
              
              {/* Star Rating */}
              <div className="flex gap-1 mb-4 text-[#C9A227]">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#C9A227]" />
                ))}
              </div>

              <div className="font-serif italic text-sm leading-relaxed text-[#8b96aa] mb-6">
                "{t.text}"
              </div>

              {/* Author Segment */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#C9A227] to-[#f0d070] text-[#1a1000] font-serif font-black flex items-center justify-center text-sm shrink-0">
                  {t.initials}
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-white leading-snug">{t.name}</div>
                  <div className="text-[11px] text-[#596478] font-medium mt-0.5">📍 {t.location}</div>
                  <div className="inline-block px-2.5 py-0.5 mt-1.5 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/20 text-[10px] font-bold text-[#f5d98a]">
                    {t.service}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
