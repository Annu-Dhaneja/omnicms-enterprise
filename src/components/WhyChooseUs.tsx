import React from 'react';
import { Sparkles, Trophy, Users, ShieldAlert, Award, Star } from 'lucide-react';
import { WhyChooseUsItem } from '../types';

interface WhyProps {
  cards: WhyChooseUsItem[];
}

export default function WhyChooseUs({ cards }: WhyProps) {
  return (
    <section id="why" className="py-24 relative z-10 bg-gradient-to-b from-transparent via-[#7C5CFC]/[0.02] to-transparent">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 text-xs font-bold text-[#f5d98a] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            ✦ Accurate Predictions
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold leading-tight">
            The Khurana <span className="text-[#C9A227]">Difference</span>
          </h2>
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 bg-gradient-to-r from-[#C9A227] to-[#f0d070]" />
            <span className="text-[#C9A227] text-md">✦</span>
            <span className="h-[1px] w-12 bg-gradient-to-l from-[#C9A227] to-[#f0d070]" />
          </div>
          <p className="text-base text-[#8b96aa]">
            Why thousands of seekers globally trust Acharya TN Khurana for career, marriage, health, and spiritual alignment.
          </p>
        </div>

        {/* Why Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((c, idx) => (
            <div 
              key={c.id} 
              className="group p-8 rounded-2xl bg-white/[0.01] border border-white/5 relative overflow-hidden transition-all duration-300 hover:translate-y-[-4px] hover:border-[#C9A227]/20"
            >
              {/* Card Footer Line animation */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C9A227] to-[#f0d070] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              
              <div className="font-serif text-5xl font-black text-[#C9A227]/10 line-height-none mb-6">
                {c.num}
              </div>
              <span className="text-4xl mb-4 block filter drop-shadow-[0_0_8px_rgba(201,162,39,0.3)]">{c.icon}</span>
              <h3 className="font-serif text-lg font-bold text-white mb-2">{c.title}</h3>
              <p className="text-xs text-[#8b96aa] leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
